const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const { URL, URLSearchParams } = require('url');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create directories for temp files
const tempDir = path.join(__dirname, 'temp_downloads');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Serve downloaded zip files
app.use('/downloads', express.static(tempDir));

// Helper: Clean old files in temp directory (older than 1 hour)
function cleanTempFiles() {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  fs.readdir(tempDir, (err, files) => {
    if (err) return;
    files.forEach(file => {
      const filePath = path.join(tempDir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return;
        if (now - stats.mtimeMs > oneHour) {
          fs.rm(filePath, { recursive: true, force: true }, () => {});
        }
      });
    });
  });
}
function mergeCookies(oldCookies, newCookies) {
  const cookieMap = {};
  oldCookies.forEach(c => {
    const [name, val] = c.split('=');
    if (name) cookieMap[name.trim()] = val;
  });
  newCookies.forEach(c => {
    const [name, val] = c.split('=');
    if (name) cookieMap[name.trim()] = val;
  });
  return Object.entries(cookieMap).map(([name, val]) => `${name}=${val}`);
}

setInterval(cleanTempFiles, 15 * 60 * 1000); // run every 15 min

// Main API handler using Server-Sent Events (SSE)
app.get('/api/download', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendProgress = (message, percent = 0) => {
    res.write(`data: ${JSON.stringify({ type: 'progress', message, percent })}\n\n`);
  };

  const sendComplete = (zipUrl, zipName) => {
    res.write(`data: ${JSON.stringify({ type: 'complete', zipUrl, zipName })}\n\n`);
    res.end();
  };

  const sendError = (message) => {
    res.write(`data: ${JSON.stringify({ type: 'error', message })}\n\n`);
    res.end();
  };

  const { targetUrl, loginMode, username, password, sessionCookie } = req.query;

  if (!targetUrl) {
    return sendError('Falta la URL de Moodle.');
  }

  const jobDirName = `job_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const jobDir = path.join(tempDir, jobDirName);
  fs.mkdirSync(jobDir);

  const axiosInstance = axios.create({
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    maxRedirects: 5,
    validateStatus: () => true // Allow handling non-200 responses manually
  });

  const parsedTargetUrl = new URL(targetUrl);
  const domain = parsedTargetUrl.hostname;

  try {
    // ----------------------------------------------------
    // STEP 1: AUTHENTICATION
    // ----------------------------------------------------
    let cookies = [];

    if (loginMode === 'cookie') {
      if (!sessionCookie) {
        throw new Error('Falta la cookie de sesión (MoodleSession).');
      }
      sendProgress('Usando la cookie de sesión proporcionada...', 5);
      cookies = [`MoodleSession=${sessionCookie.trim()}`];
    } else {
      if (!username || !password) {
        throw new Error('Falta el usuario o la contraseña.');
      }
      sendProgress('Obteniendo página de inicio de sesión de Moodle...', 5);
      
      const loginPageUrl = `https://${domain}/login/index.php`;
      const loginPageRes = await axiosInstance.get(loginPageUrl, { maxRedirects: 0 });
      const $login = cheerio.load(loginPageRes.data);
      const logintoken = $login('input[name="logintoken"]').val();

      if (!logintoken) {
        throw new Error('No se pudo encontrar el token de inicio de sesión (logintoken) en Moodle.');
      }

      // Capture initial cookies from login page load
      if (loginPageRes.headers['set-cookie']) {
        cookies = loginPageRes.headers['set-cookie'].map(c => c.split(';')[0]);
      }

      sendProgress('Iniciando sesión en Moodle...', 10);
      
      const loginParams = new URLSearchParams();
      loginParams.append('username', username.trim());
      loginParams.append('password', password.trim());
      loginParams.append('logintoken', logintoken);

      const postLoginRes = await axiosInstance.post(loginPageUrl, loginParams.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': cookies.join('; ')
        },
        maxRedirects: 0
      });

      if (postLoginRes.headers['set-cookie']) {
        const newCookies = postLoginRes.headers['set-cookie'].map(c => c.split(';')[0]);
        cookies = mergeCookies(cookies, newCookies);
      }

      // Follow session test redirect if returned
      const redirectUrl = postLoginRes.headers['location'];
      if (redirectUrl) {
        sendProgress('Estableciendo sesión de Moodle...', 15);
        const redirectRes = await axiosInstance.get(redirectUrl, {
          headers: { 'Cookie': cookies.join('; ') },
          maxRedirects: 0
        });
        if (redirectRes.headers['set-cookie']) {
          const redirectCookies = redirectRes.headers['set-cookie'].map(c => c.split(';')[0]);
          cookies = mergeCookies(cookies, redirectCookies);
        }
      }

      if (!cookies.some(c => c.includes('MoodleSession'))) {
        throw new Error('No se pudo obtener la cookie de sesión (MoodleSession) de Moodle. Verifica tus credenciales.');
      }

      sendProgress('Sesión iniciada con éxito.', 20);
    }

    const requestHeaders = {
      'Cookie': cookies.join('; ')
    };

    // ----------------------------------------------------
    // STEP 2: CRAWLING RESOURCES AND SCORMS
    // ----------------------------------------------------
    sendProgress(`Accediendo al enlace proporcionado...`, 25);
    const mainPageRes = await axiosInstance.get(targetUrl, { headers: requestHeaders });
    
    if (mainPageRes.status !== 200) {
      throw new Error(`Error al acceder al enlace de Moodle (Código HTTP ${mainPageRes.status}).`);
    }

    const $main = cheerio.load(mainPageRes.data);
    let scormUrls = [];
    let resourceUrls = [];
    let courseName = $main('h1').first().text().trim() || $main('.page-header-headings h1').first().text().trim() || 'Temario_Moodle';
    courseName = courseName.replace(/[^a-zA-Z0-9_ -]/g, '').trim();

    if (targetUrl.includes('mod/scorm/view.php')) {
      sendProgress('Detectada URL de actividad SCORM única.', 30);
      scormUrls.push(targetUrl);
    } else {
      sendProgress('Analizando recursos y actividades del curso...', 30);
      $main('a').each((i, el) => {
        const href = $main(el).attr('href');
        if (!href) return;
        
        if (href.includes('mod/scorm/view.php') && !scormUrls.includes(href)) {
          scormUrls.push(href);
        } else if (href.includes('mod/resource/view.php') && !resourceUrls.includes(href)) {
          resourceUrls.push(href);
        }
      });
    }

    sendProgress(`Encontradas ${scormUrls.length} actividades SCORM y ${resourceUrls.length} recursos de archivos.`, 35);

    if (scormUrls.length === 0 && resourceUrls.length === 0) {
      throw new Error('No se encontraron paquetes SCORM ni recursos PDF en el enlace proporcionado. Asegúrate de que el enlace corresponde a un curso de Moodle o a una actividad SCORM.');
    }

    // ----------------------------------------------------
    // STEP 3: DOWNLOAD SCORM PDFs AND RESOURCES
    // ----------------------------------------------------
    const totalItems = scormUrls.length + resourceUrls.length;
    let completedItems = 0;
    const downloadedFiles = [];

    // Helper to calculate progress percentage (from 40% to 90%)
    const getPercent = () => Math.round(40 + (completedItems / totalItems) * 50);

    // 3a. Process SCORM packages
    for (const scormViewUrl of scormUrls) {
      try {
        sendProgress(`Procesando SCORM: ${scormViewUrl}...`, getPercent());

        // Fetch view page
        const viewRes = await axiosInstance.get(scormViewUrl, { headers: requestHeaders });
        const viewHtml = viewRes.data;

        // Extract sesskey
        const sesskeyMatch = viewHtml.match(/"sesskey":"([^"]+)"/);
        if (!sesskeyMatch) {
          sendProgress(`⚠️ Saltado: no se encontró sesskey en la actividad SCORM.`, getPercent());
          completedItems++;
          continue;
        }
        const sesskey = sesskeyMatch.group ? sesskeyMatch.group(1) : sesskeyMatch[1];

        // Extract scormplayerdata
        const playerdataMatch = viewHtml.match(/var scormplayerdata = (\{.*?\});/);
        if (!playerdataMatch) {
          sendProgress(`⚠️ Saltado: no se encontró scormplayerdata en la actividad SCORM.`, getPercent());
          completedItems++;
          continue;
        }
        const scormplayerdata = JSON.parse(playerdataMatch.group ? playerdataMatch.group(1) : playerdataMatch[1]);

        // Fetch player page
        const playerUrl = `https://${domain}/mod/scorm/player.php?a=${scormplayerdata.scorm}&scoid=${scormplayerdata.sco}&currentorg=${scormplayerdata.currentorg}&sesskey=${sesskey}&display=popup&mode=normal`;
        const playerRes = await axiosInstance.get(playerUrl, { headers: requestHeaders });
        const playerHtml = playerRes.data;

        // Extract TOC JSON
        const initMatch = playerHtml.match(/M\.mod_scorm\.init\(Y,\s*([^;]+)\);/);
        if (!initMatch) {
          sendProgress(`⚠️ Saltado: llamada M.mod_scorm.init no encontrada en el reproductor SCORM.`, getPercent());
          completedItems++;
          continue;
        }

        const args = initMatch.group ? initMatch.group(1) : initMatch[1];
        const tocJsonMatch = args.match(/"(\{.*?\})"/);
        if (!tocJsonMatch) {
          sendProgress(`⚠️ Saltado: JSON de tabla de contenidos no encontrado.`, getPercent());
          completedItems++;
          continue;
        }

        const tocJson = (tocJsonMatch.group ? tocJsonMatch.group(1) : tocJsonMatch[1])
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\')
          .replace(/\\\//g, '/');

        const tocData = JSON.parse(tocJson);
        const firstScoId = Object.keys(tocData)[0];
        const firstItem = tocData[firstScoId];
        const parameters = firstItem.parameters || '';

        // Extract r parameter
        const qsMatch = parameters.match(/[?&]r=([^&]+)/);
        if (!qsMatch) {
          sendProgress(`⚠️ Saltado: parámetro 'r' no encontrado en el paquete SCORM.`, getPercent());
          completedItems++;
          continue;
        }
        const rVal = decodeURIComponent(qsMatch[1]);

        // Try to find student_id in player html to use as username for PDF API
        let studentId = (username || '').toLowerCase();
        const studentIdMatch = playerHtml.match(/"cmi.core.student_id":"([^"]+)"/);
        if (studentIdMatch) {
          studentId = studentIdMatch[1].toLowerCase();
        }

        // Call export PDF API on educalms
        const pdfDownloadUrl = `https://www.educalms.com/REPOSITORIO/exportarPdf_3.php?username=${studentId}&ruta=${rVal}&theme=&domain=${domain}`;
        sendProgress(`Descargando PDF desde Educalms para SCORM ID ${scormplayerdata.scorm}...`, getPercent());
        
        const pdfRes = await axios.get(pdfDownloadUrl, {
          responseType: 'arraybuffer',
          headers: { 'User-Agent': requestHeaders['User-Agent'] }
        });

        if (pdfRes.status === 200 && pdfRes.headers['content-type'] === 'application/pdf') {
          // Determine filename
          let filename = '';
          const contentDisp = pdfRes.headers['content-disposition'] || '';
          const fnMatch = contentDisp.match(/filename="([^"]+)"/);
          if (fnMatch) {
            filename = decodeURIComponent(fnMatch[1]);
          } else {
            filename = `${firstItem.title || 'Modulo'}.pdf`;
          }
          filename = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');

          const savePath = path.join(jobDir, filename);
          fs.writeFileSync(savePath, pdfRes.data);
          downloadedFiles.push({ path: savePath, name: filename });
          sendProgress(`✅ Descargado: ${filename}`, getPercent());
        } else {
          // If the PDF generation failed, we can fallback to standard page printing
          sendProgress(`⚠️ Falló descarga directa de PDF para SCORM ID ${scormplayerdata.scorm}. Servidor devolvió un tipo no válido.`, getPercent());
        }
      } catch (err) {
        sendProgress(`⚠️ Error procesando SCORM ${scormViewUrl}: ${err.message}`, getPercent());
      }
      completedItems++;
    }

    // 3b. Process direct file resources
    for (const resourceUrl of resourceUrls) {
      try {
        sendProgress(`Procesando recurso de archivo: ${resourceUrl}...`, getPercent());

        // Fetch resource page (Moodle will either redirect directly to pluginfile.php or contain a link to it)
        const resourceRes = await axiosInstance.get(resourceUrl, { headers: requestHeaders });
        
        let fileUrl = '';
        if (resourceRes.headers['content-type'] === 'application/pdf') {
          // If it redirected directly to a PDF
          fileUrl = resourceRes.request.res.responseUrl || resourceUrl;
        } else {
          // Parse HTML to look for resource download link
          const $res = cheerio.load(resourceRes.data);
          // Look for direct link in the content area (class resourceworkaround)
          const downloadLink = $res('.resourceworkaround a').attr('href') || $res('object[type="application/pdf"]').attr('data');
          if (downloadLink) {
            fileUrl = downloadLink;
          }
        }

        if (fileUrl) {
          sendProgress(`Descargando archivo: ${fileUrl}...`, getPercent());
          const fileRes = await axiosInstance.get(fileUrl, {
            headers: requestHeaders,
            responseType: 'arraybuffer'
          });

          if (fileRes.status === 200) {
            // Determine filename from URL or headers
            let filename = '';
            const contentDisp = fileRes.headers['content-disposition'] || '';
            const fnMatch = contentDisp.match(/filename="([^"]+)"/);
            if (fnMatch) {
              filename = decodeURIComponent(fnMatch[1]);
            } else {
              const urlParts = fileUrl.split('/');
              filename = urlParts[urlParts.length - 1].split('?')[0] || `archivo_${Date.now()}`;
              if (!filename.toLowerCase().endsWith('.pdf')) {
                filename += '.pdf';
              }
            }
            filename = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');

            const savePath = path.join(jobDir, filename);
            fs.writeFileSync(savePath, fileRes.data);
            downloadedFiles.push({ path: savePath, name: filename });
            sendProgress(`✅ Descargado: ${filename}`, getPercent());
          } else {
            sendProgress(`⚠️ Falló descarga del archivo: HTTP ${fileRes.status}`, getPercent());
          }
        } else {
          sendProgress(`⚠️ Saltado: no se encontró enlace de descarga directa en el recurso.`, getPercent());
        }
      } catch (err) {
        sendProgress(`⚠️ Error procesando recurso ${resourceUrl}: ${err.message}`, getPercent());
      }
      completedItems++;
    }

    // ----------------------------------------------------
    // STEP 4: ZIP COMPRESSION & DELIVERY
    // ----------------------------------------------------
    if (downloadedFiles.length === 0) {
      throw new Error('No se pudo descargar ningún archivo PDF del curso.');
    }

    sendProgress('Comprimiendo archivos descargados en un archivo ZIP...', 90);

    const zipFilename = `${courseName}_Temario_${Date.now()}.zip`;
    const zipPath = path.join(tempDir, zipFilename);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      sendProgress('¡Compresión completada con éxito!', 98);
      // Clean up the job folder (keep only the ZIP)
      fs.rm(jobDir, { recursive: true, force: true }, () => {});
      sendComplete(`/downloads/${zipFilename}`, zipFilename);
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);
    downloadedFiles.forEach(file => {
      archive.file(file.path, { name: file.name });
    });
    await archive.finalize();

  } catch (error) {
    console.error('Error during download job:', error);
    // Cleanup job directory if it exists
    if (fs.existsSync(jobDir)) {
      fs.rm(jobDir, { recursive: true, force: true }, () => {});
    }
    sendError(error.message || 'Ocurrió un error inesperado al procesar las descargas.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

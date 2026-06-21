document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const formSection = document.getElementById('form-section');
  const progressSection = document.getElementById('progress-section');
  const downloaderForm = document.getElementById('downloader-form');
  const startBtn = document.getElementById('start-btn');
  
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  const panelCredentials = document.getElementById('panel-credentials');
  const panelCookie = document.getElementById('panel-cookie');
  
  const progressBar = document.getElementById('progress-bar');
  const percentText = document.getElementById('percent-text');
  const statusText = document.getElementById('status-text');
  const logConsole = document.getElementById('log-console');
  const resultCard = document.getElementById('result-card');
  const downloadZipBtn = document.getElementById('download-zip-btn');
  
  const cancelBtn = document.getElementById('cancel-btn');
  const clearLogsBtn = document.getElementById('clear-logs-btn');

  let currentLoginMode = 'credentials';
  let eventSource = null;

  // Toggle login mode
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      currentLoginMode = btn.dataset.mode;
      
      if (currentLoginMode === 'credentials') {
        panelCredentials.classList.add('active');
        panelCookie.classList.remove('active');
        document.getElementById('username').required = true;
        document.getElementById('password').required = true;
        document.getElementById('sessionCookie').required = false;
      } else {
        panelCredentials.classList.remove('active');
        panelCookie.classList.add('active');
        document.getElementById('username').required = false;
        document.getElementById('password').required = false;
        document.getElementById('sessionCookie').required = true;
      }
    });
  });

  // Append a line to the console log
  function addLogLine(text) {
    const line = document.createElement('div');
    line.classList.add('log-line');
    
    // Auto-detect log severity and color it
    if (text.startsWith('✅')) {
      line.classList.add('success');
    } else if (text.startsWith('⚠️')) {
      line.classList.add('warning');
    } else if (text.startsWith('❌') || text.includes('Error')) {
      line.classList.add('error');
    }
    
    line.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
    logConsole.appendChild(line);
    
    // Auto scroll to bottom
    logConsole.scrollTop = logConsole.scrollHeight;
  }

  // Clear logs console
  clearLogsBtn.addEventListener('click', () => {
    logConsole.innerHTML = '';
  });

  // Reset progress and display forms
  function resetUI() {
    formSection.classList.remove('hidden');
    progressSection.classList.add('hidden');
    resultCard.classList.add('hidden');
    progressBar.style.width = '0%';
    percentText.textContent = '0%';
    statusText.textContent = 'Iniciando tareas...';
    startBtn.disabled = false;
    
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  }

  // Cancel action
  cancelBtn.addEventListener('click', () => {
    if (confirm('¿Seguro que deseas cancelar la descarga actual?')) {
      addLogLine('⚠️ Descarga cancelada por el usuario.');
      resetUI();
    }
  });

  // Form submission / Start Download
  downloaderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const targetUrl = document.getElementById('targetUrl').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const sessionCookie = document.getElementById('sessionCookie').value;

    // Switch view
    formSection.classList.add('hidden');
    progressSection.classList.remove('hidden');
    resultCard.classList.add('hidden');
    logConsole.innerHTML = '';
    
    progressBar.style.width = '0%';
    percentText.textContent = '0%';
    
    addLogLine('🚀 Iniciando proceso de descarga...');
    addLogLine(`🔗 URL objetivo: ${targetUrl}`);
    addLogLine(`🔐 Método: ${currentLoginMode === 'credentials' ? 'Credenciales de Moodle' : 'Cookie MoodleSession'}`);

    // Build URL query string
    const params = new URLSearchParams({
      targetUrl,
      loginMode: currentLoginMode,
      username: currentLoginMode === 'credentials' ? username : '',
      password: currentLoginMode === 'credentials' ? password : '',
      sessionCookie: currentLoginMode === 'cookie' ? sessionCookie : ''
    });

    // Establish Server-Sent Events connection
    const sseUrl = `/api/download?${params.toString()}`;
    eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'progress') {
          // Update progress details
          progressBar.style.width = `${data.percent}%`;
          percentText.textContent = `${data.percent}%`;
          statusText.textContent = data.message;
          addLogLine(data.message);
          
        } else if (data.type === 'complete') {
          // Finish successfully
          progressBar.style.width = '100%';
          percentText.textContent = '100%';
          statusText.textContent = '¡Completado!';
          addLogLine('🎉 ¡El proceso ha finalizado correctamente!');
          
          downloadZipBtn.href = data.zipUrl;
          downloadZipBtn.setAttribute('download', data.zipName);
          resultCard.classList.remove('hidden');
          
          // Trigger file download automatically after a short delay
          setTimeout(() => {
            downloadZipBtn.click();
          }, 800);
          
          eventSource.close();
          eventSource = null;
          
        } else if (data.type === 'error') {
          // Process error
          statusText.textContent = 'Ocurrió un error';
          addLogLine(`❌ Error: ${data.message}`);
          alert(`Error: ${data.message}`);
          
          eventSource.close();
          eventSource = null;
        }
      } catch (err) {
        addLogLine(`❌ Error al analizar la respuesta del servidor: ${err.message}`);
      }
    };

    eventSource.onerror = (err) => {
      console.error('EventSource error:', err);
      addLogLine('❌ Conexión con el servidor interrumpida. El servidor podría estar procesando la solicitud, o ha ocurrido una desconexión.');
      // Keep EventSource open or close if it gets stuck
      if (eventSource.readyState === EventSource.CLOSED) {
        eventSource.close();
        eventSource = null;
      }
    };
  });
});

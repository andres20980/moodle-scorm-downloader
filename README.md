# 🎓 Moodle SCORM & Resource PDF Downloader

Una aplicación web moderna y elegante diseñada para automatizar la descarga de temarios y materiales didácticos de Moodle en formato PDF, ideal para estudiar sin conexión o conservar tus apuntes una vez finalice el acceso al campus.

Este descargador es compatible con contenidos alojados en reproductores **SCORM de Educalms (iEditorial)** y recursos de archivos PDF tradicionales de Moodle.

---

## 🌟 Características Principales

* **Autenticación Dual Inteligente**:
  * **Modo Credenciales**: Inicia sesión automáticamente en el portal de Moodle a partir de tu usuario y contraseña tradicional.
  * **Modo Cookie de Sesión**: Pega tu cookie `MoodleSession` activa para saltarte sistemas de acceso de terceros como Single Sign-On (SSO), Office 365, Google o Doble Factor de Autenticación (MFA).
* **Rastreo Dinámico de Temarios**:
  * Si ingresas la URL de la página principal de un curso (`course/view.php?id=...`), el backend rastreará automáticamente **todas las unidades SCORM** y archivos de recursos adjuntos.
  * Si introduces un enlace a una actividad SCORM individual (`mod/scorm/view.php?id=...`), procesará únicamente ese temario de forma directa.
* **Extracción de PDF Directa desde Origen**:
  * Accede a la configuración de los SCOs del reproductor, captura el parámetro cifrado de ruta `r` y realiza peticiones automáticas a la API de exportación de Educalms.
  * Descarga los recursos de archivo PDF y resuelve redirecciones de forma automática.
* **Interfaz de Usuario Premium**:
  * Panel visual con estilo **Glassmorphic** y diseño de gama alta.
  * Transmisión de progreso en tiempo real mediante **Server-Sent Events (SSE)**.
  * Consola de comandos retro integrada para monitorizar logs y diagnósticos de descarga línea por línea.
  * Empaquetado ZIP de todo el temario listo para descargar al completarse la tarea.

---

## 🛠️ Estructura del Repositorio

* `server.js`: El backend en Node.js/Express encargado de simular el inicio de sesión, analizar la estructura HTML con Cheerio, descargar los ficheros mediante Axios y empaquetar el contenido en un archivo ZIP.
* `public/`: Contiene los ficheros estáticos de la interfaz web:
  * `index.html`: Estructura y maquetación interactiva.
  * `style.css`: Estilo visual avanzado con variables CSS y desenfoques de fondo.
  * `app.js`: Script de control del cliente que establece el flujo SSE con el servidor.
* `src/`: Ficheros fuente SCORM de muestra.
* [monetizacion_analisis.md](monetizacion_analisis.md): Análisis estratégico sobre la monetización del producto en formato de Extensión de Chrome.
* [GIT_BEST_PRACTICES.md](GIT_BEST_PRACTICES.md): Directrices de Git, flujo de ramas y estructura de commits (Conventional Commits).

---

## 🚀 Cómo Poner en Marcha la Aplicación

### Requisitos Previos
* Tener instalado **Node.js** (versión 18 o superior).
* Tener instalado **npm** (gestor de paquetes de Node.js).

### Instalación y Ejecución

1. Clona el repositorio si aún no lo has hecho:
   ```bash
   git clone https://github.com/andres20980/moodle-scorm-downloader.git
   ```
2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
3. Arranca el servidor local:
   ```bash
   npm start
   ```
4. Abre tu navegador y navega a la URL:
   👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Cómo Obtener la Cookie `MoodleSession` (Modo 2)

Si tu campus utiliza un portal de login corporativo o cuentas institucionales de terceros:
1. Inicia sesión normalmente en tu portal de Moodle en el navegador.
2. Abre las herramientas de desarrollador presionando `F12` o clic derecho -> **Inspeccionar**.
3. Navega a la pestaña **Application** (Chrome/Brave) o **Almacenamiento** (Firefox).
4. En el menú de la izquierda, expande **Cookies** y selecciona la URL de tu campus.
5. Copia el valor de la cookie llamada `MoodleSession`.
6. Pégalo en el campo correspondiente en la interfaz web de la aplicación y ¡listo!

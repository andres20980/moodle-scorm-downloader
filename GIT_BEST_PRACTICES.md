# Guía de Buenas Prácticas de Git y Contribución

Este documento establece las directrices y estándares de desarrollo para colaborar en el repositorio de **Moodle SCORM PDF Downloader**.

---

## 🌿 1. Estrategia de Ramas (Branching)

Trabajamos con una estructura basada en ramas de características para mantener la rama principal (`main` o `master`) siempre estable y lista para producción.

* **`main` / `master`**: La rama de producción. Nunca se edita ni se hace commit directamente sobre ella.
* **`develop`** (opcional): Rama de integración de características.
* **Ramas de Características (`feature/`)**: Para nuevas funcionalidades o cambios de diseño.
  * Ej: `feature/interfaz-glassmorphism`, `feature/descarga-directa-recursos`.
* **Ramas de Corrección (`bugfix/` o `hotfix/`)**: Para resolver errores detectados.
  * Ej: `bugfix/token-login-moodle`, `hotfix/endpoint-pdf-educalms`.

### Ciclo de vida de una tarea:
1. Crear una rama desde la última versión de `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/mi-nueva-caracteristica
   ```
2. Realizar commits organizados sobre la nueva rama.
3. Subir la rama a GitHub y crear un Pull Request (PR) hacia `main`.

---

## 💬 2. Mensajes de Commit (Conventional Commits)

Los mensajes de commit deben ser claros, descriptivos y seguir el estándar de **Conventional Commits** para facilitar la lectura del historial y la generación automática de changelogs.

Formato: `<tipo>(<ámbito opcional>): <descripción corta en minúsculas>`

### Tipos de commit comunes:
* **`feat`**: Una nueva funcionalidad para el usuario.
  * *Ej: `feat(ui): añadir consola de logs en tiempo real para descargas`*
* **`fix`**: Corrección de un bug.
  * *Ej: `fix(auth): reparar redirección del testsession al loguear en Moodle`*
* **`docs`**: Cambios únicamente en la documentación.
  * *Ej: `docs: crear guía de buenas prácticas de git en español`*
* **`style`**: Cambios de estilo, formato o espaciado que no afectan al comportamiento del código (ej: CSS, linters).
  * *Ej: `style(glass): ajustar opacidad y blur del contenedor principal`*
* **`refactor`**: Reestructuración de código que no corrige bugs ni añade características.
  * *Ej: `refactor(auth): modularizar el inicio de sesión de moodle`*
* **`test`**: Añadir o corregir pruebas unitarias o de integración.
* **`chore`**: Tareas de mantenimiento, actualización de paquetes o configuración de herramientas de desarrollo (ej. actualizar npm).

---

## 🚫 3. Archivos que NUNCA deben subirse (.gitignore)

Debemos mantener el repositorio limpio y evitar subir dependencias locales, archivos temporales generados o claves privadas. Asegúrate de incluir y respetar las siguientes exclusiones:

* **`node_modules/`**: Instalaciones de librerías de Node.js (se descargan en cada máquina mediante `npm install`).
* **`temp_downloads/`**: PDFs y archivos ZIP temporales descargados por el backend.
* **`.env` / credenciales**: Archivos con claves API, contraseñas de prueba o configuraciones privadas.
* **Logs**: Archivos `.log` de ejecución o debug.

---

## 📑 4. Flujo de Trabajo y Pull Requests (PR)

Antes de fusionar (merge) cambios en la rama principal:
1. **Ejecutar Localmente**: Asegúrate de que el código corre sin errores en tu máquina (`node server.js`).
2. **Revisar Diff**: Haz un `git diff` antes de añadir los cambios para evitar subir código de pruebas o comentarios innecesarios.
3. **Pull Request Limpio**: El PR debe tener un título claro que indique qué soluciona o qué añade, y una breve descripción de los cambios realizados.

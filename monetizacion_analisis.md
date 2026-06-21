# Análisis de Monetización y Negocio

Este documento resume el análisis de viabilidad comercial y estrategias de monetización para el proyecto **Moodle SCORM & Resource Downloader**.

---

## 🎯 El Problema y la Necesidad

Muchos estudiantes universitarios, opositores o empleados en cursos de capacitación corporativa se enfrentan a plataformas Moodle que cargan sus contenidos mediante reproductores interactivos SCORM (como Educalms). Esto genera varios inconvenientes:
1. **Acceso Limitado**: Al finalizar la fecha del curso, el alumno pierde el acceso al material.
2. **Estudio Offline Inexistente**: Es imposible subrayar, leer en tablet, o imprimir el material sin realizar capturas de pantalla individuales.
3. **Pérdida de Tiempo**: Los estudiantes dedican horas a transcribir o guardar pantallas de forma manual.

Existe una **demanda real e inmensa** de una solución automatizada para exportar estos materiales a PDF de forma limpia.

---

## 💡 Estrategia de Producto Recomendada

### Extensión de Navegador (Chrome Extension)
En lugar de lanzar una plataforma web alojada en servidores cloud (SaaS), la mejor forma de empaquetar y vender esta herramienta es mediante una **extensión de Chrome** por los siguientes motivos:

1. **Privacidad y Seguridad (RGPD)**: La extensión se ejecuta localmente en el navegador del usuario. Utiliza la sesión activa sin necesidad de que el usuario comparta su contraseña o cookie `MoodleSession` con un servidor externo.
2. **Costes de Servidor Cero**: Todo el procesamiento del scraping y las descargas de PDFs se ejecutan en el cliente, eliminando costes de hosting y ancho de banda.
3. **Menor Riesgo de Bloqueos**: Las peticiones a Moodle se hacen desde la propia dirección IP del usuario, lo que evita que los sistemas de seguridad de las plataformas bloqueen la IP de un servidor centralizado.
4. **Experiencia de Usuario Integrada**: Se puede inyectar un botón interactivo de "Descargar PDF" directamente en la barra de herramientas de Moodle.

---

## 💰 Modelos de Negocio

* **Modelo Freemium (Licencia Única / Suscripción)**:
  * **Gratis**: Descarga la primera unidad de cualquier curso para validar la utilidad de la herramienta.
  * **Pro (Pago Único / Licencia)**: Pago de **9.99€** (por ejemplo) para desbloquear descargas ilimitadas de cursos completos.
* **Pago por Uso**:
  * Cobrar un importe menor (ej. **2.99€**) por curso individual exportado en ZIP.
* **Modelo B2B (Licencia para Academias)**:
  * Versión especializada para tutores o escuelas de formación que necesiten realizar copias de seguridad de sus propios contenidos interactivos para migraciones.

---

## ⚖️ Consideraciones Legales y Técnicas

1. **Derechos de Autor**: La herramienta debe promocionarse bajo la premisa de **estudio offline y accesibilidad personal**, acogiéndose al derecho de copia privada para fines académicos y personales. Deben evitarse términos que sugieran piratería de contenidos de pago.
2. **Políticas de Uso de Moodle**: El web scraping puede estar regulado en los términos de servicio de algunas instituciones.
3. **Mantenimiento**: Dado que los reproductores SCORM o las APIs de Moodle se actualizan periódicamente, se requiere un mantenimiento constante de los endpoints de la extensión de navegador para garantizar que la descarga siga funcionando en futuras versiones.

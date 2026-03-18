# 📡 Backend API — Documentación técnica

## ¿Qué es Axios?

Axios es una librería de JavaScript que facilita hacer peticiones HTTP desde el navegador o desde Node.js. Es una alternativa más potente a la API nativa `fetch`.

**¿Por qué se usa?**
- Transforma automáticamente las respuestas a JSON sin necesidad de llamar `.json()`
- Maneja errores HTTP de forma más clara
- Permite cancelar peticiones y configurar timeouts fácilmente
- Tiene interceptores para añadir cabeceras automáticamente en todas las peticiones

**Ejemplo con Axios vs Fetch:**
```javascript
// Con fetch (nativo)
const res = await fetch('/api/v1/tasks');
const data = await res.json();

// Con Axios (librería)
const { data } = await axios.get('/api/v1/tasks');
```

En este proyecto usamos `fetch` nativo, pero en proyectos más grandes Axios es la opción estándar.

---

## ¿Qué es Postman?

Postman es una aplicación de escritorio que permite probar APIs REST de forma visual sin necesidad de escribir código. Es la herramienta estándar del sector para el desarrollo y prueba de backends.

**¿Por qué se usa?**
- Permite enviar peticiones GET, POST, PUT, DELETE con un clic
- Guarda colecciones de peticiones organizadas por proyecto
- Permite documentar la API con ejemplos reales de request y response
- Facilita probar errores forzando datos incorrectos o IDs inexistentes

**En este proyecto** usamos Thunder Client, que es la versión integrada en VSCode con las mismas funcionalidades pero sin salir del editor.

---

## ¿Qué es Sentry?

Sentry es una plataforma de monitorización de errores en tiempo real. Cuando tu aplicación falla en producción, Sentry captura el error automáticamente y te lo notifica con toda la información: stack trace, usuario afectado, navegador, sistema operativo y contexto completo.

**¿Por qué se usa?**
- Detecta errores en producción que los usuarios no reportan
- Agrupa errores similares para priorizar los más críticos
- Integra con Slack, GitHub y otras herramientas para notificaciones
- Permite ver si un deploy nuevo ha introducido errores nuevos

**Ejemplo de integración básica en Express:**
```javascript
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'TU_DSN_AQUI' });
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

---

## ¿Qué es Swagger?

Swagger (actualmente OpenAPI) es un estándar para documentar APIs REST de forma interactiva. Genera automáticamente una página web donde cualquier desarrollador puede ver todos los endpoints disponibles, sus parámetros y probarlos directamente desde el navegador.

**¿Por qué se usa?**
- Genera documentación visual y siempre actualizada de la API
- Permite a otros desarrolladores entender y probar la API sin leer el código
- Es el estándar de la industria para documentar APIs en equipos grandes
- Reduce el tiempo de integración entre equipos de frontend y backend

**Ejemplo de integración en Express:**
```javascript
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

Con esto, accediendo a `http://localhost:3000/api-docs` verías toda la documentación de la API de forma visual e interactiva.
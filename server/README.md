# 📡 TaskFlow — Backend API REST

Servidor backend de TaskFlow construido con **Node.js** y **Express**.  
Arquitectura por capas estricta con separación de responsabilidades, validación defensiva y documentación interactiva con Swagger.

**API en producción:** https://taskflow-api-seven.vercel.app  
**Documentación Swagger:** https://taskflow-api-seven.vercel.app/api-docs

---

## 📁 Estructura de carpetas

```
server/
├── src/
│   ├── config/
│   │   ├── env.js          → Carga y valida las variables de entorno
│   │   └── swagger.js      → Configuración de Swagger / OpenAPI 3.0
│   ├── controllers/
│   │   └── task.controller.js  → Valida datos de red y orquesta respuestas HTTP
│   ├── routes/
│   │   └── task.routes.js      → Mapea verbos HTTP a controladores
│   ├── services/
│   │   └── task.service.js     → Lógica de negocio pura (sin Express)
│   └── index.js            → Punto de entrada: middlewares, rutas y servidor
├── .env                    → Variables de entorno (nunca en Git)
├── .gitignore
├── package.json
└── vercel.json             → Configuración de despliegue en Vercel
```

---

## 🏗️ Arquitectura por capas

El backend sigue el principio de **Separación de Responsabilidades (SoC)**. Cada capa tiene una única misión y no conoce la existencia de las otras.

```
Petición HTTP
     │
     ▼
[ ROUTES ]        → Escucha la red. Mapea URL + verbo HTTP al controlador.
     │               No toma ninguna decisión lógica.
     ▼
[ CONTROLLER ]    → Extrae datos del request, los valida, llama al servicio.
     │               Formatea la respuesta HTTP con el código correcto.
     ▼
[ SERVICE ]       → Lógica de negocio pura. No sabe nada de Express,
                    req ni res. Solo recibe datos limpios y devuelve resultados.
```

El flujo es **siempre unidireccional**: Red → Router → Controller → Service → Controller → Red. Nunca al revés.

---

## ⚙️ Middlewares implementados

Los middlewares son funciones que interceptan cada petición HTTP **antes** de que llegue al controlador. Reciben `req` (petición), `res` (respuesta) y `next` (función que cede el control al siguiente eslabón). Si no se llama a `next()`, la petición queda colgada indefinidamente.

### 1. `express.json()` — Parseador de cuerpos
Intercepta el stream de bytes crudos que llega de la red y lo convierte en un objeto JavaScript accesible en `req.body`. Sin este middleware el servidor no puede leer el JSON que envía el cliente.

```javascript
app.use(express.json());
```

### 2. `cors()` — Seguridad de origen cruzado
El navegador bloquea por defecto las peticiones HTTP hacia dominios distintos al de la página (política Same-Origin). El frontend está en un dominio y la API en otro. Sin este middleware, el navegador rechazaría todas las peticiones aunque el servidor funcionase correctamente.

```javascript
app.use(cors());
```

### 3. `loggerAcademico` — Auditoría personalizada
Middleware desarrollado desde cero. Registra en consola cada petición HTTP con el método, la ruta, el código de respuesta y el tiempo en milisegundos. Se suscribe al evento `finish` del stream de respuesta de Node.js, que se dispara justo cuando el servidor termina de enviar la respuesta al cliente.

```javascript
const loggerAcademico = (req, res, next) => {
  const inicio = performance.now();
  res.on('finish', () => {
    const duracion = (performance.now() - inicio).toFixed(2);
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duracion}ms)`);
  });
  next();
};
```

Ejemplo de salida en consola:
```
[GET]    /api/v1/tasks        - 200 (3.14ms)
[POST]   /api/v1/tasks        - 201 (1.88ms)
[DELETE] /api/v1/tasks/99     - 404 (0.92ms)
```

### 4. Error Handler global — 4 parámetros
En Express, un middleware de manejo de errores se distingue del resto por tener exactamente **4 parámetros**: `(err, req, res, next)`. Se coloca siempre al final de `index.js` y captura cualquier error no controlado que se haya propagado por la cadena.

Se devuelve un mensaje genérico al cliente para no filtrar detalles técnicos sensibles (stack traces, rutas internas, etc.) a posibles atacantes.

```javascript
app.use((err, req, res, next) => {
  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({ error: 'Recurso no encontrado.' });
  }
  console.error(err); // El stack trace solo se registra en el servidor
  res.status(500).json({ error: 'Error interno del servidor.' });
});
```

---

## 🌐 Endpoints de la API REST

Base URL producción: `https://taskflow-api-seven.vercel.app/api/v1`  
Base URL local: `http://localhost:3000/api/v1`

El prefijo `/api/v1/` sigue el estándar de **versionado de APIs**: si en el futuro el contrato cambia de forma incompatible, se crea `/api/v2/` sin romper los clientes que usan v1.

| Método | Endpoint | Acción | Código éxito |
|--------|----------|--------|--------------|
| GET | `/tasks` | Obtener todas las tareas | `200 OK` |
| POST | `/tasks` | Crear una nueva tarea | `201 Created` |
| DELETE | `/tasks/:id` | Eliminar una tarea por ID | `204 No Content` |

### GET /api/v1/tasks
Devuelve el array completo de tareas. Operación **segura e idempotente**: ejecutarla mil veces no modifica ningún dato.

```
GET https://taskflow-api-seven.vercel.app/api/v1/tasks

Respuesta 200 OK:
[
  { "id": 1, "titulo": "Revisar documentación", "completada": false },
  { "id": 2, "titulo": "Testear endpoints", "completada": false }
]
```

### POST /api/v1/tasks
Crea una nueva tarea. Operación **no idempotente**: cada llamada crea un recurso distinto. Requiere validación del body antes de llegar al servicio.

```
POST https://taskflow-api-seven.vercel.app/api/v1/tasks
Content-Type: application/json

Body válido:
{ "titulo": "Mi nueva tarea" }

Respuesta 201 Created:
{ "id": 3, "titulo": "Mi nueva tarea", "completada": false }
```

**Errores de validación (400 Bad Request):**
```
Body: {}                        → { "error": "El título es obligatorio y debe tener al menos 3 caracteres." }
Body: { "titulo": "ab" }        → { "error": "El título es obligatorio y debe tener al menos 3 caracteres." }
Body: { "titulo": 12345 }       → { "error": "El título es obligatorio y debe tener al menos 3 caracteres." }
```

### DELETE /api/v1/tasks/:id
Elimina una tarea por su ID. Devuelve `204 No Content` en éxito: código semántico que indica que la operación fue correcta pero no hay cuerpo de respuesta que devolver.

```
DELETE https://taskflow-api-seven.vercel.app/api/v1/tasks/1

Respuesta 204 No Content (sin cuerpo)
```

**Error si el ID no existe (404 Not Found):**
```
DELETE https://taskflow-api-seven.vercel.app/api/v1/tasks/99

Respuesta 404:
{ "error": "Tarea no encontrada." }
```

---

## 🔒 Validación defensiva en la frontera de red

El principio fundamental: **nunca confíes en los datos que envía el cliente**.

La validación ocurre en el controlador, antes de que ningún dato llegue al servicio. Si los datos no cumplen el contrato, la petición se rechaza inmediatamente con un `400 Bad Request`.

```javascript
// Fragmento real de task.controller.js
const crearTarea = (req, res) => {
  const { titulo } = req.body;

  if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 3) {
    return res.status(400).json({ 
      error: 'El título es obligatorio y debe tener al menos 3 caracteres.' 
    });
  }

  const nuevaTarea = taskService.crearTarea({ titulo });
  res.status(201).json(nuevaTarea);
};
```

La validación comprueba tres cosas en orden:
1. Que el campo `titulo` exista en el body
2. Que sea de tipo `string` (no un número, array u objeto)
3. Que tenga al menos 3 caracteres tras eliminar espacios en blanco

---

## 💾 Capa de servicios — Lógica de negocio pura

El servicio no importa Express ni conoce `req` o `res`. Es JavaScript puro. Usa un **array en memoria** como persistencia simulada (en una aplicación real sería una base de datos).

```javascript
// Fragmento real de task.service.js
let tasks = [];
let nextId = 1;

const crearTarea = (data) => {
  const nuevaTarea = {
    id: nextId++,       // ID autoincremental
    titulo: data.titulo,
    completada: false
  };
  tasks.push(nuevaTarea);
  return nuevaTarea;
};

const eliminarTarea = (id) => {
  const index = tasks.findIndex(tarea => tarea.id === parseInt(id));
  if (index === -1) {
    throw new Error('NOT_FOUND'); // El controlador captura este error
  }
  tasks.splice(index, 1);
};
```

Ventaja de esta separación: si mañana se conecta una base de datos real (MongoDB, PostgreSQL), **solo se modifica el servicio**. El controlador y las rutas no se tocan.

---

## 🔧 Variables de entorno

Siguiendo la metodología **12-Factor App**, ningún valor dinámico está escrito directamente en el código. Todo va en `.env`, que está listado en `.gitignore` y **nunca se sube a GitHub**.

```bash
# Contenido del archivo .env
PORT=3000
```

El módulo `src/config/env.js` carga las variables y valida que existan antes de arrancar el servidor. Si falta una variable crítica, el servidor se niega a iniciarse con un error claro:

```javascript
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

if (!process.env.PORT) {
  throw new Error('[CONFIG] El puerto no está definido en .env');
}

module.exports = { PORT: process.env.PORT };
```

En producción (Vercel), las variables se configuran en **Settings → Environment Variables** del panel de Vercel. Nunca en el código.

---

## 📖 Documentación Swagger

La API está documentada con **OpenAPI 3.0** usando `swagger-jsdoc` y `swagger-ui-express`.

- `swagger-jsdoc` lee los comentarios JSDoc escritos encima de cada endpoint y genera automáticamente la especificación OpenAPI.
- `swagger-ui-express` sirve esa especificación como una interfaz visual interactiva.

**Acceso:** https://taskflow-api-seven.vercel.app/api-docs

> **Nota técnica:** En producción (Vercel serverless), los archivos estáticos de Swagger UI no se pueden servir desde el servidor. Se resolvió apuntando los assets CSS y JS a un CDN externo (Cloudflare), de forma que el navegador los descargue directamente sin pasar por el servidor.

---

## 🚀 Despliegue en Vercel

El backend está desplegado como función serverless en Vercel. La configuración está en `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    { "src": "src/index.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "src/index.js" }
  ]
}
```

- `builds` indica a Vercel que compile `src/index.js` como una función Node.js.
- `routes` redirige **todas** las peticiones entrantes a ese archivo, de forma que Express gestiona el enrutamiento interno.

---

## 🛠️ Cómo ejecutar en local

```bash
# 1. Entrar en la carpeta del servidor
cd server

# 2. Instalar dependencias
npm install

# 3. Crear el archivo .env con el puerto
# (escribirlo manualmente en VSCode, no con echo)
PORT=3000

# 4. Arrancar el servidor en modo desarrollo
npm run dev
```

El servidor arrancará en `http://localhost:3000`.  
Swagger disponible en `http://localhost:3000/api-docs`.

---

## 📦 Dependencias

| Paquete | Tipo | Para qué sirve |
|---------|------|----------------|
| `express` | Producción | Framework HTTP para construir el servidor |
| `cors` | Producción | Gestión de cabeceras de origen cruzado |
| `dotenv` | Producción | Carga de variables de entorno desde `.env` |
| `swagger-jsdoc` | Producción | Generación de especificación OpenAPI desde JSDoc |
| `swagger-ui-express` | Producción | Interfaz visual interactiva de la API |
| `nodemon` | Desarrollo | Reinicia el servidor automáticamente al guardar cambios |
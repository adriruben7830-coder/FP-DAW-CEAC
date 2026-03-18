# 📝 TaskFlow

Aplicación de gestión de tareas desarrollada como proyecto de prácticas
del ciclo DAW en CEAC. Permite crear, completar, eliminar y filtrar tareas
con persistencia de datos en una API REST con Node.js y Express.

## 🚀 Demo en producción
[Enlace a Vercel] https://flujo-de-tareas-proyecto.vercel.app/

## ✨ Funcionalidades

- ➕ Añadir tareas con título y prioridad (alta, media, baja)
- ✅ Marcar tareas como completadas
- 🗑️ Eliminar tareas individuales y en bloque
- 🔍 Buscar tareas en tiempo real
- 📊 Estadísticas en tiempo real (total, completadas, pendientes)
- 🌙 Modo oscuro con preferencia guardada
- ⏳ Estados de carga y error en la interfaz
- 📱 Diseño responsive para móvil y escritorio

## 🛠️ Tecnologías usadas

### Frontend
- HTML5 semántico
- CSS3 con variables y Flexbox
- JavaScript vanilla con Fetch API
- Tailwind CSS

### Backend
- Node.js
- Express.js
- CORS
- dotenv
- Nodemon (desarrollo)

### Herramientas
- Git y GitHub
- Vercel (despliegue)
- Thunder Client (pruebas de API)

## 📁 Estructura del proyecto
```
TASKFLOW_PROJECT/
├── index.html
├── css/
│   ├── styles.css
│   └── output.css
├── js/
│   ├── app.js
│   └── client.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   └── task.controller.js
│   │   ├── routes/
│   │   │   └── task.routes.js
│   │   ├── services/
│   │   │   └── task.service.js
│   │   └── index.js
│   ├── .env
│   └── package.json
├── docs/
│   └── ai/
│       ├── ai-comparison.md
│       ├── cursor-workflow.md
│       ├── prompt-engineering.md
│       ├── experiments.md
│       └── reflection.md
└── README.md
```

## 🏗️ Arquitectura del backend

El backend sigue una arquitectura por capas estricta con separación de responsabilidades:

**Capa de enrutamiento (routes):** Escucha las peticiones HTTP y las dirige al controlador correspondiente. No contiene lógica de negocio.

**Capa de controladores (controllers):** Extrae los datos de la petición, aplica validaciones defensivas y llama a la capa de servicios. Devuelve la respuesta HTTP con el código correcto.

**Capa de servicios (services):** Contiene la lógica de negocio pura. Desconoce completamente la existencia de Express, req o res. Usa un array en memoria como persistencia simulada.

### Middlewares implementados

- `express.json()` — Parsea el body de las peticiones como JSON
- `cors()` — Permite peticiones desde el frontend en otro origen
- `loggerAcademico` — Middleware personalizado que registra método, ruta, código de estado y tiempo de respuesta de cada petición

## 🌐 API REST

Base URL: `http://localhost:3000/api/v1`

| Método | Endpoint | Descripción | Respuesta |
|--------|----------|-------------|-----------|
| GET | /tasks | Obtener todas las tareas | 200 OK |
| POST | /tasks | Crear una nueva tarea | 201 Created |
| DELETE | /tasks/:id | Eliminar una tarea por ID | 204 No Content |

### Ejemplos de uso

**GET /tasks**
```
Respuesta: []
```

**POST /tasks**
```json
Body:    { "titulo": "Mi tarea" }
Respuesta: { "id": 1, "titulo": "Mi tarea", "completada": false }
```

**POST /tasks — Error de validación**
```json
Body:    { "titulo": "ab" }
Respuesta 400: { "error": "El título es obligatorio y debe tener al menos 3 caracteres." }
```

**DELETE /tasks/99 — ID no existe**
```json
Respuesta 404: { "error": "Tarea no encontrada." }
```

## ⚙️ Cómo ejecutar el proyecto

### 1. Clonar el repositorio
```bash
git clone https://github.com/adriruben7830-coder/FP-DAW-CEAC.git
```

### 2. Instalar dependencias del backend
```bash
cd server
npm install
```

### 3. Crear el archivo .env dentro de server/
```
PORT=3000
```

### 4. Arrancar el servidor
```bash
npm run dev
```

### 5. Abrir el frontend
Abre index.html con Live Server o directamente en el navegador.

## 🤖 IA utilizada en el desarrollo

- **Claude** para arquitectura, refactorización y resolución de problemas
- **Cursor IDE** para edición inline y chat contextual
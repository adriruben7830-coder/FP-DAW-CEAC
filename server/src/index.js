const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { PORT } = require('./config/env');
const taskRoutes = require('./routes/task.routes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Middleware de auditoría
const loggerAcademico = (req, res, next) => {
  const inicio = performance.now();
  res.on('finish', () => {
    const duracion = performance.now() - inicio;
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} - ${duracion.toFixed(2)} ms`);
  });
  next();
};

app.use(loggerAcademico);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js'
  ]
}));

// Rutas
app.use('/api/v1/tasks', taskRoutes);

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({ error: 'Recurso no encontrado.' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación Swagger en http://localhost:${PORT}/api-docs`);
});
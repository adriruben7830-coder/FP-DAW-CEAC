const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description: 'API REST para gestión de tareas — Proyecto DAW CEAC'
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Servidor local'
      },
      {
        url: 'https://taskflow-api-seven.vercel.app/api/v1',
        description: 'Servidor de producción'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
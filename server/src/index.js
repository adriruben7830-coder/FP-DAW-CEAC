const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');
const taskRoutes = require('./routes/task.routes');

const app = express();

// MIDDLEWARES GLOBALES
app.use(cors());
app.use(express.json());

//MIDDLEWARE DE AUDITORIA
const loggerAcademico = (req, res, next) => {
    const inicio = performance.now();
    res.on('finish', () => {
        const duracion = performance.now() - inicio;
        console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} - ${duracion.toFixed(2)} ms`);
    });
    next();
};
app.use(loggerAcademico);

//RUTAS
app.use('/api/v1/tasks', taskRoutes);

//MIDDLEWARE GLOBAL DE MANEJO DE ERRORES
app.use((err, req, res, next) => {
if (err.message === 'NOT_FOUND') {
    return res.status(404).json({ error: 'Recurso no encontrado.' });
}
console.error(err);
res.status(500).json({ error: 'Error interno del servidor.' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
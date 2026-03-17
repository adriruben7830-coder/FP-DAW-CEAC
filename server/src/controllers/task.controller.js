const taskService = require('../services/task.service');

const obtenerTareas = (req, res) => {
  const tasks = taskService.obtenerTodas();
  res.status(200).json(tasks);
};

const crearTarea = (req, res) => {
  try {
    const { titulo } = req.body;

    if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 3) {
      return res.status(400).json({ 
        error: 'El título es obligatorio y debe tener al menos 3 caracteres.' 
      });
    }

    const nuevaTarea = taskService.crearTarea({ titulo });
    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const eliminarTarea = (req, res) => {
  try {
    taskService.eliminarTarea(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Tarea no encontrada.' });
    }
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { obtenerTareas, crearTarea, eliminarTarea };
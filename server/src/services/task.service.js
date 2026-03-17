let tasks = [];
let nextId = 1;

const obtenerTodas = () => {
  return tasks;
};

const crearTarea = (data) => {
  const nuevaTarea = {
    id: nextId++,
    titulo: data.titulo,
    completada: false
  };
  tasks.push(nuevaTarea);
  return nuevaTarea;
};

const eliminarTarea = (id) => {
  const index = tasks.findIndex(tarea => tarea.id === parseInt(id));
  if (index === -1) {
    throw new Error('NOT_FOUND');
  }
  tasks.splice(index, 1);
};

module.exports = {
  obtenerTodas,
  crearTarea,
  eliminarTarea
};
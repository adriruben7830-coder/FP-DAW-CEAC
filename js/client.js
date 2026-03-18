// ============================================
// CLIENT.JS - Comunicación con la API REST
// Capa de red: todas las peticiones al servidor
// ============================================

const API_URL = 'https://taskflow-api-seven.vercel.app/api/v1/tasks';

/**
 * Obtiene todas las tareas del servidor
 * @returns {Promise<Tarea[]>}
 */
async function obtenerTareasAPI() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener tareas');
    return response.json();
}

/**
 * Crea una nueva tarea en el servidor
 * @param {string} titulo - Título de la tarea
 * @returns {Promise<Tarea>}
 */
async function crearTareaAPI(titulo) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo })
    });
    if (!response.ok) throw new Error('Error al crear tarea');
    return response.json();
}

/**
 * Elimina una tarea del servidor por ID
 * @param {number} id - ID de la tarea
 * @returns {Promise<void>}
 */
async function eliminarTareaAPI(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar tarea');
}
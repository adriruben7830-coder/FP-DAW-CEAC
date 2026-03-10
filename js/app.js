// ============================================
// APP.JS - Lógica principal de TaskMaster
// Práctica 3 y 4: JavaScript + DOM + LocalStorage + Tailwind + Modo oscuro
// ============================================
/**
 * @typedef {Object} Tarea
 * @property {number} id - Identificador único
 * @property {string} texto - Título de la tarea
 * @property {string} prioridad - 'high' | 'medium' | 'low'
 * @property {boolean} completada - Estado de la tarea
 * @property {string} createdAt - Fecha de creación
 */


// --- 1. SELECCIONAMOS LOS ELEMENTOS DEL HTML ---
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const taskList = document.getElementById('taskList');
const totalCounter = document.getElementById('total');
const searchInput = document.getElementById('searchInput');
const menuLinks = document.querySelectorAll('aside a');
const darkToggle = document.getElementById('darkToggle');

// --- 2. MODO OSCURO ---
// Comprobamos si el usuario ya tenía el modo oscuro activado la última vez
if (localStorage.getItem('modoOscuro') === 'true') {
    document.documentElement.classList.add('dark');
    darkToggle.textContent = '☀️ Modo claro';
}

// Cuando el usuario pulsa el botón, alternamos el modo oscuro
darkToggle.addEventListener('click', function() {
    document.documentElement.classList.toggle('dark');

    // Comprobamos si ahora está en modo oscuro o no
    const estaOscuro = document.documentElement.classList.contains('dark');

    // Cambiamos el texto del botón según el modo
    darkToggle.textContent = estaOscuro ? '☀️ Modo claro' : '🌙 Modo oscuro';

    // Guardamos la preferencia del usuario para que se recuerde al recargar
    localStorage.setItem('modoOscuro', estaOscuro);
});

// --- 3. CARGAMOS LAS TAREAS AL INICIAR ---
let tareas = cargarTareasDeStorage();
let filtroActual = 'all';
renderizarTodas(tareas);
actualizarContador();

// --- 4. EVENTO: AÑADIR TAREA ---
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const textoTarea = taskInput.value.trim();
    if (textoTarea === '') return;

    const nuevaTarea = {
        id: Date.now(),
        texto: textoTarea,
        prioridad: prioritySelect.value,
        completada: false
    };

    tareas.push(nuevaTarea);
    guardarEnStorage(tareas);
    renderizarTodas(tareas);
    actualizarContador();
    taskInput.value = '';
});

// --- 5. FUNCIÓN: RENDERIZAR TAREAS ---
/**
 * Renderiza las tareas en el DOM aplicando el filtro activo.
 * @param {Tarea[]} listaDeTareas - Array de tareas a mostrar
 */
function renderizarTodas(listaDeTareas) {
    taskList.innerHTML = '';

    const tareasFiltradas = listaDeTareas.filter(function(tarea) {
        if (filtroActual === 'all') return true;
        if (filtroActual === 'completed') return tarea.completada;
        return tarea.prioridad === filtroActual && !tarea.completada;
    });

    if (tareasFiltradas.length === 0) {
        taskList.innerHTML = '<p style="color:#6b7280; margin-top:1rem;">No hay tareas en esta categoría.</p>';
        return;
    }

    tareasFiltradas.forEach(function(tarea) {
        crearElementoTarea(tarea);
    });
}

// --- 6. FUNCIÓN: CREAR TARJETA DE TAREA ---
/**
 * Crea la tarjeta visual de una tarea y la añade al DOM.
 * Incluye eventos para completar, eliminar y editar.
 * @param {Tarea} tarea - Objeto tarea a renderizar
 */
function crearElementoTarea(tarea) {

    const prioridadTexto = {
        high: 'Alta',
        medium: 'Media',
        low: 'Baja'
    };

    const article = document.createElement('article');
    article.classList.add('task-card', tarea.prioridad);
    if (tarea.completada) article.classList.add('completed');
    article.dataset.id = tarea.id;

    article.innerHTML = `
        <div class="task-header">
            <h3>${tarea.texto}</h3>
            <span class="badge ${tarea.completada ? 'done' : tarea.prioridad}">
                ${tarea.completada ? '✓ Hecha' : prioridadTexto[tarea.prioridad]}
            </span>
        </div>
        <div class="task-actions">
        <button class="btn-completar" aria-label="${tarea.completada ? 'Deshacer tarea: ' + tarea.texto : 'Completar tarea: ' + tarea.texto}">
    ${tarea.completada ? '↩️ Deshacer' : '✓ Completar'}
</button>
<button class="btn-eliminar" aria-label="Eliminar tarea: ${tarea.texto}">
    🗑️ Eliminar
</button>
        </div>
    `;
// EVENTO: EDITAR CON DOBLE CLIC
article.querySelector('h3').addEventListener('dblclick', function() {
    const h3 = this;
    const textoOriginal = tarea.texto;

    // Convertimos el h3 en un input
    const input = document.createElement('input');
    input.type = 'text';
    input.value = textoOriginal;
    input.style.cssText = 'width:100%; padding:4px 8px; border:2px solid #6366f1; border-radius:8px; font-size:1rem;';

    h3.replaceWith(input);
    input.focus();

    // Función que guarda el cambio
    function guardarEdicion() {
        const nuevoTexto = input.value.trim();
        if (nuevoTexto !== '' && nuevoTexto !== textoOriginal) {
            tarea.texto = nuevoTexto;
            guardarEnStorage(tareas);
        }
        renderizarTodas(tareas);
    }

    // Guardar al pulsar Enter
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') guardarEdicion();
        if (e.key === 'Escape') renderizarTodas(tareas); // cancelar
    });

    // Guardar al hacer clic fuera
    input.addEventListener('blur', guardarEdicion);
});
    // EVENTO: COMPLETAR
    article.querySelector('.btn-completar').addEventListener('click', function() {
        tarea.completada = !tarea.completada;
        guardarEnStorage(tareas);
        renderizarTodas(tareas);
        actualizarContador();
    });

    // EVENTO: ELIMINAR
    article.querySelector('.btn-eliminar').addEventListener('click', function() {
        tareas = tareas.filter(t => t.id !== tarea.id);
        guardarEnStorage(tareas);
        article.remove();
        actualizarContador();
    });

    taskList.appendChild(article);
}

// --- 7. GUARDAR EN LOCALSTORAGE ---
/**
 * Guarda el array de tareas en LocalStorage como JSON.
 * @param {Tarea[]} listaDeTareas - Array de tareas a guardar
 */
function guardarEnStorage(listaDeTareas) {
    localStorage.setItem('tareas', JSON.stringify(listaDeTareas));
}

// --- 8. CARGAR DESDE LOCALSTORAGE ---
/**
 * Recupera las tareas guardadas en LocalStorage.
 * Si no hay datos devuelve un array vacío.
 * @returns {Tarea[]} Array de tareas guardadas
 */
function cargarTareasDeStorage() {
    const datos = localStorage.getItem('tareas');
    return datos ? JSON.parse(datos) : [];
}

// --- 9. ACTUALIZAR CONTADORES ---
/**
 * Actualiza los contadores de estadísticas en el panel lateral.
 * Muestra total, completadas y pendientes.
 */
function actualizarContador() {
    const completadas = tareas.filter(t => t.completada).length;
    const pendientes = tareas.filter(t => !t.completada).length;

    totalCounter.textContent = tareas.length;
    document.getElementById('done').textContent = completadas;
    document.getElementById('pending').textContent = pendientes;
}

// --- 10. FILTROS DEL MENÚ ---
menuLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        menuLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        filtroActual = this.dataset.filter;
        renderizarTodas(tareas);
    });
});

// --- 11. BUSCADOR EN TIEMPO REAL ---
searchInput.addEventListener('input', function() {
    const textoBusqueda = searchInput.value.toLowerCase();
    const tarjetas = taskList.querySelectorAll('.task-card');

    tarjetas.forEach(function(card) {
        const texto = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = texto.includes(textoBusqueda) ? 'block' : 'none';
    });
});
// --- 12. MARCAR TODAS COMO COMPLETADAS ---
document.getElementById('btnCompletarTodas').addEventListener('click', function() {
    tareas.forEach(function(tarea) {
        tarea.completada = true;
    });
    guardarEnStorage(tareas);
    renderizarTodas(tareas);
    actualizarContador();
});

// --- 13. BORRAR TODAS LAS COMPLETADAS ---
document.getElementById('btnBorrarCompletadas').addEventListener('click', function() {
    tareas = tareas.filter(function(tarea) {
        return !tarea.completada;
    });
    guardarEnStorage(tareas);
    renderizarTodas(tareas);
    actualizarContador();
});
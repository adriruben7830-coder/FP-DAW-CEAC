// ============================================
// APP.JS - Lógica principal de TaskFlow
// Fase 3: Conectado a API REST con Node.js
// ============================================

// --- 1. SELECCIONAMOS LOS ELEMENTOS DEL HTML ---
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const taskList = document.getElementById('taskList');
const totalCounter = document.getElementById('total');
const searchInput = document.getElementById('searchInput');
const menuLinks = document.querySelectorAll('aside a');
const darkToggle = document.getElementById('darkToggle');

// --- 2. MODO OSCURO (se mantiene en localStorage porque es preferencia de UI) ---
if (localStorage.getItem('modoOscuro') === 'true') {
    document.documentElement.classList.add('dark');
    darkToggle.textContent = '☀️ Modo claro';
}

darkToggle.addEventListener('click', function() {
    document.documentElement.classList.toggle('dark');
    const estaOscuro = document.documentElement.classList.contains('dark');
    darkToggle.textContent = estaOscuro ? '☀️ Modo claro' : '🌙 Modo oscuro';
    localStorage.setItem('modoOscuro', estaOscuro);
});

// --- 3. ESTADO GLOBAL ---
let tareas = [];
let filtroActual = 'all';

// --- 4. ESTADOS DE RED EN UI ---
function mostrarCargando() {
    taskList.innerHTML = '<p style="color:#6b7280; margin-top:1rem;">⏳ Cargando tareas...</p>';
}

function mostrarError(mensaje) {
    taskList.innerHTML = `<p style="color:#ef4444; margin-top:1rem;">❌ ${mensaje}</p>`;
}

// --- 5. INICIALIZAR: CARGAR TAREAS DESDE LA API ---
async function inicializar() {
    mostrarCargando();
    try {
        tareas = await obtenerTareasAPI();
        renderizarTodas(tareas);
        actualizarContador();
    } catch (error) {
        mostrarError('No se pudo conectar con el servidor. ¿Está corriendo?');
    }
}

inicializar();

// --- 6. EVENTO: AÑADIR TAREA ---
taskForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const textoTarea = taskInput.value.trim();
    if (textoTarea === '') return;

    try {
        const nuevaTarea = await crearTareaAPI(textoTarea);
        nuevaTarea.prioridad = prioritySelect.value;
        nuevaTarea.completada = false;
        tareas.push(nuevaTarea);
        renderizarTodas(tareas);
        actualizarContador();
        taskInput.value = '';
    } catch (error) {
        alert('Error al crear la tarea. Revisa que el servidor esté corriendo.');
    }
});

// --- 7. FUNCIÓN: RENDERIZAR TAREAS ---
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

// --- 8. FUNCIÓN: CREAR TARJETA DE TAREA ---
function crearElementoTarea(tarea) {
    const prioridadTexto = {
        high: 'Alta',
        medium: 'Media',
        low: 'Baja'
    };

    const article = document.createElement('article');
    article.classList.add('task-card', tarea.prioridad || 'medium');
    if (tarea.completada) article.classList.add('completed');
    article.dataset.id = tarea.id;

    article.innerHTML = `
        <div class="task-header">
            <h3>${tarea.titulo || tarea.texto}</h3>
            <span class="badge ${tarea.completada ? 'done' : (tarea.prioridad || 'medium')}">
                ${tarea.completada ? '✓ Hecha' : prioridadTexto[tarea.prioridad || 'medium']}
            </span>
        </div>
        <div class="task-actions">
            <button class="btn-completar" aria-label="${tarea.completada ? 'Deshacer tarea' : 'Completar tarea'}">
                ${tarea.completada ? '↩️ Deshacer' : '✓ Completar'}
            </button>
            <button class="btn-eliminar" aria-label="Eliminar tarea">
                🗑️ Eliminar
            </button>
        </div>
    `;

    // EVENTO: COMPLETAR (solo en memoria, sin API por ahora)
    article.querySelector('.btn-completar').addEventListener('click', function() {
        tarea.completada = !tarea.completada;
        renderizarTodas(tareas);
        actualizarContador();
    });

    // EVENTO: ELIMINAR
    article.querySelector('.btn-eliminar').addEventListener('click', async function() {
        try {
            await eliminarTareaAPI(tarea.id);
            tareas = tareas.filter(t => t.id !== tarea.id);
            article.remove();
            actualizarContador();
        } catch (error) {
            alert('Error al eliminar la tarea.');
        }
    });

    taskList.appendChild(article);
}

// --- 9. ACTUALIZAR CONTADORES ---
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
    renderizarTodas(tareas);
    actualizarContador();
});

// --- 13. BORRAR TODAS LAS COMPLETADAS ---
document.getElementById('btnBorrarCompletadas').addEventListener('click', async function() {
    const completadas = tareas.filter(t => t.completada);
    try {
        for (const tarea of completadas) {
            await eliminarTareaAPI(tarea.id);
        }
        tareas = tareas.filter(t => !t.completada);
        renderizarTodas(tareas);
        actualizarContador();
    } catch (error) {
        alert('Error al borrar las tareas completadas.');
    }
});
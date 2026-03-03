// ============================================
// APP.JS - Lógica principal de TaskMaster
// Práctica 3: JavaScript + DOM + LocalStorage
// ============================================

// --- 1. SELECCIONAMOS LOS ELEMENTOS DEL HTML ---
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const taskList = document.getElementById('taskList');
const totalCounter = document.getElementById('total');
const searchInput = document.getElementById('searchInput');
const menuLinks = document.querySelectorAll('aside a');

// --- 2. CARGAMOS LAS TAREAS AL INICIAR LA PÁGINA ---
let tareas = cargarTareasDeStorage();
let filtroActual = 'all';
renderizarTodas(tareas);
actualizarContador();

// --- 3. EVENTO: AÑADIR TAREA ---
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

// --- 4. FUNCIÓN: RENDERIZAR TAREAS ---
function renderizarTodas(listaDeTareas) {
    taskList.innerHTML = '';

    // Filtramos según el menú activo
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

// --- 5. FUNCIÓN: CREAR TARJETA DE TAREA EN EL DOM ---
function crearElementoTarea(tarea) {

    // Etiquetas de prioridad
    const prioridadTexto = {
        high: 'Alta',
        medium: 'Media',
        low: 'Baja'
    };

    // Creamos la tarjeta con el mismo estilo que las prácticas anteriores
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
            <button class="btn-completar">${tarea.completada ? '↩️ Deshacer' : '✓ Completar'}</button>
            <button class="btn-eliminar">🗑️ Eliminar</button>
        </div>
    `;

    // --- EVENTO: COMPLETAR ---
    article.querySelector('.btn-completar').addEventListener('click', function() {
        tarea.completada = !tarea.completada;
        guardarEnStorage(tareas);
        renderizarTodas(tareas);
        actualizarContador();
    });

    // --- EVENTO: ELIMINAR ---
    article.querySelector('.btn-eliminar').addEventListener('click', function() {
        tareas = tareas.filter(t => t.id !== tarea.id);
        guardarEnStorage(tareas);
        article.remove();
        actualizarContador();
    });

    taskList.appendChild(article);
}

// --- 6. GUARDAR EN LOCALSTORAGE ---
function guardarEnStorage(listaDeTareas) {
    localStorage.setItem('tareas', JSON.stringify(listaDeTareas));
}

// --- 7. CARGAR DESDE LOCALSTORAGE ---
function cargarTareasDeStorage() {
    const datos = localStorage.getItem('tareas');
    return datos ? JSON.parse(datos) : [];
}

// --- 8. ACTUALIZAR CONTADORES ---
function actualizarContador() {
    const completadas = tareas.filter(t => t.completada).length;
    totalCounter.textContent = tareas.length;
    document.getElementById('done').textContent = completadas;
}

// --- 9. FILTROS DEL MENÚ ---
menuLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        // Quitar active de todos
        menuLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        // Aplicar filtro
        filtroActual = this.dataset.filter;
        renderizarTodas(tareas);
    });
});

// --- 10. BONUS: BUSCADOR EN TIEMPO REAL ---
searchInput.addEventListener('input', function() {
    const textoBusqueda = searchInput.value.toLowerCase();
    const tarjetas = taskList.querySelectorAll('.task-card');

    tarjetas.forEach(function(card) {
        const texto = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = texto.includes(textoBusqueda) ? 'block' : 'none';
    });
});
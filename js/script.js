// Esperamos a que la página cargue completamente
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MENÚ DE NAVEGACIÓN =====
    const menuLinks = document.querySelectorAll('aside a');
    const tasks = document.querySelectorAll('.task-card');
    const totalCounter = document.getElementById('total');
    
    // Función para filtrar tareas
    function filterTasks(filterType) {
        let visibleCount = 0;
        
        tasks.forEach(task => {
            // Animación de salida
            task.style.transition = 'all 0.3s ease';
            task.style.transform = 'scale(0.8)';
            task.style.opacity = '0';
            
            setTimeout(() => {
                // Lógica de filtrado mejorada
                let shouldShow = false;
                
                if (filterType === 'all') {
                    shouldShow = true;
                } else if (filterType === 'high' && task.dataset.priority === 'high') {
                    shouldShow = true;
                } else if (filterType === 'completed' && task.dataset.priority === 'completed') {
                    shouldShow = true;
                } else if (filterType === 'low' && task.dataset.priority === 'low') {
                    shouldShow = true;
                } else if (filterType === 'medium' && task.dataset.priority === 'medium') {
                    shouldShow = true;
                }
                // Si es 'config', no mostramos nada (o podemos mostrar mensaje)
                
                if (shouldShow) {
                    task.style.display = 'block';
                    visibleCount++;
                    
                    // Animación de entrada
                    setTimeout(() => {
                        task.style.transform = 'scale(1)';
                        task.style.opacity = '1';
                    }, 50);
                } else {
                    task.style.display = 'none';
                }
            }, 300);
        });
        
        // Actualizar contador
        if (totalCounter) {
            totalCounter.textContent = visibleCount;
        }
    }
    
    // Eventos del menú - CORREGIDO
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Quitar active de todos
            menuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const text = this.textContent.toLowerCase();
            let filter = 'all';
            
            // ARREGLADO: Ahora cada uno tiene su lógica
            if (text.includes('alta')) {
                filter = 'high';
            } else if (text.includes('completadas')) {
                filter = 'completed';
            } else if (text.includes('baja')) {
                filter = 'low';
            } else if (text.includes('media')) {
                filter = 'medium';
            } else if (text.includes('configuración')) {
                // NUEVO: Mostramos mensaje de configuración
                alert('⚙️ Panel de configuración\n\nAquí irían las opciones de usuario');
                // No filtramos nada, dejamos todo como está o ocultamos todo
                tasks.forEach(task => {
                    task.style.display = 'none';
                });
                if (totalCounter) totalCounter.textContent = '0';
                return; // Salimos de la función
            }
            // Si es "Todas las tareas", filter sigue siendo 'all'
            
            filterTasks(filter);
        });
    });
    
    // ===== MODAL DE TAREAS =====
    const modal = document.getElementById('taskModal');
    
    // Si no existe el modal, creamos uno básico automáticamente
    if (!modal) {
        console.log('Modal no encontrado, creando uno...');
        createBasicModal();
    }
    
    const closeBtn = document.querySelector('.close-btn');
    const modalTitle = document.getElementById('modalTitle');
    const modalBadge = document.getElementById('modalBadge');
    const modalCategory = document.getElementById('modalCategory');
    const modalDescription = document.getElementById('modalDescription');
    
    // Datos de ejemplo para cada tarea
    const taskData = {
        'Diseñar mockups': {
            date: '10/03/2024',
            time: '4 horas',
            fullDesc: 'Crear wireframes detallados en Figma para todas las vistas de la aplicación. Incluir versión móvil y desktop.'
        },
        'Revisar código': {
            date: '12/03/2024',
            time: '2 horas',
            fullDesc: 'Revisar el pull request #42 del módulo de autenticación. Verificar seguridad y optimización de queries.'
        },
        'Actualizar documentación': {
            date: '15/03/2024',
            time: '1 hora',
            fullDesc: 'Actualizar la wiki del proyecto con los nuevos endpoints de la API y ejemplos de uso.'
        },
        'Setup del proyecto': {
            date: 'Completada',
            time: '3 horas',
            fullDesc: 'Configuración inicial completada: repositorio Git, CI/CD con GitHub Actions, y despliegue en Vercel.'
        }
    };
    
    // Función para crear modal si no existe
    function createBasicModal() {
        const modalHTML = `
            <div id="taskModal" class="modal">
                <div class="modal-content">
                    <span class="close-btn">&times;</span>
                    <h2 id="modalTitle">Título</h2>
                    <div class="modal-body">
                        <span id="modalBadge" class="badge">Prioridad</span>
                        <p id="modalCategory" class="category">Categoría</p>
                        <p id="modalDescription">Descripción...</p>
                        <div class="modal-meta">
                            <p>📅 Fecha límite: <span id="modalDate">--</span></p>
                            <p>⏱️ Tiempo estimado: <span id="modalTime">--</span></p>
                        </div>
                        <div class="modal-actions">
                            <button class="btn-complete">✓ Completar</button>
                            <button class="btn-close">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Añadir estilos básicos si no existen
        if (!document.getElementById('modal-styles')) {
            const styles = `
                <style id="modal-styles">
                    .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); justify-content: center; align-items: center; }
                    .modal.active { display: flex; }
                    .modal-content { background: white; padding: 20px; border-radius: 12px; max-width: 400px; width: 90%; position: relative; }
                    .close-btn { position: absolute; right: 15px; top: 10px; font-size: 24px; cursor: pointer; }
                    .modal-actions { margin-top: 20px; display: flex; gap: 10px; }
                    .btn-complete, .btn-close { padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; }
                    .btn-complete { background: #10b981; color: white; }
                    .btn-close { background: #6b7280; color: white; }
                </style>
            `;
            document.head.insertAdjacentHTML('beforeend', styles);
        }
    }
    
    // Función para abrir modal
    function openModal(taskCard) {
        const title = taskCard.querySelector('h3').textContent;
        const badge = taskCard.querySelector('.badge');
        const badgeText = badge.textContent;
        const badgeClass = badge.classList[1] || '';
        const category = taskCard.querySelector('.category').textContent;
        
        // Rellenar datos
        if (modalTitle) modalTitle.textContent = title;
        if (modalBadge) {
            modalBadge.textContent = badgeText;
            modalBadge.className = 'badge ' + badgeClass;
        }
        if (modalCategory) modalCategory.textContent = category;
        if (modalDescription) {
            modalDescription.textContent = taskData[title]?.fullDesc || 'Sin descripción detallada';
        }
        
        const dateEl = document.getElementById('modalDate');
        const timeEl = document.getElementById('modalTime');
        if (dateEl) dateEl.textContent = taskData[title]?.date || 'No definida';
        if (timeEl) timeEl.textContent = taskData[title]?.time || 'No estimado';
        
        // Mostrar modal
        const modalEl = document.getElementById('taskModal');
        if (modalEl) {
            modalEl.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Función para cerrar modal
    function closeModalFunc() {
        const modalEl = document.getElementById('taskModal');
        if (modalEl) {
            modalEl.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Eventos de las tarjetas - CON VERIFICACIÓN
    if (tasks.length > 0) {
        tasks.forEach(task => {
            task.style.cursor = 'pointer';
            task.addEventListener('click', function() {
                console.log('Clic en tarea:', this.querySelector('h3').textContent);
                openModal(this);
            });
        });
        console.log('Eventos asignados a', tasks.length, 'tareas');
    } else {
        console.error('No se encontraron tareas con clase .task-card');
    }
    
    // Eventos del modal (delegación de eventos para el modal dinámico)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('close-btn') || 
            e.target.classList.contains('btn-close')) {
            closeModalFunc();
        }
        if (e.target.classList.contains('btn-complete')) {
            alert('✅ ¡Tarea completada!');
            closeModalFunc();
        }
    });
    
    // Cerrar al clicar fuera
    document.addEventListener('click', function(e) {
        const modalEl = document.getElementById('taskModal');
        if (e.target === modalEl) {
            closeModalFunc();
        }
    });
    
    // Cerrar con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModalFunc();
        }
    });
    
    console.log('JavaScript cargado correctamente');
});
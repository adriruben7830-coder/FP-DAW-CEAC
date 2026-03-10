# 📝 TaskMaster

Aplicación de gestión de tareas desarrollada como proyecto de prácticas
del ciclo DAW en CEAC. Permite crear, completar, eliminar y filtrar tareas
con persistencia de datos en LocalStorage.

## 🚀 Demo en producción
[Enlace a Vercel] https://flujo-de-tareas-proyecto.vercel.app/

## ✨ Funcionalidades

- ➕ Añadir tareas con título y prioridad (alta, media, baja)
- ✅ Marcar tareas como completadas
- 🗑️ Eliminar tareas individuales
- ✏️ Editar el título con doble clic
- 🔍 Buscar tareas en tiempo real
- 🔃 Ordenar tareas por prioridad
- 📊 Estadísticas en tiempo real (total, completadas, pendientes)
- 🌙 Modo oscuro con preferencia guardada
- 💾 Persistencia de datos con LocalStorage
- 📱 Diseño responsive para móvil y escritorio

## 🛠️ Tecnologías usadas

- HTML5 semántico
- CSS3 con variables y Flexbox
- JavaScript vanilla
- Tailwind CSS
- LocalStorage API
- Git y GitHub
- Vercel (despliegue)
- Cursor IDE con IA
- MCP filesystem server

## 📁 Estructura del proyecto
```
TASKFLOW_PROJECT/
├── index.html
├── css/
│   ├── styles.css
│   └── output.css
├── js/
│   └── app.js
├── docs/
│   └── ai/
│       ├── ai-comparison.md
│       ├── cursor-workflow.md
│       ├── prompt-engineering.md
│       ├── experiments.md
│       └── reflection.md
└── README.md
```

## 🤖 IA utilizada en el desarrollo

Este proyecto ha sido desarrollado con ayuda de herramientas de IA:
- **Claude** para refactorización, JSDoc y resolución de problemas
- **ChatGPT** para comparativa de explicaciones técnicas
- **Cursor IDE** para edición inline y chat contextual
- **MCP filesystem** para análisis del proyecto desde la IA

## 📋 Cómo usar la aplicación

1. Escribe el título de la tarea en el campo de texto
2. Selecciona la prioridad (alta, media o baja)
3. Pulsa "Añadir Tarea"
4. Usa el menú lateral para filtrar por prioridad
5. Doble clic sobre una tarea para editarla
6. Pulsa "Marcar todas" para completar todas de golpe

# Experimentos con IA en programación

En este documento comparo resolver problemas con y sin IA,
midiendo tiempo, calidad del código y comprensión del problema.

## Experimento 1: Consultas al proyecto con MCP en Cursor

Para este experimento usé el servidor MCP filesystem conectado
a Cursor, que permite a la IA leer directamente los archivos
del proyecto sin necesidad de copiar y pegar código.

### Consulta 1: Listar archivos JavaScript
**Prompt:** "Lista todos los archivos JavaScript del proyecto"
**Respuesta:** Cursor encontró js/app.js, js/script.js y tailwind.config.js
**Conclusión:** Sin MCP habría tenido que buscarlos manualmente.

### Consulta 2: Contar funciones en app.js
**Prompt:** "Lee el archivo app.js y dime cuántas funciones tiene"
**Respuesta:** Detectó 5 funciones principales nombradas más
una función interna guardarEdicion() y varios callbacks anónimos.
**Conclusión:** Útil para hacer un inventario rápido del código.

### Consulta 3: Archivos en docs/ai
**Prompt:** "¿Qué archivos hay dentro de la carpeta docs/ai?"
**Respuesta:** Listó los 5 archivos markdown correctamente.
**Conclusión:** MCP tiene acceso completo a la estructura del proyecto.

### Consulta 4: Elementos del formulario en index.html
**Prompt:** "Lee el index.html y dime qué elementos del formulario tiene"
**Respuesta:** Describió con detalle todos los inputs, select,
botones y sus atributos exactos.
**Conclusión:** Muy útil para auditar el HTML sin abrirlo.

### Consulta 5: Qué hace styles.css
**Prompt:** "¿Qué hace el archivo styles.css?"
**Respuesta:** Explicó variables CSS, layout, estilos de tarjetas,
modo oscuro y responsive de forma muy completa.
**Conclusión:** MCP permite a la IA analizar archivos enteros
en segundos, algo imposible sin esta conexión.

## Conclusión general sobre MCP
MCP es útil en proyectos reales porque permite a la IA tener
contexto completo del proyecto sin necesidad de copiar código
manualmente. Es especialmente útil para auditorías, revisiones
de código y documentación automática.



## Experimento 2: Resolver problemas con y sin IA

### Problema 1: Contar tareas de alta prioridad

**Sin IA:**
Escribí el esqueleto de la función pero no supe completarla,
no recordaba cómo usar filter para contar elementos.
Tiempo invertido: 3 minutos sin resultado completo.

**Con IA:**
La IA generó la solución en segundos usando filter y .length
de forma encadenada, algo que no se me había ocurrido.
Tiempo invertido: 10 segundos.

**Conclusión:**
La IA es mucho más rápida para resolver problemas concretos.
Sin embargo, entender la solución que genera es igual de
importante que generarla, si no la entiendes no puedes
mantener el código después.



### Problema 2: Buscar tareas por palabra clave

**Sin IA:**
Escribí el esqueleto pero no recordaba cómo buscar texto
dentro de un string en JavaScript.
Tiempo invertido: 3 minutos sin resultado completo.

**Con IA:**
La IA usó includes() y toLowerCase() para hacer la búsqueda
insensible a mayúsculas, algo que no había pensado.
Tiempo invertido: 10 segundos.

**Conclusión:**
La IA no solo resuelve el problema sino que añade mejoras
que uno no siempre tiene en cuenta, como ignorar mayúsculas.




### Problema 3: Ordenar tareas por prioridad

**Sin IA:**
Escribí el esqueleto pero no sabía cómo comparar prioridades
con sort ya que son strings y no números.
Tiempo invertido: 3 minutos sin resultado completo.

**Con IA:**
La IA usó un objeto como tabla de conversión para asignar
números a las prioridades y luego los comparó con sort.
Una solución elegante que no habría encontrado solo.
Tiempo invertido: 10 segundos.

**Conclusión general del experimento:**
La IA acelera enormemente la resolución de problemas concretos.
El riesgo es acostumbrarse a no pensar por uno mismo. Lo ideal
es intentarlo primero solo, aunque sea parcialmente, y luego
usar la IA para completar o mejorar la solución. Así se aprende
más que copiando directamente.
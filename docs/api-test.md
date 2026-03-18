# 🧪 API Tests — TaskFlow

Documentación de pruebas de la API REST con Thunder Client.
Base URL: `http://localhost:3000/api/v1`

---

## ✅ GET /tasks — Obtener todas las tareas

**Descripción:** Devuelve un array con todas las tareas almacenadas.

**Request:**
- Método: GET
- URL: `http://localhost:3000/api/v1/tasks`
- Body: ninguno

**Respuesta esperada — 200 OK:**
```json
[]
```

---

## ✅ POST /tasks — Crear tarea correctamente

**Descripción:** Crea una tarea con un título válido (más de 3 caracteres).

**Request:**
- Método: POST
- URL: `http://localhost:3000/api/v1/tasks`
- Body:
```json
{
  "titulo": "Mi primera tarea"
}
```

**Respuesta esperada — 201 Created:**
```json
{
  "id": 1,
  "titulo": "Mi primera tarea",
  "completada": false
}
```

---

## ❌ POST /tasks — Error 400: título demasiado corto

**Descripción:** El servidor rechaza títulos con menos de 3 caracteres.

**Request:**
- Método: POST
- URL: `http://localhost:3000/api/v1/tasks`
- Body:
```json
{
  "titulo": "ab"
}
```

**Respuesta esperada — 400 Bad Request:**
```json
{
  "error": "El título es obligatorio y debe tener al menos 3 caracteres."
}
```

---

## ❌ POST /tasks — Error 400: título vacío

**Descripción:** El servidor rechaza peticiones sin título.

**Request:**
- Método: POST
- URL: `http://localhost:3000/api/v1/tasks`
- Body:
```json
{}
```

**Respuesta esperada — 400 Bad Request:**
```json
{
  "error": "El título es obligatorio y debe tener al menos 3 caracteres."
}
```

---

## ✅ DELETE /tasks/:id — Eliminar tarea existente

**Descripción:** Elimina una tarea que existe en el servidor.

**Request:**
- Método: DELETE
- URL: `http://localhost:3000/api/v1/tasks/1`
- Body: ninguno

**Respuesta esperada — 204 No Content:**
```
(sin cuerpo de respuesta)
```

---

## ❌ DELETE /tasks/:id — Error 404: tarea no encontrada

**Descripción:** El servidor devuelve 404 si el ID no existe.

**Request:**
- Método: DELETE
- URL: `http://localhost:3000/api/v1/tasks/999`
- Body: ninguno

**Respuesta esperada — 404 Not Found:**
```json
{
  "error": "Tarea no encontrada."
}
```
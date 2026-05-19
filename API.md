# Documentación de la API

## Formato de respuestas

Todas las respuestas siguen este formato estándar:

**Éxito:**
```json
{
  "success": true,
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Descripción del error"
}
```

---

## Autenticación

Los endpoints protegidos requieren el token JWT en el header:

Authorization: Bearer <token>

---

## Endpoints

### Autenticación

#### POST /auth/register
Registra un nuevo usuario.

**Autenticación:** No requerida

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@correo.com",
  "contrasena": "123456"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "id_usuario": 1,
    "nombre": "Juan Pérez",
    "correo": "juan@correo.com"
  }
}
```

---

#### POST /auth/login
Inicia sesión y retorna un token JWT.

**Autenticación:** No requerida

**Body:**
```json
{
  "correo": "juan@correo.com",
  "contrasena": "123456"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGci...",
    "nombre": "Juan Pérez",
    "correo": "juan@correo.com",
    "rol": "USER"
  }
}
```

---

### Retos

#### GET /retos
Lista todos los retos disponibles.

**Autenticación:** No requerida

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": [
    {
      "id_reto": 1,
      "titulo": "Reto SQL Injection",
      "nivel": "BASICO",
      "categoria": "Web Security",
      "creador": { "nombre": "Juan" }
    }
  ]
}
```

---

#### GET /retos/:id
Obtiene el detalle de un reto específico.

**Autenticación:** No requerida

**Parámetros:** `id` — ID del reto

---

#### POST /retos
Crea un nuevo reto.

**Autenticación:** Requerida

**Body:**
```json
{
  "titulo": "Reto XSS",
  "descripcion": "Encuentra la vulnerabilidad XSS",
  "nivel": "INTERMEDIO",
  "categoria": "Web Security"
}
```

---

#### PUT /retos/:id
Edita un reto existente.

**Autenticación:** Requerida (solo creador o ADMIN)

**Parámetros:** `id` — ID del reto

**Body:** Mismos campos que POST /retos

---

#### DELETE /retos/:id
Elimina un reto.

**Autenticación:** Requerida (solo creador o ADMIN)

**Parámetros:** `id` — ID del reto

---

### Soluciones

#### POST /soluciones
Envía una solución a un reto.

**Autenticación:** Requerida

**Body:**
```json
{
  "contenido_respuesta": "La vulnerabilidad está en...",
  "id_reto": 1
}
```

---

#### GET /soluciones/reto/:id
Lista todas las soluciones de un reto.

**Autenticación:** No requerida

**Parámetros:** `id` — ID del reto

---

#### GET /soluciones/usuario/:id
Lista todas las soluciones de un usuario.

**Autenticación:** No requerida

**Parámetros:** `id` — ID del usuario

---

### Comentarios

#### POST /comentarios
Agrega un comentario a una solución.

**Autenticación:** Requerida

**Body:**
```json
{
  "contenido": "Buen enfoque, pero podrías...",
  "id_solucion": 1
}
```

---

#### GET /comentarios/solucion/:id
Lista los comentarios de una solución.

**Autenticación:** No requerida

**Parámetros:** `id` — ID de la solución

---

### Evaluaciones

#### POST /evaluaciones
Evalúa una solución con una puntuación del 1 al 5.

**Autenticación:** Requerida

**Restricciones:**
- No puedes evaluar tu propia solución
- Solo puedes evaluar una vez cada solución

**Body:**
```json
{
  "puntuacion": 4,
  "comentario": "Muy buena solución",
  "id_solucion": 1
}
```

---

### Ranking

#### GET /ranking
Obtiene el ranking de usuarios ordenado por puntos.

**Autenticación:** No requerida

---

### Chat

#### POST /chat
Envía un mensaje al chatbot de ciberseguridad.

**Autenticación:** Requerida

**Body:**
```json
{
  "mensaje": "¿Qué es un ataque SQL Injection?"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "respuesta": "Un ataque SQL Injection es..."
  }
}
```

---

### Administración

#### GET /admin/usuarios
Lista todos los usuarios del sistema.

**Autenticación:** Requerida (solo ADMIN)

---

#### DELETE /admin/usuarios/:id
Elimina un usuario y todos sus datos.

**Autenticación:** Requerida (solo ADMIN)

**Parámetros:** `id` — ID del usuario

---

#### GET /admin/soluciones
Lista todas las soluciones del sistema.

**Autenticación:** Requerida (solo ADMIN)

---

#### PUT /admin/soluciones/:id/estado
Cambia el estado de una solución.

**Autenticación:** Requerida (solo ADMIN)

**Parámetros:** `id` — ID de la solución

**Body:**
```json
{
  "estado": "APROBADO"
}
```

**Estados válidos:** `PENDIENTE`, `APROBADO`, `RECHAZADO`


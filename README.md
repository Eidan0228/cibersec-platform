# Cibersec Platform

Plataforma web de retos en ciberseguridad y redes con validación comunitaria y chatbot de ayuda.

---

## Tecnologías utilizadas

- **Backend:** Node.js + Express.js
- **Frontend:** React
- **Base de datos:** PostgreSQL
- **ORM:** Prisma
- **Autenticación:** JWT
- **IA:** Groq API (LLaMA 3.3 70B)

---

## Arquitectura del proyecto

cibersec-platform/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── retos.controller.js
│   │   │   ├── soluciones.controller.js
│   │   │   ├── comentarios.controller.js
│   │   │   ├── evaluaciones.controller.js
│   │   │   ├── ranking.controller.js
│   │   │   └── chat.controller.js
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── retos.routes.js
│   │   │   ├── soluciones.routes.js
│   │   │   ├── comentarios.routes.js
│   │   │   ├── evaluaciones.routes.js
│   │   │   ├── ranking.routes.js
│   │   │   └── chat.routes.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
└── frontend/
├── src/
│   ├── components/
│   │   └── Navbar.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Retos.js
│   │   ├── RetoDetalle.js
│   │   ├── CrearReto.js
│   │   ├── Ranking.js
│   │   └── Chat.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   └── index.js
└── package.json

---

## Modelo de base de datos

| Tabla | Descripción |
|---|---|
| Usuario | Usuarios registrados con rol y puntos |
| Reto | Retos creados por usuarios |
| Solucion | Soluciones enviadas a retos |
| Comentario | Comentarios en soluciones |
| Evaluacion | Puntuaciones a soluciones |
| ArchivoAdjunto | Archivos adjuntos a retos |

### Relaciones principales
- Un usuario puede crear múltiples retos
- Un reto puede recibir múltiples soluciones
- Una solución puede recibir múltiples comentarios y evaluaciones
- Un usuario no puede evaluar su propia solución
- Un usuario solo puede evaluar una vez cada solución

---

## Endpoints de la API

### Autenticación
| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | /auth/register | Registrar usuario | No |
| POST | /auth/login | Iniciar sesión | No |

### Retos
| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | /retos | Listar todos los retos | No |
| GET | /retos/:id | Ver detalle de un reto | No |
| POST | /retos | Crear reto | Sí |
| PUT | /retos/:id | Editar reto | Sí |
| DELETE | /retos/:id | Eliminar reto | Sí |

### Soluciones
| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | /soluciones | Enviar solución | Sí |
| GET | /soluciones/reto/:id | Soluciones por reto | No |
| GET | /soluciones/usuario/:id | Soluciones por usuario | No |

### Comentarios
| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | /comentarios | Agregar comentario | Sí |
| GET | /comentarios/solucion/:id | Comentarios por solución | No |

### Evaluaciones
| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | /evaluaciones | Evaluar solución | Sí |

### Ranking y Chat
| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | /ranking | Ranking de usuarios | No |
| POST | /chat | Chatbot de ayuda | Sí |

---

## Instalación y ejecución

### Requisitos previos
- Node.js v18+
- PostgreSQL
- Git

### Backend

```bash
cd backend
npm install
```

Crea el archivo `.env` con:

PORT=3000
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/cibersec_db"
JWT_SECRET=cibersec_jwt_secret_2024
GROQ_API_KEY=tu_api_key_de_groq

Ejecuta las migraciones:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Inicia el servidor:

```bash
node src/server.js
```

### Frontend

```bash
cd frontend
npm install
npm start
```

La app abre en `http://localhost:3001`

---

## Funcionalidades implementadas

- Registro e inicio de sesión con JWT
- CRUD completo de retos con niveles y categorías
- Envío y visualización de soluciones
- Sistema de comentarios en soluciones
- Evaluaciones con puntuación del 1 al 5
- Ranking de usuarios por puntos
- Chatbot especializado en ciberseguridad con IA
- Rutas protegidas por autenticación
- Validaciones en todos los endpoints
- Arquitectura MVC

---

## Uso de Inteligencia Artificial

Se utilizó **Claude (Anthropic)** como asistente principal durante el desarrollo del proyecto.

### Partes donde se utilizó
- Generación de la estructura base del backend (MVC)
- Implementación de controladores, rutas y middlewares
- Configuración de Prisma y migraciones
- Implementación del middleware JWT
- Creación de componentes React del frontend
- Resolución de errores durante el desarrollo

### Tipo de ayuda recibida
Claude guió el desarrollo paso a paso siguiendo el manual del proyecto, respetando el stack tecnológico y las reglas definidas previamente. No se improvisaron tecnologías ni estructuras.

### Comprensión del código
El estudiante comprende la arquitectura MVC implementada, el flujo de autenticación JWT, las relaciones del modelo de base de datos en Prisma, y el funcionamiento de cada endpoint de la API REST.

---

## Funcionalidades pendientes

| Funcionalidad | Prioridad |
|---|---|
| Subida de archivos adjuntos a retos | Alta |
| Edición de soluciones por el autor | Media |
| Mejoras de UI/UX con diseño profesional | Alta |
| Despliegue en producción (Railway + Vercel) | Media |
| Historial completo de retos resueltos por usuario | Baja |
| Panel de administración para ADMIN | Baja |

---

## Cronograma de finalización

| Semana | Actividad |
|---|---|
| Semana 1 | Mejoras de UI/UX y diseño visual |
| Semana 2 | Subida de archivos adjuntos |
| Semana 3 | Edición de soluciones y panel de usuario |
| Semana 4 | Pruebas completas y corrección de errores |
| Semana 5 | Despliegue en producción |
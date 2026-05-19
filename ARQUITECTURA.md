# Arquitectura del Sistema

## Tipo de arquitectura

El sistema utiliza una arquitectura **cliente-servidor** con patrón **MVC (Modelo-Vista-Controlador)** en el backend.

---

## Componentes principales

### Frontend (Cliente)
- Desarrollado en **React**
- Se ejecuta en el navegador del usuario
- Consume la API REST del backend mediante **axios**
- Maneja autenticación con tokens JWT almacenados en localStorage
- Rutas protegidas que redirigen al login si no hay sesión activa

### Backend (Servidor)
- Desarrollado en **Node.js + Express.js**
- Expone una API REST con endpoints organizados por módulo
- Arquitectura MVC:
  - **Rutas:** definen los endpoints disponibles
  - **Controladores:** contienen la lógica de cada operación
  - **Middlewares:** verifican autenticación y permisos
- Genera y valida tokens **JWT** para autenticación

### Base de datos
- Motor: **PostgreSQL**
- ORM: **Prisma**
- Gestiona la persistencia de usuarios, retos, soluciones, comentarios y evaluaciones

---

## Comunicación entre componentes

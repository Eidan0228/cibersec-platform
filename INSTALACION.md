# Guía de Instalación y Ejecución

## Requisitos previos

- Node.js v18 o superior
- PostgreSQL instalado y corriendo
- Git

---

## Pasos para ejecutar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/Eidan0228/cibersec-platform.git
cd cibersec-platform
```

### 2. Configurar el Backend

Entrar a la carpeta backend e instalar dependencias:

```bash
cd backend
npm install

Crear el archivo `.env` en la carpeta `backend/` con el siguiente contenido:

PORT=3000
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/cibersec_db"
JWT_SECRET=cibersec_jwt_secret_2024
GROQ_API_KEY=tu_api_key_de_groq

> **Nota:** Reemplaza `TU_CONTRASEÑA` con tu contraseña de PostgreSQL y `tu_api_key_de_groq` con tu API key de Groq.

### 3. Configurar la base de datos

Crear la base de datos en PostgreSQL:

```sql
CREATE DATABASE cibersec_db;
```

Ejecutar las migraciones de Prisma:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Iniciar el Backend

```bash
node src/server.js
```

El servidor quedará corriendo en `http://localhost:3000`

---

### 5. Configurar el Frontend

Abrir una nueva terminal y entrar a la carpeta frontend:

```bash
cd frontend
npm install
```

### 6. Iniciar el Frontend

```bash
npm start
```

La aplicación abrirá en `http://localhost:3001`

---

## Crear usuario ADMIN

Para asignar rol de administrador a un usuario, ejecutar este query en PostgreSQL:

```sql
UPDATE "Usuario" SET rol = 'ADMIN' WHERE correo = 'tu@correo.com';
```

---

## Verificar que todo funciona

- Backend: `http://localhost:3000` debe mostrar `{"success":true,"data":"Servidor funcionando correctamente"}`
- Frontend: `http://localhost:3001` debe mostrar la página de retos

---

## Variables de entorno

| Variable | Descripción |
|---|---|
| PORT | Puerto del servidor (default: 3000) |
| DATABASE_URL | URL de conexión a PostgreSQL |
| JWT_SECRET | Clave secreta para firmar tokens JWT |
| GROQ_API_KEY | API key de Groq para el chatbot |
```

Crear el archivo `.env` en la carpeta `backend/` con el siguiente contenido:

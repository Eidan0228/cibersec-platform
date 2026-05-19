# Diseño de Base de Datos

## Motor y ORM
- **Motor:** PostgreSQL
- **ORM:** Prisma

---

## Tablas principales

### Usuario
Almacena los usuarios registrados en la plataforma.

| Campo | Tipo | Descripción |
|---|---|---|
| id_usuario | Int | Clave primaria autoincremental |
| nombre | String | Nombre del usuario |
| correo | String | Correo único del usuario |
| contrasena_hash | String | Contraseña encriptada con bcrypt |
| fecha_registro | DateTime | Fecha de registro automática |
| rol | Enum | USER o ADMIN |
| puntos_totales | Int | Puntos acumulados por actividad |

### Reto
Almacena los retos creados por los usuarios.

| Campo | Tipo | Descripción |
|---|---|---|
| id_reto | Int | Clave primaria autoincremental |
| titulo | String | Título del reto |
| descripcion | String | Descripción detallada |
| nivel | Enum | BASICO, INTERMEDIO o AVANZADO |
| categoria | String | Categoría del reto |
| fecha_creacion | DateTime | Fecha de creación automática |
| id_creador | Int | Clave foránea hacia Usuario |

### Solucion
Almacena las soluciones enviadas por los usuarios a los retos.

| Campo | Tipo | Descripción |
|---|---|---|
| id_solucion | Int | Clave primaria autoincremental |
| contenido_respuesta | String | Texto de la solución |
| fecha_envio | DateTime | Fecha de envío automática |
| estado | Enum | PENDIENTE, APROBADO o RECHAZADO |
| puntaje_obtenido | Int | Promedio de evaluaciones recibidas |
| id_usuario | Int | Clave foránea hacia Usuario |
| id_reto | Int | Clave foránea hacia Reto |

### Comentario
Almacena los comentarios hechos sobre soluciones.

| Campo | Tipo | Descripción |
|---|---|---|
| id_comentario | Int | Clave primaria autoincremental |
| contenido | String | Texto del comentario |
| fecha | DateTime | Fecha de creación automática |
| id_usuario | Int | Clave foránea hacia Usuario |
| id_solucion | Int | Clave foránea hacia Solucion |

### Evaluacion
Almacena las puntuaciones dadas a soluciones.

| Campo | Tipo | Descripción |
|---|---|---|
| id_evaluacion | Int | Clave primaria autoincremental |
| puntuacion | Int | Valor entre 1 y 5 |
| comentario | String | Comentario opcional |
| fecha | DateTime | Fecha automática |
| id_solucion | Int | Clave foránea hacia Solucion |
| id_usuario | Int | Clave foránea hacia Usuario |

### ArchivoAdjunto
Almacena archivos adjuntos a los retos.

| Campo | Tipo | Descripción |
|---|---|---|
| id_archivo | Int | Clave primaria autoincremental |
| nombre_archivo | String | Nombre del archivo |
| ruta | String | Ruta de almacenamiento |
| tipo | String | Tipo de archivo |
| id_reto | Int | Clave foránea hacia Reto |

---

## Relaciones entre tablas

Usuario ──< Reto (un usuario crea muchos retos)
Usuario ──< Solucion (un usuario envía muchas soluciones)
Usuario ──< Comentario (un usuario hace muchos comentarios)
Usuario ──< Evaluacion (un usuario hace muchas evaluaciones)
Reto ──< Solucion (un reto recibe muchas soluciones)
Reto ──< ArchivoAdjunto (un reto tiene muchos archivos)
Solucion ──< Comentario (una solución recibe muchos comentarios)
Solucion ──< Evaluacion (una solución recibe muchas evaluaciones)

### Restricciones importantes
- Un usuario **no puede evaluar su propia solución**
- Un usuario **solo puede evaluar una vez** cada solución (restricción única en id_usuario + id_solucion)
- Solo el **creador de un reto o un ADMIN** puede editarlo o eliminarlo

---

## Justificación del diseño

- Se separaron las evaluaciones de los comentarios para permitir puntuación independiente del feedback textual
- El campo `puntos_totales` en Usuario se actualiza automáticamente al recibir evaluaciones, evitando cálculos costosos en cada consulta de ranking
- El campo `puntaje_obtenido` en Solucion almacena el promedio de evaluaciones para consulta rápida
- El uso de enums para `rol`, `nivel` y `estado` garantiza integridad de datos

---

## Schema de Prisma

```prisma
model Usuario {
  id_usuario      Int      @id @default(autoincrement())
  nombre          String
  correo          String   @unique
  contrasena_hash String
  fecha_registro  DateTime @default(now())
  rol             Rol      @default(USER)
  puntos_totales  Int      @default(0)
}

model Reto {
  id_reto        Int      @id @default(autoincrement())
  titulo         String
  descripcion    String
  nivel          Nivel
  categoria      String
  fecha_creacion DateTime @default(now())
  id_creador     Int
}

enum Rol { USER ADMIN }
enum Nivel { BASICO INTERMEDIO AVANZADO }
enum EstadoSolucion { PENDIENTE APROBADO RECHAZADO }
```


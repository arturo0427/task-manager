# Backend API de Tareas

API REST desarrollada con NestJS para autenticacion de usuarios y gestion de tareas.

## Tecnologias

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT
- bcrypt
- class-validator

## Funcionalidades

- Registro de usuarios
- Inicio de sesion con JWT
- Consulta del usuario autenticado
- CRUD de tareas protegidas con token
- Soft delete en tareas
- Validacion de datos
- Manejo centralizado de errores
- Separacion por modulos, controladores, servicios, DTOs y entidades

## Estructura del proyecto

```text
src/
  auth/
    dto/
    guards/
    interfaces/
    strategies/
  common/
    decorators/
    filters/
    types/
  config/
  tasks/
    dto/
    entities/
  users/
    entities/
```

## Requisitos previos

- Node.js instalado
- PostgreSQL corriendo en tu maquina
- Una base de datos creada, por ejemplo: `encuba_tasks`

## Variables de entorno

Crea un archivo `.env` en la raiz del proyecto. Puedes usar este ejemplo:

```env
PORT=3000
JWT_SECRET=change-this-jwt-secret

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=root
DB_NAME=encuba_tasks
DB_SYNCHRONIZE=true
```

Notas:

- `DB_HOST=localhost` si PostgreSQL esta en tu maquina.
- `DB_PORT=5432` es el puerto por defecto de PostgreSQL.
- `DB_USERNAME` y `DB_PASSWORD` deben coincidir con tu usuario real de PostgreSQL.
- `DB_NAME` debe ser el nombre exacto de la base que creaste en pgAdmin.
- `DB_SYNCHRONIZE=true` crea o actualiza tablas automaticamente en desarrollo.

## Instalacion

```bash
npm install
```

## Ejecucion

Modo desarrollo:

```bash
npm run start:dev
```

Compilar proyecto:

```bash
npm run build
```

## Conexion a la base de datos

La conexion se hace automaticamente al iniciar la aplicacion usando TypeORM.

Si ya creaste la base `encuba_tasks`, solo necesitas:

1. Tener PostgreSQL encendido.
2. Confirmar que el usuario y la contrasena del `.env` son correctos.
3. Ejecutar `npm run start:dev`.

Si todo esta bien, Nest creara las tablas necesarias automaticamente porque `DB_SYNCHRONIZE=true`.

## Endpoints

### Estado

- `GET /`

Respuesta esperada:

```json
{
  "name": "Encuba Tasks API",
  "status": "ok"
}
```

### Auth

- `POST /auth/register`
- `POST /auth/login`

#### Body para register

```json
{
  "name": "Arturo",
  "email": "arturo@arturo.com",
  "password": "123456789"
}
```

#### Body para login

```json
{
  "email": "arturo@arturo.com",
  "password": "123456789"
}
```

### Usuario autenticado

- `GET /users/me`

Requiere header:

```text
Authorization: Bearer TU_TOKEN
```

### Tareas

- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

Todas estas rutas requieren:

```text
Authorization: Bearer TU_TOKEN
```

#### Body para crear tarea

```json
{
  "title": "Preparar informe semanal",
  "completed": false
}
```

#### Body para actualizar tarea

```json
{
  "title": "Preparar informe final",
  "completed": true
}
```

## Flujo de prueba en Postman

1. Ejecuta `GET http://localhost:3000/` para confirmar que la API esta arriba.
2. Ejecuta `POST http://localhost:3000/auth/register`.
3. Ejecuta `POST http://localhost:3000/auth/login`.
4. Copia el `accessToken` que devuelve login.
5. Usa ese token en `Authorization -> Bearer Token`.
6. Prueba `GET /users/me`.
7. Prueba `POST /tasks`.
8. Prueba `GET /tasks`.
9. Prueba `PUT /tasks/:id`.
10. Prueba `DELETE /tasks/:id`.

## Respuestas y errores

La API devuelve errores con un formato consistente:

```json
{
  "statusCode": 400,
  "timestamp": "2026-04-07T00:00:00.000Z",
  "path": "/ruta",
  "message": "Descripcion del error",
  "error": "Bad Request"
}
```

Ejemplos comunes:

- Credenciales invalidas
- Usuario no encontrado
- Tarea no encontrada
- Datos mal enviados
- Acceso sin token

## Seguridad

- Las contrasenas se almacenan cifradas con `bcrypt`.
- La autenticacion usa JWT.
- Las rutas sensibles estan protegidas con `JwtAuthGuard`.
- El borrado de tareas es logico mediante soft delete.

## Scripts utiles

```bash
npm run start:dev
npm run build
npm test
npm run test:e2e
```

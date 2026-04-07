# Encuba Frontend

Aplicacion frontend construida con React y Vite para autenticacion con JWT y gestion de tareas. Esta interfaz consume el backend existente mediante `axios`, guarda el token en `localStorage` y envia `Authorization: Bearer <token>` en las rutas protegidas.

## Tecnologias

- React 19
- Vite
- Axios
- ESLint

## Funcionalidades

- Login de usuario
- Registro de usuario
- Persistencia del token JWT
- Consulta del usuario autenticado
- Listado de tareas
- Creacion de tareas
- Edicion de titulo de tareas
- Cambio de estado completada/pendiente
- Eliminacion de tareas

## Endpoints que consume

### Autenticacion

- `POST /auth/register`
- `POST /auth/login`

### Usuario autenticado

- `GET /users/me`

### Tareas protegidas con JWT

- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

## Flujo de autenticacion

1. El usuario inicia sesion o se registra.
2. El backend responde con `accessToken` y `user`.
3. El token se guarda en `localStorage`.
4. Cada request protegida agrega automaticamente el header:

```http
Authorization: Bearer <token>
```

5. Al recargar la pagina, el frontend intenta recuperar la sesion con `GET /users/me`.

## Configuracion del proyecto

### Instalacion

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

Por defecto, Vite usa proxy hacia el backend en `http://localhost:3000` para estas rutas:

- `/auth`
- `/users`
- `/tasks`

La configuracion esta en [vite.config.js](./vite.config.js).

### Build de produccion

```bash
npm run build
```

### Vista previa del build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Variables de entorno

Existe el archivo `.env.example` con esta variable:

```env
VITE_API_URL=
```

Uso recomendado:

- En desarrollo local puedes dejarla vacia y usar el proxy de Vite.
- En otro entorno puedes definir `VITE_API_URL` con la URL base del backend.

Ejemplo:

```env
VITE_API_URL=http://localhost:3000
```

## Estructura del proyecto

```text
src/
  context/                 Estado global de autenticacion
  hooks/                   Hooks compartidos
  screens/                 Pantallas principales
  features/
    auth/components/       Formularios de login y registro
    tasks/components/      Componentes visuales de tareas
    tasks/hooks/           Logica de negocio de tareas
  services/api/            Cliente axios y servicios HTTP
  utils/                   Helpers de token y manejo de errores
  styles/                  Estilos globales
```

## Archivos importantes

- `src/context/AuthContext.jsx`: sesion, login, registro y logout.
- `src/services/api/client.js`: cliente `axios` base e inyeccion del Bearer token.
- `src/features/tasks/hooks/useTasks.js`: CRUD de tareas y manejo de estado.
- `src/screens/AuthScreen.jsx`: pantalla de acceso.
- `src/screens/DashboardScreen.jsx`: panel principal con tareas.

## Requisitos para ejecutar

1. Tener el backend levantado en `http://localhost:3000` o configurar `VITE_API_URL`.
2. Tener Node.js instalado.
3. Ejecutar este frontend con `npm install` y `npm run dev`.

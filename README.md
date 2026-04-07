# Task Manager Fullstack

## Descripción

Este proyecto corresponde a una prueba técnica que consiste en el desarrollo de una aplicación fullstack para la gestión de tareas, incluyendo autenticación de usuarios y operaciones CRUD protegidas mediante JWT.

La solución está dividida en dos partes principales:

* **Backend:** API REST desarrollada con NestJS
* **Frontend:** Interfaz de usuario desarrollada con React

---

## Tecnologías utilizadas

### Backend

* NestJS
* TypeORM
* PostgreSQL
* JWT (Autenticación)
* Bcrypt (Encriptación de contraseñas)

### Frontend

* React
* Axios
* Vite

### Testing

* Jest (Backend)
* React Testing Library (Frontend)

---

## Estructura del proyecto

```bash
task-manager-fullstack/
  backend/   # API REST (NestJS)
  frontend/  # Aplicación cliente (React)
```

Cada carpeta contiene su propio README con instrucciones detalladas.

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/task-manager-fullstack.git
cd task-manager-fullstack
```

---

### 2. Backend

```bash
cd backend
npm install
npm run start:dev
```

---

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Endpoints principales

### Auth

* `POST /auth/register`
* `POST /auth/login`

### Usuario

* `GET /users/me`

### Tareas (protegidas)

* `GET /tasks`
* `POST /tasks`
* `PUT /tasks/:id`
* `DELETE /tasks/:id`

---

## Autor

📧 [arturo_munoz27@outlook.com](mailto:arturo_munoz27@outlook.com)  
🔗 [LinkedIn](https://www.linkedin.com/in/arturom0427/)  
💻 [Portafolio](https://arturo0427.github.io/portafolio-responsive/)

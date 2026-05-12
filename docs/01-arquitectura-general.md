# Arquitectura General de JYF Lab

Este documento describe la arquitectura de alto nivel del sistema JYF Lab.

## Stack Tecnológico

El proyecto utiliza un stack moderno de JavaScript/TypeScript, dividido en dos partes principales que conviven en el mismo repositorio (Monorepo lógico):

- **Frontend**: React 19 + Vite (Rápido empaquetado y HMR)
- **Backend**: Express.js (Node.js) para la API REST
- **Base de Datos**: PostgreSQL
- **Estilos**: Vanilla CSS con variables y flexbox/grid moderno

## Estructura de Carpetas

```text
jyf-lab/
├── .env                # (Solo backend - dentro de server/.env) Variables de entorno
├── schema.sql          # Estructura de la base de datos PostgreSQL
├── package.json        # Dependencias de frontend y scripts de Vite
├── vite.config.js      # Configuración de Vite (incluye Proxy al backend)
│
├── server/             # 🛠️ BACKEND (Express)
│   ├── index.js        # Entry point del servidor
│   ├── package.json    # Dependencias del backend (express, pg, bcrypt...)
│   ├── db/
│   │   └── pool.js     # Conexión a PostgreSQL
│   ├── middleware/
│   │   └── verifyToken.js # Middleware JWT para proteger rutas
│   └── routes/
│       └── auth.js     # Rutas de login/logout/me
│
└── src/                # 🎨 FRONTEND (React)
    ├── main.jsx        # Punto de montaje de React
    ├── App.jsx         # Router y Layout principal
    ├── index.css       # Estilos globales
    ├── components/
    │   └── ProtectedRoute.jsx # Guard de seguridad para rutas
    ├── context/
    │   └── AuthContext.jsx # Estado global de sesión de usuario
    └── pages/
        ├── Login.jsx   # Pantalla de acceso
        └── Dashboard.jsx # Panel principal (protegido)
```

## Flujo de Datos

1. El usuario interactúa con la interfaz en React (`http://localhost:5173`).
2. Cuando el frontend necesita datos o autenticación, hace una petición HTTP mediante Axios a `/api/...`.
3. Vite intercepta esa llamada (gracias al proxy en `vite.config.js`) y la reenvía transparente al backend en `http://localhost:3001`.
4. Express procesa la solicitud, consulta PostgreSQL si es necesario usando `pg` (node-postgres), y devuelve JSON.
5. El frontend recibe el JSON, actualiza sus estados (usando Context o estados locales) y re-renderiza la interfaz.

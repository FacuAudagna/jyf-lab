# Módulo de Autenticación

La seguridad de la aplicación está gestionada mediante **JSON Web Tokens (JWT)** almacenados de forma segura en **httpOnly cookies**.

## ¿Por qué httpOnly cookies?
Guardar el token en `localStorage` permite que cualquier script malicioso (ataque XSS) pueda leerlo y robar la sesión. Al usar cookies `httpOnly`, el navegador se encarga de enviarlo en cada petición de forma automática, pero bloquea el acceso desde el código JavaScript, aumentando drásticamente la seguridad.

## Flujo de Login (Paso a paso)

1. **Frontend (`Login.jsx`)**: El usuario ingresa `email` y `password`.
2. **Contexto (`AuthContext.jsx`)**: La función `login` envía un POST a `/api/auth/login`.
3. **Backend (`server/routes/auth.js`)**:
   - Busca al usuario en la BD por su email.
   - Si existe, compara la contraseña plana enviada con el hash de la BD usando `bcrypt.compare`.
   - Si es correcta, genera un token JWT firmado con `JWT_SECRET`.
   - Se envía la respuesta al frontend y se inyecta una cookie `httpOnly` llamada `token` en los headers de respuesta HTTP.
4. **Respuesta Frontend**: El `AuthContext` recibe los datos del usuario (sin el password), actualiza su estado `user`, y re-renderiza la app.
5. **Redirección**: Al detectar el usuario, React Router navega al `/dashboard`.

## Persistencia de Sesión (`/me`)
Cuando el usuario recarga la página (F5):
1. El estado de React se limpia.
2. El `useEffect` dentro de `AuthContext.jsx` se dispara.
3. Se hace una petición GET a `/api/auth/me`. Como axios está configurado con `withCredentials: true`, la cookie viaja automáticamente.
4. El backend verifica la cookie usando el middleware `verifyToken.js`.
5. Si es válida, devuelve los datos del usuario y se restaura la sesión visualmente.

## Cerrar Sesión (Logout)
Se envía un POST a `/api/auth/logout`. El backend simplemente responde con un comando al navegador para que elimine la cookie `token` (`res.clearCookie('token')`). En el frontend se setea el usuario a `null`.

## Protección de Rutas (Frontend)
El componente `ProtectedRoute.jsx` envuelve las rutas privadas. Si un usuario no está logueado y trata de acceder a `/dashboard`, este componente lo redirige de inmediato a `/login`. También permite protección por roles si pasamos el prop `allowedRoles={['admin']}`.

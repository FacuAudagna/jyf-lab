# Flujo de Autenticación Completo

Este documento explica cómo funciona el sistema de autenticación de JYF Lab, que cubre desde la creación de la cuenta hasta la validación y recuperación de contraseña.

## Tecnologías y Herramientas Utilizadas
- **PostgreSQL**: Para almacenar credenciales de forma segura.
- **Bcryptjs**: Para hashear contraseñas antes de guardarlas (nunca se guardan en texto plano).
- **JSON Web Tokens (JWT)**: Para mantener la sesión activa.
- **Nodemailer**: Para el envío de correos (Verificación de cuentas y Recuperación de contraseña). Configurado con SMTP real (Gmail) mediante contraseñas de aplicación.

## 1. Registro de Usuario
1. El usuario completa el formulario en `/login` (Vista Register).
2. El frontend envía un `POST` a `/api/auth/register`.
3. El backend verifica que el email/usuario no existan.
4. Se hashea la contraseña.
5. Se genera un `verification_token` seguro usando la librería nativa `crypto` de Node.
6. Se inserta en la base de datos con `is_verified: false`.
7. **Nodemailer** envía un correo a la cuenta con el link de validación: `/verify-email?token=...`.
8. El frontend muestra la vista `email-sent` informando al usuario que debe revisar su bandeja.

## 2. Verificación de Correo Electrónico
1. El usuario hace clic en el enlace del correo y llega a la ruta `/verify-email` en React.
2. React extrae el `token` de la URL e invita al usuario a hacer clic en un botón de validación manual. *(Esta validación manual previene falsos errores causados por el escaneo en segundo plano de los clientes de correo o el StrictMode de React).*
3. Al confirmar, se hace una petición `GET /api/auth/verify/:token`.
4. El backend busca el token. Si coincide y el usuario no estaba verificado, actualiza `is_verified = true` y borra el token.

## 3. Inicio de Sesión
1. El usuario ingresa a `/login` y envía sus credenciales.
2. El backend verifica si la cuenta existe y si `is_verified` es verdadero. (Si no es verdadero, bloquea el inicio).
3. Compara el hash de la contraseña usando `bcrypt.compare`.
4. Si todo es correcto, genera un JWT válido por 8 horas.
5. **Seguridad**: El JWT se envía en una **cookie HTTP-Only**. Esto significa que JavaScript del lado del cliente no puede leer la cookie (previniendo ataques XSS). Se configura con `sameSite: 'strict'`.
6. El frontend actualiza el estado global usando `AuthContext`.

## 4. Recuperación de Contraseña
1. En la pantalla de login, el usuario hace clic en "¿Olvidaste tu contraseña?".
2. Ingresa su email. El frontend muestra la vista `forgot-sent`.
3. El backend (`POST /api/auth/forgot-password`) genera un `reset_token` y un tiempo de expiración de 1 hora (`reset_token_expires`).
4. Nodemailer envía el correo con el enlace `/reset-password?token=...`.
5. El usuario hace clic y abre la vista `ResetPassword.jsx`.
6. Al ingresar la nueva contraseña, se hace un `POST /api/auth/reset-password` con el token y la nueva clave.
7. El backend verifica la expiración, actualiza el hash de la clave, y limpia los campos de reset en la tabla de PostgreSQL.

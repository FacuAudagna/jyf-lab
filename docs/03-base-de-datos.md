# Módulo de Base de Datos

La aplicación utiliza PostgreSQL como motor de base de datos relacional. La interacción con la base de datos se realiza en crudo mediante sentencias SQL (sin ORMs como Prisma o Sequelize), usando la librería `pg` (node-postgres).

## El esquema (`schema.sql`)

El archivo raíz `schema.sql` es la única fuente de la verdad para la estructura de la base de datos.
Actualmente cuenta con las siguientes tablas:

1. **`users`**: Administra los usuarios del sistema (operadores, administradores). Gestiona credenciales, roles y acceso.
2. **`customers`**: Base de clientes del laboratorio. Soporta campos flexibles vía `preferences JSONB`.
3. **`supplies`**: Control de stock e insumos.
4. **`orders`**: Registro de pedidos asociados a clientes.
5. **`designs`**: Referencias a archivos/diseños que pertenecen a un pedido.

## Conexión (Pool)

Ubicado en `server/db/pool.js`, se configura un Pool de conexiones.
Se usa un **Pool** en lugar de un cliente (Client) único porque Express atiende peticiones de forma asíncrona y concurrente. El Pool mantiene múltiples conexiones abiertas y las reutiliza, optimizando drásticamente los recursos y la velocidad de respuesta.

Requiere las siguientes variables de entorno en el archivo `server/.env`:
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`

## Creación de Usuarios

Debido a que las contraseñas se almacenan en formato hash (nunca en texto plano), no se puede insertar un usuario directamente desde pgAdmin o la consola SQL sin antes hashear la clave.

Para facilitar esto, existe el script `server/create-test-user.js`.
Al ejecutar `node create-test-user.js`, el script importa `bcryptjs`, encripta la palabra "admin", y genera una entrada en la tabla de usuarios lista para usar.

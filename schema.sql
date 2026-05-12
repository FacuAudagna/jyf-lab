-- Extension para UUIDs si prefieres IDs no correlativos (opcional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 0. Tabla de Usuarios (Autenticación y Roles)
CREATE TABLE users (
    id_user SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) DEFAULT 'operador', -- Ej: 'admin', 'operador'
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1. Tabla de Clientes
CREATE TABLE customers (
    id_customer SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    birth_date DATE,
    preferences JSONB DEFAULT '{}', -- Flexibilidad NoSQL dentro de SQL
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Insumos (Stock)
CREATE TABLE supplies (
    id_supply SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    unit_of_measurement VARCHAR(20), -- ej: 'unidades', 'ml', 'mts'
    current_stock DECIMAL(10,2) DEFAULT 0,
    minimum_stock DECIMAL(10,2) DEFAULT 0,
    unit_cost DECIMAL(10,2) DEFAULT 0
);

-- 3. Tabla de Pedidos
CREATE TABLE orders (
    id_order SERIAL PRIMARY KEY,
    id_customer INT REFERENCES customers(id_customer),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) DEFAULT 'pendiente',
    total_budgeted DECIMAL(15,2) DEFAULT 0,
    observaciones TEXT
);

-- 4. Tabla de Diseños (Assets)
CREATE TABLE designs (
    id_design SERIAL PRIMARY KEY,
    id_order INT REFERENCES orders(id_order),
    file_name VARCHAR(255),
    storage_url TEXT, -- Ruta al archivo real
    version INT DEFAULT 1,
    is_mockup BOOLEAN DEFAULT FALSE,
    metadata JSONB -- Para guardar DPI, perfiles de color, etc.
);

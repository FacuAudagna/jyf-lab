# Frontend y Enrutamiento (Routing)

El frontend de React no tiene páginas físicas como en PHP o HTML plano; es una **Single Page Application (SPA)**. Para simular la navegación entre pantallas, se utiliza la librería `react-router-dom`.

## Configuración del Router (`App.jsx`)

En `App.jsx`, toda la aplicación está envuelta en tres capas principales:

1. `<Router>`: Mantiene sincronizada la barra de URL del navegador con los componentes de React.
2. `<AuthProvider>`: Proveedor de contexto que inyecta los datos de sesión y funciones de login/logout a cualquier componente interno.
3. `<Routes>`: El switch que evalúa la URL actual y decide qué `<Route>` mostrar.

### Tipos de Rutas

- **Rutas Públicas**: Como `<Route path="/login" element={<Login />} />`. Cualquiera puede acceder.
- **Rutas Protegidas**: Envueltas en el componente `<ProtectedRoute>`. 
- **Ruta Catch-all**: `<Route path="*" element={<Navigate to="/dashboard" replace />} />`. Atrapa cualquier URL inválida y redirige a un lugar seguro.

## El problema de CORS y el Proxy de Vite

Normalmente, si React en el puerto `5173` intenta hacer un POST a Express en el puerto `3001`, el navegador lo bloquea lanzando un error de CORS (Cross-Origin Resource Sharing) por seguridad.

Para evitar tener que configurar encabezados complejos en desarrollo, **Vite actúa como intermediario**.

En el archivo `vite.config.js`:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    }
  }
}
```

**¿Cómo funciona?**
1. React hace una petición a `http://localhost:5173/api/auth/login`.
2. Como es el mismo dominio de React, el navegador no tira error de CORS.
3. El servidor de Vite detecta el `/api`, y silenciosamente redirige esa petición a `http://localhost:3001/api/auth/login`.
4. Devuelve la respuesta al navegador sin alertar problemas de seguridad.

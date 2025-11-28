# Products API - NestJS CRUD Boilerplate

## Descripción del Proyecto

Backend API REST desarrollado con NestJS que proporciona un sistema completo de gestión de productos con autenticación JWT. El proyecto incluye operaciones CRUD completas, persistencia en base de datos, autenticación segura y pruebas unitarias.

## Tecnologías Principales

- **NestJS** - Framework progresivo de Node.js
- **TypeORM** - ORM para TypeScript y JavaScript
- **SQLite** - Base de datos ligera para desarrollo
- **JWT** - JSON Web Tokens para autenticación
- **Passport** - Middleware de autenticación
- **Swagger** - Documentación automática de API
- **Jest** - Framework de testing
- **bcrypt** - Encriptación de contraseñas

## Estructura del Proyecto

### Módulos Principales

- **`products`** - Gestión de productos (CRUD completo)
- **`auth`** - Autenticación y autorización con JWT
- **`users`** - Gestión de usuarios y credenciales

### Archivos de Configuración

- **`src/config/database.ts`** - Configuración centralizada de TypeORM
- **`src/config/jwt.ts`** - Configuración centralizada de JWT
- **`migrations/`** - Migraciones de base de datos
- **`data-source.ts`** - Configuración del CLI de TypeORM

## Requisitos Previos

- **Node.js** ≥ 18
- **npm** ≥ 9

## Variables de Entorno

Crear archivo `.env` basado en `.env.example`:

```bash
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1h
DB_PATH=products.sqlite
NODE_ENV=development
```

## Instalación

```bash
npm install
```

## Ejecución de Migraciones

```bash
npm run migration:run
```

## Ejecución en Modo Desarrollo

```bash
npm run start:dev
```

El servidor estará disponible en: `http://localhost:3000`

## Ejecución de Pruebas Unitarias

```bash
npm test
```

## Acceso a Documentación Swagger

```
http://localhost:3000/api
```

## Endpoints Principales

### Autenticación (Públicos)

- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión

### Productos (Protegidos con JWT)

- `GET /products` - Listar todos los productos
- `GET /products/:id` - Obtener producto por ID
- `POST /products` - Crear nuevo producto
- `PUT /products/:id` - Actualizar producto
- `DELETE /products/:id` - Eliminar producto

## Uso de la API

### 1. Registrar Usuario

```bash
curl -X POST http://localhost:3000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"password123"}'
```

### 2. Iniciar Sesión

```bash
curl -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"password123"}'
```

### 3. Crear Producto (con token JWT)

```bash
curl -X POST http://localhost:3000/products \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -d '{"name":"Café Premium","isPremium":true,"price":25.5}'
```

## Scripts Disponibles

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod

# Construcción
npm run build

# Pruebas
npm test
npm run test:watch
npm run test:cov

# Migraciones
npm run migration:run
npm run migration:revert
npm run migration:generate

# Linting
npm run lint
```

## Características Implementadas

- CRUD completo de productos
- Autenticación JWT con Passport
- Validación de datos con class-validator
- Persistencia con TypeORM y SQLite
- Migraciones de base de datos
- Documentación automática con Swagger
- Pruebas unitarias con Jest
- Configuración centralizada
- Manejo de errores uniforme
- Encriptación de contraseñas con bcrypt

## Seguridad

- Todos los endpoints de productos están protegidos con JWT
- Las contraseñas se almacenan encriptadas con bcrypt
- Validación estricta de datos de entrada
- Headers de autorización requeridos para rutas protegidas

## Testing

El proyecto incluye pruebas unitarias completas para:

- **ProductsService** - 6 casos de prueba
- **ProductsController** - 5 casos de prueba  
- **AuthService** - 4 casos de prueba
- **AuthController** - 2 casos de prueba
- **UsersService** - 5 casos de prueba

Total: **33 pruebas** con cobertura completa usando mocks controlados.

## Arquitectura

El proyecto sigue los principios de arquitectura limpia con separación clara de responsabilidades:

- **Controladores** - Capa HTTP y validación de entrada
- **Servicios** - Lógica de negocio
- **Repositorios** - Acceso a datos
- **Entidades** - Modelos de dominio
- **DTOs** - Objetos de transferencia de datos
- **Guards** - Protección de rutas
- **Configuración** - Centralizada y reutilizable

## Licencia

MIT

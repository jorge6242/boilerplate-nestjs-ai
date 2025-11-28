# 🛡️ Functional Requirements Document (FRD-03)
**Proyecto:** Boilerplate NestJS CRUD Products  
**Documento:** Autenticación y Seguridad con JWT  
**Versión:** v1.0  
**Autor:** Jorge Gómez  
**Estado:** Draft

---

## 1. Propósito

Establecer una capa de autenticación segura basada en **JWT + Passport**, incorporando un módulo `Auth` y un módulo `Users`, con lógica de registro, inicio de sesión, validación de credenciales, generación de tokens y protección de rutas internas con **Guards** y **middleware centralizado**.

---

## 2. Alcance

### 2.1 In-Scope

- Creación del módulo `users` con entidad `User` y campos mínimos:
  - `id` (uuid)
  - `email` (string, único)
  - `passwordHash` (string, encriptado con bcrypt)
- Creación del módulo `auth` con:
  - Servicio de autenticación
  - Estrategia `LocalStrategy`
  - Estrategia `JwtStrategy`
  - Servicio `JwtService` configurado globalmente
- Endpoints obligatorios:
  - `POST /auth/register`
  - `POST /auth/login`
- Generación de JWT con `expiresIn` definido.
- Uso de Guards en `products` para proteger todos los endpoints:
  - `@UseGuards(JwtAuthGuard)`
- Middleware para validar header Authorization antes de pasar al controlador.
- Configuración centralizada de JWT (secret + expiración) en `src/config/jwt.ts`.

### 2.2 Out-of-Scope
- Roles, permisos avanzados o RBAC.
- Refresh tokens.
- Revocación de tokens.
- Endpoints administrativos.
- OAuth o login social.

---

## 3. Setup de Seguridad

### 3.1 Dependencias
Desde la raíz del proyecto:

```bash
npm install @nestjs/passport passport passport-local passport-jwt @nestjs/jwt bcrypt
```

### 3.2 Configuración de JWT centralizada

Crear archivo:

```
src/config/jwt.ts
```

Este archivo debe exportar una fábrica reutilizable `getJwtConfig(configService)` que defina:

- `secret`
- `signOptions` con expiración
- Uso de variables de entorno: `JWT_SECRET`, `JWT_EXPIRES_IN`

---

## 4. Módulo Users

### 4.1 Entidad User

Crear archivo:

```
src/users/user.entity.ts
```

Campos:

- id (uuid PK)
- email (único)
- passwordHash (string)
- createdAt
- updatedAt

### 4.2 Repositorio personalizado

```
src/users/user.repository.ts
```

Debe incluir:
- findByEmail(email)
- createAndSave(dto) con hash de password

### 4.3 UsersService

Funciones obligatorias:
- registerUser(dto)
- findByEmail()
- validateCredentials()

---

## 5. Módulo Auth

### 5.1 Endpoints
```
POST /auth/register
POST /auth/login
```

### 5.2 AuthService

Debe:
- Validar usuario
- Comparar password (bcrypt)
- Generar token JWT
- Devolver `{ accessToken }`

### 5.3 Estrategias

#### LocalStrategy
Permite validar las credenciales en login.

#### JwtStrategy
Valida el token en requests protegidas.

---

## 6. Middleware y Guards

### 6.1 Middleware Global
Crear archivo:

```
src/common/middleware/auth.middleware.ts
```

Debe:
- Detectar `Authorization: Bearer <token>`
- Enviar error si no está presente
- Permitir paso si existe token (validación completa se hace con guard)

### 6.2 Guards

```
src/auth/jwt-auth.guard.ts
```

Debe proteger todos los endpoints de `products`.

Agregar en cada controlador:

```ts
@UseGuards(JwtAuthGuard)
```

---

## 7. Migraciones

Crear migración:

```
migrations/XXXXXXXXXXXX-CreateUsersTable.ts
```

Debe generar la tabla `users` con todos los campos indicados.

Ejecutar:

```bash
npm run migration:run
```

---

## 8. Criterios de aceptación

- Registro crea usuario en la BD con password hasheado.
- Login retorna `{ accessToken }`.
- Todos los endpoints de products están protegidos.
- Acceso sin token → 401.
- Token inválido → 401.
- Token válido → CRUD normal.
- Configuración JWT centralizada y no repetida.

---

## 9. Resultado esperado

Después de ejecutar este FRD:

- La API cuenta con JWT robusto.
- La entidad `User` persiste correctamente.
- `products` se convierte en un módulo privado.
- El agente puede autenticar, autorizar y proteger rutas.

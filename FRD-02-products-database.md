# 🧩 Functional Requirements Document (FRD-02)
**Proyecto:** Boilerplate NestJS CRUD Products  
**Documento:** Persistencia de Products con TypeORM  
**Versión:** v1.0  
**Autor:** Jorge Gomez  
**Estado:** Draft

---

## 1. Propósito

1.1 Extender el boilerplate definido en `FRD-01-boilerplate-core-products.md` para que el CRUD de `Product` deje de usar un arreglo en memoria y pase a usar **TypeORM con Base de Datos real**, manteniendo:

- Los mismos endpoints.
- El mismo contrato de respuestas.
- La misma entidad `Product` a nivel lógico.

1.2 Aplicar **código limpio** con separación clara entre:

- Entidad (modelo de dominio / persistencia).
- Repositorio (acceso a datos).
- Servicio (reglas de negocio).
- Controlador (capa HTTP).

---

## 2. Alcance

### 2.1 In-Scope

- Integración de **TypeORM** en el proyecto NestJS creado en FRD-01.
- Configuración de conexión a BD mediante variables de entorno.
- Mapeo de `Product` como entidad TypeORM.
- Creación de `Product.repository.ts` para abstraer la lógica de acceso a datos.
- Modificación de `ProductsService` para:
  - Usar un repositorio de TypeORM en lugar de arreglo en memoria.
- Ajustes mínimos en el controller si es necesario (pero manteniendo las rutas y responses).
- Mantener comentarios de **JSDoc** en métodos clave (repositorio/servicio).
- Configuración y uso básico de **migraciones TypeORM** para la tabla `products`, usando clases y una carpeta dedicada `migrations/`.

### 2.2 Out-of-Scope

- Autenticación / autorización.
- Múltiples bases de datos o multi-tenant.
- Relaciones complejas con otras entidades.
- Mecanismos avanzados de migraciones o versionado de esquema (se puede usar `synchronize: true` en entorno de desarrollo, según se defina aquí).

---

## 3. Setup de Persistencia

### 3.1 Requisitos

- Proyecto ya existente y funcional según `FRD-01-boilerplate-core-products.md`.
- `.env` existente o creado, con capacidad de agregar nuevas variables de conexión.

### 3.2 Dependencias mínimas

El agente debe instalar, desde la carpeta raíz del proyecto (`<nombre de carpeta>` ya creado en FRD-01):

```bash
npm install @nestjs/typeorm typeorm
```

### 3.3 Configuración centralizada de TypeORM
3.3.1 El agente debe crear la carpeta: src/config/ , y dentro un archivo llamado: src/config/database.ts
3.3.2 Este archivo debe contener **toda** la configuración de TypeORM, exportada como una **fábrica reutilizable**, que reciba `ConfigService` y devuelva las opciones de conexión.

3.3.3 En `app.module.ts`, el agente debe importar esta fábrica desde `config/database.ts` y utilizarla dentro de `TypeOrmModule.forRootAsync`, evitando incluir objetos de configuración embebidos directamente en el módulo.

3.3.4 Criterios de aceptación:

- `AppModule` NO debe contener configuración TypeORM inline.  
- Toda la configuración reside en `config/database.ts`.  
- `AppModule` solo importa y usa la fábrica.  
- La aplicación debe seguir levantando correctamente usando la BD definida por `DB_PATH` o `products.sqlite`.

### 3.4 Migraciones con TypeORM

3.4.1 El agente debe configurar TypeORM para soportar **migraciones basadas en clases**, asegurando que:

- Exista una carpeta `migrations/` en la raíz del proyecto (por ejemplo: `<nombre de carpeta>/migrations/`).  
- La configuración de TypeORM utilizada por el CLI conozca:
  - la conexión a la BD,
  - la entidad `Product`,
  - y la ruta de la carpeta `migrations/`.

3.4.2 El agente debe **generar una migración inicial** que cree la tabla `products` en la BD, basada en la entidad `Product`.  

- El archivo de migración debe vivir dentro de la carpeta `migrations/`.  
- La migración debe ser una **clase de TypeORM**, implementando los métodos estándar `up` y `down`.  
  - `up`: crea la tabla `products` con las columnas necesarias.  
  - `down`: revierte la creación de la tabla (por ejemplo, eliminándola).

3.4.3 El agente debe **ejecutar** la migración inicial de `products` como parte de esta fase de persistencia, antes de considerar completado el FRD-02.

3.4.4 Criterios de aceptación de migraciones:

- Tras ejecutar la migración, la tabla `products` debe existir en la BD, con columnas coherentes con la entidad `Product` (`id`, `name`, `description`, `isPremium`, `price`, `createdAt`, `updatedAt`).  
- La migración debe ser revertible mediante su método `down` sin errores.  
- El CRUD de `/products` debe funcionar correctamente leyendo/escribiendo en la tabla `products` creada por la migración (no solo por `synchronize: true`).

# 🧩 Functional Requirements Document (FRD-00)
**Proyecto:** Boilerplate NestJS CRUD Products  
**Documento:** FRD Maestro de Orquestación  
**Versión:** v2.0  
**Autor:** Jorge Gomez  
**Estado:** Draft

---

## 1. Propósito

1.1 Definir cómo un agente (FRD Assistant / CLI) debe **orquestar** la ejecución de varios FRD específicos del proyecto en el siguiente **orden**:

- `FRD-01-boilerplate-core-products.md`
- `FRD-02-products-database.md`
- `FRD-03-auth-jwt.md`
- `FRD-04-unit-testing.md`

1.2 Garantizar que:

- El **boilerplate core** se genere primero (Fase 1) usando **exactamente** las reglas de `FRD-01-boilerplate-core-products.md`.
- La **capa de persistencia con TypeORM + Base de Datos** (Fase 2) se aplique **solo después** de que el core esté correcto y estable, siguiendo `FRD-02-products-database.md`.
- La **capa de autenticación JWT** (Fase 3) se implemente **después** de tener la BD funcional, siguiendo `FRD-03-auth-jwt.md`.
- Las **pruebas unitarias mínimas** (Fase 4) se generen al final, cuando toda la lógica de negocio y seguridad esté lista, siguiendo `FRD-04-unit-testing.md`.

---

## 2. Alcance

### 2.1 In-Scope

- Orquestar la secuencia de trabajo del agente:
  - Fase 1 → ejecutar `FRD-01-boilerplate-core-products.md`.
  - Fase 2 → ejecutar `FRD-02-products-database.md`.
  - Fase 3 → ejecutar `FRD-03-auth-jwt.md`.
  - Fase 4 → ejecutar `FRD-04-unit-testing.md`.
- Definir reglas de **orden, dependencia y no-interactividad** entre fases.
- Establecer criterios mínimos de éxito global:
  - Proyecto corriendo.
  - Persistiendo en BD real.
  - Endpoints protegidos por JWT.
  - Pruebas unitarias corriendo en verde.

### 2.2 Out-of-Scope

- Modificar el contenido interno de los FRD operativos (`FRD-01`, `FRD-02`, `FRD-03`, `FRD-04`).
- Redefinir los requisitos funcionales ya especificados en cada FRD específico.
- Añadir features fuera del scope de Products y Auth (por ejemplo, otros módulos complejos).

---

## 3. Documentos Relacionados

3.1 **FRD-01 — Boilerplate Core Products**  
Archivo: `FRD-01-boilerplate-core-products.md`  
Rol: Define el **proyecto base NestJS**, CRUD de `Product` en memoria, validaciones, Swagger, JSDoc y pruebas con `curl`.

3.2 **FRD-02 — Products Database (TypeORM + Migraciones)**  
Archivo: `FRD-02-products-database.md`  
Rol: Extiende el proyecto base para que `ProductsService` use **TypeORM + BD real**, con configuración centralizada, repositorio dedicado, migraciones y (opcionalmente) seeds.

3.3 **FRD-03 — Autenticación JWT**  
Archivo: `FRD-03-auth-jwt.md`  
Rol: Agrega módulo de autenticación con JWT + Passport, endpoints de registro/login, configuración centralizada de secretos y expiración, guards y middleware para proteger los endpoints de `products`.

3.4 **FRD-04 — Pruebas Unitarias Mínimas**  
Archivo: `FRD-04-unit-testing.md`  
Rol: Define la creación de pruebas unitarias mínimas para controladores y servicios de los módulos `products` y `auth`, alineadas con buenas prácticas de `@nestjs/testing`, sin requerir coverage avanzado.

---

## 4. Fases de Ejecución

### 4.1 Fase 1 — Boilerplate Core (FRD-01)

El agente debe:

- Leer y seguir **exclusivamente** lo definido en `FRD-01-boilerplate-core-products.md`.
- Crear el proyecto NestJS, módulo `products`, DTOs, entidad lógica, Swagger, `ValidationPipe`, filtro global de errores y JSDoc.
- Configurar el servidor para que exponga el CRUD de `Product` en memoria.
- Ejecutar las pruebas de `curl` indicadas en FRD-01 y verificar que los códigos HTTP coinciden con lo especificado.

**Regla estricta:**  
El contenido de `FRD-01-boilerplate-core-products.md` es **intocable**.  
El agente **no puede reescribir ni alterar** ese documento; solo debe **obedecerlo**.

### 4.2 Fase 2 — Persistencia con TypeORM + BD (FRD-02)

Solo se ejecuta cuando:

- Todos los criterios de aceptación del FRD-01 se cumplieron.
- El servidor corre establemente y el CRUD funciona en memoria.

El agente debe:

- Leer y seguir `FRD-02-products-database.md`.
- Integrar TypeORM con una BD real (por defecto SQLite) usando configuración **centralizada** en `src/config/database.ts`.
- Convertir `Product` en entidad TypeORM y crear `Product.repository.ts` para acceso a datos.
- Configurar `ProductsService` para usar el repositorio y la BD real, manteniendo:
  - Los mismos endpoints.
  - El mismo contrato de respuesta.
- Configurar y ejecutar las **migraciones** definidas en el FRD (y, si aplica, seeds).
- Volver a ejecutar los `curl` clave para comprobar que el CRUD ahora opera sobre la BD real.

### 4.3 Fase 3 — Autenticación JWT (FRD-03)

Solo se ejecuta cuando:

- Fase 1 (FRD-01) fue completada con éxito.
- Fase 2 (FRD-02) fue aplicada correctamente y la aplicación persiste datos en BD.

El agente debe:

- Leer y seguir `FRD-03-auth-jwt.md`.
- Crear el módulo `auth` y la entidad `User` con al menos `email` y `password` (hash).
- Implementar repositorio, servicio y controlador de `auth` con endpoints mínimos:
  - `POST /auth/register`
  - `POST /auth/login`
- Configurar JWT + Passport con:
  - Módulo JWT en un único lugar centralizado (secret, expiración, algoritmo) leyendo desde variables de entorno.
  - Estrategia `JwtStrategy` reutilizable.
- Agregar `Guards` y, cuando el FRD lo indique, middleware centralizado para:
  - Validar el header `Authorization: Bearer <token>`.
  - Proteger todos los endpoints de `products` (y otros privados) para que solo sean accesibles con un token válido.
- Mantener claro qué endpoints son públicos (`/auth/*`) y cuáles son privados (`/products/*`).

### 4.4 Fase 4 — Pruebas Unitarias (FRD-04)

Solo se ejecuta cuando:

- Fase 1 (FRD-01) está en estado “OK”.
- Fase 2 (FRD-02) está en estado “OK”.
- Fase 3 (FRD-03) está en estado “OK”.

El agente debe:

- Leer y seguir `FRD-04-unit-testing.md`.
- Generar pruebas unitarias básicas para:
  - `products.service.ts`
  - `products.controller.ts`
  - `auth.service.ts`
  - `auth.controller.ts`
- Usar exclusivamente `@nestjs/testing` y mocks controlados (sin tocar la BD real).
- Mantener el alcance mínimo definido (sin métricas de coverage obligatorias).
- Ejecutar correctamente las pruebas con:

```bash
npm test
```

---

## 5. Reglas de Orquestación para el Agente

### 5.1 Orden obligatorio

- Primero **Fase 1 → FRD-01**  
- Luego **Fase 2 → FRD-02**  
- Luego **Fase 3 → FRD-03**  
- Finalmente **Fase 4 → FRD-04**  
- El agente **no puede** ejecutar una fase si la anterior no está en estado “OK”.

### 5.2 No-interactividad entre fases

- Mientras se esté ejecutando FRD-01, FRD-02, FRD-03 o FRD-04:

  - El agente **no debe** preguntar qué hacer a continuación.
  - El agente **no debe** ofrecer opciones ni pedir que el usuario elija entre alternativas.
  - El agente **no debe** pedir confirmación para ejecutar comandos ni introducir condiciones del tipo
    “solo continuaré si el usuario confirma”, independientemente de la formulación exacta
    (preguntas, sugerencias, frases condicionales, etc.).
  - El agente **no debe** introducir una “fase de planificación adicional” visible (por ejemplo:
    “mi plan inmediato es leer los FRD, crear backlog, diseñar estrategia, proponer estructura…”).
    Toda la planificación necesaria ya está definida por FRD-00 y los FRD específicos; cualquier
    planificación adicional debe quedar como razonamiento interno, no como salida visible.

- Hasta que **termine** la fase actual según sus criterios de aceptación, el agente solo puede:
  - Reportar progreso (lo que ya hizo y lo que hará a continuación **dentro de la fase actual**).
  - Reportar errores y cómo los está corrigiendo según el FRD, sin pedir decisiones al usuario.

- El agente **no debe** mencionar que “necesita aprobación” o que “requiere confirmación” para comandos internos; debe limitarse a indicar qué está ejecutando o ejecutará a continuación, sin involucrar al usuario en decisiones de flujo durante la fase.

### 5.3 Lectura explícita de archivos

El agente debe asumir que:

- `FRD-00-master-orchestration.md`
- `FRD-01-boilerplate-core-products.md`
- `FRD-02-products-database.md`
- `FRD-03-auth-jwt.md`
- `FRD-04-unit-testing.md`

Están disponibles en la **misma carpeta raíz** del proyecto (por ejemplo, en el workspace del IDE).

Cuando el usuario seleccione estos archivos en el entorno (p. ej. Windsurf / Gravitty / editor similar), el agente debe tratarlos como **fuente de verdad**.

### 5.4 Integridad de los FRD

- Cualquier diferencia entre lo implementado y lo descrito en los FRD se considera **error de implementación**, no motivo para editar los FRD.
- El agente debe corregir el **código**, **no los documentos**.

### 5.5 Activación automática al recibir los archivos y el nombre de la carpeta

Si el usuario proporciona en un mismo mensaje:

- La referencia explícita a este documento:  
  `FRD-00-master-orchestration.md`
- La referencia a los documentos operativos:  
  `FRD-01-boilerplate-core-products.md`  
  `FRD-02-products-database.md`  
  `FRD-03-auth-jwt.md`  
  `FRD-04-unit-testing.md`  
- El nombre de la carpeta del proyecto (ej.: `nombre de carpeta: api-products`)

Mientras la orquestación esté activa:

- Cualquier mensaje del usuario distinto a una orden explícita de detener la orquestación
  (por ejemplo: “DETENER ORQUESTACIÓN” o “parar orquestación”)
  se interpretará como un simple **permiso para continuar** siguiendo FRD-00.

- Mensajes como “ok”, “ok puedes continuar”, “vale” u otros equivalentes
  **no deben** provocar preguntas nuevas, cambios de plan ni solicitudes de confirmación;
  el agente debe seguir ejecutando la fase actual según lo ya definido.

Entonces el agente debe interpretar ese mensaje como:

> **“Iniciar la orquestación siguiendo exactamente FRD-00, ejecutando de inmediato la Fase 1 (FRD-01), luego la Fase 2 (FRD-02), luego la Fase 3 (FRD-03) y finalmente la Fase 4 (FRD-04), sin solicitar confirmaciones adicionales”.**

Bajo esta condición:

- El agente **no debe** responder con preguntas como:  
  “¿Qué quieres que haga exactamente?”  
- Tampoco debe ofrecer opciones ni pedir selección de tareas.
- Debe entrar directamente en **modo ejecución**, aplicando la orquestación definida en este documento.

Esta activación automática **no modifica** las reglas de validación:

- Fase 1 debe completarse con éxito antes de ejecutar Fase 2.
- Fase 2 debe completarse con éxito antes de ejecutar Fase 3.
- Fase 3 debe completarse con éxito antes de ejecutar Fase 4.
'


### 5.6 Tarea de cierre: Actualización automática del README

Una vez completadas **todas** las fases (FRD-01, FRD-02, FRD-03 y FRD-04) y estando cada una en estado “OK”, el agente debe ejecutar una **tarea final obligatoria**:

#### 5.6.1 Generación/Actualización del archivo `README.md`

El agente debe crear o sobrescribir el archivo `README.md` ubicado en la carpeta raíz del proyecto (`/api-products/README.md`) con la siguiente información mínima:

1. **Descripción del proyecto**
   - Propósito del backend.
   - Tecnologías principales utilizadas (NestJS, TypeORM, JWT, etc.).

2. **Estructura del proyecto**
   - Módulos principales (`products`, `auth`, `users`).
   - Ubicación de archivos de configuración (`src/config/*`).
wA
3. **Requisitos previos**
   - Versión recomendada de Node.js.
   - Variables de entorno requeridas (con referencia a `.env.example`).

4. **Instalación**
   ```bash
   npm install
   ```

5. **Ejecución de migraciones**
   ```bash
   npm run migration:run
   ```

6. **Ejecución en modo desarrollo**
   ```bash
   npm run start:dev
   ```

7. **Ejecución de pruebas unitarias**
   ```bash
   npm test
   ```

8. **Acceso a documentación Swagger**
   ```
   http://localhost:3000/api
   ```

#### 5.6.2 Reglas adicionales para el README

- El agente **no debe** pedir confirmación para generar o sobrescribir el README.
- El contenido del README debe ser generado de forma **automática** basado en el estado final del proyecto.
- Si ya existe un `README.md`, el agente debe **sobrescribirlo por completo**, evitando mezclar contenido previo.
- El README debe ser claro, conciso, actualizado y completamente funcional.
- No se permiten frases condicionales del tipo “si deseas”, “puedes agregar”, “opcionalmente”, etc.


---

## 6. Criterios de Aceptación Globales

### 6.1 Fase 1 (FRD-01)

- Criterios de aceptación de `FRD-01-boilerplate-core-products.md` cumplidos **tal cual** están definidos.
- CRUD funcional en memoria con validación, Swagger y formato de errores correcto.

### 6.2 Fase 2 (FRD-02)

- Criterios de aceptación de `FRD-02-products-database.md` cumplidos.
- CRUD de `Product` operando contra BD real mediante TypeORM.
- Migraciones ejecutadas con éxito.

### 6.3 Fase 3 (FRD-03)

- Criterios de aceptación de `FRD-03-auth-jwt.md` cumplidos.
- Endpoints de `auth` (`/auth/register`, `/auth/login`) funcionando.
- Endpoints de `products` protegidos con JWT (guards/middleware) y accesibles solo con token válido.

### 6.4 Fase 4 (FRD-04)

- Criterios de aceptación de `FRD-04-unit-testing.md` cumplidos.
- Las pruebas unitarias generadas deben:
  - Compilar sin errores.
  - Ejecutarse correctamente con `npm test`.
  - Validar mínimamente la lógica de service y controller de `products` y `auth`.

### 6.5 Orquestación

- El agente:
  - No modificó los FRD operativos.
  - Siguió el orden Fase 1 → Fase 2 → Fase 3 → Fase 4.
  - No pidió decisiones al usuario a mitad de fase (solo reportó progreso o errores).

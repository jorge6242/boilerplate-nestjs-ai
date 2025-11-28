# 🧩 Functional Requirements Document (FRD)
**Proyecto:** Boilerplate NestJS CRUD Products  
**Versión:** v1.0 (versión mínima)  
**Autor:** Jorge Gomez  
**Estado:** Draft

---

## 1. Propósito
Crear un **proyecto base en NestJS** que exponga un **CRUD REST** para la entidad `Product`, con **validación**, **Swagger** y **estructura modular** lista para extender.

---

## 2. Alcance

### 2.1 In-Scope
- Proyecto NestJS creado con `nest new`.
- Módulo `products` con endpoints CRUD.
- Validaciones con `class-validator`.
- Documentación automática con Swagger en `/api`.
- Documentacion con JSDoc

### 2.2 Out-of-Scope
- Autenticación / autorización.
- Persistencia real en BD (se puede usar arreglo en memoria).
- CI/CD avanzado.

---

## 3. Setup mínimo

### 3.1 Requisitos
- Node.js ≥ 18  
- npm ≥ 9  
- Nest CLI global: `npm i -g @nestjs/cli`

### 3.2 Secuencia obligatoria (ejecución automática)
El agente **debe ejecutar en este orden** y continuar si el comando anterior terminó con código `0`:

```bash
nest new <nombre de carpeta> --package-manager npm
cd <nombre de carpeta>
npm install class-validator class-transformer @nestjs/config @nestjs/swagger swagger-ui-express
```

> **Regla de avance automático:**  
> Si `nest new <nombre de carpeta> --package-manager npm` termina con código de salida `0`, el agente **no debe** preguntar “Continue waiting…?” ni esperar más interacción del usuario. Debe continuar inmediatamente con el siguiente comando de la secuencia (`cd <nombre de carpeta>` y luego `npm install ...`).

> Si la carpeta `<nombre de carpeta>/` ya existe, el agente solo debe ejecutar los pasos faltantes (instalar deps).

> **Política de ejecución para pruebas de endpoints (obligatoria):**  
> Tras completar la instalación del §3.2, el agente **debe**:
> 1) Abrir una **Terminal A** y ejecutar `npm run start:dev`.  
> 2) **Mantener** la Terminal A **abierta** y **no finalizar** el proceso (no usar `Ctrl+C`) hasta terminar las pruebas.  
> 3) Abrir una **Terminal B** (sesión separada) para ejecutar los `curl` del §7, **sin** detener el server de la Terminal A.
---

## 4. Estructura mínima esperada

```text
<nombre de carpeta>/
  package.json
  src/
    main.ts
    app.module.ts
    products/
      products.module.ts
      products.controller.ts
      products.service.ts
      dto/
        create-product.dto.ts
        update-product.dto.ts
      product.entity.ts
```

> **Validación de generación:**  
> Al finalizar la secuencia del §3.2, el agente debe verificar que **todas** las rutas indicadas en este apartado existen. Si falta alguna (`products.service.ts`, `products.controller.ts`, o algún DTO), debe generarla inmediatamente antes de continuar con `npm run start:dev`.

---

## 5. Bootstrap de la app

Editar `src/main.ts` para que incluya SIEMPRE:

1. **ValidationPipe global** con:
   - `whitelist: true`
   - `forbidNonWhitelisted: true`
   - `transform: true`

2. **Swagger** en `/api`.

3. **ConfigModule** debe poder usarse desde `main.ts`.

Ejemplo de intención (no tiene que ser literal):

```ts
const app = await NestFactory.create(AppModule);
app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
const config = new DocumentBuilder().setTitle('Products API').setVersion('1.0').build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('/api', app, document);
await app.listen(3000);
```

> **Verificación previa a pruebas:**  
> Antes de ejecutar `curl`, el agente debe confirmar que la app está corriendo (por ejemplo, detectando el log: `Nest] Server running on http://localhost:3000`).  
> Si el server no está activo, **reiniciar** `npm run start:dev` en la Terminal A y **volver a intentar** las pruebas.

---

## 6. Entidad y DTOs

### 6.1 Entidad canónica (`product.entity.ts`)
```ts
export class Product {
  id: string;
  name: string;
  description?: string;
  isPremium: boolean;
  price?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### 6.2 `create-product.dto.ts`
- `name`: string, requerido, no vacío
- `description`: string, opcional
- `isPremium`: boolean, requerido
- `price`: number, requerido **solo si** `isPremium = true`

### 6.3 `update-product.dto.ts`
- Mismos campos que create, todos opcionales.

---

## 7. Endpoints requeridos

Base: `http://localhost:3000/products`

| Método | Ruta              | Descripción                    | Respuestas |
|--------|-------------------|---------------------------------|------------|
| GET    | `/products`       | Lista todos los productos       | 200 OK     |
| GET    | `/products/:id`   | Obtiene un producto por id      | 200 / 404  |
| POST   | `/products`       | Crea un producto                | 201        |
| PUT    | `/products/:id`   | Actualiza un producto completo  | 200 / 404  |
| DELETE | `/products/:id`   | Elimina un producto             | 204 / 404  |

### 7.1 Reglas mínimas
- `POST` y `PUT` deben validar DTO → si falla, 400.
- `GET /products/:id`, `PUT /products/:id`, `DELETE /products/:id` → si no existe, 404.
- ID será `uuid` generado en memoria.
- Se debe inluir comentarios de JSDoc para la logica que se generen.

### 7.2 Comandos de prueba (ejecución en Terminal B, con el server activo en Terminal A)

```bash
# Crear producto válido
curl -X POST http://localhost:3000/products \
  -H 'Content-Type: application/json' \
  -d '{"name":"Café Premium","isPremium":true,"price":25.5}'

# Listar productos
curl -X GET http://localhost:3000/products

# Error de validación (falta "name")
curl -X POST http://localhost:3000/products \
  -H 'Content-Type: application/json' \
  -d '{"isPremium":true,"price":25.5}'
```
Regla: Estos tres comandos deben ejecutarse en ese orden y el agente debe registrar el código de salida de cada curl.
---

## 8. Formato de errores (uniforme)

Todas las respuestas de error deben seguir este formato:

```json
{
  "statusCode": 400,
  "message": ["campo X es requerido"],
  "error": "Bad Request",
  "timestamp": "2025-10-26T10:00:00.000Z",
  "path": "/products"
}
```

No es obligatorio el texto exacto de `message[]`, pero sí que sea un **array de strings**.

---

## 9. ProductsService (en memoria)

El servicio debe mantener los productos en un arreglo en memoria (`private products: Product[] = []`) y exponer métodos:

- `findAll(...)`
- `findOne(id: string)`
- `create(dto)`
- `update(id: string, dto)`
- `remove(id: string)`

---

## 10. Swagger

- El controller `products.controller.ts` debe tener `@ApiTags('products')`.
- Cada endpoint debe aparecer en `/api`.

---

## 11. Scripts mínimos en `package.json`

```json
{
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "build": "nest build"
  }
}
```

---

## 12. Criterios de aceptación

-1. Una vez que el server esté corriendo en la Terminal A, el agente **debe ejecutar automáticamente** las pruebas `curl` del §7 desde una Terminal B, **sin solicitar confirmación** ni ofrecer opciones. Solo debe reportar resultados.
1. El proyecto levanta con `npm run start:dev` sin errores.
0. Mientras no se hayan ejecutado todos los pasos del §3.2 y no exista la estructura del §4, el agente **no debe** pedir instrucciones adicionales al usuario ni ofrecer opciones (“¿quieres que valide…?”). Debe completar primero el setup mínimo.
2. `/api` muestra el controller `products`.
3. `POST /products` crea un producto y devuelve un `id` (uuid).
4. `GET /products` devuelve un array (vacío o con datos).
5. Peticiones inválidas devuelven el formato de error del §8.
6. Si durante la generación el agente reporta mensajes del tipo `problems found` sobre archivos creados (`products.module.ts`, `products.service.ts`, DTOs), el proceso **no se considera completo**. El agente debe corregir o regenerar esos archivos y volver a evaluarlos hasta que no existan `problems found` antes de informar éxito.
7. Durante la ejecución de las pruebas del §7.2, el proceso `npm run start:dev` **debe permanecer activo**. Si se detiene (por cierre manual u otro motivo), el agente **no puede** declarar éxito: debe reiniciar el server y **reintentar** los `curl` hasta completarlos.
6. El agente debe **imprimir un reporte compacto** de las pruebas con el formato:
   - `[TEST] POST /products → <HTTP_STATUS>`  
   - `[TEST] GET /products → <HTTP_STATUS>`  
   - `[TEST] POST /products (invalid) → <HTTP_STATUS>`  
   Sin preguntas ni prompts adicionales.

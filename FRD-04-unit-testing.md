# 🧩 Functional Requirements Document (FRD-03)
**Proyecto:** Boilerplate NestJS CRUD Products  
**Documento:** Pruebas unitarias de Products (Service & Controller)  
**Versión:** v1.0  
**Autor:** Jorge Gomez  
**Estado:** Draft

---

## 1. Propósito

1.1 Definir los requisitos mínimos para implementar **pruebas unitarias** del módulo `products` en el proyecto generado por:

- `FRD-01-boilerplate-core-products.md`
- `FRD-02-products-database.md`

1.2 Asegurar que existan **tests básicos pero funcionales**, sin requerir métricas estrictas de coverage, que validen:

- La lógica principal de `ProductsService`.
- El comportamiento de `ProductsController`.

---

## 2. Alcance

### 2.1 In-Scope

- Pruebas unitarias usando **Jest** (stack por defecto de NestJS).
- Tests de:
  - `ProductsService`
  - `ProductsController`
- Uso de **mocks** para aislar dependencias:
  - Mock del repositorio TypeORM de `Product` en las pruebas del service.
  - Mock de `ProductsService` en las pruebas del controller.
- Estructura de tests coherente con buenas prácticas (`*.spec.ts`).

### 2.2 Out-of-Scope

- Pruebas end-to-end (E2E).
- Configuración avanzada de coverage.
- Pruebas de otros módulos distintos a `products`.

---

## 3. Setup de Pruebas

3.1 Se asume que el proyecto NestJS ya tiene Jest configurado por defecto.

3.2 El agente debe ubicar o crear los archivos:

```
src/products/products.service.spec.ts
src/products/products.controller.spec.ts
```

---

## 4. Estrategia de Pruebas Unitarias

### 4.1 Principios generales

- Las pruebas deben ser unitarias, determinísticas y legibles.
- No deben depender de base de datos real.
- No deben levantar el servidor HTTP.

---

## 5. Pruebas para `ProductsService`

### 5.1 Objetivo

Validar la lógica de negocio de `ProductsService`, incluyendo reglas sobre `isPremium` y `price`, y manejo de casos de éxito/error.

### 5.2 Setup

- Mock del repositorio TypeORM.
- Sin conexión a BD real.

### 5.3 Casos de prueba mínimos

| ID   | Unidad     | Descripción | Resultado esperado |
|------|------------|-------------|--------------------|
| S-01 | create     | Crear producto válido | Retorna objeto con id |
| S-02 | findAll    | Listar productos | Array mock |
| S-03 | findOne OK | Buscar existente | Retorna producto |
| S-04 | findOne KO | Buscar inexistente | Excepción NotFound |
| S-05 | update     | Actualizar producto | Retorna actualizado |
| S-06 | remove     | Eliminar producto | No error |

---

## 6. Pruebas para `ProductsController`

### 6.1 Objetivo

Validar que `ProductsController` expone endpoints y delega correctamente en el servicio.

### 6.2 Setup

- Mock de `ProductsService`.

### 6.3 Casos mínimos

| ID   | Handler   | Descripción | Resultado esperado |
|------|-----------|-------------|--------------------|
| C-01 | findAll   | GET /products | Llama service.findAll |
| C-02 | findOne   | GET /products/:id | Llama service.findOne |
| C-03 | create    | POST /products | Llama service.create |
| C-04 | update    | PUT /products/:id | Llama service.update |
| C-05 | remove    | DELETE /products/:id | Llama service.remove |

---

## 7. Ejecución de pruebas

El comando:

```
npm test
```

Debe ejecutar todos los tests creados sin errores.

---

## 8. Criterios de Aceptación

- Existen `.spec.ts` para controller y service.
- Ambos módulos usan mocks adecuados.
- Casos S‑01 a S‑06 y C‑01 a C‑05 están implementados.
- `npm test` corre sin fallos.

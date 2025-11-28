# 📘 Orquestación por FRDs — Guía de Uso
**Proyecto:** `api-products`  
**Arquitectura:** NestJS + TypeORM + JWT  
**Automatización:** Agentes de IA (Windsurf / Antigravity / Claude Sonnet)

---

## 🚀 ¿Qué es la Orquestación por FRDs?

Este repositorio implementa un enfoque de desarrollo basado en **FRDs (Functional Requirements Documents)**, donde la construcción del backend se divide en fases independientes y un **FRD Maestro (`FRD-00`)** coordina la ejecución.

Este método permite que un agente de IA:

- Construya un backend paso a paso  
- Sin improvisar  
- Sin pedir confirmaciones  
- Siguiendo reglas estrictas  
- Con fases que no se bloquean entre sí  
- Y con resultados consistentes y reproducibles  

Es una técnica inspirada en principios de ingeniería de requisitos (IEEE 830 / ISO/IEC 29148) y task decomposition para LLMs.

---

## 🧩 ¿Qué contiene este repositorio?

```
.                       # Raíz del repo
├── api-products/       # Backend NestJS generado por la orquestación
│   ├── src/
│   ├── migrations/
│   ├── README.md       # README propio del backend
│   └── package.json
├── FRD-00-master-orchestration.md
├── FRD-01-boilerplate-core-products.md
├── FRD-02-products-database.md
├── FRD-03-auth-security.md
├── FRD-04-unit-testing.md
└── README.md           # README principal del repositorio (este)
```

---

# 📂 FRDs del proyecto

A continuación, una descripción precisa del rol de cada FRD:

---

## 🧠 **FRD-00 — Master Orchestration (FRD Maestro)**  
**Rol:** Es el director de orquesta.  
Define:

- El orden de ejecución de las fases  
- Dependencias entre FRDs  
- Comportamiento del agente  
- Validaciones obligatorias  
- Criterios para avanzar o detener la ejecución  
- Reglas de no-interactividad  
- Condiciones de éxito globales  

**Es el único documento que gobierna el flujo completo.**  
No implementa código; orquesta a los demás.

---

## 🔥 **FRD-01 — Boilerplate Core Products**  
**Rol:** Genera el proyecto base NestJS.  
Incluye:

- Proyecto creado con `nest new`  
- CRUD de productos **en memoria**  
- DTOs con class-validator  
- JSDoc obligatorio  
- Configuración global (Swagger, ValidationPipe, filtros de error)  
- Contratos y endpoints iniciales  

Es la fundación donde se construyen todas las demás fases.

---

## 🗄️ **FRD-02 — Base de Datos + TypeORM**  
**Rol:** Convierte el CRUD en memoria a persistencia real.  
Define:

- Integración con TypeORM  
- Configuración de `database.ts`  
- Migraciones  
- Product entity  
- ProductRepository dedicado  
- Refactor del servicio a operaciones async  
- Verificación con `curl`  

Expande la arquitectura sin modificar el core inicial.

---

## 🔐 **FRD-03 — Autenticación JWT**  
**Rol:** Agrega seguridad y usuarios.  
Incluye:

- User entity  
- Hashing con bcrypt  
- Registro e inicio de sesión  
- Crear estrategias Local y JWT  
- Guards para proteger `/products/*`  
- Integración de Swagger con BearerAuth  

La API se convierte en un backend real listo para entornos profesionales.

---

## 🧪 **FRD-04 — Pruebas Unitarias**  
**Rol:** Asegurar estabilidad y prevenir regresiones.  
Define:

- Uso de Jest y @nestjs/testing  
- Pruebas unitarias para controllers/services  
- Mocks controlados (sin BD real)  
- Validación final con `npm test`  

Cierra el ciclo garantizando calidad y consistencia.

---

# ⚙️ Cómo ejecutar la Orquestación

La orquestación se ejecuta **desde un editor compatible con agentes LLM**, como:

- **Windsurf**
- **Antigravity (Google)**
- **VSCode con Agentes**
- **Cursor**
- **Claude Code**

---

## 1️⃣ Preparar la carpeta

```bash
git clone https://github.com/tuusuario/tu-repo.git
cd tu-repo
```

Asegúrate de que los FRDs existan al nivel raíz.

---

## 2️⃣ Abrir el proyecto en el editor

Abre el repo en el editor con agente.

---

## 3️⃣ Activar la Orquestación

Envíale al agente:

```
Iniciar la orquestación siguiendo FRD-00 maestro.
```

---

## 4️⃣ Esperar la ejecución completa

El agente generará:

- Proyecto NestJS  
- CRUD  
- BD  
- JWT  
- Migraciones  
- Pruebas unitarias  

---

## 5️⃣ Ejecutar el backend (opcional)

```bash
cd api-products
npm install
npm run migration:run
npm run start:dev
```

Swagger: `http://localhost:3000/api`

---

# 🎯 ¿Por qué usar este método?

- No improvisa  
- Es reproducible  
- Es escalable  
- Reduce carga de contexto  
- Industrializa el desarrollo con IA  

---

# 📌 Licencia  
MIT License.

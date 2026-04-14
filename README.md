# TPV 2026 - Premium POS Monorepo

Sistema de Punto de Venta (TPV) de alto rendimiento y diseño premium, construido con una arquitectura de monorepo moderna para escalabilidad y mantenibilidad.

## 🚀 Tecnologías Principales

- **Workspace**: [Nx](https://nx.dev) (Gestión unificada de apps y libs)
- **Frontend**: [Angular 19](https://angular.dev) (PWA con Fabric.js para diseño de planta)
- **Backend**: [NestJS](https://nestjs.io) (API robusta y modular)
- **Base de Datos**: [PostgreSQL](https://www.postgresql.org/) con [Prisma ORM](https://www.prisma.io/)
- **Estilos**: [Tailwind CSS v3](https://tailwindcss.com/) con estética Glassmorphism

## 🛠️ Estructura del Proyecto

```text
apps/
  ├── api/          # NestJS Backend (Gestiona inventario, tickets y fiscalidad)
  └── pwa/          # Angular Frontend (Interfaz de usuario y diseñador de sala)
libs/
  └── shared/       # Modelos y DTOs compartidos entre API y PWA
```

## 🏁 Guía de Inicio Rápido

### 1. Requisitos Previos
- Node.js (v20+)
- Docker (opcional, para la base de datos)

### 2. Instalación
```bash
npm install --legacy-peer-deps
```

### 3. Preparar la Base de Datos
Si usas Docker:
```bash
docker-compose up -d
npm run db:push
```
*Si no usas Docker, configura primero tu URL en el archivo `.env`.*

### 4. Ejecutar Aplicaciones
En terminales separadas:
```bash
# Servir API (Backend)
npm run start:api

# Servir PWA (Frontend)
npm run start:pwa
```

## 💎 Características Destacadas

### ✅ Fiscalidad VeriFactu
Implementación de encadenamiento de hashes inmutable para cumplimiento con la normativa fiscal española. Cada ticket genera un hash encadenado al anterior para asegurar la integridad de los datos.

### 🏢 Inventario Multi-almacén y Escandallos
Gestión avanzada de stock que descuenta ingredientes automáticamente basándose en las recetas (escandallos) al realizar una venta, soportando múltiples puntos de almacenamiento.

### 🎨 Diseñador de Sala Interactivo
Herramienta visual incorporada en la PWA que permite arrastrar y redimensionar mesas sobre una cuadrícula táctil, persistiendo las coordenadas y formas en la base de datos.

---

## 📦 Subida a GitHub

Para realizar el primer envío a tu repositorio:

1. `git add .`
2. `git commit -m "Initial commit: POS Monorepo with Nx 19, Angular 19 and NestJS"`
3. `git push -u origin main`

---
Desarrollado con ❤️ para el TPV 2026.

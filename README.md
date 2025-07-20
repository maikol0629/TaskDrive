# 📋 GestionTareas - Task Management System

Una aplicación moderna de gestión de tareas construida con **Next.js 15**, **Supabase**, y **TypeScript**. Refactorizada para aprovechar las capacidades completas de Next.js App Router con rutas dinámicas y middleware de protección.

## 🚀 **Características Principales**

### ✅ **Implementado:**
- 🔐 **Autenticación completa** (registro, login, logout) con middleware de protección
- 📝 **Gestión de tareas** (crear, editar, eliminar, cambiar estado)
- 📂 **Gestión de proyectos** (organizar tareas por proyectos) con rutas dinámicas
- 👤 **Perfiles de usuario** con información personalizada
- 🎨 **UI moderna** con Tailwind CSS y componentes atómicos
- 🔄 **Tiempo real** con Supabase Realtime
- 🛡️ **Seguridad** con Row Level Security (RLS) y middleware
- 🛣️ **Rutas dinámicas** para proyectos individuales
- 📱 **Navegación optimizada** con Next.js App Router

### 🔶 **En Desarrollo:**
- 👥 **Funcionalidad de equipos** (creación, invitaciones, colaboración)
- 🔔 **Sistema de notificaciones** en tiempo real
- 📊 **Dashboard de métricas** y estadísticas

## 🛠️ **Stack Tecnológico**

- **Frontend:** Next.js 15.3.3, React 19, TypeScript
- **Backend:** Supabase (PostgreSQL + Auth + Realtime)
- **Estilos:** Tailwind CSS 4.1.10
- **Iconos:** Lucide React
- **Arquitectura:** Atomic Design Pattern + App Router
- **Middleware:** Protección de rutas automática

## 📁 **Nueva Estructura del Proyecto**

```
src/
├── app/                          # App Router de Next.js
│   ├── (auth)/                   # Grupo de rutas de autenticación
│   │   ├── auth/
│   │   │   ├── layout.tsx       # Layout específico para auth
│   │   │   ├── login/page.tsx   # Página de login
│   │   │   └── register/page.tsx # Página de registro
│   ├── dashboard/               # Rutas protegidas del dashboard
│   │   ├── layout.tsx          # Layout con sidebar y header
│   │   ├── page.tsx            # Redirección a /tasks
│   │   ├── tasks/page.tsx      # Gestión de tareas personales
│   │   ├── projects/           # Gestión de proyectos
│   │   │   ├── page.tsx        # Lista de proyectos
│   │   │   └── [id]/page.tsx   # Detalle de proyecto dinámico
│   │   └── teams/page.tsx      # Equipos (placeholder)
│   ├── components/              # Componentes organizados por Atomic Design
│   │   ├── atoms/              # Componentes básicos
│   │   ├── molecules/          # Combinaciones de átomos
│   │   ├── organisms/          # Componentes complejos
│   │   └── templates/          # Layouts y plantillas
│   ├── api/                    # API Routes
│   └── globals.css            # Estilos globales
├── contexts/                   # React Contexts
├── utils/                     # Utilidades y configuraciones
├── types/                     # Tipos de TypeScript
└── middleware.ts              # Middleware de protección de rutas
```

## 🛣️ **Sistema de Rutas**

### **Rutas Públicas:**
- `/` - Redirección automática según estado de auth
- `/auth/login` - Página de inicio de sesión
- `/auth/register` - Página de registro

### **Rutas Protegidas (Dashboard):**
- `/dashboard` - Redirección a `/dashboard/tasks`
- `/dashboard/tasks` - Gestión de tareas personales
- `/dashboard/projects` - Lista de proyectos
- `/dashboard/projects/[id]` - Detalle de proyecto específico
- `/dashboard/teams` - Gestión de equipos (en desarrollo)

### **Protección Automática:**
- Middleware intercepta todas las rutas
- Redirección automática según estado de autenticación
- Session persistente con Supabase Auth Helpers

## 🚀 **Instalación y Configuración**

### **Prerrequisitos:**
- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

### **1. Clonar el repositorio:**
```bash
git clone <repository-url>
cd GestionTareas
```

### **2. Instalar dependencias:**
```bash
npm install
```

### **3. Configurar variables de entorno:**
Crear archivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### **4. Ejecutar en desarrollo:**
```bash
# Modo normal (recomendado)
npm run dev

# Con Turbopack (experimental, puede tener errores)
npm run dev:turbo
```

### **5. Verificar calidad del código:**
```bash
# Ejecutar linter
npm run lint

# Arreglar errores automáticamente
npm run lint:fix

# Verificar tipos
npm run type-check
```

## 📊 **Base de Datos (Supabase)**

### **Tablas principales:**
- `profiles` - Perfiles de usuario
- `Task` - Tareas individuales
- `project` - Proyectos
- `teams` - Equipos de trabajo
- `team_members` - Miembros de equipos
- `team_invitations` - Invitaciones a equipos

### **Características de seguridad:**
- ✅ Row Level Security (RLS) habilitado
- ✅ Políticas de acceso por usuario
- ✅ Autenticación JWT automática
- ✅ Middleware de protección en Next.js

## 🎯 **Navegación y UX**

### **Características mejoradas:**
- ✅ **Navegación nativa** con Next.js Link
- ✅ **URLs semánticas** para cada sección
- ✅ **Estado persistente** en la URL
- ✅ **Breadcrumbs automáticos** en proyectos
- ✅ **Carga optimizada** con layouts anidados
- ✅ **SEO friendly** con metadata dinámico

### **Flujo de usuario:**
1. **Landing** → Redirección automática según auth
2. **Login/Register** → Formularios dedicados
3. **Dashboard** → Layout persistente con sidebar
4. **Navegación** → URLs directas para cada sección
5. **Proyectos** → Vista lista + detalle con rutas dinámicas

## 🎨 **Mejoras en UI/UX**

### **Layout responsivo:**
- **Sidebar fijo** con navegación principal
- **Header dinámico** con título de sección
- **Contenido centrado** con márgenes optimizados
- **Estados de carga** unificados
- **Mensajes de error** consistentes

### **Componentes actualizados:**
- **NavItem** → Usa Next.js Link
- **Header** → Simplificado con solo título y logout
- **Sidebar** → Navegación basada en rutas
- **EmptyState** → Reutilizable para diferentes secciones

## 🔧 **Comandos disponibles:**
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Ejecutar build de producción
npm run lint         # Verificar código
npm run lint:fix     # Arreglar errores de lint
npm run type-check   # Verificar tipos TypeScript
```

## 🛡️ **Seguridad y Mejores Prácticas**

### **Implementadas:**
- ✅ **Middleware de autenticación** automático
- ✅ **Tipos TypeScript** estrictos con Supabase
- ✅ **Validación de rutas** y parámetros
- ✅ **Sanitización de datos** en formularios
- ✅ **Manejo de errores** robusto
- ✅ **Código organizado** por responsabilidades

## 🐛 **Problemas Solucionados**

### **Refactorización completada:**
- ✅ **Separación de responsabilidades** → Cada página maneja su estado
- ✅ **Navegación mejorada** → URLs directas y bookmarkeable
- ✅ **Performance optimizada** → Layouts anidados y carga selectiva
- ✅ **Código mantenible** → Componentes desacoplados
- ✅ **TypeScript completo** → Tipos seguros con Supabase

## 🔄 **Próximas Mejoras**

### **Corto plazo (1-2 semanas):**
- [ ] Completar funcionalidad de equipos con rutas dinámicas
- [ ] Sistema de notificaciones en tiempo real
- [ ] Mejorar tipos TypeScript pendientes
- [ ] Tests unitarios para componentes

### **Mediano plazo (1-2 meses):**
- [ ] Dashboard de métricas con gráficos
- [ ] Búsqueda y filtros avanzados
- [ ] Subida de archivos en proyectos
- [ ] Comentarios en tareas con tiempo real
- [ ] Tags y etiquetas con filtros

### **Largo plazo (3+ meses):**
- [ ] App móvil (React Native) con rutas compartidas
- [ ] Integraciones externas (Slack, Trello, etc.)
- [ ] Analytics avanzados y reportes
- [ ] API pública con documentación

## 📞 **Soporte**

Para reportar bugs o solicitar funcionalidades:
1. Crear issue en el repositorio
2. Incluir pasos para reproducir
3. Especificar entorno (navegador, OS, etc.)
4. Indicar ruta específica si es relevante

## 📄 **Licencia**

Este proyecto está bajo licencia MIT. Ver archivo `LICENSE` para más detalles.

---

**Desarrollado con ❤️ usando Next.js 15, App Router y Supabase**

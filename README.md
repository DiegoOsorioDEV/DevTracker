# 📊 DevTracker

**Gestor de tareas empresarial - Planifica, Asigna y Visualiza tu flujo de trabajo**

DevTracker es una plataforma web completa para la gestión integral de proyectos y tareas. Diseñada para equipos de trabajo empresarial, permite programar tareas, asignarlas a miembros del equipo, marcar su estado de avance y visualizar el progreso en tiempo real.

---

## 🌟 Características Principales

- 📅 **Programación de Tareas** - Agenda tareas con fechas, horas y prioridades
- ✅ **Seguimiento de Estado** - Marca tareas como completadas, en progreso o pendientes
- 👥 **Asignación de Equipo** - Asigna tareas a miembros del equipo específicos
- 📊 **Dashboard Visual** - Visualiza el estado de todos tus proyectos en tiempo real
- 🎯 **Gestión de Proyectos** - Organiza tareas por proyectos y sprints
- 📈 **Reportes y Métricas** - Analiza productividad y avance del equipo
- 🔔 **Notificaciones** - Recibe alertas sobre cambios en tus tareas
- 🔐 **Control de Acceso** - Permisos y roles configurables
- 💬 **Colaboración** - Comenta y colabora en tareas
- 🎨 **Interfaz Intuitiva** - Diseño moderno y fácil de usar

---

## 🛠️ Stack Tecnológico

### Backend
| Tecnología | Descripción |
|-----------|------------|
| **Laravel** | Framework PHP moderno y robusto |
| **PHP** | Lenguaje de servidor |
| **MySQL/PostgreSQL** | Base de datos relacional |
| **API REST** | Endpoints para integración |

### Frontend
| Tecnología | Descripción |
|-----------|------------|
| **React** | Librería UI moderna |
| **Inertia.js** | Conecta React con Laravel |
| **Tailwind CSS** | Estilos y diseño responsivo |
| **Vite** | Bundler y dev server rápido |

### Complementos
- **Headless UI** - Componentes accesibles
- **Drag & Drop** - Interfaz intuitiva (@hello-pangea/dnd)

---

## 📋 Requisitos Previos

- PHP >= 8.1
- Composer
- Node.js >= 18.x
- npm o yarn
- Base de datos (MySQL o PostgreSQL)

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/DiegoOsorioDEV/DevTracker.git
cd DevTracker
```

### 2. Configurar Backend (Laravel)

```bash
# Instalar dependencias PHP
composer install

# Copiar archivo de configuración
cp .env.example .env

# Generar clave de aplicación
php artisan key:generate

# Ejecutar migraciones
php artisan migrate

# Crear enlace de almacenamiento (si es necesario)
php artisan storage:link
```

### 3. Configurar Frontend (React)

```bash
# Instalar dependencias Node
npm install

# Compilar assets
npm run dev
```

### 4. Variables de Entorno

Configura el archivo `.env`:

```env
APP_NAME=DevTracker
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=devtracker
DB_USERNAME=root
DB_PASSWORD=

VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 💻 Scripts Disponibles

### Backend
```bash
# Servidor de desarrollo
php artisan serve

# Ejecutar migraciones
php artisan migrate

# Crear datos de prueba
php artisan db:seed

# Ejecutar tests
php artisan test

# Caché de configuración
php artisan config:cache
```

### Frontend
```bash
# Servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview
```

---

## 📚 Funcionalidades Principales

### Gestión de Tareas
- ✅ Crear, editar y eliminar tareas
- 📅 Establecer fechas de inicio y vencimiento
- 🏷️ Asignar prioridades (Baja, Media, Alta, Crítica)
- 👤 Asignar a miembros del equipo
- 📝 Agregar descripción y comentarios

### Estados de Tareas
- **Pendiente** - Tarea no iniciada
- **En Progreso** - Tarea en curso
- **Completada** - Tarea finalizada
- **En Revisión** - Esperando aprobación
- **Bloqueada** - Tarea impedida

### Visualización
- 📋 Vista de Lista
- 📊 Vista de Tablero (Kanban)
- 📅 Vista de Calendario
- 📈 Gráficos de Progreso

### Colaboración
- 💬 Comentarios en tareas
- 👥 Mención de compañeros
- 📎 Adjuntar archivos
- 🔔 Notificaciones en tiempo real

---

## 🏗️ Estructura del Proyecto

```
DevTracker/
├── app/                      # Código PHP/Laravel
│   ├── Http/Controllers/     # Controladores
│   ├── Models/              # Modelos Eloquent
│   ├── Resources/           # API Resources
│   └── Requests/            # Form Requests
├── resources/               # Recursos frontend
│   ├── js/                  # Componentes React
│   ├── css/                 # Estilos
│   └── views/               # Vistas blade
├── database/                # Migraciones y seeders
│   ├── migrations/
│   └── seeders/
├── routes/                  # Rutas de la aplicación
│   ├── web.php             # Rutas web
│   └── api.php             # Rutas API
├── public/                  # Archivos públicos
├── vite.config.js          # Configuración Vite
├── tailwind.config.js      # Configuración Tailwind
└── package.json            # Dependencias Node
```

---

## 🧪 Testing

```bash
# Ejecutar todos los tests
php artisan test

# Tests específicos
php artisan test --filter=TaskTest

# Coverage de tests
php artisan test --coverage
```

---

## 📖 API Endpoints

### Tareas
- `GET /api/tasks` - Listar tareas
- `POST /api/tasks` - Crear tarea
- `GET /api/tasks/:id` - Obtener tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea
- `PATCH /api/tasks/:id/status` - Cambiar estado

### Proyectos
- `GET /api/projects` - Listar proyectos
- `POST /api/projects` - Crear proyecto
- `GET /api/projects/:id` - Obtener proyecto
- `PUT /api/projects/:id` - Actualizar proyecto

### Usuarios
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario

### Reportes
- `GET /api/reports/dashboard` - Dashboard general
- `GET /api/reports/progress` - Progreso de tareas
- `GET /api/reports/team-metrics` - Métricas del equipo

---

## 🔒 Seguridad

- Autenticación Laravel Sanctum
- CSRF protection
- SQL Injection prevention
- XSS protection
- Rate limiting
- Validación de entrada

---

## 🎨 Características UI/UX

- **Responsive Design** - Funciona en desktop, tablet y móvil
- **Drag & Drop** - Mueve tareas entre estados fácilmente
- **Componentes Reutilizables** - Código limpio y mantenible
- **Tema Personalizable** - Adapta colores a tu marca
- **Accesibilidad** - Cumple estándares WCAG

---

## 📦 Dependencias Principales

### Backend
```
laravel/framework
laravel/sanctum
laravel/tinker
laravel/pint
```

### Frontend
```
react@18.2.0
@inertiajs/react
tailwindcss
vite
@hello-pangea/dnd
```

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la licencia MIT.

---

## 👨‍💻 Autor

**Diego Osorio**
- GitHub: [@DiegoOsorioDEV](https://github.com/DiegoOsorioDEV)

---

## 🙏 Agradecimientos

- [Laravel](https://laravel.com/) - Framework excepcional
- [React](https://react.dev/) - Librería UI moderna
- [Tailwind CSS](https://tailwindcss.com/) - Estilos eficientes
- [Inertia.js](https://inertiajs.com/) - Conectando backends y frontends

---

## 💡 Roadmap Futuro

- [ ] Integración con Google Calendar
- [ ] Exportar reportes (PDF, Excel)
- [ ] Aplicación móvil nativa
- [ ] Integraciones con Slack/Teams
- [ ] Time tracking automático
- [ ] Análisis de productividad IA
- [ ] Automatización de workflows
- [ ] Sistema de webhooks

---

## 📞 Soporte

Si tienes preguntas o encuentras problemas:
- Abre un [issue](https://github.com/DiegoOsorioDEV/DevTracker/issues)
- Contacta directamente al desarrollador

---

**⭐ Si este proyecto te fue útil, por favor considera darle una estrella en GitHub!**

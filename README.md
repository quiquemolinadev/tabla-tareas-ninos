# 📋 Sistema de Seguimiento de Tareas para Niños

Una aplicación web sencilla, rápida y funcional para tracking de tareas diarias con indicadores visuales y persistencia de datos.

## 🎯 Características

✅ **Seguimiento visual** - Círculos de colores para cada día de la semana
- 🟢 Verde (completo): 1 punto
- 🟡 Amarillo (parcial): 0.5 puntos
- 🔴 Rojo (no completado): 0 puntos

✅ **Multi-usuario** - Crear perfiles para múltiples niños

✅ **Estadísticas automáticas**
- Contador semanal
- Acumulado mensual
- Acumulado anual
- Porcentajes de logro

✅ **Persistencia** - Datos guardados en LocalStorage

✅ **Importar/Exportar** - Backup y restauración de datos en JSON

✅ **Responsive** - Funciona en móvil, tablet y desktop

✅ **Sin dependencias** - HTML, CSS y JavaScript vanilla

## 🚀 Cómo usar

### Desarrollo local

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/tabla-tareas-ninos.git
cd tabla-tareas-ninos
```

2. Inicia un servidor local:
```bash
# Con Python 3
python -m http.server 8000

# O con Node.js/npm
npx http-server
```

3. Abre `http://localhost:8000` en tu navegador

### Primer uso

1. Ingresa el nombre del niño/a
2. Haz clic en "Entrar"
3. Haz clic en "+ Agregar tarea" para crear tareas
4. Haz clic en los círculos para cambiar el estado (gris → amarillo → verde → gris)
5. Los datos se guardan automáticamente

## 📊 Sistema de Puntos

- **Verde**: 1 punto (tarea completada)
- **Amarillo**: 0.5 puntos (tarea parcial)
- **Gris**: 0 puntos (no completada)

## 💾 Almacenamiento de Datos

Los datos se almacenan en el LocalStorage de tu navegador. Cada usuario tiene:
- Nombre
- Lista de tareas
- Estados de cada tarea por semana
- Fechas de creación

## 📁 Estructura del Proyecto

```
tabla-tareas-ninos/
├── index.html          # Estructura HTML
├── css/
│   └── styles.css      # Estilos CSS minimalistas
├── js/
│   ├── app.js          # Lógica principal
│   ├── storage.js      # Persistencia de datos
│   └── calculations.js # Cálculos de totales
├── README.md           # Este archivo
└── .gitignore          # Archivos ignorados por Git
```

## 🛠️ Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Estilos responsive con Grid y Flexbox
- **JavaScript Vanilla** - Sin frameworks
- **LocalStorage API** - Persistencia local

## 🌐 Hosting

### GitHub Pages (Recomendado)

1. Crea un repositorio público en GitHub
2. Sube los archivos
3. Ve a Settings > Pages > Source: Main branch
4. Tu sitio estará disponible en: `https://tu-usuario.github.io/tabla-tareas-ninos`

### Otras opciones

- **Netlify**: Deploy automático desde Git
- **Vercel**: Excelente para proyectos frontend
- **Cloudflare Pages**: CDN global incluido

## 📝 Notas

- Los datos se guardan en LocalStorage del navegador
- Se recomienda exportar datos regularmente como backup
- Cada usuario puede tener sus propias tareas
- Los estados se reinician cada lunes

## 📄 Licencia

Libre para usar y modificar.

## ✨ Mejoras futuras

- [ ] Temas oscuro/claro
- [ ] Notificaciones push
- [ ] Sincronización en la nube
- [ ] Reportes PDF
- [ ] Integración con calendarios
- [ ] Sistema de recompensas

---

Hecho con ❤️ para hacer el seguimiento de tareas más divertido

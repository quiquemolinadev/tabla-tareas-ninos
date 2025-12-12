# 🚀 Guía de Deployment a GitHub Pages

## Paso 1: Preparar tu repositorio Git

```bash
cd tabla-tareas-ninos
git init
git add .
git commit -m "Initial commit: Sistema de seguimiento de tareas infantiles"
```

## Paso 2: Crear un repositorio en GitHub

1. Ve a [github.com](https://github.com) y inicia sesión
2. Haz clic en "New" para crear un nuevo repositorio
3. Nombra el repositorio: `tabla-tareas-ninos`
4. Elige "Public" (importante para GitHub Pages)
5. NO inicialices con README (ya tienes uno)
6. Haz clic en "Create repository"

## Paso 3: Conectar tu repositorio local con GitHub

Copia y ejecuta estos comandos (reemplaza TU-USUARIO con tu nombre de usuario GitHub):

```bash
git branch -M main
git remote add origin https://github.com/TU-USUARIO/tabla-tareas-ninos.git
git push -u origin main
```

## Paso 4: Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Haz clic en "Settings" (arriba a la derecha)
3. En el menú izquierdo, haz clic en "Pages"
4. En "Source", selecciona "Deploy from a branch"
5. Selecciona "main" como rama
6. Haz clic en "Save"

## Paso 5: Esperar a que se despliegue

- GitHub Pages tardará unos segundos en desplegar
- Tu sitio estará disponible en: `https://TU-USUARIO.github.io/tabla-tareas-ninos`

## Para futuros cambios

Cada vez que hagas cambios locales:

```bash
git add .
git commit -m "Descripción del cambio"
git push
```

Los cambios se desplegarán automáticamente en GitHub Pages.

## Troubleshooting

### El sitio dice "404"
- Espera 1-2 minutos a que GitHub Pages termine de desplegar
- Recarga la página (Ctrl + F5 o Cmd + Shift + R)

### Los estilos o JavaScript no cargan
- Asegúrate de que los archivos están en el repositorio (`git status`)
- Los paths en index.html deben ser relativos:
  - ✅ Correcto: `href="css/styles.css"`
  - ❌ Incorrecto: `href="/css/styles.css"` o `href="C:/..."`

### Los datos no se guardan
- LocalStorage solo funciona con HTTPS en GitHub Pages
- Si ves errores en la consola, comprueba la sección "Security" de DevTools

## Alternativas de Hosting

Si no quieres usar GitHub Pages:

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Vercel
```bash
npm install -g vercel
vercel
```

### Cloudflare Pages
1. Conecta tu repositorio de GitHub
2. Selecciona el branch a desplegar
3. Haz clic en "Save and Deploy"

---

¡Listo! Tu aplicación debería estar disponible públicamente ahora.

# 🚀 Guía de Deployment - GitHub Actions + Secrets

## 📦 Instalación Local

1. **Clona el repositorio**
```bash
git clone https://github.com/TU_USUARIO/tabla_tareas_ninos.git
cd tabla_tareas_ninos
```

2. **Configura Firebase localmente**
   - Copia `js/config.example.js` a `js/config.js`
   - Abre `js/config.js` y reemplaza con tus credenciales de Firebase

3. **Inicia un servidor local**
```bash
python -m http.server 8000
```

---

## 🚀 Despliegue a GitHub Pages con CI/CD

### Paso 1: Configura GitHub Secrets

1. Ve a tu repositorio en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Crea estos **New repository secret**:

```
FIREBASE_API_KEY = Tu API Key
FIREBASE_AUTH_DOMAIN = tu-proyecto.firebaseapp.com
FIREBASE_DATABASE_URL = https://tu-proyecto.firebasedatabase.app
FIREBASE_PROJECT_ID = tu-proyecto
FIREBASE_STORAGE_BUCKET = tu-proyecto.appspot.com
FIREBASE_MESSAGING_SENDER_ID = Tu Messaging ID
FIREBASE_APP_ID = Tu App ID
```

**¿Dónde obtener estos valores?**
- Ve a [Firebase Console](https://console.firebase.google.com/)
- Abre tu proyecto → Settings (⚙️) → Project Settings
- Copia cada valor

### Paso 2: Habilita GitHub Pages

1. Ve a **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `gh-pages` (será creada automáticamente)
4. Click **Save**

### Paso 3: Deploy automático

```bash
git push origin main
```

**El workflow hace automáticamente:**
1. ✅ Checkoutea el código
2. ✅ Genera `js/config.js` con tus Secrets
3. ✅ Despliega a GitHub Pages

**Tu app estará en:** `https://TU_USUARIO.github.io/tabla_tareas_ninos`

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

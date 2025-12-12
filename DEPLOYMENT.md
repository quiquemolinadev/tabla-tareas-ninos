# 🚀 Guía de Deployment - GitHub Pages + Firebase Seguro

## 📦 Instalación Local

1. **Clona el repositorio**
```bash
git clone https://github.com/TU_USUARIO/tabla_tareas_ninos.git
cd tabla_tareas_ninos
```

2. **Configura Firebase localmente**
```bash
# Copia la plantilla
cp js/config.example.js js/config.js

# Edita con tus credenciales (incluida la NUEVA API Key)
nano js/config.js
```

3. **Inicia un servidor local**
```bash
python -m http.server 8000
```

4. **Abre en el navegador**
```
http://localhost:8000
```

---

## 🚀 Despliegue a GitHub Pages (AUTOMÁTICO + SEGURO)

### Paso 1: Obten una NUEVA API Key (IMPORTANTE)

**⚠️ La clave anterior fue detectada. Debes crear una nueva:**

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. APIs & Services → Credentials
4. **Elimina** la clave expuesta
5. Click **+ CREATE CREDENTIALS** → **API Key**
6. Copia la NUEVA clave

Ver [NUEVO_API_KEY.md](NUEVO_API_KEY.md) para detalles.

### Paso 2: Configura GitHub Pages para Actions

⚠️ **IMPORTANTE - PASO FÁCIL DE OLVIDAR**

1. Ve a tu repositorio en GitHub
2. **Settings** → **Pages**
3. En **Source**, selecciona: **GitHub Actions**
4. Click **Save**

Esto permite que el workflow tenga permisos para desplegar.

### Paso 3: Configura GitHub Secrets (NUEVA clave)

1. Ve a tu repositorio en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Edita `FIREBASE_API_KEY` (o crea si no existe)
4. Pega la **NUEVA** clave
5. Click **Update secret** (o Create)

**Los otros 6 secrets:**
```
FIREBASE_AUTH_DOMAIN = tabla-tareas-ninos-ce4fb.firebaseapp.com
FIREBASE_DATABASE_URL = https://tabla-tareas-ninos-ce4fb-default-rtdb.europe-west1.firebasedatabase.app
FIREBASE_PROJECT_ID = tabla-tareas-ninos-ce4fb
FIREBASE_STORAGE_BUCKET = tabla-tareas-ninos-ce4fb.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID = 220910312742
FIREBASE_APP_ID = 1:220910312742:web:42741944dd7491ee2375e7
```

### Paso 3: Deploy automático

```bash
git add .
git commit -m "Usar nueva API Key con GitHub Actions"
git push origin main
```

### Paso 4: Verifica en GitHub Actions

1. Ve a tu repositorio → **Actions**
2. Deberías ver "Deploy to GitHub Pages" ejecutándose
3. Espera a que termine (verde ✅)

### Paso 5: Configura Firebase Security Rules

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Tu proyecto → **Realtime Database** → **Rules**
3. Reemplaza con esto:

```json
{
  "rules": {
    "usuarios": {
      "$uid": {
        ".read": "auth.uid === $uid",
        ".write": "auth.uid === $uid"
      }
    }
  }
}
```

4. Click **Publish**

### Paso 6: Tu app está en vivo

```
https://TU_USUARIO.github.io/tabla_tareas_ninos
```

---

## 🔒 Cómo está protegida

✅ **API Key NO está en el código** - Solo en GitHub Secrets (cifrados)
✅ **GitHub Actions genera config.js** - Pero no lo publica
✅ **Firebase Security Rules** - Protege los datos
✅ **Validación en cliente** - Código funcional

---

## 🐛 Solución de problemas

**Error: "Firebase no está disponible"**
- Asegúrate de que config.js existe (Actions debe haberlo generado)
- Verifica que los Secrets están creados correctamente
- Abre consola (F12) y busca errores

**Error: "FIREBASE_CONFIG no encontrado"**
- En local: asegúrate de haber copiado config.example.js a config.js
- En Pages: asegúrate de que los 7 GitHub Secrets están creados

**El sitio sigue sin actualizarse**
- Limpia cache del navegador (Ctrl+Shift+Delete)
- Espera 2 minutos para que Pages se actualice
- Verifica que el workflow está en verde

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

# 🚀 Guía de Deployment - GitHub Pages + Firebase Seguro

## 📦 Instalación Local

1. **Clona el repositorio**
```bash
git clone https://github.com/TU_USUARIO/tabla_tareas_ninos.git
cd tabla_tareas_ninos
```

2. **Inicia un servidor local**
```bash
python -m http.server 8000
```

3. **Abre en el navegador**
```
http://localhost:8000
```

---

## 🚀 Despliegue a GitHub Pages (AUTOMÁTICO)

### Paso 1: Haz push a GitHub

```bash
git add .
git commit -m "Desplegar aplicación"
git push origin main
```

### Paso 2: Verifica que el workflow se ejecutó

1. Ve a tu repositorio en GitHub
2. Click en **Actions**
3. Deberías ver "Deploy to GitHub Pages" en **verde ✅**
4. Espera 1-2 minutos

### Paso 3: Configura Firebase Security Rules

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Abre tu proyecto → **Realtime Database** → **Rules**
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

4. Click en **Publish**

### Paso 4: Tu app está en vivo

```
https://TU_USUARIO.github.io/tabla_tareas_ninos
```

---

## 🔒 Seguridad

✅ **Credenciales públicas** (apiKey está en navegador, es normal)
✅ **Firebase Security Rules** (protege los datos)
⏳ **Sin Authentication aún** (cualquiera puede escribir con cualquier ID)

Para máxima seguridad:
- Ver [FIREBASE_SECURITY_RULES.md](FIREBASE_SECURITY_RULES.md)
- Implementar Firebase Authentication (próxima fase)

---

## 🐛 Solución de problemas

**Error: "Firebase no está disponible"**
- Recarga la página (F5)
- Verifica que no hay bloqueadores de publicidad

**Error: "No se puede guardar en Firebase"**
- Abre consola (F12)
- Verifica que ves: "✅ Firebase inicializado correctamente"
- Si no, asegúrate de que Firebase está alcanzable (sin VPN)

**La app dice "Datos sincronizados" pero no los veo**
- Es normal si no tienes Authentication aún
- Los datos se guardan pero cualquiera puede verlos
- Implementa Security Rules (Paso 3) para restringir acceso

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

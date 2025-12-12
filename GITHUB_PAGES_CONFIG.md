# GitHub Pages - Configuración Segura

## ¿Cómo está protegida tu app?

### ✅ Credenciales NO están en el código

- **NO** hay secretos hard-codeados en firebase.js
- **SÍ** vienen de GitHub Secrets (cifrados)
- GitHub Actions las inyecta en tiempo de build
- El código deployado NO contiene las credenciales

### ✅ Lo que las protege:

1. **GitHub Secrets** - Credenciales cifradas (no visibles)
2. **Firebase Security Rules** - Controlan quién puede leer/escribir
3. **Firebase Authentication** (próximamente) - Usuarios deben loguear

## Configuración paso a paso

### Paso 1: Obten una NUEVA API Key

Tu clave anterior fue detectada por GitHub. Necesitas una nueva:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials
3. Elimina la clave expuesta
4. Click **+ CREATE CREDENTIALS** → **API Key**
5. Copia la nueva clave

Ver [NUEVO_API_KEY.md](NUEVO_API_KEY.md) para detalles completos.

### Paso 2: Configura GitHub Secrets (con la NUEVA clave)

1. Ve a tu repositorio en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Crea/edita estos 7 secrets:

```
FIREBASE_API_KEY = [NUEVA CLAVE AQUÍ]
FIREBASE_AUTH_DOMAIN = tabla-tareas-ninos-ce4fb.firebaseapp.com
FIREBASE_DATABASE_URL = https://tabla-tareas-ninos-ce4fb-default-rtdb.europe-west1.firebasedatabase.app
FIREBASE_PROJECT_ID = tabla-tareas-ninos-ce4fb
FIREBASE_STORAGE_BUCKET = tabla-tareas-ninos-ce4fb.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID = 220910312742
FIREBASE_APP_ID = 1:220910312742:web:42741944dd7491ee2375e7
```

### Paso 3: Haz push a GitHub

```bash
git add .
git commit -m "Configurar con nueva API Key segura"
git push origin main
```

**GitHub Actions automáticamente:**
1. Lee los Secrets
2. Genera `js/config.js` (con las credenciales)
3. Lo usa en el build
4. **NO lo publica** en Pages (está en exclude_assets)

### Paso 4: Configura Firebase Security Rules

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Tu proyecto → **Realtime Database** → **Rules**
3. Reemplaza todo con:

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

### Paso 5: Tu app está segura

- Abre: https://TU_USUARIO.github.io/tabla_tareas_ninos
- Los datos se sincronizan con Firebase
- Las credenciales NO están visibles en el código

## ¿Por qué GitHub detectó la clave anterior?

GitHub tiene detección automática de secretos. Aunque Firebase apiKey es "técnicamente pública", ponerla hard-coded en un repositorio público activa alertas.

**La solución correcta (que ahora tienes):**
- Usar GitHub Secrets + GitHub Actions
- Inyectar en tiempo de build
- NO publicar config.js en Pages
- El código nunca contiene secretos

## Resumen de seguridad

| Componente | Estado | Detalles |
|-----------|--------|----------|
| API Key | ✅ Seguro | En GitHub Secrets, NO en código |
| config.js | ✅ Seguro | Generado en build, NO publicado |
| Security Rules | ✅ Configurado | Cada usuario ve solo sus datos |
| Authentication | ⏳ Pendiente | Próxima fase (opcional) |

Tu app está listo para producción.


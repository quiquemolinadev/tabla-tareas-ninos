# GitHub Pages - Configuración Automática

Las credenciales de Firebase se inyectan automáticamente mediante **GitHub Actions** durante el despliegue.

## ¿Cómo funciona?

1. **Guardas tus credenciales en GitHub Secrets** (cifradas)
2. **GitHub Actions las lee durante el build**
3. **Genera `js/config.js` automáticamente**
4. **Despliega a GitHub Pages sin exponer credenciales**

## Configuración (Una sola vez)

### 1. Añade tus credenciales como Secrets

Ve a tu repositorio:
- **Settings** → **Secrets and variables** → **Actions**
- Click **New repository secret**

Añade estos 7 secrets:

```
FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN
FIREBASE_DATABASE_URL
FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET
FIREBASE_MESSAGING_SENDER_ID
FIREBASE_APP_ID
```

### 2. Habilita GitHub Pages

- **Settings** → **Pages**
- Source: **Deploy from a branch**
- Branch: `gh-pages`

### 3. Haz un push

```bash
git push origin main
```

¡Listo! El workflow automático hace el resto.

## 🔒 Seguridad

✅ Las credenciales **NUNCA** se suben a GitHub
✅ Solo existen en Secrets (cifradas por GitHub)
✅ Se inyectan solo en tiempo de build

## 📋 Flujo CI/CD

```
Tu push → GitHub Actions →
  1. Checkout código
  2. Lee Secrets de GitHub
  3. Genera js/config.js
  4. Deploya a Pages
```


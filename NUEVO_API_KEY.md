# ¿Cómo obtener una NUEVA API Key de Firebase?

## Paso 1: Revoca la clave expuesta (INMEDIATAMENTE)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. APIs & Services → Credentials
4. Busca y elimina la API Key que GitHub detectó

## Paso 2: Crea una NUEVA API Key

1. En Google Cloud Console, mismo sitio
2. Click en **+ CREATE CREDENTIALS**
3. Selecciona **API Key**
4. Copia la nueva clave

## Paso 3: Actualiza GitHub Secrets

1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Edita el secret `FIREBASE_API_KEY`
4. Pega la NUEVA clave
5. Click Update secret

## Paso 4: Actualiza tu config.js local (para desarrollo)

```bash
# Edita js/config.js
# Busca: apiKey: "VIEJA_CLAVE"
# Reemplaza con: apiKey: "NUEVA_CLAVE"
```

## Paso 5: Haz push con los cambios

```bash
git add .
git commit -m "Refactor: Usar nueva API Key segura con GitHub Actions"
git push origin main
```

¡Listo! El workflow creará `config.js` con la nueva clave en tiempo de build, pero NO lo publicará en Pages.

## ¿Por qué GitHub detectó la clave anterior?

GitHub tiene un sistema automático que detecta secretos en repositorios públicos. Aunque las credenciales de Firebase "son públicas por naturaleza", ponerlas hard-coded en un repositorio público activa estas alertas.

**Solución correcta:**
- Nunca hard-codear secretos en código
- Siempre usar Variables de Entorno o GitHub Secrets
- GitHub Actions las inyecta en tiempo de build
- El código deployado no contiene los secretos

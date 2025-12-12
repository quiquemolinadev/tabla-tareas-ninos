# GitHub Pages - Configuración Segura

## ¿Cómo está protegida tu app?

### ✅ Las credenciales de Firebase son públicas (y está bien)

La `apiKey` está visible en:
- El código fuente
- DevTools del navegador
- Cualquier persona que inspeccione

**Esto es normal y esperado en aplicaciones web.**

### ✅ Lo que las protege:

1. **Firebase Security Rules** - Controlan quién puede leer/escribir
2. **Firebase Authentication** (próximamente) - Usuarios deben loguear
3. **Validación en backend** (opcional) - Cloud Functions

## Configuración paso a paso

### Paso 1: Deploy automático ✅
Ya está configurado. Solo haz `git push origin main`.

### Paso 2: Configura Firebase Rules (IMPORTANTE) ⏳

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

Ver [FIREBASE_SECURITY_RULES.md](FIREBASE_SECURITY_RULES.md) para más detalles.

### Paso 3: Tu app está segura ✅

Con las reglas de arriba:
- Cada usuario solo ve sus propios datos
- Cada usuario solo puede escribir sus propios datos
- Cualquiera en el mundo puede intentar acceder, pero Firebase los bloquea

## Sin Authentication (estado actual)

Por ahora, tu app funciona sin Firebase Authentication:
- ✅ Los datos se sincronizan
- ✅ Las Security Rules los protegen
- ⏳ Sin auth real, pero funcional

Si quieres máxima seguridad, implementar Authentication es el siguiente paso.


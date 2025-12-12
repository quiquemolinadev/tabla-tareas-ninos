# Firebase Security Rules - Protegiendo tu Base de Datos

## ¿Por qué necesitas Security Rules?

Las credenciales de Firebase API Key son **públicas** (están en el navegador). Lo que las protege es:

1. **Firebase Authentication** - Usuarios deben loguear
2. **Security Rules** - Restricciones sobre quién puede leer/escribir qué datos

Sin reglas, cualquiera podría:
- Leer todos los datos de todos los usuarios
- Modificar tareas ajenas
- Borrar datos

## Cómo aplicar las reglas

### Paso 1: Ve a Firebase Console
1. https://console.firebase.google.com/
2. Abre tu proyecto
3. **Realtime Database** → **Rules**

### Paso 2: Reemplaza las reglas con esto:

```json
{
  "rules": {
    "usuarios": {
      "$uid": {
        // Cada usuario solo puede ver sus propios datos
        ".read": "auth.uid === $uid",
        // Cada usuario solo puede escribir en sus propios datos
        ".write": "auth.uid === $uid"
      }
    }
  }
}
```

### Paso 3: Click en "Publish"

## ¿Cómo funciona?

```
Usuario A intenta leer datos de Usuario B
           ↓
Firebase verifica: auth.uid (Usuario A) === $uid (Usuario B)?
           ↓
         NO → Acceso denegado ❌

Usuario A intenta leer SUS PROPIOS datos
           ↓
Firebase verifica: auth.uid (Usuario A) === $uid (Usuario A)?
           ↓
         SÍ → Acceso permitido ✅
```

## ¿Y si necesito reglas más complejas?

Ejemplos adicionales que podrías usar:

### Todos los datos son públicos de lectura (pero protegidos de escritura)
```json
{
  "rules": {
    "usuarios": {
      "$uid": {
        ".read": true,
        ".write": "auth.uid === $uid"
      }
    }
  }
}
```

### Permitir que root vea todos los datos
```json
{
  "rules": {
    "usuarios": {
      "$uid": {
        ".read": "auth.uid === $uid || auth.uid === 'usuario-root'",
        ".write": "auth.uid === $uid"
      }
    }
  }
}
```

### Solo lectura (sin escritura desde cliente)
```json
{
  "rules": {
    "usuarios": {
      ".read": true,
      ".write": false
    }
  }
}
```

## ⚠️ Importante

**Estado de Testing**
- En Firebase Console, verás una advertencia:
  > "Your security rules are defined as public, so anyone can read and write to your database."

- Esto es temporal si tienes reglas débiles.
- Con las reglas de arriba, está **seguro**.
- Pero asegúrate de tener **Firebase Authentication** implementado en tu app.

## Estado actual de tu app

Tu app usa:
- ✅ Credenciales públicas de Firebase (correcto)
- ✅ Base de datos Realtime Database (bien)
- ⏳ **PENDIENTE:** Implementar Authentication (login seguro)
- ⏳ **PENDIENTE:** Aplicar Security Rules (acceso restringido)

Por ahora, sin Authentication, los datos están públicos pero funcionales.

## Próximos pasos (opcional)

Para máxima seguridad:
1. Implementar Firebase Authentication (Google, Email, etc)
2. Guardar UID del usuario autenticado
3. Aplicar las Security Rules de arriba
4. Backend que valide datos (Cloud Functions)

¿Necesitas ayuda con alguno de estos pasos?

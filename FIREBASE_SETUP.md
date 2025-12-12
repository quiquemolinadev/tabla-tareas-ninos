# 🔥 Configuración de Firebase

## Pasos para habilitar sincronización en la nube

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear proyecto"
3. Nombre: `tabla-tareas-ninos`
4. Continúa (sin necesidad de Google Analytics)

### 2. Agregar Realtime Database

1. En el panel izquierdo, ve a **Build > Realtime Database**
2. Haz clic en "Crear base de datos"
3. Ubicación: `us-central1` (o la más cercana)
4. Modo de seguridad: **Prueba**
5. Crear

### 3. Obtener Credenciales

1. Ve a **Configuración del proyecto** (⚙️ arriba a la izquierda)
2. Selecciona tu app o crea una si es necesario
3. En "Apps", selecciona **Aplicación web** (`</>`)
4. Copia el objeto `firebaseConfig`

### 4. Actualizar firebase.js

En `js/firebase.js`, reemplaza:

```javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "TU_MESSAGING_ID",
    appId: "TU_APP_ID"
};
```

Con tus credenciales reales.

### 5. Habilitar Firebase en index.html

En `index.html`, descomenta estas líneas:

```html
<!-- Firebase (comentado hasta que configures tus credenciales) -->
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js" defer></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js" defer></script>
<script src="js/firebase.js" defer></script>
```

### 6. Configurar Reglas de Seguridad (Importante)

En **Realtime Database > Reglas**, reemplaza con:

```json
{
  "rules": {
    "usuarios": {
      "$uid": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

⚠️ **NOTA IMPORTANTE:** Estas reglas son solo para desarrollo. Para producción, implementa autenticación real.

### 7. Prueba

1. Recarga la aplicación (Ctrl+F5)
2. Inicia sesión
3. Agrega tareas
4. Cierra sesión - los datos se guardarán en Firebase
5. Abre sesión nuevamente - los datos se cargarán desde Firebase

## Flujo de Sincronización

```
LOGIN:
┌─────────────────┐
│  Ingresa PIN    │
└────────┬────────┘
         │
┌────────▼────────┐
│ Verifica PIN    │
└────────┬────────┘
         │
┌────────▼──────────────────┐
│ Carga datos de Firebase   │
└────────┬──────────────────┘
         │
┌────────▼──────────────────┐
│ Actualiza localStorage    │
└────────┬──────────────────┘
         │
┌────────▼───────────┐
│ Muestra Dashboard  │
└────────────────────┘

LOGOUT:
┌───────────────────┐
│  Clic Cerrar      │
│  Sesión           │
└────────┬──────────┘
         │
┌────────▼──────────────────┐
│ Guarda datos en Firebase  │
└────────┬──────────────────┘
         │
┌────────▼──────────────────┐
│ Limpia localStorage       │
└────────┬──────────────────┘
         │
┌────────▼──────────┐
│ Muestra Login     │
└───────────────────┘
```

## Características Habilitadas

✅ **Sincronización en Cloud** - Datos guardados en Firebase
✅ **Multi-dispositivo** - Los datos se sincronizan entre dispositivos
✅ **Offline** - Funciona aunque no haya internet (usa localStorage)
✅ **Gratis** - Incluido en el plan gratuito de Firebase

## Solución de Problemas

### "CloudSync is not defined"
- Verifica que firebase.js esté descomentado en index.html

### "Datos no se sincronizan"
- Comprueba que las credenciales sean correctas en firebase.js
- Verifica que la Realtime Database esté creada
- Revisa la consola (F12) para ver errores

### "Error al guardar"
- Verifica tu conexión a internet
- Revisa las reglas de seguridad en Firebase Console

## Próximos Pasos

- [ ] Implementar autenticación real (no solo PIN)
- [ ] Agregar encriptación de datos
- [ ] Implementar sincronización en tiempo real
- [ ] Agregar backups automáticos

---

¿Necesitas ayuda? Revisa la [documentación oficial de Firebase](https://firebase.google.com/docs/database)

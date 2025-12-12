/* ============================================
   CONFIG.EXAMPLE.JS - Plantilla de Configuración
   ============================================
   
   ⚠️ NOTA IMPORTANTE sobre SEGURIDAD:
   
   Las credenciales de Firebase API Key son PÚBLICAS.
   No es un secreto. Está permitido compartirlas.
   
   Lo que las protege es:
   1. Firebase Authentication (usuarios deben loguear)
   2. Security Rules (reglas que restringen acceso)
   
   NUNCA debes guardar en git:
   - Claves de bases de datos privadas
   - Tokens JWT privados
   - Contraseñas de administrador
   
   Pero las credenciales de Firebase Client son públicas
   y están en la consola de tu navegador.
*/

const FIREBASE_CONFIG = {
    apiKey: "REEMPLAZA_CON_TU_API_KEY",
    authDomain: "tu-proyecto.firebaseapp.com",
    databaseURL: "https://tu-proyecto.firebasedatabase.app",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "TU_MESSAGING_ID",
    appId: "TU_APP_ID"
};

/* ============================================
   FIREBASE.JS - Integración con Firebase
   ============================================
   
   Configuración segura:
   - Credenciales públicas (apiKey) están permitidas en Firebase
   - Lo importante es Firebase Authentication + Security Rules
   - Las reglas restringen quién puede leer/escribir cada dato
*/

// Configuración pública de Firebase (segura con Firebase Auth + Rules)
const firebaseConfig = {
    apiKey: "AIzaSyBclGyKjp-vqCQwo6w0duIuqC4qUDSxTt8",
    authDomain: "tabla-tareas-ninos-ce4fb.firebaseapp.com",
    databaseURL: "https://tabla-tareas-ninos-ce4fb-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "tabla-tareas-ninos-ce4fb",
    storageBucket: "tabla-tareas-ninos-ce4fb.firebasestorage.app",
    messagingSenderId: "220910312742",
    appId: "1:220910312742:web:42741944dd7491ee2375e7"
};

// Declarar database globalmente
let database = null;

try {
    console.log('🔧 Inicializando Firebase...');
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    console.log('✅ Firebase inicializado correctamente');
    console.log('   Seguridad: Protegida por Firebase Authentication + Security Rules');
} catch (error) {
    console.error('❌ Error al inicializar Firebase:', error);
    database = null;
}

const CloudSync = {
    // Guardar datos en Firebase cuando se cierra sesión
    async saveToCloud(userId, userData) {
        try {
            console.log('Guardando datos en Firebase para:', userId);
            
            const ref = database.ref(`usuarios/${userId}`);
            await ref.set({
                ...userData,
                ultimaActualizacion: new Date().toISOString()
            });
            
            console.log('Datos guardados en Firebase exitosamente');
            return true;
        } catch (error) {
            console.error('Error al guardar en Firebase:', error);
            alert('Error al sincronizar datos. Verifica tu conexión a internet.');
            return false;
        }
    },

    // Cargar datos desde Firebase cuando inicia sesión
    async loadFromCloud(userId) {
        try {
            console.log('Cargando datos de Firebase para:', userId);
            
            const ref = database.ref(`usuarios/${userId}`);
            const snapshot = await ref.once('value');
            
            if (snapshot.exists()) {
                console.log('Datos encontrados en Firebase');
                return snapshot.val();
            } else {
                console.log('No hay datos previos en Firebase');
                return null;
            }
        } catch (error) {
            console.error('Error al cargar de Firebase:', error);
            return null;
        }
    },

    // Sincronizar datos en tiempo real (opcional)
    setupRealtimeSync(userId, onDataChange) {
        try {
            const ref = database.ref(`usuarios/${userId}`);
            
            ref.on('value', (snapshot) => {
                if (snapshot.exists()) {
                    console.log('Cambios detectados en Firebase');
                    onDataChange(snapshot.val());
                }
            });
            
            return () => ref.off(); // Función para desuscribirse
        } catch (error) {
            console.error('Error en sincronización en tiempo real:', error);
        }
    },

    // Eliminar datos de Firebase (para privacidad)
    async deleteFromCloud(userId) {
        try {
            console.log('Eliminando datos de Firebase para:', userId);
            
            const ref = database.ref(`usuarios/${userId}`);
            await ref.remove();
            
            console.log('Datos eliminados de Firebase');
            return true;
        } catch (error) {
            console.error('Error al eliminar de Firebase:', error);
            return false;
        }
    },

    // Verificar conexión a internet
    isOnline() {
        return navigator.onLine;
    }
};

// Escuchar cambios de conexión
window.addEventListener('online', () => {
    console.log('Conexión restaurada');
    // Aquí podrías sincronizar datos pendientes
});

window.addEventListener('offline', () => {
    console.log('Conexión perdida - funcionando offline');
});

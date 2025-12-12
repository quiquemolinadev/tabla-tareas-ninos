/* ============================================
   FIREBASE.JS - Integración con Firebase
   ============================================ */

// Obtener configuración de Firebase
// En desarrollo: desde config.js (local)
// En GitHub Pages: desde config.js (generado por CI/CD con GitHub Secrets)
function getFirebaseConfig() {
    if (typeof FIREBASE_CONFIG !== 'undefined') {
        console.log('📦 Configuración de Firebase cargada correctamente');
        return FIREBASE_CONFIG;
    }
    
    console.error('❌ CONFIGURACIÓN FALTANTE');
    console.error('En desarrollo: copia config.example.js a config.js y añade tus credenciales');
    console.error('En GitHub Pages: configura GitHub Secrets en tu repositorio');
    return null;
}

const firebaseConfig = getFirebaseConfig();

// Declarar database globalmente
let database = null;

if (!firebaseConfig) {
    console.error('❌ Firebase no puede inicializarse sin configuración');
} else {
    // Inicializar Firebase
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
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

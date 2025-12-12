/* ============================================
   FIREBASE.JS - Integración con Firebase
   ============================================
   
   Configuración segura:
   - En desarrollo: carga desde config.js (local, no versionado)
   - En GitHub Pages: Actions genera config.js pero NO lo publica
   - Las credenciales solo existen en GitHub Secrets (cifradas)
*/

// Declarar database globalmente
let database = null;

// Esperar a que config.js se cargue
function initializeFirebase() {
    if (typeof FIREBASE_CONFIG === 'undefined') {
        console.error('❌ FIREBASE_CONFIG no encontrado');
        console.error('En desarrollo: asegúrate de que config.js está cargado');
        console.error('');
        console.error('Solución:');
        console.error('1. Copia: cp js/config.example.js js/config.js');
        console.error('2. Edita js/config.js con tus credenciales');
        console.error('3. Recarga la página');
        return;
    }

    try {
        console.log('🔧 Inicializando Firebase...');
        firebase.initializeApp(FIREBASE_CONFIG);
        database = firebase.database();
        console.log('✅ Firebase inicializado correctamente');
        console.log('   projectId:', FIREBASE_CONFIG.projectId);
    } catch (error) {
        console.error('❌ Error al inicializar Firebase:', error);
        database = null;
    }
}

// Inicializar cuando firebase esté disponible
if (typeof firebase !== 'undefined') {
    initializeFirebase();
} else {
    // Esperar a que firebase se cargue
    window.addEventListener('load', initializeFirebase);
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

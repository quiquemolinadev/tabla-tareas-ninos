/* ============================================
   STORAGE.JS - Persistencia de Datos
   ============================================ */

const Storage = {
    STORAGE_KEY: 'tablaTareasData',

    // Obtener todos los datos
    getData() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : { users: [], usuarioActual: null };
        } catch (error) {
            console.error('Error al cargar datos:', error);
            return { users: [], usuarioActual: null };
        }
    },

    // Guardar todos los datos
    saveData(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error al guardar datos:', error);
            return false;
        }
    },

    // Obtener usuario actual
    getCurrentUser() {
        const data = this.getData();
        if (!data.usuarioActual) return null;
        return data.users.find(u => u.id === data.usuarioActual);
    },

    // Establecer usuario actual
    setCurrentUser(userId) {
        const data = this.getData();
        data.usuarioActual = userId;
        this.saveData(data);
    },

    // Crear nuevo usuario (método legacy, mantener para compatibilidad)
    createUser(nombre) {
        return this.createNewUser(nombre, '0000');
    },

    // Crear o obtener usuario root
    ensureRootUser() {
        const data = this.getData();
        
        // Buscar si existe un usuario root
        let rootUser = data.users.find(u => u.nombre === 'root' && u.id === 'usuario-root');
        
        if (!rootUser) {
            // Crear usuario root si no existe
            const newRoot = {
                id: 'usuario-root',
                nombre: 'root',
                pin: '9999',
                tareas: [],
                fechaCreacion: new Date().toISOString(),
                isRoot: true
            };
            data.users.unshift(newRoot); // Agregar al inicio
            this.saveData(data);
            console.log('Usuario root creado');
            return newRoot;
        }
        
        // Si existe pero no tiene PIN, agregarlo
        if (!rootUser.pin) {
            rootUser.pin = '9999';
            rootUser.isRoot = true;
            this.saveData(data);
            console.log('PIN agregado a usuario root existente');
        }
        
        console.log('Usuario root ya existe con PIN:', rootUser.pin);
        return rootUser;
    },

    // Verificar si un usuario es root
    isRootUser(userId) {
        const data = this.getData();
        const user = data.users.find(u => u.id === userId);
        return user && user.isRoot === true;
    },

    // Crear nuevo usuario (solo por root)
    createNewUser(nombre, pin = '0000') {
        const data = this.getData();
        const usuario = {
            id: 'usuario-' + Date.now(),
            nombre: nombre,
            pin: pin,
            tareas: [],
            fechaCreacion: new Date().toISOString(),
            isRoot: false
        };
        data.users.push(usuario);
        this.saveData(data);
        return usuario;
    },

    // Actualizar PIN de usuario
    updateUserPin(userId, newPin) {
        const data = this.getData();
        const user = data.users.find(u => u.id === userId);
        if (user) {
            user.pin = newPin;
            this.saveData(data);
            return true;
        }
        return false;
    },

    // Eliminar usuario
    deleteUser(userId) {
        if (userId === 'usuario-root') {
            console.error('No se puede eliminar el usuario root');
            return false;
        }
        const data = this.getData();
        const index = data.users.findIndex(u => u.id === userId);
        if (index > -1) {
            data.users.splice(index, 1);
            this.saveData(data);
            return true;
        }
        return false;
    },

    // Verificar PIN
    verifyPin(userId, pin) {
        const data = this.getData();
        const user = data.users.find(u => u.id === userId);
        console.log('verifyPin - userId:', userId);
        console.log('verifyPin - user encontrado:', !!user);
        if (user) {
            console.log('verifyPin - user.pin:', user.pin);
            console.log('verifyPin - pin ingresado:', pin);
            console.log('verifyPin - coincide:', user.pin === pin);
        }
        return user && user.pin === pin;
    },

    // Obtener todos los usuarios
    getAllUsers() {
        const data = this.getData();
        return data.users;
    },

    // Agregar tarea
    addTask(userId, taskName) {
        const data = this.getData();
        const user = data.users.find(u => u.id === userId);
        if (!user) return null;

        const tarea = {
            id: 'tarea-' + Date.now(),
            nombre: taskName,
            semanas: [{
                fechaInicio: this._getCurrentWeekStart(),
                estados: [0, 0, 0, 0, 0, 0, 0] // 0=sin completar, 0.5=parcial, 1=completo
            }],
            fechaCreacion: new Date().toISOString()
        };
        user.tareas.push(tarea);
        this.saveData(data);
        return tarea;
    },

    // Actualizar estado de tarea (día específico)
    updateTaskState(userId, taskId, dayIndex, newState) {
        const data = this.getData();
        const user = data.users.find(u => u.id === userId);
        if (!user) return false;

        const tarea = user.tareas.find(t => t.id === taskId);
        if (!tarea) return false;

        // Obtener la semana actual o crear una nueva
        const weekStart = this._getCurrentWeekStart();
        let semana = tarea.semanas.find(s => s.fechaInicio === weekStart);
        
        if (!semana) {
            semana = {
                fechaInicio: weekStart,
                estados: [0, 0, 0, 0, 0, 0, 0]
            };
            tarea.semanas.push(semana);
        }

        // Ciclar a través de estados: 0 -> 0.5 -> 1 -> 0
        if (newState === 'next') {
            const current = semana.estados[dayIndex];
            if (current === 0) {
                semana.estados[dayIndex] = 0.5;
            } else if (current === 0.5) {
                semana.estados[dayIndex] = 1;
            } else {
                semana.estados[dayIndex] = 0;
            }
        } else {
            semana.estados[dayIndex] = newState;
        }

        this.saveData(data);
        return true;
    },

    // Obtener tareas del usuario actual
    getUserTasks(userId) {
        const data = this.getData();
        const user = data.users.find(u => u.id === userId);
        if (!user) return [];
        return user.tareas;
    },

    // Eliminar tarea
    deleteTask(userId, taskId) {
        const data = this.getData();
        const user = data.users.find(u => u.id === userId);
        if (!user) return false;

        const index = user.tareas.findIndex(t => t.id === taskId);
        if (index > -1) {
            user.tareas.splice(index, 1);
            this.saveData(data);
            return true;
        }
        return false;
    },

    // Editar nombre de tarea
    editTaskName(userId, taskId, newName) {
        const data = this.getData();
        const user = data.users.find(u => u.id === userId);
        if (!user) return false;

        const tarea = user.tareas.find(t => t.id === taskId);
        if (tarea) {
            tarea.nombre = newName;
            this.saveData(data);
            return true;
        }
        return false;
    },

    // Exportar datos a JSON
    exportData() {
        const data = this.getData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tareas-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    },

    // Importar datos desde JSON
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.users && Array.isArray(data.users)) {
                        this.saveData(data);
                        resolve(true);
                    } else {
                        reject(new Error('Formato de archivo inválido'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Error al leer archivo'));
            reader.readAsText(file);
        });
    },

    // Limpiar todos los datos
    clearAllData() {
        if (confirm('¿Estás seguro? Esta acción eliminará TODOS los datos.')) {
            localStorage.removeItem(this.STORAGE_KEY);
            window.location.reload();
        }
    },

    // Obtener estados de la semana actual para una tarea
    getCurrentWeekStates(userId, taskId) {
        const data = this.getData();
        const user = data.users.find(u => u.id === userId);
        if (!user) return [0, 0, 0, 0, 0, 0, 0];

        const tarea = user.tareas.find(t => t.id === taskId);
        if (!tarea) return [0, 0, 0, 0, 0, 0, 0];

        const weekStart = this._getCurrentWeekStart();
        const semana = tarea.semanas.find(s => s.fechaInicio === weekStart);
        
        return semana ? semana.estados : [0, 0, 0, 0, 0, 0, 0];
    },

    // Helper: obtener inicio de semana actual (lunes)
    _getCurrentWeekStart() {
        const today = new Date();
        const first = today.getDate() - today.getDay() + 1; // Ajuste para empezar en lunes
        const date = new Date(today.setDate(first));
        return date.toISOString().split('T')[0];
    },

    // Obtener todas las semanas registradas de una tarea
    getTaskWeeks(userId, taskId) {
        const data = this.getData();
        const user = data.users.find(u => u.id === userId);
        if (!user) return [];

        const tarea = user.tareas.find(t => t.id === taskId);
        return tarea ? tarea.semanas : [];
    }
};

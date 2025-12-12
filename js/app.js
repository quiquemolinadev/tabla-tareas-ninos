/* ============================================
   APP.JS - Lógica Principal de la Aplicación
   ============================================ */

const App = {
    currentUserId: null,
    isLoggingIn: false, // Flag para prevenir doble login

    // Inicializar la aplicación
    init() {
        console.log('App.init() iniciado');
        
        // Asegurar que existe usuario root
        Storage.ensureRootUser();
        
        this.currentUserId = Storage.getCurrentUser()?.id || null;
        console.log('Usuario actual:', this.currentUserId);
        this.setupEventListeners();
        console.log('Event listeners configurados');
        this.loadUsers();
        
        if (this.currentUserId) {
            this.showMainContent();
            this.render();
            console.log('Contenido principal mostrado');
        }
    },

    // Configurar event listeners
    setupEventListeners() {
        console.log('Configurando event listeners...');
        
        // Login
        const loginBtn = document.getElementById('loginBtn');
        const addTaskBtn = document.getElementById('addTaskBtn');
        
        console.log('loginBtn existe:', !!loginBtn);
        console.log('addTaskBtn existe:', !!addTaskBtn);
        
        if (loginBtn) loginBtn.addEventListener('click', () => {
            console.log('Click en loginBtn');
            this.handleLogin();
        });
        
        if (document.getElementById('userSelect')) {
            document.getElementById('userSelect').addEventListener('change', (e) => {
                console.log('Usuario seleccionado:', e.target.value);
            });
        }

        // Controles principales
        if (document.getElementById('logoutBtn')) document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());
        if (document.getElementById('changePasswordBtn')) document.getElementById('changePasswordBtn').addEventListener('click', () => this.handleChangePassword());
        
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => {
                console.log('CLICK EN AGREGAR TAREA');
                this.handleAddTask();
            });
            console.log('Event listener añadido a addTaskBtn');
        }
        if (document.getElementById('exportBtn')) document.getElementById('exportBtn').addEventListener('click', () => Storage.exportData());
        if (document.getElementById('importBtn')) document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });
        if (document.getElementById('importFile')) document.getElementById('importFile').addEventListener('change', (e) => this.handleImport(e));
        if (document.getElementById('clearBtn')) document.getElementById('clearBtn').addEventListener('click', () => Storage.clearAllData());

        // Panel admin
        if (document.getElementById('adminPanelBtn')) document.getElementById('adminPanelBtn').addEventListener('click', () => this.showAdminPanel());
        if (document.getElementById('closeAdminBtn')) document.getElementById('closeAdminBtn').addEventListener('click', () => this.hideAdminPanel());
        if (document.getElementById('createUserBtn')) document.getElementById('createUserBtn').addEventListener('click', () => this.handleCreateUser());

        // Auto-save cada 30 segundos
        setInterval(() => {
            if (this.currentUserId) {
                // Los datos se guardan automáticamente en Storage
            }
        }, 30000);
        
        console.log('Event listeners configurados completamente');
    },

    // Manejar login con PIN
    handleLogin() {
        console.log('handleLogin() ejecutado');
        
        if (this.isLoggingIn) {
            console.log('Login ya en proceso, cancelando');
            return;
        }
        
        this.isLoggingIn = true;
        
        const userSelect = document.getElementById('userSelect');
        const userId = userSelect.value;
        
        if (!userId) {
            alert('Por favor selecciona un usuario');
            this.isLoggingIn = false;
            return;
        }

        const user = Storage.getAllUsers().find(u => u.id === userId);
        if (!user) {
            alert('Usuario no encontrado');
            this.isLoggingIn = false;
            return;
        }

        // Pedir PIN usando modal
        this.showPinModal(user.nombre, (pin) => {
            if (pin === null) {
                this.isLoggingIn = false;
                return;
            }

            if (!Storage.verifyPin(userId, pin)) {
                alert('PIN incorrecto');
                this.isLoggingIn = false;
                return;
            }

            // PIN correcto - Cargar datos desde la nube si están disponibles
            this.loginWithCloudSync(userId);
        });
    },

    // Mostrar modal para pedir PIN
    showPinModal(userName, callback) {
        const modal = document.getElementById('pinModal');
        const userNameEl = document.getElementById('pinModalUserName');
        const pinInput = document.getElementById('pinInput');
        const okBtn = document.getElementById('pinModalOkBtn');
        const cancelBtn = document.getElementById('pinModalCancelBtn');

        userNameEl.textContent = `PIN para ${userName}:`;
        pinInput.value = '';
        pinInput.focus();

        modal.classList.remove('hidden');

        const handleOk = () => {
            const pin = pinInput.value;
            cleanup();
            modal.classList.add('hidden');
            callback(pin);
        };

        const handleCancel = () => {
            cleanup();
            modal.classList.add('hidden');
            callback(null);
        };

        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                handleOk();
            } else if (e.key === 'Escape') {
                handleCancel();
            }
        };

        okBtn.addEventListener('click', handleOk);
        cancelBtn.addEventListener('click', handleCancel);
        pinInput.addEventListener('keypress', handleKeyPress);

        const cleanup = () => {
            okBtn.removeEventListener('click', handleOk);
            cancelBtn.removeEventListener('click', handleCancel);
            pinInput.removeEventListener('keypress', handleKeyPress);
        };
    },

    // Login con sincronización de cloud
    async loginWithCloudSync(userId) {
        try {
            // Si Firebase está disponible, cargar datos de la nube
            if (typeof CloudSync !== 'undefined' && CloudSync.isOnline()) {
                console.log('Cargando datos desde Firebase...');
                const cloudData = await CloudSync.loadFromCloud(userId);
                
                if (cloudData) {
                    console.log('Datos cargados de Firebase', cloudData);
                    // Actualizar localStorage con datos de la nube
                    const localData = Storage.getData();
                    const userIndex = localData.users.findIndex(u => u.id === userId);
                    if (userIndex > -1) {
                        // Mergear: mantener datos locales y actualizar con datos de nube
                        const localUser = localData.users[userIndex];
                        localData.users[userIndex] = {
                            ...localUser,  // Mantener estructura local (id, nombre, pin, etc)
                            ...cloudData,  // Sobrescribir con datos de nube (tareas, puntos, etc)
                            id: userId,    // Asegurar que el id no se pierda
                            tareas: cloudData.tareas || localUser.tareas || []  // Asegurar tareas existe
                        };
                        Storage.saveData(localData);
                    }
                }
            }

            // Completar login
            Storage.setCurrentUser(userId);
            this.currentUserId = userId;
            document.getElementById('userSelect').value = '';
            this.hideLoginSection();
            this.showMainContent();
            this.render();
            console.log('Login exitoso');
        } catch (error) {
            console.error('Error durante login con cloud sync:', error);
            // Continuar con login local si falla cloud
            Storage.setCurrentUser(userId);
            this.currentUserId = userId;
            this.hideLoginSection();
            this.showMainContent();
            this.render();
        } finally {
            this.isLoggingIn = false;
        }
    },

    // Manejar logout
    async handleLogout() {
        try {
            // Guardar datos en la nube antes de logout
            const currentUser = Storage.getCurrentUser();
            if (currentUser && typeof CloudSync !== 'undefined' && CloudSync.isOnline()) {
                console.log('Sincronizando datos con Firebase antes de logout...');
                await CloudSync.saveToCloud(currentUser.id, currentUser);
                console.log('Datos sincronizados exitosamente');
            }
        } catch (error) {
            console.error('Error al sincronizar con Firebase:', error);
            // Continuar con logout aunque falle cloud
        }

        this.currentUserId = null;
        Storage.setCurrentUser(null);
        this.hideMainContent();
        this.hideAdminPanel();
        this.loadUsers();
        this.showLoginSection();
    },

    // Manejar cambio de PIN
    handleChangePassword() {
        const newPin = prompt('Ingresa el nuevo PIN (4 dígitos):');
        
        if (newPin === null) return;
        
        if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
            alert('El PIN debe ser 4 dígitos');
            return;
        }

        if (Storage.updateUserPin(this.currentUserId, newPin)) {
            alert('¡PIN actualizado exitosamente!');
        } else {
            alert('Error al actualizar el PIN');
        }
    },

    // Mostrar panel de administración
    showAdminPanel() {
        document.getElementById('adminPanel').classList.remove('hidden');
        document.getElementById('tasksContent').classList.add('hidden');
        this.renderUsersList();
    },

    // Ocultar panel de administración
    hideAdminPanel() {
        document.getElementById('adminPanel').classList.add('hidden');
        document.getElementById('tasksContent').classList.remove('hidden');
    },

    // Crear nuevo usuario (solo root)
    handleCreateUser() {
        if (!Storage.isRootUser(this.currentUserId)) {
            alert('Solo el administrador puede crear usuarios');
            return;
        }

        const nombreInput = document.getElementById('newUserNameInput');
        const pinInput = document.getElementById('newUserPinInput');

        const nombre = nombreInput.value.trim();
        const pin = pinInput.value.trim();

        if (!nombre) {
            alert('Ingresa un nombre');
            return;
        }

        if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
            alert('El PIN debe ser 4 dígitos');
            return;
        }

        Storage.createNewUser(nombre, pin);
        nombreInput.value = '';
        pinInput.value = '';
        this.renderUsersList();
        this.loadUsers();
        alert(`Usuario ${nombre} creado exitosamente`);
    },

    // Eliminar usuario (solo root)
    handleDeleteUser(userId) {
        if (!Storage.isRootUser(this.currentUserId)) {
            alert('Solo el administrador puede eliminar usuarios');
            return;
        }

        if (userId === 'usuario-root') {
            alert('No se puede eliminar el usuario administrador');
            return;
        }

        const user = Storage.getAllUsers().find(u => u.id === userId);
        if (confirm(`¿Estás seguro de que quieres eliminar a ${user.nombre}?`)) {
            if (Storage.deleteUser(userId)) {
                this.renderUsersList();
                this.loadUsers();
                alert(`Usuario ${user.nombre} eliminado`);
            }
        }
    },

    // Actualizar PIN de un usuario (solo root)
    handleUpdateUserPin(userId) {
        if (!Storage.isRootUser(this.currentUserId)) {
            alert('Solo el administrador puede actualizar PINs');
            return;
        }

        const user = Storage.getAllUsers().find(u => u.id === userId);
        const newPin = prompt(`Nuevo PIN para ${user.nombre}:`);

        if (newPin === null) return;

        if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
            alert('El PIN debe ser 4 dígitos');
            return;
        }

        if (Storage.updateUserPin(userId, newPin)) {
            this.renderUsersList();
            alert(`PIN de ${user.nombre} actualizado`);
        }
    },

    // Manejar agregar tarea
    handleAddTask() {
        console.log('handleAddTask() llamado');
        console.log('currentUserId:', this.currentUserId);
        
        if (!this.currentUserId) {
            alert('Por favor inicia sesión primero');
            return;
        }

        const taskName = prompt('Nombre de la tarea:');
        console.log('taskName ingresado:', taskName);
        
        if (!taskName || !taskName.trim()) {
            console.log('Tarea vacía, cancelando');
            return;
        }

        const result = Storage.addTask(this.currentUserId, taskName.trim());
        console.log('Resultado de addTask:', result);
        
        if (!result) {
            alert('Error al agregar la tarea');
            console.error('Error en addTask, userId:', this.currentUserId);
            return;
        }

        this.render();
    },

    // Manejar importar datos
    handleImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        Storage.importData(file)
            .then(() => {
                alert('Datos importados exitosamente');
                this.init();
            })
            .catch((error) => {
                alert('Error al importar: ' + error.message);
            });
    },

    // Manejar cambio de estado de tarea
    handleToggleState(taskId, dayIndex) {
        Storage.updateTaskState(this.currentUserId, taskId, dayIndex, 'next');
        this.render();
    },

    // Manejar edición de nombre de tarea
    handleEditTaskName(taskId, newName) {
        if (!newName.trim()) return;
        Storage.editTaskName(this.currentUserId, taskId, newName.trim());
    },

    // Manejar eliminación de tarea
    handleDeleteTask(taskId) {
        if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            return;
        }

        // Pedir PIN de root para confirmar eliminación
        const rootPin = prompt('Ingresa el PIN de administrador para confirmar la eliminación:');
        
        if (rootPin === null) {
            return; // Usuario canceló
        }

        // Verificar PIN contra el usuario root
        if (!Storage.verifyPin('usuario-root', rootPin)) {
            alert('PIN incorrecto. Eliminación cancelada.');
            return;
        }

        // PIN correcto, eliminar la tarea
        Storage.deleteTask(this.currentUserId, taskId);
        this.render();
        alert('Tarea eliminada exitosamente');
    },

    // Cargar lista de usuarios
    loadUsers() {
        const userSelect = document.getElementById('userSelect');
        
        // Sincronizar usuarios desde Firebase primero (si está disponible)
        if (typeof CloudSync !== 'undefined' && CloudSync.isOnline()) {
            CloudSync.loadAllUsers().then(usuariosFirebase => {
                if (usuariosFirebase && usuariosFirebase.length > 0) {
                    // Actualizar localStorage con los usuarios de Firebase
                    const data = Storage.getData();
                    data.users = usuariosFirebase;
                    Storage.saveData(data);
                    console.log('✅ Usuarios sincronizados desde Firebase');
                }
                
                // Luego cargar en el dropdown
                this._renderUserSelect();
            }).catch(error => {
                console.error('Error sincronizando usuarios:', error);
                // Si falla, usar los locales
                this._renderUserSelect();
            });
        } else {
            // Si no hay Firebase, usar locales
            this._renderUserSelect();
        }
    },

    // Renderizar dropdown de usuarios (helper privado)
    _renderUserSelect() {
        const userSelect = document.getElementById('userSelect');
        const users = Storage.getAllUsers();
        
        userSelect.innerHTML = '<option value="">-- Seleccionar usuario --</option>';
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.nombre;
            userSelect.appendChild(option);
        });

        if (this.currentUserId) {
            userSelect.value = this.currentUserId;
        }
    },

    // Renderizar lista de usuarios (para admin)
    renderUsersList() {
        const usersList = document.getElementById('usersList');
        const users = Storage.getAllUsers();

        usersList.innerHTML = '';

        users.forEach(user => {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';

            const pinDisplay = user.id === 'usuario-root' ? '●●●●' : user.pin;

            userItem.innerHTML = `
                <div class="user-item-info">
                    <h4>${user.nombre}</h4>
                    <p>ID: ${user.id}</p>
                    <p>Creado: ${new Date(user.fechaCreacion).toLocaleDateString('es-ES')}</p>
                </div>
                <div class="user-item-pin">
                    <span>PIN: ${pinDisplay}</span>
                </div>
                <div class="user-item-actions">
                    ${user.id !== 'usuario-root' ? `
                        <button class="btn btn-secondary btn-small" onclick="App.handleUpdateUserPin('${user.id}')">🔐 Cambiar PIN</button>
                        <button class="btn btn-danger btn-small" onclick="App.handleDeleteUser('${user.id}')">🗑️ Eliminar</button>
                    ` : '<span style="color: #999;">Admin</span>'}
                </div>
            `;

            usersList.appendChild(userItem);
        });
    },

    // Mostrar sección de login
    showLoginSection() {
        document.getElementById('loginSection').style.display = 'flex';
    },

    // Ocultar sección de login
    hideLoginSection() {
        document.getElementById('loginSection').style.display = 'none';
    },

    // Mostrar contenido principal
    showMainContent() {
        document.getElementById('mainContent').classList.remove('hidden');
    },

    // Ocultar contenido principal
    hideMainContent() {
        document.getElementById('mainContent').classList.add('hidden');
    },

    // Renderizar la aplicación
    render() {
        if (!this.currentUserId) {
            this.hideMainContent();
            return;
        }

        this.showMainContent();
        this.renderUserInfo();
        this.renderTasks();
        this.updateStatistics();
    },

    // Renderizar información del usuario
    renderUserInfo() {
        const currentUser = Storage.getCurrentUser();
        if (currentUser) {
            document.getElementById('currentUserName').textContent = `Bienvenido, ${currentUser.nombre}!`;
        }
        
        // Mostrar/ocultar botones admin
        const isRoot = Storage.isRootUser(this.currentUserId);
        const adminButtons = document.querySelectorAll('.admin-only');
        adminButtons.forEach(btn => {
            btn.style.display = isRoot ? 'block' : 'none';
        });

        // Mostrar botón de panel admin
        const adminPanelBtn = document.getElementById('adminPanelBtn');
        if (adminPanelBtn) {
            adminPanelBtn.style.display = isRoot ? 'block' : 'none';
        }
        
        console.log('Usuario es root:', isRoot);
    },

    // Renderizar tareas
    renderTasks() {
        const currentUser = Storage.getCurrentUser();
        if (!currentUser) return;

        const tasksList = document.getElementById('tasksList');
        tasksList.innerHTML = '';

        // Asegurar que tareas existe
        if (!currentUser.tareas || currentUser.tareas.length === 0) {
            tasksList.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 2rem; color: #999;">
                        No hay tareas aún. ¡Crea la primera tarea!
                    </td>
                </tr>
            `;
            return;
        }

        currentUser.tareas.forEach(tarea => {
            const estados = Storage.getCurrentWeekStates(this.currentUserId, tarea.id);
            const row = document.createElement('tr');
            row.className = 'task-row';

            let rowHTML = `
                <td class="task-name-cell">
                    <input 
                        type="text" 
                        class="task-name-input" 
                        value="${this.escapeHtml(tarea.nombre)}"
                        data-task-id="${tarea.id}"
                        onblur="App.handleEditTaskName('${tarea.id}', this.value)"
                        onkeypress="if(event.key==='Enter') this.blur()"
                    >
                </td>
            `;

            // Agregar estados para cada día
            for (let day = 0; day < 7; day++) {
                const estado = estados[day];
                const stateClass = Calculations.getStateClass(estado);
                rowHTML += `
                    <td>
                        <div 
                            class="state-circle ${stateClass}"
                            onclick="App.handleToggleState('${tarea.id}', ${day})"
                            title="${Calculations.getStateLabel(estado)}"
                        ></div>
                    </td>
                `;
            }

            // Agregar botón de eliminar
            rowHTML += `
                <td>
                    <button 
                        class="action-btn"
                        onclick="App.handleDeleteTask('${tarea.id}')"
                        title="Eliminar tarea"
                    >
                        🗑️
                    </button>
                </td>
            `;

            row.innerHTML = rowHTML;
            tasksList.appendChild(row);
        });
    },

    // Actualizar estadísticas
    updateStatistics() {
        const stats = Calculations.getStatistics(this.currentUserId);

        document.getElementById('weeklyTotal').textContent = stats.weekly.puntos;
        document.getElementById('weeklyPercent').textContent = stats.weekly.porcentaje + '%';

        document.getElementById('monthlyTotal').textContent = stats.monthly.puntos;
        document.getElementById('monthlyPercent').textContent = stats.monthly.porcentaje + '%';

        document.getElementById('yearlyTotal').textContent = stats.yearly.puntos;
        document.getElementById('yearlyPercent').textContent = stats.yearly.porcentaje + '%';
    },

    // Escapar HTML para seguridad
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Inicializar cuando el DOM esté listo
console.log('Script app.js cargado');

let appInitialized = false;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded evento disparado');
    if (!appInitialized) {
        appInitialized = true;
        App.init();
    }
});

// Si el documento ya está listo, inicializar inmediatamente
if (document.readyState === 'loading') {
    console.log('Documento aún cargando, esperando DOMContentLoaded');
} else {
    console.log('Documento ya cargado, inicializando App');
    if (!appInitialized) {
        appInitialized = true;
        App.init();
    }
}

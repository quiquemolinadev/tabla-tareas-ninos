/* ============================================
   CALCULATIONS.JS - Cálculos de Totales
   ============================================ */

const Calculations = {
    // Obtener el lunes de la semana actual
    getCurrentWeekStart() {
        const today = new Date();
        const first = today.getDate() - today.getDay() + 1;
        const date = new Date(today.setDate(first));
        return date.toISOString().split('T')[0];
    },

    // Obtener el primer día del mes actual
    getCurrentMonthStart() {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    },

    // Obtener el primer día del año actual
    getCurrentYearStart() {
        const today = new Date();
        return new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
    },

    // Calcular total semanal (puntos y porcentaje)
    calculateWeeklyTotal(userId) {
        const user = Storage.getCurrentUser();
        if (!user || user.id !== userId) return { puntos: 0, porcentaje: 0 };

        const weekStart = this.getCurrentWeekStart();
        let totalPuntos = 0;
        let totalPosible = 0;

        user.tareas.forEach(tarea => {
            const semana = tarea.semanas.find(s => s.fechaInicio === weekStart);
            if (semana) {
                semana.estados.forEach(estado => {
                    totalPuntos += estado;
                    totalPosible += 1;
                });
            }
        });

        const porcentaje = totalPosible > 0 ? Math.round((totalPuntos / totalPosible) * 100) : 0;
        return { 
            puntos: Math.round(totalPuntos * 10) / 10,
            porcentaje: porcentaje
        };
    },

    // Calcular total mensual
    calculateMonthlyTotal(userId) {
        const user = Storage.getCurrentUser();
        if (!user || user.id !== userId) return { puntos: 0, porcentaje: 0 };

        const monthStart = this.getCurrentMonthStart();
        const today = new Date();
        let totalPuntos = 0;
        let totalPosible = 0;

        user.tareas.forEach(tarea => {
            tarea.semanas.forEach(semana => {
                const semanaDate = new Date(semana.fechaInicio);
                if (semanaDate >= new Date(monthStart) && semanaDate <= today) {
                    semana.estados.forEach(estado => {
                        totalPuntos += estado;
                        totalPosible += 1;
                    });
                }
            });
        });

        const porcentaje = totalPosible > 0 ? Math.round((totalPuntos / totalPosible) * 100) : 0;
        return { 
            puntos: Math.round(totalPuntos * 10) / 10,
            porcentaje: porcentaje
        };
    },

    // Calcular total anual
    calculateYearlyTotal(userId) {
        const user = Storage.getCurrentUser();
        if (!user || user.id !== userId) return { puntos: 0, porcentaje: 0 };

        const yearStart = this.getCurrentYearStart();
        const today = new Date();
        let totalPuntos = 0;
        let totalPosible = 0;

        user.tareas.forEach(tarea => {
            tarea.semanas.forEach(semana => {
                const semanaDate = new Date(semana.fechaInicio);
                if (semanaDate >= new Date(yearStart) && semanaDate <= today) {
                    semana.estados.forEach(estado => {
                        totalPuntos += estado;
                        totalPosible += 1;
                    });
                }
            });
        });

        const porcentaje = totalPosible > 0 ? Math.round((totalPuntos / totalPosible) * 100) : 0;
        return { 
            puntos: Math.round(totalPuntos * 10) / 10,
            porcentaje: porcentaje
        };
    },

    // Obtener resumen de estadísticas
    getStatistics(userId) {
        const weekly = this.calculateWeeklyTotal(userId);
        const monthly = this.calculateMonthlyTotal(userId);
        const yearly = this.calculateYearlyTotal(userId);

        return {
            weekly,
            monthly,
            yearly
        };
    },

    // Obtener estado visual para un día (retorna clase CSS)
    getStateClass(stateValue) {
        if (stateValue === 0) return '';
        if (stateValue === 0.5) return 'partial';
        if (stateValue === 1) return 'completed';
        return '';
    },

    // Obtener próximo estado (para ciclar)
    getNextState(currentState) {
        if (currentState === 0) return 0.5;
        if (currentState === 0.5) return 1;
        return 0;
    },

    // Obtener descripción legible del estado
    getStateLabel(stateValue) {
        if (stateValue === 0) return 'No completado';
        if (stateValue === 0.5) return 'Parcial';
        if (stateValue === 1) return 'Completado';
        return 'Desconocido';
    }
};

import { Injectable, signal, computed, effect } from '@angular/core';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { FirestoreService } from './firestore.service';
import {
    User,
    Practice,
    Session,
    PracticeProgress,
    MeditationSession,
    DEFAULT_PRACTICES
} from '../models/models';

/**
 * Servicio de gestión de estado usando Angular Signals
 * Maneja el estado de usuario, prácticas y sesiones con persistencia automática
 */
@Injectable({
    providedIn: 'root'
})
export class StateService {
    // UID del usuario actual de Firebase
    private currentFirebaseUID = signal<string | null>(null);

    // Signals para el estado
    user = signal<User | null>(null);
    practices = signal<Practice[]>(DEFAULT_PRACTICES);
    sessions = signal<Session[]>([]);
    meditationSessions = signal<MeditationSession[]>([]);

    constructor(
        private storageService: StorageService,
        private authService: AuthService,
        private firestoreService: FirestoreService
    ) {
        // Escuchar cambios en el usuario de Firebase
        effect(() => {
            const firebaseUser = this.authService.currentUser();
            const newUID = firebaseUser?.uid || null;
            const previousUID = this.currentFirebaseUID();

            // Si cambió el usuario, actualizar UID y recargar datos
            if (newUID !== previousUID) {
                console.log('🔄 Usuario cambió:', previousUID, '→', newUID);
                this.currentFirebaseUID.set(newUID);
                this.loadUserData();
            }
        });
    }

    /**
     * Genera las keys de storage con prefijo del usuario
     */
    private getStorageKey(key: string): string {
        const uid = this.currentFirebaseUID();
        if (!uid) {
            // Si no hay usuario autenticado, usar keys globales (fallback)
            return key;
        }
        return `user_${uid}_${key}`;
    }

    // Computed signals para datos derivados
    practiceProgress = computed(() => {
        const allSessions = this.sessions();
        const progressMap = new Map<string, PracticeProgress>();

        this.practices().forEach(practice => {
            const practiceSessions = allSessions.filter(
                s => s.practiceId === practice.id
            );

            const totalRepetitions = practiceSessions.reduce(
                (sum, session) => sum + session.repetitions,
                0
            );

            const sortedSessions = [...practiceSessions].sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            const lastSession = sortedSessions[0];

            progressMap.set(practice.id, {
                practiceId: practice.id,
                totalRepetitions,
                targetRepetitions: practice.targetRepetitions,
                sessions: practiceSessions,
                lastSessionDate: lastSession?.date,
                lastSessionRepetitions: lastSession?.repetitions
            });
        });

        return progressMap;
    });

    /**
     * Carga los datos del usuario actual desde el storage
     */
    private async loadUserData() {
        try {
            const uid = this.currentFirebaseUID();

            if (!uid) {
                // No hay usuario autenticado, limpiar datos
                console.log('❌ No hay usuario autenticado, limpiando datos');
                this.user.set(null);
                this.sessions.set([]);
                this.meditationSessions.set([]);
                this.practices.set(DEFAULT_PRACTICES);
                return;
            }

            console.log('📂 Cargando datos para usuario:', uid);

            // Cargar usuario
            const user = await this.storageService.get<User>(this.getStorageKey('user'));
            if (user) {
                this.user.set(user);
            }

            // Cargar prácticas personalizadas o usar las por defecto
            const practices = await this.storageService.get<Practice[]>(
                this.getStorageKey('practices')
            );
            if (practices) {
                this.practices.set(practices);
            } else {
                // Si no hay prácticas guardadas, usar las por defecto
                this.practices.set(DEFAULT_PRACTICES);
            }

            // Cargar sesiones
            const sessions = await this.storageService.get<Session[]>(
                this.getStorageKey('sessions')
            );
            if (sessions) {
                // Convertir las fechas de string a Date
                const sessionsWithDates = sessions.map(s => ({
                    ...s,
                    date: new Date(s.date)
                }));
                this.sessions.set(sessionsWithDates);
            } else {
                this.sessions.set([]);
            }

            // TODO: Cargar sesiones de meditación desde Firestore
            if (uid) {
                const meditationSessions = await this.firestoreService.getMeditationSessions(uid);
                this.meditationSessions.set(meditationSessions);
            } else {
                this.meditationSessions.set([]);
            }

            console.log('✅ Datos cargados correctamente');
        } catch (error) {
            console.error('❌ Error cargando datos del usuario:', error);
        }
    }

    /**
     * Guarda o actualiza el usuario
     */
    async saveUser(user: User) {
        try {
            this.user.set(user);
            await this.storageService.set(this.getStorageKey('user'), user);
        } catch (error) {
            console.error('Error guardando usuario:', error);
            throw error;
        }
    }

    /**
     * Agrega una nueva sesión de práctica
     */
    async addSession(practiceId: string, repetitions: number, notes?: string) {
        try {
            const newSession: Session = {
                id: this.generateId(),
                practiceId,
                repetitions,
                date: new Date(),
                notes
            };

            const updatedSessions = [...this.sessions(), newSession];
            this.sessions.set(updatedSessions);

            await this.storageService.set(this.getStorageKey('sessions'), updatedSessions);

            return newSession;
        } catch (error) {
            console.error('Error agregando sesión:', error);
            throw error;
        }
    }

    async addMeditationSession(
        durationMinutes: number,
        completedMinutes: number,
        completed: boolean,
        notes?: string
    ) {
        try {
            const uid = this.currentFirebaseUID();
            if (!uid) {
                throw new Error('No hay usuario autenticado');
            }

            const newSession: MeditationSession = {
                id: this.generateId(),
                durationMinutes,
                completedMinutes,
                date: new Date(),
                completed,
                notes
            };

            // Guardar en Firestore
            await this.firestoreService.addMeditationSession(uid, newSession);

            // Actualizar signal
            const updatedSessions = [...this.meditationSessions(), newSession];
            this.meditationSessions.set(updatedSessions);

            console.log('✅ Sesión de meditación guardada en Firestore');
            return newSession;
        } catch (error) {
            console.error('Error agregando sesión de meditación:', error);
            throw error;
        }
    }

    /**
     * Obtiene el progreso de una práctica específica
     */
    getPracticeProgress(practiceId: string): PracticeProgress | undefined {
        return this.practiceProgress().get(practiceId);
    }

    /**
     * Obtiene una práctica por ID
     */
    getPracticeById(practiceId: string): Practice | undefined {
        return this.practices().find(p => p.id === practiceId);
    }

    /**
     * Obtiene las últimas N sesiones de una práctica
     */
    getRecentSessions(practiceId: string, limit: number = 10): Session[] {
        return this.sessions()
            .filter(s => s.practiceId === practiceId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, limit);
    }

    /**
     * Elimina una sesión
     */
    async deleteSession(sessionId: string) {
        try {
            const updatedSessions = this.sessions().filter(s => s.id !== sessionId);
            this.sessions.set(updatedSessions);

            await this.storageService.set(this.getStorageKey('sessions'), updatedSessions);
        } catch (error) {
            console.error('Error eliminando sesión:', error);
            throw error;
        }
    }

    /**
     * Limpia todos los datos (útil para testing o reset)
     */
    async clearAllData() {
        try {
            this.user.set(null);
            this.sessions.set([]);
            await this.storageService.clear();
        } catch (error) {
            console.error('Error limpiando datos:', error);
            throw error;
        }
    }

    /**
     * Genera un ID único simple
     */
    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}

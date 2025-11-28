import { Injectable, signal, computed } from '@angular/core';
import { StorageService } from './storage.service';
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
    // Storage keys
    private readonly STORAGE_KEYS = {
        USER: 'user',
        SESSIONS: 'sessions',
        PRACTICES: 'practices',
        MEDITATION_SESSIONS: 'meditationSessions'
    };

    // Signals para el estado
    user = signal<User | null>(null);
    practices = signal<Practice[]>(DEFAULT_PRACTICES);
    sessions = signal<Session[]>([]);
    meditationSessions = signal<MeditationSession[]>([]);

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

    constructor(private storageService: StorageService) {
        this.loadInitialData();
    }

    /**
     * Carga los datos iniciales desde el storage
     */
    private async loadInitialData() {
        try {
            // Cargar usuario
            const user = await this.storageService.get<User>(this.STORAGE_KEYS.USER);
            if (user) {
                this.user.set(user);
            }

            // Cargar prácticas (o usar las predeterminadas)
            const practices = await this.storageService.get<Practice[]>(
                this.STORAGE_KEYS.PRACTICES
            );
            if (practices && practices.length > 0) {
                this.practices.set(practices);
            } else {
                // Guardar las prácticas predeterminadas
                await this.storageService.set(
                    this.STORAGE_KEYS.PRACTICES,
                    DEFAULT_PRACTICES
                );
            }

            // Cargar sesiones
            const sessions = await this.storageService.get<Session[]>(
                this.STORAGE_KEYS.SESSIONS
            );
            if (sessions) {
                // Convertir las fechas de string a Date
                const sessionsWithDates = sessions.map(s => ({
                    ...s,
                    date: new Date(s.date)
                }));
                this.sessions.set(sessionsWithDates);
            }

            // Cargar sesiones de meditación
            const meditationSessions = await this.storageService.get<MeditationSession[]>(
                this.STORAGE_KEYS.MEDITATION_SESSIONS
            );
            if (meditationSessions) {
                const meditationSessionsWithDates = meditationSessions.map(s => ({
                    ...s,
                    date: new Date(s.date)
                }));
                this.meditationSessions.set(meditationSessionsWithDates);
            }
        } catch (error) {
            console.error('Error cargando datos iniciales:', error);
        }
    }

    /**
     * Guarda o actualiza el usuario
     */
    async saveUser(user: User) {
        try {
            this.user.set(user);
            await this.storageService.set(this.STORAGE_KEYS.USER, user);
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

            await this.storageService.set(this.STORAGE_KEYS.SESSIONS, updatedSessions);

            return newSession;
        } catch (error) {
            console.error('Error agregando sesión:', error);
            throw error;
        }
    }

    /**
     * Agrega una nueva sesión de meditación (timer)
     */
    async addMeditationSession(
        durationMinutes: number,
        completedMinutes: number,
        completed: boolean,
        notes?: string
    ) {
        try {
            const newSession: MeditationSession = {
                id: this.generateId(),
                durationMinutes,
                completedMinutes,
                date: new Date(),
                completed,
                notes
            };

            const updatedSessions = [...this.meditationSessions(), newSession];
            this.meditationSessions.set(updatedSessions);

            await this.storageService.set(
                this.STORAGE_KEYS.MEDITATION_SESSIONS,
                updatedSessions
            );

            console.log('Sesión de meditación guardada:', newSession);
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
            await this.storageService.set(this.STORAGE_KEYS.SESSIONS, updatedSessions);
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

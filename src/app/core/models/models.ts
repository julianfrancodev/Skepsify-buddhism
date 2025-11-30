/**
 * Modelos de datos para la aplicación Skepsify Buddhism
 */

/**
 * Información del usuario practicante
 */
export interface User {
    id: string;
    name: string;
    refugeDate?: Date; // Fecha de toma de refugio
    refugeName?: string; // Nombre de refugio (ej: "Karma Dorje")
    refugeMeaning?: string; // Significado del nombre (ej: "Actividad Indestructible")
    createdAt: Date;
}

/**
 * Definición de una práctica de Ngöndro
 */
export interface Practice {
    id: string;
    name: string;
    emoji: string;
    targetRepetitions: number; // Meta de repeticiones (ej: 111,111)
    description?: string;
}

/**
 * Registro de una sesión de práctica
 */
export interface Session {
    id: string;
    practiceId: string;
    repetitions: number;
    date: Date;
    notes?: string;
}

/**
 * Registro de una sesión de meditación con temporizador
 */
export interface MeditationSession {
    id: string;
    durationMinutes: number; // Duración en minutos
    completedMinutes: number; // Minutos completados (puede ser menor si se pausó)
    date: Date;
    completed: boolean; // Si se completó el tiempo total
    notes?: string;
}

/**
 * Progreso acumulado de una práctica
 */
export interface PracticeProgress {
    practiceId: string;
    totalRepetitions: number;
    targetRepetitions: number;
    sessions: Session[];
    lastSessionDate?: Date;
    lastSessionRepetitions?: number;
}

/**
 * Estado completo de la aplicación
 */
export interface AppState {
    user: User | null;
    practices: Practice[];
    sessions: Session[];
    meditationSessions: MeditationSession[];
    practiceProgress: Map<string, PracticeProgress>;
}

/**
 * Prácticas predefinidas de Ngöndro
 */
export const DEFAULT_PRACTICES: Practice[] = [
    {
        id: '1',
        name: 'Refugio y Bodhicitta',
        emoji: '🙏',
        targetRepetitions: 111111,
        description: 'Práctica preliminar de refugio y generación de bodhicitta'
    },
    {
        id: '2',
        name: 'Vajrasattva',
        emoji: '✨',
        targetRepetitions: 111111,
        description: 'Práctica de purificación con el mantra de Vajrasattva'
    },
    {
        id: '3',
        name: 'Ofrenda de Mandala',
        emoji: '🪷',
        targetRepetitions: 111111,
        description: 'Acumulación de mérito mediante la ofrenda del mandala'
    },
    {
        id: '4',
        name: 'Guru Yoga',
        emoji: '🧘',
        targetRepetitions: 111111,
        description: 'Práctica de devoción y conexión con el maestro'
    }
];

/**
 * Programa de meditación (ej: Tonglen, Shamatha)
 */
export interface Program {
    id: string;
    title: string;
    description: string;
    category: 'compassion' | 'mindfulness' | 'wisdom' | 'concentration';
    level: 'beginner' | 'intermediate' | 'advanced' | 'all';
    coverImageUrl: string;
    instructor: string;
    totalSessions: number;
    estimatedDuration: number; // minutos totales
    isPremium: boolean;
    order: number;
    createdAt: Date;
}

/**
 * Paquete de sesiones dentro de un programa
 */
export interface MeditationPackage {
    id: string;
    programId: string;
    title: string;
    description: string;
    order: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    sessionCount: number;
    totalDuration: number;
    coverImageUrl?: string;
    isPremium: boolean;
}

/**
 * Sesión individual de meditación con audio
 */
export interface ProgramSession {
    id: string;
    programId: string;
    packageId: string;
    title: string;
    description: string;
    order: number;
    durationMinutes: number;
    audioUrl: string;
    transcriptUrl?: string;
    coverImageUrl?: string;
    instructor: string;
    isPremium: boolean;
    tags: string[];
}

/**
 * Progreso del usuario en un programa
 */
export interface ProgramProgress {
    programId: string;
    startedAt: Date;
    lastAccessedAt: Date;
    completedPackages: string[];
    completedSessions: string[];
    currentPackageId?: string;
    currentSessionId?: string;
    totalMinutesCompleted: number;
}

/**
 * Categoría con conteo de sesiones
 */
export interface CategoryWithCount {
    id: string;
    name: string;
    emoji: string;
    sessionCount: number;
}

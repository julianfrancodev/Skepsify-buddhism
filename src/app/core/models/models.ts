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

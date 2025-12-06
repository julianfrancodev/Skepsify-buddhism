import { Injectable, inject } from '@angular/core';
import {
    Firestore,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    arrayUnion,
    serverTimestamp,
    Timestamp
} from '@angular/fire/firestore';
import {
    Program,
    MeditationPackage,
    ProgramSession,
    ProgramProgress,
    MeditationSession,
    CategoryWithCount
} from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {
    private firestore: Firestore;

    constructor(firestore: Firestore) {
        this.firestore = firestore;
    }

    // ========================================
    // PROGRAMAS
    // ========================================

    /**
     * Obtiene todos los programas de meditación
     */
    async getPrograms(): Promise<Program[]> {
        try {
            const q = query(
                collection(this.firestore, 'programs'),
                orderBy('order', 'asc')
            );
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    id: doc.id,
                    createdAt: data['createdAt'] instanceof Timestamp
                        ? data['createdAt'].toDate()
                        : new Date(data['createdAt'])
                } as Program;
            });
        } catch (error) {
            console.error('Error obteniendo programas:', error);
            return [];
        }
    }

    /**
     * Obtiene un programa específico por ID
     */
    async getProgramById(programId: string): Promise<Program | null> {
        try {
            const docRef = doc(this.firestore, 'programs', programId);
            const snapshot = await getDoc(docRef);

            if (!snapshot.exists()) {
                return null;
            }

            const data = snapshot.data();
            return {
                ...data,
                id: snapshot.id,
                createdAt: data['createdAt'] instanceof Timestamp
                    ? data['createdAt'].toDate()
                    : new Date(data['createdAt'])
            } as Program;
        } catch (error) {
            console.error('Error obteniendo programa:', error);
            return null;
        }
    }

    /**
     * Obtiene programas por categoría
     */
    async getProgramsByCategory(category: string): Promise<Program[]> {
        try {
            const allPrograms = await this.getPrograms();
            return allPrograms.filter(p => p.category === category);
        } catch (error) {
            console.error('Error obteniendo programas por categoría:', error);
            return [];
        }
    }

    /**
     * Obtiene categorías aleatorias con conteo de sesiones
     */
    async getRandomCategories(count: number = 4): Promise<CategoryWithCount[]> {
        try {
            const allPrograms = await this.getPrograms();

            // Agrupar por categoría y contar sesiones
            const categoryMap = new Map<string, CategoryWithCount>();

            for (const program of allPrograms) {
                const category = program.category;
                if (!categoryMap.has(category)) {
                    categoryMap.set(category, {
                        id: category,
                        name: this.getCategoryName(category),
                        emoji: this.getCategoryEmoji(category),
                        sessionCount: 0
                    });
                }

                // Contar sesiones del programa
                const packages = await this.getPackagesByProgram(program.id);
                for (const pkg of packages) {
                    const sessions = await this.getSessionsByPackage(program.id, pkg.id);
                    const currentCount = categoryMap.get(category)!.sessionCount;
                    categoryMap.set(category, {
                        ...categoryMap.get(category)!,
                        sessionCount: currentCount + sessions.length
                    });
                }
            }

            // Convertir a array y mezclar aleatoriamente
            const categories = Array.from(categoryMap.values());
            const shuffled = categories.sort(() => Math.random() - 0.5);

            // Retornar las primeras 'count' categorías
            return shuffled.slice(0, count);
        } catch (error) {
            console.error('Error obteniendo categorías aleatorias:', error);
            return [];
        }
    }

    /**
     * Helper: Obtiene el nombre de la categoría
     */
    private getCategoryName(category: string): string {
        const names: Record<string, string> = {
            'compassion': 'Compasión',
            'mindfulness': 'Atención Plena',
            'wisdom': 'Sabiduría',
            'concentration': 'Concentración'
        };
        return names[category] || category;
    }

    /**
     * Helper: Obtiene el emoji de la categoría
     */
    private getCategoryEmoji(category: string): string {
        const emojis: Record<string, string> = {
            'compassion': '❤️',
            'mindfulness': '😌',
            'wisdom': '✨',
            'concentration': '🧘'
        };
        return emojis[category] || '📿';
    }

    /**
     * Obtiene las categorías disponibles
     */
    getAvailableCategories(): string[] {
        return ['compassion', 'mindfulness', 'wisdom', 'concentration'];
    }

    /**
     * Obtiene 2 categorías aleatorias basadas en el día actual
     * Las categorías cambian automáticamente cada día
     */
    getDailyCategories(): string[] {
        const categories = this.getAvailableCategories();
        const today = new Date();

        // Crear una "semilla" basada en el día del año
        const dayOfYear = Math.floor(
            (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
        );

        // Usar la semilla para generar índices "aleatorios" pero consistentes por día
        const shuffled = this.seededShuffle([...categories], dayOfYear);

        // Retornar las primeras 2
        return shuffled.slice(0, 2);
    }

    /**
     * Obtiene programas de las categorías del día
     */
    async getDailyPrograms(): Promise<{ categories: string[], programs: Program[] }> {
        try {
            const dailyCategories = this.getDailyCategories();
            const allPrograms = await this.getPrograms();

            // Filtrar programas que pertenezcan a las categorías del día
            const programs = allPrograms.filter(p =>
                dailyCategories.includes(p.category)
            );

            return {
                categories: dailyCategories,
                programs
            };
        } catch (error) {
            console.error('Error obteniendo programas del día:', error);
            return { categories: [], programs: [] };
        }
    }

    /**
     * Mezcla un array usando una semilla (para consistencia diaria)
     * @private
     */
    private seededShuffle<T>(array: T[], seed: number): T[] {
        const shuffled = [...array];
        let currentSeed = seed;

        for (let i = shuffled.length - 1; i > 0; i--) {
            // Generar número "aleatorio" basado en la semilla
            currentSeed = (currentSeed * 9301 + 49297) % 233280;
            const randomIndex = Math.floor((currentSeed / 233280) * (i + 1));

            // Intercambiar elementos
            [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
        }

        return shuffled;
    }

    // ========================================
    // PAQUETES
    // ========================================

    /**
     * Obtiene todos los paquetes de un programa
     */
    async getPackagesByProgram(programId: string): Promise<MeditationPackage[]> {
        try {
            const q = query(
                collection(this.firestore, `programs/${programId}/packages`),
                orderBy('order', 'asc')
            );
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            } as MeditationPackage));
        } catch (error) {
            console.error('Error obteniendo paquetes:', error);
            return [];
        }
    }

    /**
     * Obtiene un paquete específico
     */
    async getPackageById(programId: string, packageId: string): Promise<MeditationPackage | null> {
        try {
            const docRef = doc(this.firestore, `programs/${programId}/packages/${packageId}`);
            const snapshot = await getDoc(docRef);

            if (!snapshot.exists()) {
                return null;
            }

            return {
                ...snapshot.data(),
                id: snapshot.id
            } as MeditationPackage;
        } catch (error) {
            console.error('Error obteniendo paquete:', error);
            return null;
        }
    }

    // ========================================
    // SESIONES
    // ========================================

    /**
     * Obtiene todas las sesiones de un paquete
     */
    async getSessionsByPackage(programId: string, packageId: string): Promise<ProgramSession[]> {
        try {
            const q = query(
                collection(this.firestore, `programs/${programId}/packages/${packageId}/sessions`),
                orderBy('order', 'asc')
            );
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            } as ProgramSession));
        } catch (error) {
            console.error('Error obteniendo sesiones:', error);
            return [];
        }
    }

    /**
     * Obtiene una sesión específica
     */
    async getSessionById(
        programId: string,
        packageId: string,
        sessionId: string
    ): Promise<ProgramSession | null> {
        try {
            const docRef = doc(
                this.firestore,
                `programs/${programId}/packages/${packageId}/sessions/${sessionId}`
            );
            const snapshot = await getDoc(docRef);

            if (!snapshot.exists()) {
                return null;
            }

            return {
                ...snapshot.data(),
                id: snapshot.id
            } as ProgramSession;
        } catch (error) {
            console.error('Error obteniendo sesión:', error);
            return null;
        }
    }

    /**
     * Obtiene 2 sesiones aleatorias que cambian cada día
     * Las sesiones son consistentes durante todo el día
     */
    async getDailySessions(): Promise<ProgramSession[]> {
        try {
            const allPrograms = await this.getPrograms();
            const allSessions: ProgramSession[] = [];

            // Recopilar todas las sesiones de todos los programas y paquetes
            for (const program of allPrograms) {
                const packages = await this.getPackagesByProgram(program.id);
                for (const pkg of packages) {
                    const sessions = await this.getSessionsByPackage(program.id, pkg.id);
                    allSessions.push(...sessions);
                }
            }

            if (allSessions.length === 0) {
                return [];
            }

            // Crear una "semilla" basada en el día del año
            const today = new Date();
            const dayOfYear = Math.floor(
                (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
            );

            // Mezclar sesiones usando la semilla del día
            const shuffled = this.seededShuffle([...allSessions], dayOfYear);

            // Retornar las primeras 2 sesiones
            return shuffled.slice(0, 2);
        } catch (error) {
            console.error('Error obteniendo sesiones diarias:', error);
            return [];
        }
    }

    /**
     * Obtiene 1 sesión aleatoria que cambia cada día (versión optimizada)
     * Útil para mostrar una "tendencia del día" o sesión destacada
     */
    async getDailySession(): Promise<ProgramSession | null> {
        try {
            const sessions = await this.getDailySessions();
            return sessions.length > 0 ? sessions[0] : null;
        } catch (error) {
            console.error('Error obteniendo sesión diaria:', error);
            return null;
        }
    }

    // ========================================
    // PROGRESO DEL USUARIO
    // ========================================

    /**
     * Obtiene el progreso del usuario en un programa
     */
    async getProgramProgress(uid: string, programId: string): Promise<ProgramProgress | null> {
        try {
            const docRef = doc(this.firestore, `users/${uid}/programProgress/${programId}`);
            const snapshot = await getDoc(docRef);

            if (!snapshot.exists()) {
                return null;
            }

            const data = snapshot.data();
            return {
                ...data,
                startedAt: data['startedAt'] instanceof Timestamp
                    ? data['startedAt'].toDate()
                    : new Date(data['startedAt']),
                lastAccessedAt: data['lastAccessedAt'] instanceof Timestamp
                    ? data['lastAccessedAt'].toDate()
                    : new Date(data['lastAccessedAt'])
            } as ProgramProgress;
        } catch (error) {
            console.error('Error obteniendo progreso:', error);
            return null;
        }
    }

    /**
     * Actualiza el progreso del usuario en un programa
     */
    async updateProgramProgress(uid: string, progress: Partial<ProgramProgress>): Promise<void> {
        try {
            const docRef = doc(this.firestore, `users/${uid}/programProgress/${progress.programId}`);
            await setDoc(docRef, {
                ...progress,
                lastAccessedAt: serverTimestamp()
            }, { merge: true });
        } catch (error) {
            console.error('Error actualizando progreso:', error);
            throw error;
        }
    }

    /**
     * Marca una sesión como completada
     */
    async markSessionCompleted(
        uid: string,
        programId: string,
        sessionId: string,
        minutesCompleted: number
    ): Promise<void> {
        try {
            const progressRef = doc(this.firestore, `users/${uid}/programProgress/${programId}`);
            const progress = await getDoc(progressRef);

            if (progress.exists()) {
                // Actualizar progreso existente
                await updateDoc(progressRef, {
                    completedSessions: arrayUnion(sessionId),
                    lastAccessedAt: serverTimestamp(),
                    totalMinutesCompleted: (progress.data()['totalMinutesCompleted'] || 0) + minutesCompleted
                });
            } else {
                // Crear nuevo progreso
                await setDoc(progressRef, {
                    programId,
                    startedAt: serverTimestamp(),
                    lastAccessedAt: serverTimestamp(),
                    completedSessions: [sessionId],
                    completedPackages: [],
                    totalMinutesCompleted: minutesCompleted
                });
            }
        } catch (error) {
            console.error('Error marcando sesión completada:', error);
            throw error;
        }
    }

    // ========================================
    // SESIONES DE MEDITACIÓN DEL USUARIO
    // ========================================

    /**
     * Agrega una sesión de meditación al historial del usuario
     */
    async addMeditationSession(uid: string, session: MeditationSession): Promise<void> {
        try {
            const docRef = doc(this.firestore, `users/${uid}/meditationSessions/${session.id}`);
            await setDoc(docRef, {
                ...session,
                date: Timestamp.fromDate(session.date)
            });

            console.log('✅ Sesión de meditación guardada en Firestore');
        } catch (error) {
            console.error('❌ Error guardando sesión de meditación:', error);
            throw error;
        }
    }

    /**
     * Obtiene todas las sesiones de meditación del usuario
     */
    async getMeditationSessions(uid: string): Promise<MeditationSession[]> {
        try {
            const q = query(
                collection(this.firestore, `users/${uid}/meditationSessions`),
                orderBy('date', 'desc')
            );
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    id: doc.id,
                    date: data['date'] instanceof Timestamp
                        ? data['date'].toDate()
                        : new Date(data['date'])
                } as MeditationSession;
            });
        } catch (error) {
            console.error('Error obteniendo sesiones de meditación:', error);
            return [];
        }
    }

    /**
     * Elimina una sesión de meditación
     */
    async deleteMeditationSession(uid: string, sessionId: string): Promise<void> {
        try {
            const docRef = doc(this.firestore, `users/${uid}/meditationSessions/${sessionId}`);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error eliminando sesión:', error);
            throw error;
        }
    }

    // ========================================
    // PROGRAMAS FAVORITOS
    // ========================================

    /**
     * Agrega un programa a favoritos
     */
    async addToFavorites(uid: string, programId: string): Promise<void> {
        try {
            const docRef = doc(this.firestore, `users/${uid}/favoritePrograms/${programId}`);
            await setDoc(docRef, {
                addedAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error agregando a favoritos:', error);
            throw error;
        }
    }

    /**
     * Elimina un programa de favoritos
     */
    async removeFromFavorites(uid: string, programId: string): Promise<void> {
        try {
            const docRef = doc(this.firestore, `users/${uid}/favoritePrograms/${programId}`);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error eliminando de favoritos:', error);
            throw error;
        }
    }

    /**
     * Obtiene los IDs de programas favoritos del usuario
     */
    async getFavorites(uid: string): Promise<string[]> {
        try {
            const snapshot = await getDocs(
                collection(this.firestore, `users/${uid}/favoritePrograms`)
            );
            return snapshot.docs.map(doc => doc.id);
        } catch (error) {
            console.error('Error obteniendo favoritos:', error);
            return [];
        }
    }
}

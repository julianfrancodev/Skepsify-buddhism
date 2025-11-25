import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

/**
 * Servicio wrapper para Ionic Storage
 * Maneja la inicialización y operaciones básicas de almacenamiento
 */
@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private _storage: Storage | null = null;
    private _initPromise: Promise<void>;

    constructor(private storage: Storage) {
        this._initPromise = this.init();
    }

    /**
     * Inicializa el storage
     */
    private async init(): Promise<void> {
        const storage = await this.storage.create();
        this._storage = storage;
        console.log('Storage inicializado correctamente');
    }

    /**
     * Asegura que el storage esté inicializado antes de cualquier operación
     */
    private async ensureInitialized(): Promise<void> {
        await this._initPromise;
    }

    /**
     * Guarda un valor en el storage
     */
    async set(key: string, value: any): Promise<void> {
        try {
            await this.ensureInitialized();
            await this._storage?.set(key, value);
            console.log(`Guardado en storage: ${key}`, value);
        } catch (error) {
            console.error(`Error guardando ${key}:`, error);
            throw error;
        }
    }

    /**
     * Obtiene un valor del storage
     */
    async get<T>(key: string): Promise<T | null> {
        try {
            await this.ensureInitialized();
            const value = await this._storage?.get(key);
            console.log(`Obtenido de storage: ${key}`, value);
            return value;
        } catch (error) {
            console.error(`Error obteniendo ${key}:`, error);
            return null;
        }
    }

    /**
     * Elimina un valor del storage
     */
    async remove(key: string): Promise<void> {
        try {
            await this.ensureInitialized();
            await this._storage?.remove(key);
        } catch (error) {
            console.error(`Error eliminando ${key}:`, error);
            throw error;
        }
    }

    /**
     * Limpia todo el storage
     */
    async clear(): Promise<void> {
        try {
            await this.ensureInitialized();
            await this._storage?.clear();
        } catch (error) {
            console.error('Error limpiando storage:', error);
            throw error;
        }
    }

    /**
     * Obtiene todas las claves almacenadas
     */
    async keys(): Promise<string[]> {
        try {
            await this.ensureInitialized();
            return await this._storage?.keys() || [];
        } catch (error) {
            console.error('Error obteniendo claves:', error);
            return [];
        }
    }
}

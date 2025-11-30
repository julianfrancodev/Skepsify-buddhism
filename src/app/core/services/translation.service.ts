import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'es' | 'en' | 'pt';

export interface LanguageOption {
    code: Language;
    name: string;
    flag: string;
}

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    currentLanguage = signal<Language>('es');

    private readonly STORAGE_KEY = 'app-language';

    readonly availableLanguages: LanguageOption[] = [
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'pt', name: 'Português', flag: '🇧🇷' }
    ];

    constructor(private translate: TranslateService) {
        this.initializeLanguage();
    }

    private initializeLanguage() {
        // Intentar cargar idioma guardado
        const savedLang = localStorage.getItem(this.STORAGE_KEY) as Language;

        if (savedLang && this.isValidLanguage(savedLang)) {
            this.setLanguage(savedLang);
        } else {
            // Detectar idioma del navegador
            const browserLang = this.translate.getBrowserLang();
            const defaultLang: Language = this.isValidLanguage(browserLang as Language)
                ? (browserLang as Language)
                : 'es';

            this.setLanguage(defaultLang);
        }
    }

    private isValidLanguage(lang: string): lang is Language {
        return ['es', 'en', 'pt'].includes(lang);
    }

    setLanguage(lang: Language) {
        this.translate.use(lang);
        this.currentLanguage.set(lang);
        localStorage.setItem(this.STORAGE_KEY, lang);
        console.log(`✅ Idioma cambiado a: ${lang}`);
    }

    getLanguage(): Language {
        return this.currentLanguage();
    }

    getLanguageName(code: Language): string {
        const lang = this.availableLanguages.find(l => l.code === code);
        return lang ? lang.name : code;
    }

    // Helper para obtener traducciones programáticamente
    instant(key: string, params?: any): string {
        return this.translate.instant(key, params);
    }

    // Helper para obtener traducciones async (útil para inicialización)
    get(key: string, params?: any) {
        return this.translate.get(key, params);
    }
}

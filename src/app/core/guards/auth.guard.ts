import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard para proteger rutas que requieren autenticación
 * Espera a que Firebase termine de cargar antes de verificar
 */
export const authGuard = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Esperar a que Firebase termine de cargar
    while (authService.isLoading()) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Si el usuario está autenticado, permitir acceso
    if (authService.isAuthenticated()) {
        console.log('✅ Acceso permitido - Usuario autenticado');
        return true;
    }

    // Si no está autenticado, redirigir al login
    console.log('🚫 Acceso denegado - Redirigiendo a login');
    router.navigate(['/onboarding/login']);
    return false;
};

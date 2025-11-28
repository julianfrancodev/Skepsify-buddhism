import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard para proteger rutas que requieren autenticación
 */
export const authGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Si el usuario está autenticado, permitir acceso
    if (authService.isAuthenticated()) {
        return true;
    }

    // Si no está autenticado, redirigir al login
    console.log('🚫 Acceso denegado - Redirigiendo a login');
    router.navigate(['/onboarding/login']);
    return false;
};

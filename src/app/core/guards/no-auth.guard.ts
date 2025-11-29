import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard para rutas de onboarding (login, register, welcome)
 * Redirige a usuarios autenticados a la app principal
 */
export const noAuthGuard = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Esperar a que Firebase termine de cargar
    while (authService.isLoading()) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Si el usuario YA está autenticado, redirigir a la app
    if (authService.isAuthenticated()) {
        console.log('✅ Usuario ya autenticado - Redirigiendo a app');
        router.navigate(['/tabs/tab1']);
        return false; // Bloquear acceso al onboarding
    }

    // Si NO está autenticado, permitir acceso al onboarding
    console.log('🔓 Acceso permitido a onboarding');
    return true;
};

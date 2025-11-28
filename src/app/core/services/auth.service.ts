import { Injectable, signal } from '@angular/core';
import {
    Auth,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    User,
    onAuthStateChanged,
    updateProfile
} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    // Signals para el estado de autenticación
    currentUser = signal<User | null>(null);
    isAuthenticated = signal<boolean>(false);
    isLoading = signal<boolean>(true);

    constructor(
        private auth: Auth,
        private router: Router
    ) {
        // Escuchar cambios en el estado de autenticación
        onAuthStateChanged(this.auth, (user) => {
            this.currentUser.set(user);
            this.isAuthenticated.set(!!user);
            this.isLoading.set(false);

            if (user) {
                console.log('✅ Usuario autenticado:', user.email);
            } else {
                console.log('❌ No hay usuario autenticado');
            }
        });
    }

    /**
     * Iniciar sesión con Google
     */
    async signInWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');

            const result = await signInWithPopup(this.auth, provider);

            console.log('✅ Login con Google exitoso:', result.user.email);

            // Navegar a la app principal
            this.router.navigate(['/tabs/tab1']);

            return result.user;
        } catch (error: any) {
            console.error('❌ Error en login con Google:', error);
            throw this.handleAuthError(error);
        }
    }

    /**
     * Registrar nuevo usuario con email y contraseña
     */
    async signUpWithEmail(email: string, password: string, displayName?: string) {
        try {
            const result = await createUserWithEmailAndPassword(this.auth, email, password);

            // Actualizar el nombre del usuario si se proporciona
            if (displayName && result.user) {
                await updateProfile(result.user, { displayName });
            }

            console.log('✅ Registro exitoso:', result.user.email);

            // Navegar a la app principal
            this.router.navigate(['/tabs/tab1']);

            return result.user;
        } catch (error: any) {
            console.error('❌ Error en registro:', error);
            throw this.handleAuthError(error);
        }
    }

    /**
     * Iniciar sesión con email y contraseña
     */
    async signInWithEmail(email: string, password: string) {
        try {
            const result = await signInWithEmailAndPassword(this.auth, email, password);

            console.log('✅ Login con email exitoso:', result.user.email);

            // Navegar a la app principal
            this.router.navigate(['/tabs/tab1']);

            return result.user;
        } catch (error: any) {
            console.error('❌ Error en login con email:', error);
            throw this.handleAuthError(error);
        }
    }

    /**
     * Cerrar sesión
     */
    async logout() {
        try {
            await signOut(this.auth);
            console.log('✅ Sesión cerrada');
            this.router.navigate(['/onboarding/login']);
        } catch (error) {
            console.error('❌ Error al cerrar sesión:', error);
            throw error;
        }
    }

    /**
     * Obtener el usuario actual
     */
    getCurrentUser(): User | null {
        return this.currentUser();
    }

    /**
     * Manejo de errores de autenticación
     */
    private handleAuthError(error: any): Error {
        let message = 'Error en la autenticación';

        switch (error.code) {
            case 'auth/email-already-in-use':
                message = 'Este correo ya está registrado';
                break;
            case 'auth/invalid-email':
                message = 'Correo electrónico inválido';
                break;
            case 'auth/operation-not-allowed':
                message = 'Operación no permitida';
                break;
            case 'auth/weak-password':
                message = 'La contraseña es muy débil (mínimo 6 caracteres)';
                break;
            case 'auth/user-disabled':
                message = 'Esta cuenta ha sido deshabilitada';
                break;
            case 'auth/user-not-found':
                message = 'Usuario no encontrado';
                break;
            case 'auth/wrong-password':
                message = 'Contraseña incorrecta';
                break;
            case 'auth/invalid-credential':
                message = 'Credenciales inválidas';
                break;
            case 'auth/popup-closed-by-user':
                message = 'Inicio de sesión cancelado';
                break;
            default:
                message = error.message || 'Error desconocido';
        }

        return new Error(message);
    }
}

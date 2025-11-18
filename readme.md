# Documentación del Proyecto: Skepsify Buddhism

Bienvenido a la documentación de Skepsify Buddhism, una aplicación móvil desarrollada con Ionic y Angular para guiar a los usuarios en las prácticas del Budismo Tibetano.

## 1. Descripción General

La aplicación ofrece una experiencia de onboarding a través de un carrusel de bienvenida, una pantalla de inicio de sesión/registro y está preparada para expandirse con más funcionalidades. Está construida como una aplicación móvil multiplataforma utilizando tecnologías web modernas.

## 2. Stack Tecnológico

- **Framework Principal**: [Ionic](https://ionicframework.com/) con [Angular](https://angular.io/) (Standalone Components).
- **UI/Navegación**: Componentes de Ionic UI.
- **Carrusel**: [Swiper.js](https://swiperjs.com/) (integrado como Web Components).
- **Plataforma Nativa**: [Capacitor](https://capacitorjs.com/) para el acceso a funcionalidades nativas y la compilación para iOS y Android.
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/).
- **Estilos**: SCSS.

## 3. Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu sistema:

- [Node.js](https://nodejs.org/) (versión LTS recomendada)
- [NPM](https://www.npmjs.com/) (se instala con Node.js)
- [Ionic CLI](https://ionicframework.com/docs/cli)
  ```bash
  npm install -g @ionic/cli
  ```
- [Android Studio](https://developer.android.com/studio) (para compilar y ejecutar en Android).

## 4. Instalación

1.  Clona el repositorio en tu máquina local.
2.  Navega a la raíz del proyecto.
3.  Instala todas las dependencias del proyecto:
    ```bash
    npm install
    ```

## 5. Servidor de Desarrollo

Para ejecutar la aplicación en tu navegador y aprovechar el *hot-reloading* durante el desarrollo, utiliza el siguiente comando:

```bash
ionic serve
```

Esto abrirá la aplicación en `http://localhost:8100`.

## 6. Flujo de Trabajo con Capacitor (Para Android/iOS)

Capacitor es el puente que conecta tu aplicación web con las plataformas nativas.

### Paso 1: Construir la Aplicación Web

Antes de cualquier operación con Capacitor, debes tener una versión de producción de tu código web.

```bash
ionic build
```

Este comando compila tu aplicación y la coloca en la carpeta `www`, que es el directorio que Capacitor utiliza.

### Paso 2: Agregar la Plataforma Nativa

Si es la primera vez que configuras el proyecto o si eliminaste la carpeta nativa, necesitas agregar la plataforma.

```bash
ionic cap add android
```

Esto creará una carpeta `android` con un proyecto nativo de Android.

### Paso 3: Sincronizar los Cambios

Cada vez que realices cambios significativos en tu código web o en las dependencias, debes sincronizarlos con el proyecto nativo.

```bash
ionic cap sync android
```

Este comando realiza dos acciones clave:
1.  Copia los archivos de la carpeta `www` a la carpeta del proyecto nativo.
2.  Actualiza las dependencias y configuraciones nativas.

### Paso 4: Abrir en el IDE Nativo

Para compilar, ejecutar en un emulador o en un dispositivo físico, abre el proyecto en Android Studio.

```bash
ionic cap open android
```

Desde Android Studio, puedes usar el botón "Run" (▶️) para instalar y lanzar la aplicación.

### Solución de Problemas Comunes

A veces, los proyectos nativos pueden corromperse. Una solución efectiva es eliminar la carpeta de la plataforma y volver a generarla.

```bash
# 1. Eliminar la carpeta de Android
rm -rf android

# 2. Volver a agregar la plataforma
ionic cap add android

# 3. Sincronizar de nuevo
ionic cap sync android
```

## 7. Estructura y Componentes Clave

- **`src/app/components/`**: Contiene componentes reutilizables como `ButtonComponent`.
- **`src/app/onboarding/`**: Agrupa las páginas de bienvenida (`welcome`) e inicio de sesión (`login`).
- **`src/global.scss`**: Archivo de estilos globales. Incluye una corrección importante para respetar las áreas seguras (notch) en dispositivos modernos.
- **`src/main.ts`**: Punto de entrada de la aplicación donde se registran los elementos de Swiper.js.
- **`declarations.d.ts`**: Archivo de declaración de tipos para solucionar problemas de TypeScript con módulos que no tienen tipos definidos, como `swiper/element/bundle`.

---

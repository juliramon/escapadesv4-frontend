# Atajos de Banners Publicitarios para Historias

Esta funcionalidad permite a los usuarios insertar banners publicitarios dinámicamente en las descripciones de historias utilizando atajos especiales (shortcodes).

## Cómo usar los atajos

### Atajo básico

```
[ad_banner]
```

Inserta un banner publicitario con la configuración predeterminada.

### Atajos con configuración personalizada

#### Especificar slot publicitario

```
[ad_banner slot="4940975412"]
```

#### Configurar formato del banner

```
[ad_banner format="horizontal"]
[ad_banner format="rectangle"]
[ad_banner format="vertical"]
```

#### Banner no responsivo

```
[ad_banner responsive="false"]
```

#### Agregar clases CSS personalizadas

```
[ad_banner style="max-width-md"]
[ad_banner style="text-center mt-8"]
```

#### Combinando múltiples atributos

```
[ad_banner slot="9222117584" format="horizontal" responsive="true"]
```

## Slots disponibles

-   **4940975412** - Banner Lateral (usado en el sidebar)
-   **9222117584** - Banner Horizontal (usado al final de artículos)
-   **1234567890** - Banner Cuadrado (para contenido inline)

## Formatos soportados

-   **auto** - Formato automático (predeterminado)
-   **rectangle** - Banner rectangular
-   **horizontal** - Banner horizontal
-   **vertical** - Banner vertical

## Ejemplos de uso práctico

### Banner en medio del contenido

```html
<p>Este es el primer párrafo de la historia...</p>

[ad_banner slot="4940975412" format="rectangle"]

<p>Aquí continúa el contenido después del banner...</p>
```

### Banner al final de una sección

```html
<h2>Consejos para viajar</h2>
<p>Contenido de la sección...</p>

[ad_banner format="horizontal"]

<h2>Siguiente sección</h2>
```

### Banner con estilos personalizados

```html
<p>Párrafo introductorio...</p>

[ad_banner slot="9222117584" style="mt-8 mb-8"]

<p>Continuación del contenido...</p>
```

## Cómo funciona técnicamente

1. **Parser personalizado**: El archivo `utils/ContentParser.js` procesa el contenido HTML y reemplaza los atajos por componentes React.

2. **Procesamiento**: Los atajos se convierten en componentes `AdBanner` con las propiedades especificadas.

3. **Renderizado**: Durante la visualización de la historia, los atajos se renderizan como banners publicitarios reales.

## Integración en el editor

En los formularios de creación y edición de historias, encontrarás:

1. **Botón helper**: "Insertar Banner Publicitario" que abre un modal con opciones.
2. **Interfaz visual**: Selección de slots, formatos y configuraciones.
3. **Vista previa**: El atajo generado se muestra antes de insertarlo.
4. **Inserción automática**: El atajo se inserta directamente en el editor TipTap.

## Consideraciones importantes

-   Los banners se cargan dinámicamente usando Google AdSense
-   Mantiene compatibilidad con la funcionalidad existente de galerías de imágenes
-   Los atajos son preservados cuando se edita el contenido
-   El componente es completamente accesible y SEO-friendly

## Archivos modificados

-   `utils/ContentParser.js` - Parser principal para procesar atajos
-   `components/editor/AdBannerShortcodeHelper.jsx` - Helper visual para editores
-   `pages/histories/[slug].js` - Visualización de historias
-   `pages/nova-historia.js` - Formulario de nueva historia
-   `pages/histories/[slug]/editar.js` - Formulario de edición

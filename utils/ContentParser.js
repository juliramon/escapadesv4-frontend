import parse from "html-react-parser";
import AdBanner from "../components/ads/AdBanner";

/**
 * Parser personalizado para contenido de historias que soporta atajos especiales
 * Soporta:
 * - [ad_banner] - Banner publicitario básico
 * - [ad_banner slot="123456789"] - Banner con slot específico
 * - [ad_banner format="auto" responsive="true"] - Banner con configuración personalizada
 */

const ContentParser = {
	/**
	 * Procesa el contenido HTML y reemplaza los atajos por componentes React
	 * @param {string} htmlContent - Contenido HTML a procesar
	 * @param {object} options - Opciones adicionales
	 * @returns {Array} Array de elementos React procesados
	 */
	parseContent: (htmlContent, options = {}) => {
		if (!htmlContent) return [];

		let processedContent = htmlContent;
		const adBannerComponents = [];

		// Expresión regular para encontrar atajos de banners publicitarios
		const adBannerRegex = /\[ad_banner(?:\s+([^[\]]*))?\]/gi;

		// Reemplazar atajos de banners con marcadores temporales
		let match;
		let bannerIndex = 0;

		while ((match = adBannerRegex.exec(htmlContent)) !== null) {
			const fullMatch = match[0];
			const attributes = match[1];

			// Parsear atributos del atajo
			const bannerProps = parseAdBannerAttributes(attributes);

			// Crear un marcador temporal único
			const placeholder = `__AD_BANNER_${bannerIndex}__`;

			// Guardar el componente para insertar después
			adBannerComponents[bannerIndex] = createAdBannerComponent(
				bannerProps,
				bannerIndex
			);

			// Reemplazar el atajo con el marcador
			processedContent = processedContent.replace(
				fullMatch,
				`<div class="ad-banner-placeholder" data-banner-id="${bannerIndex}">${placeholder}</div>`
			);

			bannerIndex++;
		}

		// Parsear el HTML procesado
		const parsedElements = parse(processedContent, {
			replace: (domNode) => {
				// Reemplazar marcadores de banners con componentes React
				if (
					domNode.type === "tag" &&
					domNode.name === "div" &&
					domNode.attribs?.class === "ad-banner-placeholder"
				) {
					const bannerId = parseInt(
						domNode.attribs["data-banner-id"]
					);
					return adBannerComponents[bannerId];
				}
			},
		});

		// Convertir a array si no lo es ya
		return Array.isArray(parsedElements)
			? parsedElements
			: [parsedElements];
	},

	/**
	 * Procesa contenido con soporte para galerías de imágenes (funcionalidad existente)
	 * @param {string} description - Descripción de la historia
	 * @param {Array} images - Array de imágenes disponibles
	 * @param {Function} buildImagesGrid - Función para construir la galería
	 * @param {object} welcomeText - Texto de bienvenida opcional
	 * @returns {Array} Array de elementos procesados
	 */
	parseStoryContent: (
		description,
		images = [],
		buildImagesGrid = null,
		welcomeText = null
	) => {
		if (!description) return [];

		// Primero procesar los atajos de banners
		let parsedDescription = ContentParser.parseContent(description);
		let slicedDescription = [];

		// Convertir a array plano
		parsedDescription.forEach((el) => slicedDescription.push(el));

		// Insertar texto de bienvenida si está disponible
		if (slicedDescription.length > 1 && welcomeText) {
			slicedDescription.splice(1, 0, welcomeText);
		}

		// Procesar galerías de imágenes (funcionalidad existente)
		if (buildImagesGrid && images.length > 0) {
			slicedDescription.forEach((el, idx) => {
				if (
					typeof el?.props?.children === "string" &&
					el.props.children.includes("post_images")
				) {
					const str = el.props.children;
					const found = str.replace(/^\D+/g, "");
					const foundArr = found.slice(0, -2).split(",");
					const startingIndex = foundArr[0];
					const endIndex = foundArr[1];

					slicedDescription[idx] = buildImagesGrid(
						startingIndex,
						endIndex
					);
				}
			});
		}

		return slicedDescription;
	},
};

/**
 * Parsea los atributos de un atajo de banner publicitario
 * @param {string} attributeString - String con los atributos
 * @returns {object} Objeto con los atributos parseados
 */
function parseAdBannerAttributes(attributeString) {
	const defaultProps = {
		"data-ad-format": "auto",
		"data-full-width-responsive": "true",
	};

	if (!attributeString) {
		return defaultProps;
	}

	const props = { ...defaultProps };

	// Expresión regular para encontrar atributos key="value" o key='value'
	const attrRegex = /(\w+)=["']([^"']+)["']/g;
	let match;

	while ((match = attrRegex.exec(attributeString)) !== null) {
		const [, key, value] = match;

		switch (key.toLowerCase()) {
			case "slot":
				props["data-ad-slot"] = value;
				break;
			case "format":
				props["data-ad-format"] = value;
				break;
			case "responsive":
				props["data-full-width-responsive"] = value;
				break;
			case "style":
				props["customstyles"] = value;
				break;
			default:
				// Permitir atributos personalizados con prefijo data-
				if (key.startsWith("data-")) {
					props[key] = value;
				}
				break;
		}
	}

	return props;
}

/**
 * Crea un componente AdBanner con las propiedades especificadas
 * @param {object} props - Propiedades del banner
 * @param {number} index - Índice único del banner
 * @returns {JSX.Element} Componente AdBanner
 */
function createAdBannerComponent(props, index) {
	return (
		<div key={`ad-banner-${index}`} className="ad-banner-container my-6">
			<span className="inline-block text-xs text-gray-500 mb-2">
				Anunci
			</span>
			<AdBanner {...props} />
		</div>
	);
}

export default ContentParser;

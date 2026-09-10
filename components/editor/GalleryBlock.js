import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import GalleryBlockView from "./GalleryBlockView";

/**
 * Bloc de galeria dins del cos de la publicació.
 *
 * El contingut es desa com un `<div data-gallery="url1|url2">` buit, o sigui
 * que viatja dins del mateix HTML de la descripció: no depèn de cap llista
 * d'imatges adjuntes ni de comptar posicions com feia `post_images(n, m)`.
 * `ContentParser` el torna a convertir en una graella al web públic.
 *
 * La funció de pujada arriba per referència (`uploadRef`) i no per valor:
 * depèn del slug de la fitxa, que canvia mentre s'escriu, i reconstruir
 * l'editor a cada lletra buidaria el text.
 */
const SEPARATOR = "|";

const GalleryBlock = Node.create({
	name: "galleryBlock",
	group: "block",
	atom: true,
	draggable: true,
	selectable: true,

	addOptions() {
		return {
			/** { current: (formData) => Promise<{path}> } */
			uploadRef: null,
		};
	},

	addAttributes() {
		return {
			images: {
				default: [],
				parseHTML: (element) => {
					const raw = element.getAttribute("data-gallery") || "";
					return raw.split(SEPARATOR).filter(Boolean);
				},
				renderHTML: (attributes) => ({
					"data-gallery": (attributes.images || []).join(SEPARATOR),
				}),
			},
		};
	},

	parseHTML() {
		return [{ tag: "div[data-gallery]" }];
	},

	renderHTML({ HTMLAttributes }) {
		return [
			"div",
			mergeAttributes(HTMLAttributes, { class: "content-gallery" }),
		];
	},

	addNodeView() {
		return ReactNodeViewRenderer(GalleryBlockView);
	},

	addCommands() {
		return {
			insertGalleryBlock:
				(images = []) =>
				({ commands }) =>
					commands.insertContent({
						type: this.name,
						attrs: { images },
					}),
		};
	},
});

export default GalleryBlock;

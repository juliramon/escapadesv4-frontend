import Link from "@tiptap/extension-link";

/**
 * Extensió d'enllaços de tots els editors de l'àrea d'administració.
 *
 * Abans cada formulari configurava `Link` pel seu compte, i els modals de
 * destinacions, categories i categories de viatge no el carregaven: el botó
 * d'enllaç hi fallava i, en obrir un text que ja tenia enllaços, l'editor els
 * esborrava en silenci.
 *
 * A la versió 2.0 de `@tiptap/extension-link` el `rel` no és un atribut de
 * l'enllaç sinó una opció de l'extensió, i per defecte tots els enllaços
 * sortien amb `target="_blank"` i `rel="noopener noreferrer nofollow"`. Aquí
 * `target` i `rel` passen a ser de cada enllaç, sense valor per defecte:
 *  - el contingut ja publicat els porta escrits i es conserva igual;
 *  - el cercador d'enllaços (`LinkPicker`) decideix quins en porta cadascun
 *    segons si és intern o extern (`linkAttributesFor`).
 *
 * Ctrl/⌘+K obre el cercador des de dins del text. L'escolta `EditorNavbar`.
 */
const SiteLink = Link.extend({
	addAttributes() {
		return {
			...this.parent?.(),
			target: { default: null },
			rel: { default: null },
		};
	},

	addKeyboardShortcuts() {
		return {
			"Mod-k": () => {
				this.editor.emit("openLinkPicker");
				return true;
			},
		};
	},
}).configure({
	openOnClick: false,
	autolink: false,
	defaultProtocol: "https",
	HTMLAttributes: { target: null, rel: null },
});

export default SiteLink;

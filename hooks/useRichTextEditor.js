import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

/**
 * Editor de text ric per als camps llargs de l'àrea d'administració.
 *
 * Els modals de destinació i de categoria de viatge en necessiten sis cadascun
 * i els declaraven un per un, amb el seu `useState` i el seu `onUpdate`, per
 * acabar guardant només l'HTML: dotze blocs de vint línies idèntiques. Aquí el
 * contingut es llegeix directament de l'editor quan es desa.
 *
 * @param {string} content HTML inicial del camp.
 */
const useRichTextEditor = (content) =>
	useEditor({
		extensions: [StarterKit, Image],
		content: content || "",
		autofocus: false,
		parseOptions: { preserveWhitespace: true },
	});

/** HTML actual d'un editor, o cadena buida si encara no està llest. */
const htmlOf = (editor) => (editor ? editor.getHTML() : "");

export default useRichTextEditor;
export { htmlOf };

import { EditorContent } from "@tiptap/react";
import EditorNavbar from "../editor/EditorNavbar";

/**
 * Camp de text ric amb etiqueta i barra d'eines.
 *
 * El trio etiqueta + `EditorNavbar` + `EditorContent` estava repetit dotze
 * vegades entre els modals de destinació i de categoria de viatge.
 */
const RichTextField = ({ label, hint, editor }) => (
	<div className="form__group">
		<span className="form__label">{label}</span>
		{hint ? <span className="form__text_info">{hint}</span> : null}
		<EditorNavbar editor={editor} />
		<EditorContent editor={editor} className="form-composer__editor" />
	</div>
);

export default RichTextField;

const EditorNavbar = ({ editor }) => {
	const addImage = () => {
		const url = window.prompt("URL");
		if (url) {
			editor.chain().focus().setImage({ src: url }).run();
		}
	};

	if (!editor) {
		return null;
	}
	return (
		<div className="editor-bar__wrapper">
			<button
				onClick={() => editor.chain().focus().toggleBold().run()}
				className={editor.isActive("bold") ? "is-active" : ""}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="icon icon-tabler icon-tabler-bold"
					width="44"
					height="44"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="#000000"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M7 5h6a3.5 3.5 0 0 1 0 7h-6z" />
					<path d="M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7" />
				</svg>
			</button>
			<button
				onClick={() => editor.chain().focus().toggleItalic().run()}
				className={editor.isActive("italic") ? "is-active" : ""}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="icon icon-tabler icon-tabler-italic"
					width="44"
					height="44"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="#000000"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<line x1="11" y1="5" x2="17" y2="5" />
					<line x1="7" y1="19" x2="13" y2="19" />
					<line x1="14" y1="5" x2="10" y2="19" />
				</svg>
			</button>
			<button
				onClick={() => editor.chain().focus().toggleStrike().run()}
				className={editor.isActive("strike") ? "is-active" : ""}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="icon icon-tabler icon-tabler-strikethrough"
					width="44"
					height="44"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="#000000"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M7 5v9a5 5 0 0 0 10 0v-9" />
					<path d="M4 12h16" />
				</svg>
			</button>
			<button
				onClick={() => editor.chain().focus().setParagraph().run()}
				className={editor.isActive("paragraph") ? "is-active" : ""}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="icon icon-tabler icon-tabler-letter-p"
					width="44"
					height="44"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="#000000"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M7 20v-16h5.5a4 4 0 0 1 0 9h-5.5" />
				</svg>
			</button>
			<button
				onClick={() => editor.chain().focus().toggleBlockquote().run()}
				className={editor.isActive("blockquote") ? "is-active" : ""}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="icon icon-tabler icon-tabler-blockquote"
					width={44}
					height={44}
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="#000000"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M6 15h15"></path>
					<path d="M21 19h-15"></path>
					<path d="M15 11h6"></path>
					<path d="M21 7h-6"></path>
					<path d="M9 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2"></path>
					<path d="M3 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2"></path>
				</svg>
			</button>
			<button
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="icon icon-tabler icon-tabler-h-2"
					width="44"
					height="44"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="#000000"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M17 12a2 2 0 1 1 4 0c0 .591 -.417 1.318 -.816 1.858l-3.184 4.143l4 -.001" />
					<path d="M4 6v12" />
					<path d="M12 6v12" />
					<path d="M11 18h2" />
					<path d="M3 18h2" />
					<path d="M4 12h8" />
					<path d="M3 6h2" />
					<path d="M11 6h2" />
				</svg>
			</button>
			<button
				onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
				className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="icon icon-tabler icon-tabler-h-3"
					width={44}
					height={44}
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="#000000"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M19 14a2 2 0 1 0 -2 -2"></path>
					<path d="M17 16a2 2 0 1 0 2 -2"></path>
					<path d="M4 6v12"></path>
					<path d="M12 6v12"></path>
					<path d="M11 18h2"></path>
					<path d="M3 18h2"></path>
					<path d="M4 12h8"></path>
					<path d="M3 6h2"></path>
					<path d="M11 6h2"></path>
				</svg>
			</button>
			<button
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				className={editor.isActive("bulletList") ? "is-active" : ""}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="icon icon-tabler icon-tabler-list"
					width="44"
					height="44"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="#000000"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<line x1="9" y1="6" x2="20" y2="6" />
					<line x1="9" y1="12" x2="20" y2="12" />
					<line x1="9" y1="18" x2="20" y2="18" />
					<line x1="5" y1="6" x2="5" y2="6.01" />
					<line x1="5" y1="12" x2="5" y2="12.01" />
					<line x1="5" y1="18" x2="5" y2="18.01" />
				</svg>
			</button>
			<button
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				className={editor.isActive("orderedList") ? "is-active" : ""}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="icon icon-tabler icon-tabler-list-numbers"
					width="44"
					height="44"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="#000000"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M11 6h9" />
					<path d="M11 12h9" />
					<path d="M12 18h8" />
					<path d="M4 16a2 2 0 1 1 4 0c0 .591 -.5 1 -1 1.5l-3 2.5h4" />
					<path d="M6 10v-6l-2 2" />
				</svg>
			</button>
			<button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="icon icon-tabler icon-tabler-border-horizontal"
					width="44"
					height="44"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="#000000"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<line x1="4" y1="12" x2="20" y2="12" />
					<line x1="4" y1="4" x2="4" y2="4.01" />
					<line x1="8" y1="4" x2="8" y2="4.01" />
					<line x1="12" y1="4" x2="12" y2="4.01" />
					<line x1="16" y1="4" x2="16" y2="4.01" />
					<line x1="20" y1="4" x2="20" y2="4.01" />
					<line x1="4" y1="8" x2="4" y2="8.01" />
					<line x1="12" y1="8" x2="12" y2="8.01" />
					<line x1="20" y1="8" x2="20" y2="8.01" />
					<line x1="4" y1="16" x2="4" y2="16.01" />
					<line x1="12" y1="16" x2="12" y2="16.01" />
					<line x1="20" y1="16" x2="20" y2="16.01" />
					<line x1="4" y1="20" x2="4" y2="20.01" />
					<line x1="8" y1="20" x2="8" y2="20.01" />
					<line x1="12" y1="20" x2="12" y2="20.01" />
					<line x1="16" y1="20" x2="16" y2="20.01" />
					<line x1="20" y1="20" x2="20" y2="20.01" />
				</svg>
			</button>
			<button onClick={() => addImage()}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="icon icon-tabler icon-tabler-photo"
					width="44"
					height="44"
					viewBox="0 0 24 24"
					strokeWidth="1.5"
					stroke="#000000"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<line x1="15" y1="8" x2="15.01" y2="8" />
					<rect x="4" y="4" width="16" height="16" rx="3" />
					<path d="M4 15l4 -4a3 5 0 0 1 3 0l5 5" />
					<path d="M14 14l1 -1a3 5 0 0 1 3 0l2 2" />
				</svg>
			</button>
		</div>
	);
};

export default EditorNavbar;

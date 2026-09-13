import { useEffect, useId, useMemo, useRef, useState } from "react";
import useLinkTargets, { resolveTargetUrl } from "../../hooks/useLinkTargets";
import {
	findLinkTarget,
	isInternalHref,
	linkAttributesFor,
	looksLikeUrl,
	searchLinkTargets,
	toHref,
} from "../../utils/internalLinks";

const MAX_RESULTS = 8;

/**
 * Cercador d'enllaços de l'editor, a l'estil del de WordPress.
 *
 * S'escriu el títol d'una entrada del web i es tria d'entre els resultats; si
 * el que s'escriu és una URL, s'hi enllaça directament.
 *  - Amb text seleccionat, l'enllaç s'aplica al text.
 *  - Sense selecció, s'insereix el títol de l'entrada ja enllaçat.
 *  - Amb el cursor dins d'un enllaç, el modifica i permet treure'l.
 *
 * Es pinta dins de la barra de l'editor, que és sticky i fa de referència per
 * a la posició absoluta.
 */
const LinkPicker = ({ editor, onClose, toggleRef }) => {
	const rootRef = useRef(null);
	const inputRef = useRef(null);
	const listRef = useRef(null);
	const listId = useId();

	// L'editor perd el focus mentre s'escriu aquí, però conserva la selecció
	// al seu estat: es llegeix un sol cop, en obrir.
	const [current] = useState(() => editor.getAttributes("link"));
	const isEditing = Boolean(current.href);

	const [query, setQuery] = useState(current.href || "");
	const [activeIndex, setActiveIndex] = useState(0);
	// `null` vol dir que no s'ha tocat: interns a la mateixa pestanya, externs
	// a una de nova, com fins ara.
	const [newTabChoice, setNewTabChoice] = useState(
		isEditing ? current.target === "_blank" : null,
	);

	const { status, targets, partial } = useLinkTargets();
	const [isResolving, setIsResolving] = useState(false);
	// Es torna a posar a `true` a cada muntatge: Fast Refresh executa la neteja
	// i torna a muntar, i si no, `apply` no enllaçaria res després d'un canvi
	// en calent.
	const isMounted = useRef(false);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	const isUrlQuery = looksLikeUrl(query);

	const options = useMemo(() => {
		if (isUrlQuery) {
			const href = toHref(query);
			const match = findLinkTarget(targets, href);
			return [
				match
					? { key: match.key, target: match, href: match.url }
					: { key: `url:${href}`, target: null, href },
			];
		}
		return searchLinkTargets(targets, query, MAX_RESULTS).map((target) => ({
			key: target.key,
			target,
			href: target.url,
		}));
	}, [isUrlQuery, query, targets]);

	const activeOption = options[activeIndex] || null;
	const newTab =
		newTabChoice ?? (activeOption ? !isInternalHref(activeOption.href) : false);

	useEffect(() => {
		inputRef.current?.focus();
		inputRef.current?.select();
	}, []);

	useEffect(() => setActiveIndex(0), [query]);

	// Les fitxes necessiten una crida per saber la seva URL canònica: es fa
	// mentre l'opció està marcada, perquè en prémer Enter ja hi sigui.
	useEffect(() => {
		if (activeOption?.target) resolveTargetUrl(activeOption.target);
	}, [activeOption]);

	useEffect(() => {
		listRef.current
			?.querySelector(`[data-index="${activeIndex}"]`)
			?.scrollIntoView({ block: "nearest" });
	}, [activeIndex]);

	useEffect(() => {
		const handlePointer = (event) => {
			if (rootRef.current?.contains(event.target)) return;
			// El botó de la barra ja obre i tanca pel seu compte.
			if (toggleRef?.current?.contains(event.target)) return;
			onClose();
		};
		document.addEventListener("mousedown", handlePointer);
		return () => document.removeEventListener("mousedown", handlePointer);
	}, [onClose, toggleRef]);

	// El focus torna al text abans de desmuntar el cercador. Amb
	// `commands.focus()`, que va en diferit, acabava al <body>.
	const closeAndReturnFocus = () => {
		editor.view.focus();
		onClose();
	};

	const apply = async (option) => {
		if (!option || isResolving) return;
		let { href } = option;
		if (option.target) {
			setIsResolving(true);
			href = await resolveTargetUrl(option.target);
			// Si mentrestant s'ha tancat, no s'enllaça res.
			if (!isMounted.current) return;
		}
		const attrs = linkAttributesFor(
			href,
			newTabChoice ?? !isInternalHref(href),
		);
		const chain = editor.chain().focus();
		if (isEditing) {
			chain.extendMarkRange("link").setLink(attrs).run();
		} else if (editor.state.selection.empty) {
			chain
				.insertContent({
					type: "text",
					text: option.target ? option.target.title : option.href,
					marks: [{ type: "link", attrs }],
				})
				.run();
		} else {
			chain.setLink(attrs).run();
		}
		closeAndReturnFocus();
	};

	const removeLink = () => {
		editor.chain().focus().extendMarkRange("link").unsetLink().run();
		closeAndReturnFocus();
	};

	const handleKeyDown = (event) => {
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			if (!options.length) return;
			const step = event.key === "ArrowDown" ? 1 : -1;
			setActiveIndex(
				(index) => (index + step + options.length) % options.length,
			);
		} else if (event.key === "Enter") {
			// Els editors dels modals viuen dins d'un <form>.
			event.preventDefault();
			apply(activeOption);
		} else if (event.key === "Escape") {
			event.preventDefault();
			event.stopPropagation();
			closeAndReturnFocus();
		}
	};

	const heading = isUrlQuery
		? null
		: query.trim()
			? "Resultats"
			: "Publicat recentment";

	return (
		<div
			ref={rootRef}
			className="link-picker"
			role="dialog"
			aria-busy={isResolving}
			aria-label={isEditing ? "Modificar l'enllaç" : "Inserir un enllaç"}
		>
			<div className="link-picker__search">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<circle cx="10" cy="10" r="7" />
					<line x1="21" y1="21" x2="15" y2="15" />
				</svg>
				<input
					ref={inputRef}
					type="text"
					className="link-picker__input"
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Cerca una entrada del web o enganxa una URL"
					role="combobox"
					aria-expanded="true"
					aria-controls={listId}
					aria-autocomplete="list"
					aria-activedescendant={
						activeOption ? `${listId}-${activeIndex}` : undefined
					}
				/>
			</div>

			{heading ? <p className="link-picker__heading">{heading}</p> : null}

			<ul
				ref={listRef}
				id={listId}
				role="listbox"
				className="link-picker__results"
			>
				{status === "loading" && !isUrlQuery ? (
					<li className="link-picker__empty">
						Carregant les entrades del web…
					</li>
				) : null}
				{status === "error" && !isUrlQuery ? (
					<li className="link-picker__empty">
						No s'han pogut carregar les entrades. Pots enganxar-hi
						una URL igualment.
					</li>
				) : null}
				{status === "ready" && !options.length ? (
					<li className="link-picker__empty">
						Cap entrada coincideix amb «{query.trim()}».
					</li>
				) : null}
				{options.map((option, index) => (
					<li
						key={option.key}
						id={`${listId}-${index}`}
						role="option"
						aria-selected={index === activeIndex}
						data-index={index}
						className={`link-picker__option${
							index === activeIndex ? " is-active" : ""
						}`}
						onMouseEnter={() => setActiveIndex(index)}
						// Que el clic no tregui el focus del camp de cerca.
						onMouseDown={(event) => event.preventDefault()}
						onClick={() => apply(option)}
					>
						<span className="link-picker__option-text">
							<span className="link-picker__title">
								{option.target
									? option.target.title
									: "Enllaçar a aquesta adreça"}
							</span>
							<span className="link-picker__path">
								{option.target
									? option.target.displayPath
									: option.href}
							</span>
						</span>
						<span className="link-picker__type">
							{option.target
								? option.target.typeLabel
								: isInternalHref(option.href)
									? "Intern"
									: "Extern"}
						</span>
					</li>
				))}
			</ul>

			{partial ? (
				<p className="link-picker__notice">
					Alguns tipus de contingut no s'han pogut carregar.
				</p>
			) : null}

			<div className="link-picker__footer">
				<label className="link-picker__checkbox">
					<input
						type="checkbox"
						checked={newTab}
						onChange={(event) => setNewTabChoice(event.target.checked)}
					/>
					Obrir en una pestanya nova
				</label>
				{isEditing ? (
					<button
						type="button"
						className="link-picker__remove"
						onClick={removeLink}
					>
						Treure l'enllaç
					</button>
				) : null}
			</div>
			<p className="link-picker__hint">
				↑ ↓ per triar · Enter per enllaçar · Esc per tancar · Ctrl/⌘+K
				per obrir-lo des del text
			</p>
		</div>
	);
};

export default LinkPicker;

import Link from "next/link";
import { useState } from "react";
import { SeoScoreRing } from "../forms/SeoScore";

/**
 * Fila d'una entitat al llistat del panell d'administració.
 *
 * `CategoryBox`, `CharacteristicBox`, `DestinationBox` i `TripCategoryBox`
 * eren el mateix fitxer de dues-centes línies quatre vegades: només canviaven
 * el servei d'esborrat i quin modal d'edició obrien. Aquí queda el marcatge i
 * el desplegable, i cada cridador li passa el seu modal.
 */

const iconProps = {
	xmlns: "http://www.w3.org/2000/svg",
	className: "dropdown__menu_icon",
	width: "20",
	height: "20",
	viewBox: "0 0 24 24",
	strokeWidth: "1.5",
	stroke: "#00206B",
	fill: "none",
	strokeLinecap: "round",
	strokeLinejoin: "round",
};

const EntityRow = ({
	href,
	image,
	title,
	subtitle,
	seo = null,
	onEdit,
	onRemove,
	editModal,
}) => {
	const [dropdownVisibility, setDropdownVisibility] = useState(false);

	// Alguns documents antics no tenen subtítol: `subtitle.slice()` petava.
	const safeSubtitle = subtitle || "";
	const shortenedSubtitle =
		safeSubtitle.length > 70 ? `${safeSubtitle.slice(0, 70)}…` : safeSubtitle;

	return (
		<div className="content box flex items-center gap-3 w-full bg-white hover:bg-gray-50 border border-primary-50 rounded-xl mb-2 px-4 py-3 transition-colors">
			<Link href={href}>
				<a className="flex items-center gap-4 min-w-0 flex-1">
					<div className="flex items-center justify-center bg-gray-100 overflow-hidden h-12 w-12 shrink-0 rounded-lg border border-primary-50">
						{image ? (
							<img
								src={image}
								alt={title}
								className="w-full h-full object-cover"
							/>
						) : null}
					</div>
					<div className="min-w-0 flex-1">
						<h3 className="m-0 text-15 font-medium text-primary-500 truncate">
							{title}
						</h3>
						{shortenedSubtitle ? (
							<p className="m-0 text-xs text-primary-400 truncate">
								{shortenedSubtitle}
							</p>
						) : null}
					</div>
					{seo ? (
						<span className="shrink-0 flex items-center justify-end w-12">
							<SeoScoreRing
								score={seo.score}
								level={seo.level}
							/>
						</span>
					) : null}
				</a>
			</Link>

			<div className={`dropdown ${dropdownVisibility ? "open" : ""}`}>
				<button
					type="button"
					onClick={() => setDropdownVisibility(!dropdownVisibility)}
					aria-label="Accions"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="dropdown__icon"
						width="28"
						height="28"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="#00206B"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" />
						<circle cx="5" cy="12" r="1" />
						<circle cx="12" cy="12" r="1" />
						<circle cx="19" cy="12" r="1" />
					</svg>
				</button>
				<ul
					className={`dropdown__menu ${
						dropdownVisibility ? "block" : "hidden"
					}`}
				>
					<li className="border-b border-primary-50 w-full">
						<Link href={href}>
							<a className="dropdown__menu_item">
								<svg {...iconProps}>
									<path stroke="none" d="M0 0h24v24H0z" />
									<circle cx="12" cy="12" r="2" />
									<path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />
									<path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" />
								</svg>
								Visualitzar
							</a>
						</Link>
					</li>
					<li className="border-b border-primary-50 w-full">
						<button
							type="button"
							onClick={() => {
								setDropdownVisibility(false);
								onEdit();
							}}
							className="dropdown__menu_item"
						>
							<svg {...iconProps}>
								<path stroke="none" d="M0 0h24v24H0z" />
								<circle cx="6" cy="12" r="3" />
								<circle cx="18" cy="6" r="3" />
								<circle cx="18" cy="18" r="3" />
								<line x1="8.7" y1="10.7" x2="15.3" y2="7.3" />
								<line x1="8.7" y1="13.3" x2="15.3" y2="16.7" />
							</svg>
							Editar
						</button>
					</li>
					<li>
						<button
							type="button"
							onClick={onRemove}
							className="dropdown__menu_item"
						>
							<svg {...iconProps}>
								<path stroke="none" d="M0 0h24v24H0z" />
								<line x1="4" y1="7" x2="20" y2="7" />
								<line x1="10" y1="11" x2="10" y2="17" />
								<line x1="14" y1="11" x2="14" y2="17" />
								<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
								<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
							</svg>
							Eliminar
						</button>
					</li>
				</ul>
			</div>

			{editModal}
		</div>
	);
};

export default EntityRow;

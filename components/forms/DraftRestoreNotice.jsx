import { relativeTime } from "./AutosaveIndicator";

/**
 * Avís de l'esborrany local trobat en obrir un formulari.
 *
 * Apareix només quan el que hi ha desat al navegador no coincideix amb el que
 * s'acaba de carregar, o sigui quan de debò hi ha feina per recuperar.
 */
const DraftRestoreNotice = ({ savedAt, onRestore, onDiscard }) => (
	<div className="mb-4 flex flex-wrap items-center gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={20}
			height={20}
			viewBox="0 0 24 24"
			strokeWidth="1.8"
			stroke="currentColor"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="text-amber-600 shrink-0"
			aria-hidden="true"
		>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path d="M12 8v4l3 3" />
			<path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
		</svg>
		<p className="text-sm text-amber-900 m-0 flex-1 min-w-[16rem]">
			Hi ha un esborrany desat en aquest navegador
			{savedAt ? ` ${relativeTime(savedAt)}` : ""} amb canvis que no es
			van arribar a publicar.
		</p>
		<div className="flex items-center gap-2">
			<button
				type="button"
				className="button button__secondary button__xs w-auto"
				onClick={onDiscard}
			>
				Descartar
			</button>
			<button
				type="button"
				className="button button__primary button__xs w-auto"
				onClick={onRestore}
			>
				Recuperar l&apos;esborrany
			</button>
		</div>
	</div>
);

export default DraftRestoreNotice;

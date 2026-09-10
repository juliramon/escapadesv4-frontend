import { useRef, useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import {
	ACCEPTED_IMAGE_ACCEPT,
	isAcceptedImage,
	rejectedImageMessage,
} from "../../utils/uploads";

/**
 * Com es veu i s'edita el bloc de galeria dins de l'editor.
 *
 * Les imatges es pugen en el moment de triar-les —i no en desar la fitxa—
 * perquè el bloc necessita la URL definitiva per desar-la dins del text.
 */

const TrashIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={16}
		height={16}
		viewBox="0 0 24 24"
		strokeWidth="2"
		stroke="currentColor"
		fill="none"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
	>
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<path d="M4 7l16 0" />
		<path d="M10 11l0 6" />
		<path d="M14 11l0 6" />
		<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
		<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
	</svg>
);

const GalleryBlockView = ({ node, updateAttributes, deleteNode, extension, selected }) => {
	const images = node.attrs.images || [];
	const inputRef = useRef(null);
	const [isUploading, setIsUploading] = useState(false);
	const [error, setError] = useState("");

	const handleFiles = async (e) => {
		const files = Array.prototype.slice.call(e.target.files || []);
		e.target.value = "";
		if (!files.length) return;

		const rejected = files.filter((file) => !isAcceptedImage(file));
		if (rejected.length) {
			setError(rejectedImageMessage(rejected));
			return;
		}

		const upload = extension.options.uploadRef?.current;
		if (!upload) {
			setError(
				"Desa la publicació un primer cop i ja podràs pujar imatges aquí.",
			);
			return;
		}

		setError("");
		setIsUploading(true);

		try {
			const uploaded = [];
			for (const file of files) {
				const payload = new FormData();
				payload.append("imageUrl", file);
				const result = await upload(payload);
				if (result?.path) uploaded.push(result.path);
			}
			updateAttributes({ images: [...images, ...uploaded] });
		} catch (uploadError) {
			console.error(uploadError);
			setError("No s'han pogut pujar les imatges. Torna-ho a provar.");
		}

		setIsUploading(false);
	};

	const removeImage = (index) =>
		updateAttributes({
			images: images.filter((_, idx) => idx !== index),
		});

	return (
		<NodeViewWrapper
			className={`my-4 rounded-md border bg-gray-50 p-3 transition-colors ${
				selected ? "border-primary-500" : "border-primary-50"
			}`}
		>
			<div
				className="flex items-center justify-between gap-3 mb-2"
				contentEditable={false}
			>
				<span className="text-xs font-medium tracking-wide text-primary-500">
					Galeria d&apos;imatges
					{images.length ? ` · ${images.length}` : ""}
				</span>
				<div className="flex items-center gap-2">
					<button
						type="button"
						className="text-xs text-blue-600 underline"
						onClick={() => inputRef.current?.click()}
						disabled={isUploading}
					>
						{isUploading ? "Pujant…" : "Afegir imatges"}
					</button>
					<button
						type="button"
						className="text-primary-300 hover:text-red-600"
						onClick={deleteNode}
						aria-label="Esborrar la galeria"
					>
						<TrashIcon />
					</button>
				</div>
			</div>

			<input
				ref={inputRef}
				type="file"
				className="hidden"
				accept={ACCEPTED_IMAGE_ACCEPT}
				multiple
				onChange={handleFiles}
			/>

			{images.length === 0 ? (
				<button
					type="button"
					onClick={() => inputRef.current?.click()}
					className="w-full rounded-md border border-dashed border-primary-100 bg-white py-6 text-sm text-primary-400 hover:border-primary-300"
					contentEditable={false}
				>
					{isUploading
						? "Pujant les imatges…"
						: "Tria les imatges d'aquesta galeria"}
				</button>
			) : (
				<div className="flex flex-wrap -m-1" contentEditable={false}>
					{images.map((image, idx) => (
						<div
							key={`${image}-${idx}`}
							className="relative m-1 w-24 h-24 rounded-md overflow-hidden border border-primary-50"
						>
							<img
								src={image}
								alt=""
								className="w-full h-full object-cover"
							/>
							<button
								type="button"
								onClick={() => removeImage(idx)}
								aria-label={`Treure la imatge ${idx + 1}`}
								className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black bg-opacity-60 text-white hover:bg-opacity-90 flex items-center justify-center text-xs"
							>
								×
							</button>
						</div>
					))}
				</div>
			)}

			{error ? (
				<p className="m-0 mt-2 text-xs text-red-600" role="alert">
					{error}
				</p>
			) : null}
		</NodeViewWrapper>
	);
};

export default GalleryBlockView;

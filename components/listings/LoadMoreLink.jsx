import Link from "next/link";

/**
 * «Veure'n més» dels llistats.
 *
 * És un enllaç real a la pàgina següent (`utils/pagination.js`) perquè Google
 * pugui arribar a totes les entrades. Amb un clic normal no navega: carrega la
 * tanda següent i l'afegeix a la graella, com feia el botó. Amb Ctrl/Cmd, Maj
 * o el botó del mig s'obre la pàgina, com qualsevol altre enllaç.
 */
const LoadMoreLink = ({ href, isFetching, onLoadMore }) => {
	const handleClick = (event) => {
		if (
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey ||
			event.button !== 0
		) {
			return;
		}
		event.preventDefault();
		onLoadMore();
	};

	return (
		<div className="col-span-full w-full mt-10 flex justify-center">
			{isFetching ? (
				<span
					className="button button__primary button__lg"
					role="status"
				>
					<svg
						className="w-5 h-5 mr-2.5 text-primary-400 animate-spin dark:text-gray-600 fill-white"
						viewBox="0 0 100 101"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path
							d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
							fill="currentColor"
						/>
						<path
							d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
							fill="currentFill"
						/>
					</svg>
					Carregant
				</span>
			) : (
				<Link href={href} prefetch={false}>
					<a
						className="button button__primary button__lg"
						onClick={handleClick}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="icon icon-tabler icon-tabler-plus mr-2"
							width={20}
							height={20}
							viewBox="0 0 24 24"
							strokeWidth="2"
							stroke="currentColor"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<line x1={12} y1={5} x2={12} y2={19} />
							<line x1={5} y1={12} x2={19} y2={12} />
						</svg>
						Veure'n més
					</a>
				</Link>
			)}
		</div>
	);
};

export default LoadMoreLink;

/**
 * Avís dels formularis d'autenticació.
 *
 * Substitueix l'`<Alert variant="danger">` de react-bootstrap. El CSS de
 * Bootstrap no s'importa enlloc del projecte, o sigui que aquells avisos es
 * pintaven sense cap estil: text negre damunt de fons blanc, sense marge ni
 * color, i sovint ni s'entenia que fossin un error.
 */

const TONES = {
	error: {
		box: "bg-red-50 border-red-100 text-red-800",
		icon: "text-red-500",
		path: "M12 9v4M12 17h.01M10.24 4.76l-8.1 13.5A2 2 0 0 0 3.9 21h16.2a2 2 0 0 0 1.76 -2.74l-8.1 -13.5a2 2 0 0 0 -3.52 0z",
	},
	success: {
		box: "bg-emerald-50 border-emerald-100 text-emerald-800",
		icon: "text-emerald-600",
		path: "M5 12l5 5l10 -10",
	},
	info: {
		box: "bg-gray-50 border-primary-50 text-primary-500",
		icon: "text-primary-400",
		path: "M12 9h.01M11 12h1v4h1M12 21a9 9 0 1 1 0 -18a9 9 0 0 1 0 18z",
	},
};

const AuthAlert = ({ tone = "error", children }) => {
	if (!children) return null;
	const styles = TONES[tone] || TONES.error;

	return (
		<div
			className={`flex items-start gap-x-2.5 rounded-xl border px-4 py-3 mb-5 text-sm ${styles.box}`}
			role={tone === "error" ? "alert" : "status"}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={18}
				height={18}
				viewBox="0 0 24 24"
				strokeWidth="2"
				stroke="currentColor"
				fill="none"
				strokeLinecap="round"
				strokeLinejoin="round"
				className={`${styles.icon} shrink-0 mt-0.5`}
				aria-hidden="true"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d={styles.path} />
			</svg>
			<span>{children}</span>
		</div>
	);
};

export default AuthAlert;

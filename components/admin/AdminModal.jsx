/**
 * Contenidor dels modals de l'àrea d'administració.
 *
 * La capçalera amb el botó de tancar i l'estructura header/body/footer estava
 * copiada literalment a cadascun dels vuit modals de crear i editar i als tres
 * de filtrar. Qualsevol retoc s'havia de fer onze vegades.
 */
const AdminModal = ({
	visibility,
	hideModal,
	title,
	size = "",
	children,
	footer,
}) => {
	return (
		<div className={`modal ${visibility === true ? "active" : ""}`}>
			<div className={`modal__wrapper ${size}`}>
				<div className="modal__header">
					<span>{title}</span>
					<button
						type="button"
						onClick={() => hideModal()}
						className="modal__close"
						aria-label="Tancar"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="icon icon-tabler icon-tabler-x"
							width={24}
							height={24}
							viewBox="0 0 24 24"
							strokeWidth="2"
							stroke="currentColor"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path
								stroke="none"
								d="M0 0h24v24H0z"
								fill="none"
							></path>
							<line x1={18} y1={6} x2={6} y2={18}></line>
							<line x1={6} y1={6} x2={18} y2={18}></line>
						</svg>
					</button>
				</div>
				<div className="modal__body">{children}</div>
				{footer ? <div className="modal__footer">{footer}</div> : null}
			</div>
		</div>
	);
};

export default AdminModal;

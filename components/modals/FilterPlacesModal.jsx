import { useState, useEffect } from "react";
import ContentService from "../../services/contentService";
import FetchingSpinnerInline from "../global/FetchingSpinnerInline";

const FilterPlacesModal = ({
	isFilterModalOpen,
	hideModal,
	handleCheckRegion,
	handleCheckCategory,
	handleCheckSeason,
	handleSubmit,
}) => {
	const service = new ContentService();

	const initialState = {
		destinations: [],
		categories: [],
	};

	const [state, setState] = useState(initialState);

	useEffect(() => {
		const fetchData = async () => {
			const destinations = await service.getDestinations();
			const categories = await service.getCategories();
			setState({ ...state, destinations, categories });
		};
		fetchData();
	}, []);

	const getSelectedCount = () => {
		const regionCheckboxes = document.querySelectorAll(
			'input[name="placeRegion"]:checked'
		);
		const categoryCheckboxes = document.querySelectorAll(
			'input[name="placeCategory"]:checked'
		);
		const seasonCheckboxes = document.querySelectorAll(
			'input[name="placeSeason"]:checked'
		);

		return (
			regionCheckboxes.length +
			categoryCheckboxes.length +
			seasonCheckboxes.length
		);
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		const selectedCount = getSelectedCount();

		// Llamar al handleSubmit original pasando el evento y el contador
		handleSubmit(e, selectedCount);
	};

	return (
		<div className={`modal ${isFilterModalOpen == true ? "active" : ""}`}>
			<div className="modal__wrapper modal--md">
				<div className="modal__header">
					<span>Filtrar allotjaments</span>
					<button
						onClick={() => hideModal()}
						className="modal__close"
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
				<div className="modal__body">
					<form className="form flex flex-col gap-y-8 m-0">
						<div>
							<span className="text-xs uppercase text-primary-400 tracking-wider mb-2 block">
								Regió
							</span>
							{state.destinations.length > 0 &&
								state.destinations.map((destination) => (
									<fieldset key={destination._id}>
										<label className="cursor-pointer capitalize text-15">
											<input
												type="checkbox"
												name="placeRegion"
												// Les activitats i allotjaments referencien la destinació
												// per _id: el filtre ha d enviar l id, no el títol.
												id={destination._id}
												onChange={handleCheckRegion}
												className="mr-2"
											/>
											{destination.title}
										</label>
									</fieldset>
								))}
							{state.destinations.length === 0 && (
								<FetchingSpinnerInline />
							)}
						</div>
						<div>
							<span className="text-xs uppercase text-primary-400 tracking-wider mb-2 block">
								Categoria
							</span>
							{state.categories.length > 0 &&
								state.categories.map((category) => {
									if (category.isPlace) {
										return (
											<fieldset key={category._id}>
												<label className="cursor-pointer capitalize text-15">
													<input
														type="checkbox"
														name="placeCategory"
														id={category.name.toLowerCase()}
														onChange={
															handleCheckCategory
														}
														className="mr-2"
													/>
													{category.pluralName}
												</label>
											</fieldset>
										);
									}
								})}
							{state.categories.length === 0 && (
								<FetchingSpinnerInline />
							)}
						</div>
						<div>
							<span className="text-xs uppercase text-primary-400 tracking-wider mb-2 block">
								Temporada
							</span>
							<fieldset>
								<label className="cursor-pointer text-sm">
									<input
										type="checkbox"
										name="placeSeason"
										id="hivern"
										onChange={handleCheckSeason}
										className="mr-2"
									/>
									Hivern
								</label>
							</fieldset>
							<fieldset>
								<label className="cursor-pointer text-sm">
									<input
										type="checkbox"
										name="placeSeason"
										id="primavera"
										onChange={handleCheckSeason}
										className="mr-2"
									/>
									Primavera
								</label>
							</fieldset>
							<fieldset>
								<label className="cursor-pointer text-sm">
									<input
										type="checkbox"
										name="placeSeason"
										id="estiu"
										onChange={handleCheckSeason}
										className="mr-2"
									/>
									Estiu
								</label>
							</fieldset>
							<fieldset>
								<label className="cursor-pointer text-sm">
									<input
										type="checkbox"
										name="placeSeason"
										id="tardor"
										onChange={handleCheckSeason}
										className="mr-2"
									/>
									Tardor
								</label>
							</fieldset>
						</div>
					</form>
				</div>
				<div className="modal__footer">
					<button
						onClick={handleFormSubmit}
						type="submit"
						className="button button__primary button__med w-full"
					>
						Filtrar
					</button>
				</div>
			</div>
		</div>
	);
};

export default FilterPlacesModal;

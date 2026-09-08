import { useEffect, useState } from "react";
import ContentService from "../../services/contentService";
import FetchingSpinnerInline from "../global/FetchingSpinnerInline";
import AdminModal from "../admin/AdminModal";

/**
 * Modal de filtres dels llistats públics.
 *
 * Substitueix `FilterActivitiesModal`, `FilterPlacesModal` i
 * `FilterDestinationsModal`, que eren el mateix fitxer tres vegades: entre el
 * d'activitats i el de destinacions només hi havia vuit línies de diferència
 * (el nom del component, el títol i una etiqueta).
 *
 * `variant` decideix el prefix dels `name` dels checkbox i quines categories
 * s'ofereixen: les d'allotjament (`isPlace`) o les d'escapada.
 */

const SEASONS = [
	{ id: "hivern", label: "Hivern" },
	{ id: "primavera", label: "Primavera" },
	{ id: "estiu", label: "Estiu" },
	{ id: "tardor", label: "Tardor" },
];

const VARIANTS = {
	activities: {
		title: "Filtrar activitats",
		prefix: "activity",
		regionLabel: "Regió",
		showPlaceCategories: false,
	},
	places: {
		title: "Filtrar allotjaments",
		prefix: "place",
		regionLabel: "Regió",
		showPlaceCategories: true,
	},
	destinations: {
		title: "Filtrar resultats",
		prefix: "activity",
		regionLabel: "Destinació",
		// La pàgina de destinació barreja activitats i allotjaments, i abans
		// només oferia les categories d'escapada. Es manté igual.
		showPlaceCategories: false,
	},
};

const FilterListingsModal = ({
	variant = "activities",
	isFilterModalOpen,
	hideModal,
	handleCheckRegion,
	handleCheckCategory,
	handleCheckSeason,
	handleSubmit,
}) => {
	const config = VARIANTS[variant] || VARIANTS.activities;
	const service = new ContentService();

	const [state, setState] = useState({ destinations: [], categories: [] });

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [destinations, categories] = await Promise.all([
					service.getDestinations(),
					service.getCategories(),
				]);
				setState({
					destinations: destinations || [],
					categories: categories || [],
				});
			} catch (error) {
				setState({ destinations: [], categories: [] });
			}
		};
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getSelectedCount = () =>
		["Region", "Category", "Season"].reduce(
			(total, group) =>
				total +
				document.querySelectorAll(
					`input[name="${config.prefix}${group}"]:checked`
				).length,
			0
		);

	const handleFormSubmit = (e) => {
		e.preventDefault();
		handleSubmit(e, getSelectedCount());
	};

	const visibleCategories = state.categories.filter((category) =>
		config.showPlaceCategories ? category.isPlace : !category.isPlace
	);

	return (
		<AdminModal
			visibility={isFilterModalOpen}
			hideModal={hideModal}
			title={config.title}
			size="modal--md"
			footer={
				<button
					onClick={handleFormSubmit}
					type="submit"
					className="button button__primary button__med w-full"
				>
					Filtrar
				</button>
			}
		>
			<form className="form flex flex-col gap-y-8 m-0">
				<div>
					<span className="text-xs uppercase text-primary-400 tracking-wider mb-2 block">
						{config.regionLabel}
					</span>
					{state.destinations.length > 0 ? (
						state.destinations.map((destination) => (
							<fieldset key={destination._id}>
								<label className="cursor-pointer capitalize text-15">
									<input
										type="checkbox"
										name={`${config.prefix}Region`}
										// Les fitxes referencien la destinació
										// per _id: el filtre ha d'enviar l'id.
										id={destination._id}
										onChange={handleCheckRegion}
										className="mr-2"
									/>
									{destination.title}
								</label>
							</fieldset>
						))
					) : (
						<FetchingSpinnerInline />
					)}
				</div>

				<div>
					<span className="text-xs uppercase text-primary-400 tracking-wider mb-2 block">
						Categoria
					</span>
					{state.categories.length > 0 ? (
						visibleCategories.map((category) => (
							<fieldset key={category._id}>
								<label className="cursor-pointer capitalize text-15">
									<input
										type="checkbox"
										name={`${config.prefix}Category`}
										id={category.name.toLowerCase()}
										onChange={handleCheckCategory}
										className="mr-2"
									/>
									{category.pluralName}
								</label>
							</fieldset>
						))
					) : (
						<FetchingSpinnerInline />
					)}
				</div>

				<div>
					<span className="text-xs uppercase text-primary-400 tracking-wider mb-2 block">
						Temporada
					</span>
					{SEASONS.map((season) => (
						<fieldset key={season.id}>
							<label className="cursor-pointer text-sm">
								<input
									type="checkbox"
									name={`${config.prefix}Season`}
									id={season.id}
									onChange={handleCheckSeason}
									className="mr-2"
								/>
								{season.label}
							</label>
						</fieldset>
					))}
				</div>
			</form>
		</AdminModal>
	);
};

export default FilterListingsModal;

import ContentService from "../../services/contentService";
import DestinationRail from "../../components/homepage/DestinationRail";
import MobileAnchorAd from "../../components/ads/MobileAnchorAd";
import NavigationBar from "../../components/global/NavigationBar";
import Footer from "../../components/global/Footer";
import GlobalMetas from "../../components/head/GlobalMetas";
import BreadcrumbRichSnippet from "../../components/richsnippets/BreadcrumbRichSnippet";
import ListingHeader from "../../components/headers/ListingHeader";

const DestinationsList = ({ destinations }) => {
	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title="Destinacions per a escapades en parella"
				description="Totes les destinacions d'Escapades en Parella: zones de Catalunya i rodalia amb allotjaments i activitats triades per gaudir-les en parella."
				url="https://escapadesenparella.cat/destinacions"
				image="https://res.cloudinary.com/juligoodie/image/upload/v1632416196/getaways-guru/zpdiudqa0bk8sc3wfyue.jpg"
				canonical="https://escapadesenparella.cat/destinacions"
			/>
			{/* Rich snippets */}
			<BreadcrumbRichSnippet
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Destinacions"
				page2Url="https://escapadesenparella.cat/destinacions"
			/>
			<div className="destinations">
				<NavigationBar />
				<main>
					<ListingHeader
						title={`Destinacions per descobrir en parella`}
						subtitle={`Tria una zona i descobreix-hi els allotjaments amb encant i les activitats que valen la pena per a una escapada a dos`}
						breadcrumbLevel1={"Destinacions"}
					/>

					<section className="pt-6 md:pt-8 pb-12 lg:pb-20">
						<div className="container">
							{destinations.length > 0 ? (
								<DestinationRail
									destinations={destinations}
									className="lg:grid-cols-3 xl:grid-cols-4"
								/>
							) : (
								<p className="text-center mx-auto text-lg">
									Encara no hi ha destinacions publicades.
									<br /> Torna-ho a provar més endavant.
								</p>
							)}
						</div>
					</section>
				</main>
			</div>
			<Footer
				logo_url={
					"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
				}
			/>
			<MobileAnchorAd />
		</>
	);
};

export async function getStaticProps() {
	const service = new ContentService();
	let destinations = [];

	try {
		destinations = (await service.getDestinations()) || [];
	} catch (err) {
		destinations = [];
	}

	return {
		props: {
			// Els documents de destinació porten `reviewText`, `seoText` i un
			// iframe de mapa que aquesta pàgina no pinta; enviar-ho tot al
			// client inflava el JSON de la pàgina sense cap motiu.
			destinations: destinations.map(({ slug, title, subtitle, image }) => ({
				slug,
				title,
				subtitle: subtitle || null,
				image: image || null,
			})),
		},
		revalidate: 120,
	};
}

export default DestinationsList;

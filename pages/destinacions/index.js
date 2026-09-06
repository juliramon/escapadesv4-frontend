import Link from "next/link";
import ContentService from "../../services/contentService";
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

					<section className="py-8 md:py-12 lg:pb-20">
						<div className="container">
							{destinations.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 gap-5">
									{destinations.map((el) => (
										<article key={el._id}>
											<Link
												href={`/destinacions/${el.slug}`}
											>
												<a
													title={el.title}
													className="block w-full h-full rounded-xl overflow-hidden group relative"
												>
													<picture className="block w-full aspect-w-3 aspect-h-4 overflow-hidden">
														<img
															src={el.image}
															alt={el.title}
															className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-500 ease-in-out"
															width={390}
															height={525}
															loading="lazy"
														/>
													</picture>
													<div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
														<span className="block text-white text-lg font-semibold">
															{el.title}
														</span>
														{el.subtitle ? (
															<span className="block text-white/80 text-sm mt-0.5">
																{el.subtitle}
															</span>
														) : null}
													</div>
												</a>
											</Link>
										</article>
									))}
								</div>
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
			destinations,
		},
		revalidate: 120,
	};
}

export default DestinationsList;

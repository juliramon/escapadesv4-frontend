import Footer from "../components/global/Footer";
import NavigationBar from "../components/global/NavigationBar";
import GlobalMetas from "../components/head/GlobalMetas";
import BreadcrumbRichSnippet from "../components/richsnippets/BreadcrumbRichSnippet";
import ShareBarModal from "../components/social/ShareBarModal";

const PressMedia = () => {
	const programesAnemDeCap = [
		{
			title: "Anem de cap | T'escapes amb mi per Sant Jordi?",
			thumbnail:
				"/premsa-i-mitjans/thumbnails-anem-de-cap/anem-de-cap-01-sant-jordi.jpg",
			url: "https://www.laxarxames.cat/movie-details/3697261",
			year: 2024,
			duration: 27,
			summary:
				"'Anem de cap' a Sant Jordi: amb Tac12 vivim l'inici de la Setmana Medieval de Montblanc, on la llegenda de Sant Jordi cobra vida. L'escriptora Anna Fité ens porta els millors llibres per regalar als més petits aquesta diada. El tàndem Juli i Andrea ens descobreixen tres escapades en parella perfectes per primavera. Amb Canal Taronja Anoia escalem per tenir les millors vistes. I l'escriptora Eva Baltasar comparteix amb nosaltres com són els seus cap de setmana. I és que els dissabtes, diumenges i les diades de Sant Jordi són insuperables... si anem de cap!",
		},
		{
			title: "Anem de cap | La màgia del cap de setmana",
			thumbnail:
				"/premsa-i-mitjans/thumbnails-anem-de-cap/anem-de-cap-02-magia-cap-de-setmana.jpg",
			url: "https://www.laxarxames.cat/movie-details/3697261",
			year: 2024,
			duration: 27,
			summary:
				"Al magazín 'Anem de cap' visitem la Fira del Vi de Falset i el festival Una Tona de Màgia i també fem una escapada fins al Santuari de Cabrera i els Aiguamolls de l'Empordà. Però si preferiu quedar-vos a casa, llavors no us podeu perdre la selecció de les millors estrenes musicals de la setmana i els discs que cal revisitar que ens fa en Julen, que també ens recomana 'Rocketman'. A més, la periodista Norma Levrero treu la seva maneta d'idees amb cinc activitats per fer amb canalla els dies de pluja, i l'actor Àlex Brendemühl comparteix amb nosaltres les seves estrenes i els seus caps de setmana.",
		},
		{
			title: "Anem de cap | Mil i una destinacions",
			thumbnail:
				"/premsa-i-mitjans/thumbnails-anem-de-cap/anem-de-cap-03-mil-i-una-destinacions.jpg",
			url: "https://www.laxarxames.cat/movie-details/3697261",
			year: 2024,
			duration: 27,
			summary:
				"Al magazín 'Anem de cap' visitem les Fires de Maig i la dels Enamorats de Vilafranca del Penedès, el Parc de la Draga de Banyoles i la ruta de l'arròs de Pals. També tenim temps de relaxar-nos a casa entre llibres, d'apuntar la maneta d'idees de la Norma Levrero amb cinc llocs on anar amb criatures aquest cap de setmana o de preparar-nos pel festival Floral de Vilassar de la mà de la seva directora Judit Neddermann.",
		},
		{
			title: "Anem de cap | Temps de vi",
			thumbnail:
				"/premsa-i-mitjans/thumbnails-anem-de-cap/anem-de-cap-02-temps-de-vi.jpg",
			url: "https://www.laxarxames.cat/movie-details/3777444",
			year: 2024,
			duration: 27,
			summary:
				"A l'Anem de cap' ens fem ressò de dues propostes amb el vi com a protagonista: les fires Temps de Vi de Vilanova i la Geltrú i Reus Viu el Vi de la capital del Baix Camp. També descobrim el paratge natural dels Esterregalls d'All, els millors indrets del Pallars Sobirà i una activitat marítima per a tots els públics a la costa de Sant Feliu de Guíxols. Tot plegat, ambientat amb les millors propostes musicals de la mà de Julen.",
		},
		{
			title: "Anem de cap | Escapades refrescants",
			thumbnail:
				"/premsa-i-mitjans/thumbnails-anem-de-cap/anem-de-cap-03-escapades-refrescants.jpg",
			url: "https://www.laxarxames.cat/movie-details/3810264",
			year: 2024,
			duration: 27,
			summary:
				"Al magazín 'Anem de cap' fem una escapada en caiac al cap de Creus, a les basses del Coll de Nargó i al cim del Parc Natural dels Ports per combatre la calor. També sortim de festa major per Sant Pere a Reus, descobrim on s'escapa els caps de setmana el periodista Víctor Amela, ens convertim en apicultors per un dia a la comarca dels Ports i desembalem tres jocs de taula per riure amb amics i en família.",
		},
		{
			title: "Anem de cap | L'època del renaixement",
			thumbnail:
				"/premsa-i-mitjans/thumbnails-anem-de-cap/anem-de-cap-06-epoca-renaixement.jpg",
			url: "https://www.laxarxames.cat/movie-details/3854335",
			year: 2024,
			duration: 27,
			summary:
				"Al magazín 'Anem de cap' ens traslladem a la Tortosa del segle XVI i visitem la fira del Renaixament i segunit a l'època dels cavallers jugarem a castells i catapultes amb en Jordi Pota. En Juli i l'Andrea ens portaran en parella a fer barranquisme a Castellar del Vallès, a visitar un dels paratges més desconeguts del Cap de Creus i al Baix Camp a descobrir la platja Sant Jordi. A més la Norma ens proposa cinc activitats per prendre la fresca, i descobrim com és el cap de setmana ideal d'Agnès Busquets.",
		},
	];

	const programesRadioVoltrega = [
		{
			title: "T9 213É | La Tarda 04-07-24",
			thumbnail: "/premsa-i-mitjans/thumbnails-la-tarda/la-tarda-01.jpg",
			url: "https://open.spotify.com/episode/0Wh4CLUyzUTjg2dv38zw3j?si=cad083e3f54a4988",
			year: 2024,
			duration: 30,
			summary:
				"Avui us passarem una entrevista que vaig fer fa uns dies a l'Andrea Prat i en Juli Ramon, i em direu qui són ells, doncs són els creadors del compte d'Instagram @ESCAPADESENPARELLA on fan uns viatges i aventures xulíssimes principalment pel territori Català. Ténen actualment més de 19.000 seguidors i com que estem a l'estiu vam creure que era un bon moment per fer aquesta entrevista perquè ens inspiréssin per trobar algun lloc per fer una escapada divertida durant aquests temps de vacances.",
		},
	];

	const programesEspaiInternet = [
		{
			title: "Espai Internet | Escapades en parella per Catalunya",
			thumbnail:
				"/premsa-i-mitjans/thumbnails-espai-internet/espai-internet-01.jpg",
			url: "https://www.ccma.cat/3cat/espai-internet-10072016/video/5610976/",
			year: 2016,
			duration: 2,
			summary:
				"Al seu blog, escapadesenparella.cat, proposen això: escapades de curta durada, a llocs pròxims, pensades per a dos. N'hi ha de romàntiques, d'aventura, culturals, gastronòmiques, i també alguna de més llunyana, com ara a Estocolm. Les complementen amb mapes, donen molts consells útils i fan un relat minuciós acompanyat d'abundants fotografies, moltes de les quals són selfies.",
		},
	];

	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title="Premsa i mitjans"
				description="Recull de col·laboracions i mencions d'Escapadesenparella.cat a la premsa i als mitjans. Fes clic per saber-ne més."
				url="https://escapadesenparella.cat/premsa-i-mitjans"
				image="https://res.cloudinary.com/juligoodie/image/upload/v1632416196/getaways-guru/zpdiudqa0bk8sc3wfyue.jpg"
				canonical="https://escapadesenparella.cat/premsa-i-mitjans"
			/>
			{/* Rich snippets */}
			<BreadcrumbRichSnippet
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Premsa i mitjans"
				page2Url={`https://escapadesenparella.cat/premsa-i-mitjans`}
			/>
			<div className="anem-de-cap">
				<NavigationBar />

				{/* Section heading */}
				<section className="pt-8 md:pt-12 lg:pt-20">
					<div className="container">
						{/* Breadcrumb + article header */}
						<ul className="breadcrumb max-w-3xl mx-auto justify-center">
							<li className="breadcrumb__item">
								<a
									href="/"
									title="Inici"
									className="breadcrumb__link"
								>
									Inici
								</a>
							</li>
							<li className="breadcrumb__item">
								<span className="breadcrumb__link active">
									Premsa i mitjans
								</span>
							</li>
						</ul>

						{/* Article heading + subtitle + meta info */}
						<div className="relative pt-4">
							<div className="md:max-w-xl lg:max-w-5xl mx-auto text-center">
								<h1 className="my-0 text-balance">
									<span class="text-secondary-500">
										Premsa
									</span>{" "}
									i mitjans
								</h1>
								<p className="mt-4 !mb-0 text-block--xl leading-normal max-w-[55ch] mx-auto">
									Recull de col·laboracions i mencions
									d'Escapadesenparella.cat a la premsa i als
									mitjans.
								</p>
								<div className="mt-5">
									<ShareBarModal
										picture={null}
										title={"Premsa i mitjans"}
										rating={null}
										slug={
											"https://escapadesenparella.cat/premsa-i-mitjans"
										}
										locality={null}
										colorClass={""}
									/>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Section Anem de Cap */}
				<section>
					<div className="container">
						<div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-8 relative py-8 md:py-12 lg:py-20 border-b border-primary-50">
							<div className="col-span-4 md:col-span-6 lg:col-span-4">
								<div className="sticky top-40 lg:pr-12">
									<h2>Anem de Cap</h2>
									<p className="text-block">
										Pere Puig Mir dirigeix i presenta 'Anem
										de cap', un espai setmanal que proposa
										activitats per a fer durant el cap de
										setmana tant si sortim com si el passem
										a casa. El programa compta amb
										col·laboradors experts que ens
										recomanaran les millors sortides en
										família, en parella, culturals, etc.
										Així com jocs, llibres, música o
										programes de televisió si ens quedem al
										sofà.
									</p>
									<ul className="list-none m-0 p-0">
										<li className="text-block m-0">
											<strong>Rol:</strong> Col·laboradors
										</li>
										<li className="text-block m-0">
											<strong>Programes:</strong> 6
										</li>
										<li className="text-block m-0">
											<strong>Temporades:</strong> 1
										</li>
										<li className="text-block m-0">
											<strong>Emissora:</strong> La Xarxa
										</li>
										<li className="text-block m-0">
											<strong>Productora:</strong> VOTV
										</li>
									</ul>
								</div>
							</div>
							<div className="col-span-4 md:col-span-6 lg:col-span-8 flex flex-col gap-y-5">
								{programesAnemDeCap.map((item) => (
									<article className="bg-gray-50 rounded-2xl overflow-hidden">
										<a
											href={item.url}
											title={item.title}
											className="grid grid-cols-4 md:grid-cols-6"
											target="_blank"
											rel="nofollow noreferrer"
										>
											<picture className="w-full h-full aspect-[16/9] rounded-2xl overflow-hidden col-span-4 md:col-span-3 lg:col-span-3">
												<img
													src={item.thumbnail}
													alt={item.title}
													className="w-full h-full object-cover"
													loading="lazy"
												/>
											</picture>
											<div className="col-span-4 md:col-span-3 lg:col-span-3 p-6">
												<h3>{item.title}</h3>
												<div className="flex items-center gap-x-2.5">
													<span className="text-sm font-light">
														{item.duration} min.
													</span>
													<span className="text-sm font-light">
														{item.year}
													</span>
												</div>
												<p className="text-block text-sm line-clamp-5 mt-2.5 text-grey-300 mb-0">
													{item.summary}
												</p>
											</div>
										</a>
									</article>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Section Radio Voltregà */}
				<section>
					<div className="container">
						<div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-8 relative py-8 md:py-12 lg:py-20 border-b border-primary-50">
							<div className="col-span-4 md:col-span-6 lg:col-span-4">
								<div className="sticky top-40 lg:pr-12">
									<h2>La Tarda</h2>
									<p className="text-block">
										El teu programa de sostenibilitat i
										alimentació ecològica amb les seves
										seccions: "La Ruta del Vi" amb Xavier
										Sala i "Empendre conscientment" amb
										Marco Guzmán i també música de km0.
									</p>
									<ul className="list-none m-0 p-0">
										<li className="text-block m-0">
											<strong>Rol:</strong> Entrevistats
										</li>
										<li className="text-block m-0">
											<strong>Programes:</strong> 1
										</li>
										<li className="text-block m-0">
											<strong>Emissora:</strong> Ràdio
											Voltregá
										</li>
									</ul>
								</div>
							</div>
							<div className="col-span-4 md:col-span-6 lg:col-span-8 flex flex-col gap-y-5">
								{programesRadioVoltrega.map((item) => (
									<article className="bg-gray-50 rounded-2xl overflow-hidden">
										<a
											href={item.url}
											title={item.title}
											className="grid grid-cols-4 md:grid-cols-6"
											target="_blank"
											rel="nofollow noreferrer"
										>
											<picture className="w-full h-full aspect-[16/9] rounded-2xl overflow-hidden col-span-4 md:col-span-3 lg:col-span-3">
												<img
													src={item.thumbnail}
													alt={item.title}
													className="w-full h-full object-cover"
													loading="lazy"
												/>
											</picture>
											<div className="col-span-4 md:col-span-3 lg:col-span-3 p-6">
												<h3>{item.title}</h3>
												<div className="flex items-center gap-x-2.5">
													<span className="text-sm font-light">
														{item.duration} min.
													</span>
													<span className="text-sm font-light">
														{item.year}
													</span>
												</div>
												<p className="text-block text-sm line-clamp-5 mt-2.5 text-grey-300 mb-0">
													{item.summary}
												</p>
											</div>
										</a>
									</article>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Section Espai Internet */}
				<section className="py-8 md:py-12 lg:py-20">
					<div className="container grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-8 relative">
						<div className="col-span-4 md:col-span-6 lg:col-span-4">
							<div className="sticky top-40 lg:pr-12">
								<h2>Espai Internet</h2>
								<p className="text-block">
									Els webs més útils, els més curiosos, els
									blogs més interessants, el més nou a la
									xarxa i també el més divertit... Són algunes
									de les propostes que anireu trobant a
									l'"Espai internet", que s'emet els diumenges
									després del "TN vespre" a TV3.
								</p>
								<ul className="list-none m-0 p-0">
									<li className="text-block m-0">
										<strong>Rol:</strong> Menció
									</li>
									<li className="text-block m-0">
										<strong>Programes:</strong> 1
									</li>
									<li className="text-block m-0">
										<strong>Emissora:</strong> TV3
									</li>
								</ul>
							</div>
						</div>
						<div className="col-span-4 md:col-span-6 lg:col-span-8 flex flex-col gap-y-5">
							{programesEspaiInternet.map((item) => (
								<article className="bg-gray-50 rounded-2xl overflow-hidden">
									<a
										href={item.url}
										title={item.title}
										className="grid grid-cols-4 md:grid-cols-6"
										target="_blank"
										rel="nofollow noreferrer"
									>
										<picture className="w-full h-full aspect-[16/9] rounded-2xl overflow-hidden col-span-4 md:col-span-3 lg:col-span-3">
											<img
												src={item.thumbnail}
												alt={item.title}
												className="w-full h-full object-cover"
												loading="lazy"
											/>
										</picture>
										<div className="col-span-4 md:col-span-3 lg:col-span-3 p-6">
											<h3>{item.title}</h3>
											<div className="flex items-center gap-x-2.5">
												<span className="text-sm font-light">
													{item.duration} min.
												</span>
												<span className="text-sm font-light">
													{item.year}
												</span>
											</div>
											<p className="text-block text-sm line-clamp-5 mt-2.5 text-grey-300 mb-0">
												{item.summary}
											</p>
										</div>
									</a>
								</article>
							))}
						</div>
					</div>
				</section>
			</div>
			<Footer />
		</>
	);
};

export default PressMedia;

import GlobalMetas from "../components/head/GlobalMetas";
import BreadcrumbRichSnippet from "../components/richsnippets/BreadcrumbRichSnippet";

const LinksBioInstagram = () => {
	const links = [
		{
			title: "🍂🍁 Què fer aquesta tardor a Catalunya: 17 escapades que no et pots perdre",
			link: "https://escapadesenparella.cat/llistes/que-fer-tardor-catalunya-activitats-on-anar",
		},
		{
			title: "⛰️ 11 activitats per descobrir el Pallars Sobirà",
			link: "https://escapadesenparella.cat/llistes/que-fer-al-pallars-sobira-11-activitats-descobrir-el-pallars",
		},
		{
			title: "❤️‍🔥 Les escapades més romàntiques!",
			link: "https://escapadesenparella.cat/escapades-romantiques",
		},
		{
			title: "📬 Subscriu-te a la nosta newsletter!",
			link: "https://escapadesenparella.cat/llistes/que-fer-al-pallars-sobira-11-activitats-descobrir-el-pallars",
		},
		{
			title: "🏝️ Què fer a Sardenya?",
			link: "https://escapadesenparella.cat/viatges/viatge-a-sardenya/que-visitar-a-sardenya-vacances-a-sardenya",
		},
		{
			title: "✈️ Descomptes per la vostra propera escapada!",
			link: "https://escapadesenparella.cat/descomptes-viatjar",
		},
		{
			title: "☕ Ens convides a un cafè?",
			link: "https://ko-fi.com/escapadesenparella",
		},
		{
			title: "☎️ Contacte",
			link: "https://escapadesenparella.cat/contacte",
		},
	];

	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title="Enllaços directes"
				description="Enllaços directes d'Instagram"
				url="https://escapadesenparella.cat/links-bio-instagram"
				image="/email-confirmation.jpg"
				canonical="https://escapadesenparella.cat/links-bio-instagram"
				index="false"
			/>
			{/* Rich snippets */}
			<BreadcrumbRichSnippet
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Enllaços directes"
				page2Url={`https://escapadesenparella.cat/links-bio-instagram`}
			/>

			<div className="links-bio-instagram flex items-center justify-center relative">
				<section className="py-12 md:py-24 relative z-10">
					<div className="container">
						<div className="flex flex-col items-center">
							<div className="bg-primary-50 rounded-md px-8 pb-6 pt-6 md:px-8 md:pt-8 md:pb-8 relative ">
								<img
									className="block w-32 mx-auto"
									src="/logo-escapades-en-parella.svg"
									alt="logo Escapadesenparella.cat"
									loading="lazy"
								/>

								<div className="w-full md:max-w-md flex flex-col items-center gap-5 pt-4 md:pt-6 md:flex-1">
									<div className="w-full md:max-w-md">
										<p className="mb-0 font-light text-center">
											La vostra escapada en parella a
											Catalunya comença aquí!
										</p>
									</div>
								</div>
							</div>
							<div className="flex w-full">
								<ul className="list-none m-0 p-0 pt-5 w-full flex flex-col gap-y-3">
									{links.map((link, index) => (
										<li className="w-full" key={index}>
											<a
												href={link.link}
												title={link.title}
												target="_blank"
												className="button button__ghost button__med bg-primary-50 w-full block text-center"
											>
												{link.title}
											</a>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</section>
				<picture className="block fixed w-full h-full inset-0 before:absolute before:inset-0 before:backdrop-blur-xl before:bg-primary-500 before:bg-opacity-25">
					<img
						src="home-about-s.jpg"
						alt="Enllaços directes d'Instagram"
						className="w-full h-full object-cover"
						loading="eager"
					/>
				</picture>
			</div>
		</>
	);
};

export default LinksBioInstagram;

import Link from "next/link";
import NavigationBar from "../components/global/NavigationBar";
import GlobalMetas from "../components/head/GlobalMetas";
import BreadcrumbRichSnippet from "../components/richsnippets/BreadcrumbRichSnippet";
import Footer from "../components/global/Footer";
import SectionHeading from "../components/homepage/SectionHeading";
import ContentService from "../services/contentService";

const TEAM = [
	{
		name: "Andrea Prat",
		image: "andrea-prat-escapadesenparella",
		bio: "Creativa i inquieta. Amant de les escapades d'aventura i dels macarrons de casa. Dissenyadora i il·lustradora treballant al món de la programació de dia, i mestre de taitxí de nit. Sempre amb un ventolín a mà. Un superpoder: no dormir mai.",
		link: {
			href: "https://www.linkedin.com/in/andreaprat/",
			label: "Troba'm a LinkedIn",
		},
	},
	{
		name: "Juli Ramon",
		image: "juli-ramon-escapadesenparella",
		bio: "Metòdic i disposat a tot. Amant de les escapades d'aventura, les escapades culturals i de la caldereta de llagosta. Programador web apassionat pel disseny d'interfícies. Sempre amb la càmera a punt. Un superpoder: poder volar.",
		link: {
			href: "https://www.linkedin.com/in/juliramon/",
			label: "Troba'm a LinkedIn",
		},
	},
	{
		name: "Bru",
		image: "bru-escapadesenparella",
		bio: "Incansable i valent. Amant de totes les escapades on pugui anar i del iogurt. Treballant intensament per ser el millor secretari. Rastrejador per naturalesa. Sempre amb la pilota a la boca. Un superpoder: tenir les potes llargues.",
		link: {
			href: "https://www.instagram.com/bruthewiener/",
			label: "Troba'm a Instagram",
		},
	},
];

const BRAND_PARTNERS = [
	{ title: "Càmping del Mar", img: "logo-camping-mar.jpg" },
	{ title: "Brollats", img: "logo-brollats.jpg" },
	{ title: "Llet Nostra", img: "logo-llet-nostra.jpg" },
	{ title: "LOHODI", img: "logo-lohodi.jpg" },
	{ title: "Càmping Pedraforca", img: "logo-camping-pedraforca.jpg" },
	{ title: "L'Azure Hotel", img: "logo-azure.jpg" },
	{ title: "Hotel Terradets", img: "logo-hotel-terradets.jpg" },
	{ title: "Càmpings.cat", img: "logo-campingscat.jpg" },
	{ title: "Hostal Montserrat", img: "logo-hostal-montserrat.jpg" },
	{ title: "Hotel Somlom", img: "logo-somlom.jpg" },
	{ title: "Eco Rail del Cardener", img: "logo-ecorail.jpg" },
	{ title: "Ajuntament de Llinars", img: "logo-ajuntament-llinars.jpg" },
	{ title: "Cases Singulars", img: "logo-cases-singulars.jpg" },
	{ title: "Mas El Brugué", img: "logo-mas-brugue.jpg" },
	{ title: "El Molí de Siurana", img: "logo-moli-siurana.jpg" },
	{ title: "Comarca Aventura", img: "logo-comarca-aventura.jpg" },
	{
		title: "Apartament Spa Parellada",
		img: "logo-apartament-spa-parellada.jpg",
	},
	{ title: "Sunrise Homes", img: "logo-sunrise-homes.jpg" },
];

/**
 * Imatge amb versió mòbil i d'escriptori. L'extensió va a part perquè algunes
 * fotos són `.JPG` i d'altres `.jpg`, i en producció (Linux) les majúscules
 * compten: abans "què fem" es demanava en `.JPG` i no carregava.
 */
const AboutPicture = ({
	mobile,
	desktop,
	ext = "jpg",
	alt,
	className = "",
	loading = "lazy",
}) => (
	<picture className={`block w-full h-full rounded-2xl overflow-hidden ${className}`}>
		<source
			srcSet={`/sobre-nosaltres/${mobile}.webp`}
			media="(max-width: 767px)"
			type="image/webp"
		/>
		<source
			srcSet={`/sobre-nosaltres/${mobile}.${ext}`}
			media="(max-width: 767px)"
		/>
		<source
			srcSet={`/sobre-nosaltres/${desktop}.webp`}
			media="(min-width: 768px)"
			type="image/webp"
		/>
		<img
			src={`/sobre-nosaltres/${desktop}.${ext}`}
			alt={alt}
			width="400"
			height="300"
			className="w-full h-full object-cover"
			loading={loading}
			fetchpriority={loading === "eager" ? "high" : undefined}
		/>
	</picture>
);

const AboutUs = ({ totals = {} }) => {
	const date = new Date();
	const foundationYears = date.getFullYear() - 2015;

	/**
	 * Mateixes xifres i mateix format que el bloc "Qui hi ha al darrere" de la
	 * portada. Abans es baixaven els tres llistats sencers al navegador només
	 * per comptar-los, amb un spinner mentrestant.
	 */
	const stats = [
		{
			value: totals.activities,
			label: "experiències originals",
			href: "/activitats",
		},
		{
			value: totals.places,
			label: "allotjaments amb encant",
			href: "/allotjaments",
		},
		{
			value: totals.stories,
			label: "històries en parella",
			href: "/histories",
		},
	].filter((stat) => Number(stat.value) > 0);

	return (
		<>
			<GlobalMetas
				title={"Sobre nosaltres"}
				description={
					"Som el portal d'escapades en parella de referència en català; un equip amant de descobrir i compartir noves experiències originals i allotjaments amb encant a Catalunya"
				}
				url={"https://escapadesenparella.cat/sobre-nosaltres"}
				canonical={"https://escapadesenparella.cat/sobre-nosaltres"}
			/>
			{/* Rich snippets */}
			<BreadcrumbRichSnippet
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title={`Sobre nosaltres`}
				page2Url={`https://escapadesenparella.cat/sobre-nosaltres`}
			/>
			<div id="aboutUs">
				<NavigationBar />
				<main>
					{/* Section header */}
					<section className="pt-4 md:pt-6 lg:pt-8">
						<div className="container">
							<ul className="breadcrumb">
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
										Sobre nosaltres
									</span>
								</li>
							</ul>

							<div className="mt-3.5 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
								<div className="max-w-xl">
									<span className="block text-13 uppercase tracking-widest text-tertiary-800 mb-2">
										Qui som
									</span>
									<h1 className="my-0 text-balance">
										Sobre nosaltres
									</h1>
									<p className="mt-4 !mb-0 text-block leading-normal text-grey-400">
										Fa {foundationYears} anys que recorrem
										Catalunya descobrint les experiències més
										originals i els allotjaments amb més
										encant, perquè ens apassiona inspirar i
										compartir noves propostes per a una
										escapada en parella per recordar.
									</p>
									<div className="flex flex-wrap gap-2.5 mt-6">
										<a
											href="#equip"
											title="Coneix-nos"
											className="button button__primary button__med"
										>
											Coneix-nos
										</a>
										<Link href="/premsa-i-mitjans">
											<a
												title="Premsa i mitjans"
												className="button button__ghost button__med"
											>
												Mencions als mitjans
											</a>
										</Link>
									</div>
								</div>
								<AboutPicture
									mobile="sobre-nosaltres-portada-m"
									desktop="sobre-nosaltres-portada-s"
									alt="Escapades en parella, i molt més"
									className="aspect-[4/3] md:aspect-[16/9]"
									loading="eager"
								/>
							</div>
						</div>
					</section>

					{/* Section textblock 1 */}
					<section className="pt-12 md:pt-16 lg:pt-20">
						<div className="container">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
								<div className="grid grid-cols-2 gap-5 order-2 lg:order-1">
									<AboutPicture
										mobile="sobre-nosaltres-1-m"
										desktop="sobre-nosaltres-1"
										ext="JPG"
										alt="Turisme sostenible, de quilòmetre zero i en català"
										className="aspect-[3/4]"
									/>
									<AboutPicture
										mobile="sobre-nosaltres-2-m"
										desktop="sobre-nosaltres-2"
										alt="Turisme sostenible, de quilòmetre zero i en català"
										className="aspect-[3/4]"
									/>
								</div>
								<div className="max-w-xl order-1 lg:order-2">
									<span className="block text-13 uppercase tracking-widest text-tertiary-800 mb-2">
										Com viatgem
									</span>
									<h2 className="my-0 text-balance">
										Turisme sostenible, de quilòmetre zero i
										en català
									</h2>
									<p className="mt-4 !mb-0 text-block leading-normal text-grey-400">
										Descobreix Catalunya d'una manera
										autèntica i responsable. Et convidem a
										gaudir del{" "}
										<strong className="text-grey-700">
											turisme sostenible
										</strong>
										, apostant pel quilòmetre zero i
										promovent la nostra llengua. Amb
										propostes que respecten el medi ambient
										i{" "}
										<strong className="text-grey-700">
											potencien les economies locals
										</strong>
										, aquí trobaràs experiències úniques per
										compartir en parella, tot preservant la
										riquesa cultural i natural del nostre
										territori. Viatja amb consciència, viatja
										en català.
									</p>

									{stats.length ? (
										<dl className="grid grid-cols-3 gap-x-4 gap-y-2 mt-7 pt-6 border-t border-primary-50">
											{stats.map((stat) => (
												<div key={stat.label}>
													<dt className="sr-only">
														{stat.label}
													</dt>
													<dd className="m-0">
														<Link href={stat.href}>
															<a className="group block">
																<span className="block font-headings text-2xl md:text-3xl leading-none text-grey-700">
																	{stat.value}
																</span>
																<span className="block mt-1 text-13 text-grey-400 group-hover:text-grey-700 transition-colors">
																	{stat.label}
																</span>
															</a>
														</Link>
													</dd>
												</div>
											))}
										</dl>
									) : null}
								</div>
							</div>
						</div>
					</section>

					{/* Section team */}
					<section
						className="pt-12 md:pt-16 lg:pt-20 scroll-mt-36"
						id="equip"
					>
						<div className="container">
							<SectionHeading
								eyebrow="Equip"
								title="Qui hi ha darrere del projecte"
								description="Treballem dia a dia per crear propostes úniques i responsables. Coneix l'equip darrere del projecte, que amb il·lusió i compromís, fan possible que puguis viure escapades inoblidables."
							/>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6 md:mt-8">
								{TEAM.map((member) => (
									<article key={member.name}>
										<picture className="block w-full aspect-[4/3] rounded-2xl overflow-hidden">
											<source
												srcSet={`/sobre-nosaltres/${member.image}.webp`}
												type="image/webp"
											/>
											<img
												src={`/sobre-nosaltres/${member.image}.jpg`}
												alt={member.name}
												width="400"
												height="300"
												className="w-full h-full object-cover"
												loading="lazy"
											/>
										</picture>
										<div className="mt-5">
											<h3 className="my-0">{member.name}</h3>
											<p className="mt-2 !mb-0 text-block leading-normal text-grey-400">
												{member.bio}
											</p>
											<a
												href={member.link.href}
												title={member.link.label}
												className="section-heading__link mt-3"
												target="_blank"
												rel="nofollow noreferrer"
											>
												{member.link.label}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width={16}
													height={16}
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth={2}
													strokeLinecap="round"
													strokeLinejoin="round"
													aria-hidden="true"
												>
													<path
														stroke="none"
														d="M0 0h24v24H0z"
														fill="none"
													/>
													<path d="M9 6l6 6l-6 6" />
												</svg>
											</a>
										</div>
									</article>
								))}
							</div>
						</div>
					</section>

					{/* Section services */}
					<section className="pt-12 md:pt-16 lg:pt-20">
						<div className="container">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
								<div className="max-w-xl">
									<span className="block text-13 uppercase tracking-widest text-tertiary-800 mb-2">
										Què fem
									</span>
									<h2 className="my-0 text-balance">
										Ens encanta treballar en campanyes que
										posin en valor productes i marques de
										casa nostra
									</h2>
									<p className="mt-4 !mb-0 text-block leading-normal text-grey-400">
										Des de la creació de continguts, fins a
										la promoció a les xarxes socials, passant
										pel procés d'investigació, de disseny
										gràfic i de programació, dediquem el
										temps que faci falta per posar en valor
										els productes i marques que confien en
										nosaltres.
									</p>
									<div className="flex flex-wrap gap-2.5 mt-6">
										<Link href="/contacte">
											<a
												title="Contacta'ns"
												className="button button__primary button__med"
											>
												Contacta'ns
											</a>
										</Link>
										<Link href="/empreses">
											<a
												title="Com col·laborem amb allotjaments i activitats"
												className="button button__ghost button__med"
											>
												Com col·laborem
											</a>
										</Link>
									</div>
								</div>
								<AboutPicture
									mobile="sobre-nosaltres-que-fem-m"
									desktop="sobre-nosaltres-que-fem"
									alt="Creació de continguts per a marques i allotjaments"
									className="aspect-[4/3] lg:aspect-[16/9]"
								/>
							</div>
						</div>
					</section>

					{/* Section brands */}
					<section className="py-12 md:py-16 lg:py-20">
						<div className="container">
							<SectionHeading
								eyebrow="Col·laboracions"
								title="Confien en nosaltres"
							/>
							<div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-x-6 gap-y-4 lg:gap-x-10 lg:gap-y-6 mt-6 md:mt-8">
								{BRAND_PARTNERS.map((logo) => (
									<picture
										key={logo.title}
										className="block w-full h-full aspect-[16/9]"
									>
										<img
											src={`/logos-partners/${logo.img}`}
											alt={logo.title}
											className="w-full h-full object-contain"
											width={160}
											height={90}
											loading="lazy"
										/>
									</picture>
								))}
							</div>
						</div>
					</section>
				</main>
				<Footer />
			</div>
		</>
	);
};

export async function getStaticProps() {
	const service = new ContentService();

	// Si les xifres no arriben, la pàgina es genera igualment sense el bloc.
	let totals = {};
	try {
		totals = (await service.getSiteStats()) ?? {};
	} catch (error) {
		console.error(
			"[sobre-nosaltres] no s'han pogut carregar les xifres:",
			error.message
		);
	}

	return {
		props: { totals },
		revalidate: 120,
	};
}

export default AboutUs;

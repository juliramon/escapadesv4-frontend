import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import NavigationBar from "../../components/global/NavigationBar";
import ContentService from "../../services/contentService";
import SignUpModal from "../../components/modals/SignUpModal";
import UserContext from "../../contexts/UserContext";
import ShareModal from "../../components/modals/ShareModal";
import parse from "html-react-parser";
import Footer from "../../components/global/Footer";
import FooterHistoria from "../../components/global/FooterHistoria";
import FetchingSpinner from "../../components/global/FetchingSpinner";
import GlobalMetas from "../../components/head/GlobalMetas";
import Breadcrumb from "../../components/richsnippets/Breadcrumb";
import FancyboxUtil from "../../utils/FancyboxUtils";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import AdSkyScrapperHoritzontal728x90 from "../../components/ads/AdSkyScrapperHoritzontal728x90";

const StoryListing = ({ storyDetails }) => {
	const { user } = useContext(UserContext);
	const router = useRouter();

	useEffect(() => {
		if (
			router.pathname.includes("editar") ||
			router.pathname.includes("nova-activitat") ||
			router.pathname.includes("nou-allotjament") ||
			router.pathname.includes("nova-historia")
		) {
			document.querySelector("body").classList.add("composer");
		} else {
			document.querySelector("body").classList.remove("composer");
		}
	}, [router]);

	const urlToShare = `https://escapadesenparella.cat/histories/${router.query.slug}`;

	const initialState = {
		story: {},
		storyLoaded: false,
		owner: {},
	};
	const [state, setState] = useState(initialState);
	const [queryId, setQueryId] = useState(null);
	useEffect(() => {
		if (router && router.query) {
			setQueryId(router.query.slug);
		}
	}, [router]);

	const service = new ContentService();

	const [modalVisibility, setModalVisibility] = useState(false);
	const handleModalVisibility = () => setModalVisibility(true);
	const hideModalVisibility = () => setModalVisibility(false);

	const [shareModalVisibility, setShareModalVisibility] = useState(false);
	const handleShareModalVisibility = () => setShareModalVisibility(true);
	const hideShareModalVisibility = () => setShareModalVisibility(false);

	useEffect(() => {
		if (storyDetails !== undefined) {
			setState({
				...state,
				story: storyDetails,
				storyLoaded: storyDetails !== undefined ? true : false,
				owner: storyDetails.owner,
			});
		}
	}, []);

	if (state.storyLoaded === false) {
		return <FetchingSpinner />;
	}

	let { title, subtitle, description } = state.story;

	let parsedDescription;
	let slicedDescription = [];

	const stateImages = [...state.story.images];
	// const stateImagesList = stateImages.map((el, idx) => ({
	//   src: el,
	//   thumbnail: el,
	//   title: state.story.title,
	// }));

	// const getThumbnailContent = (item) => {
	//   return <img src={item.thumbnail} width={120} height={90} />;
	// };

	// const photoSwipeGallery = (
	//   <PhotoSwipeGallery
	//     items={stateImagesList}
	//     thumbnailContent={getThumbnailContent}
	//     options={{ history: false }}
	//   />
	// );

	const welcomeText = (
		<h2 className="mb-8">
			{title}: Benvinguts a l'escapada de la setmana, ens hi acompanyes?
		</h2>
	);

	if (description) {
		parsedDescription = parse(description);

		const maxSliders = 3;
		const slidesPerSlider = stateImages.length / maxSliders;

		const totalDescriptionElements = parsedDescription.length; // ex. 21

		for (let i = 1; i < totalDescriptionElements; i++) {
			if (totalDescriptionElements % i == 0) {
				console.log(i);
			}
		}

		parsedDescription.map((el) => slicedDescription.push(el));
		if (slicedDescription.length > 1) {
			// slicedDescription[0].splice(4, 0, photoSwipeGallery);
			slicedDescription.splice(1, 0, welcomeText);
		}
	}

	let publicationDate = new Date(storyDetails.createdAt).toLocaleDateString(
		"ca-es",
		{
			year: "numeric",
			month: "short",
			day: "numeric",
		}
	);

	let updatedDate = new Date(storyDetails.updatedAt).toLocaleDateString(
		"ca-es",
		{
			year: "numeric",
			month: "short",
			day: "numeric",
		}
	);

	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title={state.story.metaTitle}
				description={state.story.metaDescription}
				url={`https://escapadesenparella.cat/histories/${state.story.slug}`}
				image={state.story.cover}
				canonical={`https://escapadesenparella.cat/histories/${state.story.slug}`}
			/>
			{/* Rich snippets */}
			<Breadcrumb
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Històries"
				page2Url="https://escapadesenparella.cat/histories"
				page3Title={state.story.metaTitle}
				page3Url={`https://escapadesenparella.cat/histories/${state.story.slug}`}
			/>
			<div className="listing-story">
				<NavigationBar
					logo_url={
						"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
					}
					user={user}
				/>
				<div className="pt-3 px-6">
					<div className="w-full">
						<ul className="breadcrumb">
							<li className="breadcrumb__item">
								<a href="/" title="Inici" className="breadcrumb__link">
									Inici
								</a>
							</li>
							<li className="breadcrumb__item">
								<a href="/histories" className="breadcrumb__link">
									Històries en parella
								</a>
							</li>
							<li className="breadcrumb__item">
								<span className="breadcrumb__link active">{title}</span>
							</li>
						</ul>
					</div>
				</div>
				<div className="bg-primary-100 py-4">
					<AdSkyScrapperHoritzontal728x90 />
				</div>
				<main>
					<article className="pt-4 md:pt-8 pb-4">
						<div className="container">
							<div className="max-w-2xl mx-auto">
								<h1 className="text-center">{title}</h1>
								<p className="text-lg md:text-xl text-center px-16 mt-2.5">
									{subtitle}
								</p>
								<div className="mt-3 flex flex-wrap items-center justify-center">
									<div className="flex flex-wrap items-center">
										<div className="rounded-full overflow-hidden w-8 h-8 mr-2.5">
											<picture>
												<img
													src={state.owner.avatar}
													alt={state.owner.fullName}
													width={32}
													height={32}
													className="w-full h-full object-cover"
													loadgin="eager"
												/>
											</picture>
										</div>
										<span className="text-sm text-primary-400 text-opacity-80">
											{state.owner.fullName}
										</span>
										<span className="mx-2 text-sm text-primary-400 text-opacity-80">
											·
										</span>
										<span className="text-sm text-primary-400 text-opacity-80">
											Publicat el{" "}
											<time datetime={storyDetails.createdAt}>
												<u>{publicationDate}</u>
											</time>
										</span>
									</div>
								</div>
							</div>
							{state.storyLoaded === true ? (
								<div className="w-full max-w-3xl md:mx-auto mt-6">
									<div className="aspect-w-16 aspect-h-9 rounded overflow-hidden">
										<picture>
											<img
												src={state.story.cover}
												alt={title}
												width={400}
												height={300}
												className="w-full h-full object-cover"
												loading="eager"
											/>
										</picture>
									</div>
									<figcaption className="text-xs mt-2 text-primary-400 text-opacity-80">
										Foto d' <u>Andrea Prat</u> i <u>Juli Ramon</u> per
										Escapadesenparella.cat
									</figcaption>
								</div>
							) : null}
							<div className="max-w-xl mx-auto pt-8">
								<div className="text-center text-tertiary-500 text-opacity-80 text-sm py-4 mb-8 bg-tertiary-100 bg-opacity-50 flex items-center justify-center rounded-md">
									<span className="inline-block">
										Darrera actualització:{" "}
										<time datetime={updatedDate}>
											<u>{updatedDate}</u>
										</time>
									</span>
								</div>
								<div className="listing-description">{slicedDescription}</div>
							</div>
						</div>
						<div className="max-w-4xl my-10 ml-4 lg:mx-auto">
							<Swiper spaceBetween={10} slidesPerView={1.15}>
								{stateImages.map((el, idx) => (
									<SwiperSlide key={el._id}>
										<FancyboxUtil>
											<a
												key={idx}
												data-fancybox="gallery"
												href={el}
												className="block aspect-w-16 aspect-h-9 rounded overflow-hidden w-full h-full"
											>
												<img
													alt=""
													src={el}
													className="w-full h-full object-cover"
												/>
											</a>
										</FancyboxUtil>
									</SwiperSlide>
								))}
							</Swiper>
						</div>
					</article>
				</main>
				<section>
					<div className="container">
						<FooterHistoria />
					</div>
				</section>
				<SignUpModal
					visibility={modalVisibility}
					hideModal={hideModalVisibility}
				/>
				<ShareModal
					visibility={shareModalVisibility}
					hideModal={hideShareModalVisibility}
					url={urlToShare}
				/>
			</div>
			<Footer
				logo_url={
					"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
				}
			/>
		</>
	);
};

export async function getServerSideProps({ params }) {
	const service = new ContentService();
	const storyDetails = await service.getStoryDetails(params.slug);
	return {
		props: {
			storyDetails,
		},
	};
}

export default StoryListing;

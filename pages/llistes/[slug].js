import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Footer from "../../components/global/Footer";
import NavigationBar from "../../components/global/NavigationBar";
import ShareModal from "../../components/modals/ShareModal";
import SignUpModal from "../../components/modals/SignUpModal";
import UserContext from "../../contexts/UserContext";
import ContentService from "../../services/contentService";
import ReactHtmlParser from "react-html-parser";
import FooterHistoria from "../../components/global/FooterHistoria";
import GlobalMetas from "../../components/head/GlobalMetas";
import Breadcrumb from "../../components/richsnippets/Breadcrumb";
import FetchingSpinner from "../../components/global/FetchingSpinner";
import AdSkyScrapper from "../../components/ads/AdSkyScrapper";
import AdSkyScrapperHoritzontal728x90 from "../../components/ads/AdSkyScrapperHoritzontal728x90";
import Article from "../../components/richsnippets/Article";

const ListView = ({ listDetails }) => {
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

	const urlToShare = `https://escapadesenparella.cat/llistes/${router.query.slug}`;

	const initialState = {
		list: {},
		listLoaded: false,
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
		if (listDetails !== undefined) {
			setState({
				...state,
				list: listDetails,
				listLoaded: listDetails.type ? true : false,
				owner: listDetails.owner,
			});
		}
	}, []);

	if (!state.listLoaded) {
		return <FetchingSpinner />;
	}

	let { title, subtitle, description, createdAt, updatedAt } = state.list;
	let publicationDate = new Date(createdAt).toLocaleDateString("ca-es", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
	let updatedDate = new Date(updatedAt).toLocaleDateString("ca-es", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title={state.list.metaTitle}
				description={state.list.metaDescription}
				url={`https://escapadesenparella.cat/llistes/${state.list.slug}`}
				image={state.list.cover}
				canonical={`https://escapadesenparella.cat/llistes/${state.list.slug}`}
			/>
			{/* Rich snippets */}
			<Breadcrumb
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Llistes"
				page2Url="https://escapadesenparella.cat/llistes"
				page3Title={state.list.metaTitle}
				page3Url={`https://escapadesenparella.cat/llistes/${state.list.slug}`}
			/>
			<Article
				headline={state.list.title}
				summary={state.list.subtitle}
				image={state.list.cover}
				author={state.owner.fullName}
				publicationDate={state.list.createdAt}
				modificationDate={state.list.updatedAt}
			/>
			<div className="listing-list">
				<NavigationBar
					logo_url={
						"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
					}
					user={user}
				/>
				<div className="pt-3 px-4">
					<div className="w-full">
						<ul className="breadcrumb">
							<li className="breadcrumb__item">
								<a href="/" title="Inici" className="breadcrumb__link">
									Inici
								</a>
							</li>
							<li className="breadcrumb__item">
								<a href="/llistes" className="breadcrumb__link">
									Llistes
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
					<article className="pt-8 pb-4">
						<div className="container">
							<div className="flex flex-wrap">
								<div className="w-full max-w-5xl mx-auto">
									<div className="w-full pb-6 lg:pl-12 lg:pr-20 lg:border-l border-primary-300">
										<h1 className=" max-w-2xl">{title}</h1>
										<div className="mt-3 flex flex-wrap items-center">
											<div className="flex flex-wrap items-center">
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
														<time dateTime={publicationDate}>
															<u>{publicationDate}</u>
														</time>
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="w-full max-w-6xl mx-auto">
									<div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden">
										<picture>
											<img
												src={state.list.cover}
												alt={state.list.title}
												width={400}
												height={300}
												className="w-full h-full object-cover"
												loading="eager"
											/>
										</picture>
									</div>
									<figcaption className="text-xs mt-2 text-primary-400 text-opacity-80 md:text-right">
										{state.list.title}
									</figcaption>
								</div>
							</div>
							<div className="flex flex-wrap items-stretch w-full max-w-5xl mx-auto">
								<div className="w-full lg:w-9/12 lg:pl-12 lg:pr-20 -mt-6 pt-10 pb-8 lg:border-l md:border-primary-300">
									<div className="text-center text-tertiary-500 text-opacity-80 text-sm py-4 mb-5 md:mb-6 bg-tertiary-100 bg-opacity-50 flex items-center justify-center rounded-md">
										<span className="inline-block">
											Actualitzat el{" "}
											<time dateTime={updatedDate}>
												<u>{updatedDate}</u>
											</time>
										</span>
									</div>
									<p className="md:text-lg max-w-2xl mb-6 md:mb-8">
										{subtitle}
									</p>
									<div className="list__description">
										{ReactHtmlParser(description)}
									</div>
								</div>
								<div className="w-full lg:w-3/12 py-8 md:pt-20 -mt-7 ">
									<div className="p-4 sticky top-36">
										<AdSkyScrapper />
									</div>
								</div>
							</div>
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
				<Footer
					logo_url={
						"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
					}
				/>
			</div>
		</>
	);
};

export async function getServerSideProps({ params }) {
	const service = new ContentService();
	const listDetails = await service.getListDetails(params.slug);
	return {
		props: {
			listDetails,
		},
	};
}

export default ListView;

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
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
			<div className="listing-list">
				<NavigationBar
					logo_url={
						"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
					}
					user={user}
				/>
				<main>
					<div className="pt-6">
						<div className="container">
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
					<article className="pt-2 md:pt-6 lg:pt-12 pb-4">
						<div className="container">
							<div className="flex flex-col-reverse md:flex-col">
								<div className="w-full max-w-5xl mx-auto">
									<div className="w-full lg:pl-12 lg:pr-20 pb-8 lg:border-l border-primary-300">
										<h1 className="mt-4 mb-4 md:mt-0 font-display">{title}</h1>
										<div className="mt-6 flex flex-wrap items-center justify-between">
											<div className="flex flex-wrap items-center">
												<Link href={`/usuaris/${state.owner._id}`}>
													<a className="flex flex-wrap items-center">
														<div className="rounded-full overflow-hidden w-12 h-12 mr-3">
															<picture>
																<img
																	src={state.owner.avatar}
																	alt={state.owner.fullName}
																	width={48}
																	height={48}
																	className="w-full h-full object-cover"
																	loadgin="eager"
																/>
															</picture>
														</div>
														<span className="listing-owner-name">
															{state.owner.fullName}
														</span>
														<span className="mx-2 opacity-40 inline-block">
															–
														</span>
														<span className="text-sm inline-block opacity-40">
															Publicat el {publicationDate}
														</span>
														<div className="hidden md:inline-flex md:items-center">
															<span className="mx-2 opacity-40 inline-block">
																/
															</span>
															<span className="text-sm inline-block opacity-40">
																Actualitzat el {updatedDate}
															</span>
														</div>
													</a>
												</Link>
											</div>
											{/* <div
											className="flex items-center justify-center button button__secondary button__med cursor-pointer mt-5 md:mt-0 w-full md:w-auto"
											onClick={() => handleShareModalVisibility()}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="icon icon-tabler icon-tabler-share mr-3"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="currentColor"
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path stroke="none" d="M0 0h24v24H0z" fill="none" />
												<circle cx="6" cy="12" r="3" />
												<circle cx="18" cy="6" r="3" />
												<circle cx="18" cy="18" r="3" />
												<line x1="8.7" y1="10.7" x2="15.3" y2="7.3" />
												<line x1="8.7" y1="13.3" x2="15.3" y2="16.7" />
											</svg>
											<span className="text-sm">Compartir</span>
										</div> */}
										</div>
									</div>
								</div>
								<div className="w-full">
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
									<figcaption className="text-xs mt-2.5 lg:text-right">
										{state.list.title}
									</figcaption>
								</div>
							</div>

							<div className="flex flex-wrap items-stretch w-full max-w-5xl mx-auto">
								<div className="w-full lg:w-9/12 lg:pl-12 lg:pr-20 py-8 md:pt-20 lg:border-l md:border-primary-300 -mt-7">
									<p className="md:text-lg max-w-2xl mb-10">{subtitle}</p>
									<div className="list__description">
										{ReactHtmlParser(description)}
									</div>
								</div>
								<div className="w-full lg:w-3/12 py-8 md:pt-20 -mt-7 ">
									<div className="bg-red-500 p-4 sticky top-36">
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

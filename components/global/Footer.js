import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import ContentService from "../../services/contentService";
import NewsletterService from "../../services/newsletterService";

const DynamicKoFiBadge = dynamic(() => import('./KoFiBadge'), {
	loading: () => <span>Loading...</span>
});

const Footer = () => {
	const service = new ContentService();
	const [state, setState] = useState({
		placeCategories: [],
		activityCategories: [],
	});

	const [newsletterFormData, setNewsletterFormData] = useState({
		name: '',
		email: '',
		serverMessage: '',
		submitted: false,
		error: false
	});

	const newsletterService = new NewsletterService();

	useEffect(() => {
		const fetchData = async () => {
			setState({ ...state, isFetching: true });
			const categories = await service.getCategories();

			if (categories.length > 0) {
				let placeCategories = [];
				let activityCategories = [];

				categories.filter((el) => {
					if (el.isPlace == true) {
						placeCategories.push(el);
					} else {
						activityCategories.push(el);
					}
				});

				setState({
					...state,
					placeCategories: placeCategories,
					activityCategories: activityCategories,
				});
			}
		};
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let copyrightDate = new Date();
	copyrightDate = copyrightDate.getFullYear();

	const handleNewsletterFormChange = (e) => {
		setNewsletterFormData({ ...newsletterFormData, [e.target.name]: e.target.value })
	};

	const handleNewsletterFormSubmit = (e) => {
		e.preventDefault();
		const { name, email } = newsletterFormData;

		if (name !== "" && email !== "") {
			newsletterService.subscribeToNewsletter(name, email).then((res) => {
				if (res.status === 200) {
					setNewsletterFormData({ ...newsletterFormData, serverMessage: res.message, submitted: true, error: false })
				}
				if (res.status === 400 || res.status === 500) {
					setNewsletterFormData({ ...newsletterFormData, serverMessage: res.message, error: true });
				}
			});
		}
	};

	return (
		<>
			<section className="pb-12 md:pt-12 md:pb-24">
				<div className="container">
					<div className="bg-primary-50 rounded-md px-8 pb-8 pt-6 md:px-12 md:py-8 relative flex flex-wrap items-center">
						<picture className="block w-64 lg:w-80 h-auto mx-auto mix-blend-multiply">
							<img src="https://res.cloudinary.com/juligoodie/image/upload/v1626446634/getaways-guru/static-files/email-confirmation_lu3qbp.jpg" width="256" height="170" className="w-full h-auto object-contain" alt="Subscriu-te a la nostra newsletter" loading="lazy" />
						</picture>
						<div className="w-full md:w-auto flex flex-wrap items-center gap-5 pt-6 md:pt-0 md:pl-8 md:flex-1">
							<div className="w-full md:max-w-xs">
								<h2 className="mb-2 text-2xl leading-tight text-center md:text-left">Subscriu-te a la nostra newsletter</h2>
								<p className="mb-0 font-light text-center md:text-left">Per rebre les últimes novetats i ofertes</p>
							</div>
							{!newsletterFormData.submitted ? <form className="form flex flex-wrap items-center flex-1" onSubmit={handleNewsletterFormSubmit}>
								<fieldset className="form__group w-full md:w-auto">
									<label htmlFor="name" className="form__label">Nom</label>
									<input type="text" id="name" name="name" onChange={handleNewsletterFormChange} className="form__control bg-white" />
								</fieldset>
								<fieldset className="form__group w-full md:w-auto flex-1">
									<label htmlFor="email" className="form__label">Correu electrònic</label>
									<input type="email" id="email" name="email" onChange={handleNewsletterFormChange} className="form__control bg-white" />
								</fieldset>
								<fieldset className="form__group w-full lg:w-auto">
									<button type="submit" className="button button__med button__primary justify-center md:mt-1 lg:mt-5">Subscriure'm</button>
								</fieldset>
								<span className="block w-full px-1.5 mt-1 form__text_info">Al fer clic a "Subscriure'm" confirmes haver llegit i estàs d'acord amb la <a href="/politica-privadesa" title="Política de Privacitat" className="text-primary-900 underline">Política de Privacitat.</a></span>
								{newsletterFormData.error ? <span className="px-1.5 inline-flex items-center mt-2.5 text-sm text-red-500">
									<svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5" width={24} height={24} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none" />
										<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
										<path d="M12 8v4" />
										<path d="M12 16h.01" />
									</svg>
									{newsletterFormData.serverMessage}</span>
									: null}
							</form> : <div className="flex items-center justify-center md:justify-start xl:justify-center flex-1 lg:flex-none xl:flex-1">
								<div className="max-w-[280px] mx-auto md:mx-0 flex items-center">
									<svg xmlns="http://www.w3.org/2000/svg" className="mr-2.5 text-green-500" width={32} height={32} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none" />
										<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
										<path d="M9 12l2 2l4 -4" />
									</svg>
									<span className="inline-block flex-1">{newsletterFormData.serverMessage}</span>
								</div>
							</div>}
						</div>
					</div>
				</div>
			</section>
			<footer id="footer" className="pt-12 pb-2 lg:pt-16 lg:pb-6">
				<div className="container">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
						<div className="w-full mb-6 lg:mb-0 md:pr-5">
							<div className="flex flex-col flex-wrap items-start max-w-xs">
								<svg viewBox="0 0 638 173" xmlns="http://www.w3.org/2000/svg" className="mb-3 w-36 h-auto"><g fill="none"><path d="M269.56 85.96c6.08 0 11.28-2 14.96-5.68.88-.96.72-2.56-.48-3.28l-2.4-1.52c-.8-.56-1.84-.48-2.56.16-2.4 2.16-5.84 3.44-9.52 3.44-8 0-12.88-4.56-14.08-11.2h29.68c1.52 0 2.8-1.28 2.8-2.8.4-13.44-9.36-21.6-19.68-21.6-11.92 0-20.48 9.52-20.48 21.28 0 11.68 8.32 21.2 21.76 21.2Zm10.8-24.4h-24.88c1.12-6.72 5.84-11.2 12.8-11.2 6.88 0 11.12 4.4 12.08 11.2Zm26.88 24.4c10.72 0 15.92-6 15.92-13.12 0-6.16-3.36-9.28-13.28-11.36a72.88 72.88 0 0 0-1.514-.293l-1.02-.188-.507-.096c-3.711-.715-7.119-1.68-7.119-5.263 0-3.36 2.88-5.68 6.88-5.68 3.68 0 6 1.6 7.12 3.36.48.8 1.44 1.12 2.32.88l2.88-.8c1.28-.32 1.92-1.84 1.28-3.04-2.24-4.4-7.28-6.88-12.88-6.88-8.88 0-15.04 5.28-15.04 12.72 0 5.92 3.36 9.6 10.88 11.36.916.206 1.861.378 2.803.54l.564.096c4.69.796 9.113 1.493 9.113 5.364 0 3.6-2.96 5.76-8.24 5.76-5.12 0-7.6-1.76-8.72-3.52-.56-.8-1.52-1.2-2.48-.88l-3.2 1.12c-1.2.4-1.84 1.84-1.2 3.04 2.56 4.48 8.48 6.88 15.44 6.88Zm40.72 0c6.96 0 12.8-3.12 16.56-7.92.8-1.04.48-2.56-.64-3.2l-2.48-1.36c-.88-.48-2.08-.24-2.72.56-2.4 3.12-6.24 5.04-10.72 5.04-8 0-13.76-6.08-13.76-14.32 0-8.32 5.76-14.4 13.76-14.4 4.48 0 8.32 1.92 10.72 5.04.64.8 1.84 1.04 2.72.56l2.48-1.36c1.12-.64 1.44-2.16.64-3.2-3.76-4.8-9.6-7.92-16.56-7.92-12.24 0-21.28 9.52-21.28 21.28 0 11.68 9.04 21.2 21.28 21.2Zm40.16 0c7.04 0 11.76-2.88 14.72-6.64v3.52c0 1.2.96 2.16 2.16 2.16h3.04c1.2 0 2.16-.96 2.16-2.16V46.6c0-1.2-.96-2.16-2.16-2.16H405c-1.2 0-2.16.96-2.16 2.16v3.52c-2.96-3.76-7.68-6.64-14.72-6.64-12.64 0-20.16 10.64-20.16 21.28 0 10.56 7.52 21.2 20.16 21.2Zm.72-6.88c-8.4 0-13.44-6.16-13.44-14.32 0-8.24 5.04-14.4 13.44-14.4 8.96 0 14 6.32 14 14.4 0 8-5.04 14.32-14 14.32Zm35.28 21.36c1.2 0 2.16-.96 2.16-2.16V79.32c3.04 3.76 7.68 6.64 14.72 6.64 12.64 0 20.24-10.64 20.24-21.2 0-10.64-7.6-21.28-20.24-21.28-7.04 0-11.68 2.88-14.72 6.64V46.6c0-1.2-.96-2.16-2.16-2.16h-3.04c-1.12 0-2.08.96-2.08 2.16v51.68c0 1.2.96 2.16 2.08 2.16h3.04Zm16.16-21.36c-8.88 0-14-6.32-14-14.32 0-8.08 5.12-14.4 14-14.4 8.4 0 13.44 6.16 13.44 14.4 0 8.16-5.04 14.32-13.44 14.32Zm45.12 6.88c7.04 0 11.76-2.88 14.72-6.64v3.52c0 1.2.96 2.16 2.16 2.16h3.04c1.2 0 2.16-.96 2.16-2.16V46.6c0-1.2-.96-2.16-2.16-2.16h-3.04c-1.2 0-2.16.96-2.16 2.16v3.52c-2.96-3.76-7.68-6.64-14.72-6.64-12.64 0-20.16 10.64-20.16 21.28 0 10.56 7.52 21.2 20.16 21.2Zm.72-6.88c-8.4 0-13.44-6.16-13.44-14.32 0-8.24 5.04-14.4 13.44-14.4 8.96 0 14 6.32 14 14.4 0 8-5.04 14.32-14 14.32Zm47.92 6.88c7.04 0 11.76-2.88 14.8-6.64v3.52c0 1.2.96 2.16 2.08 2.16h3.04c1.2 0 2.16-.96 2.16-2.16V31.16c0-1.2-.96-2.16-2.16-2.16h-3.04c-1.12 0-2.08.96-2.08 2.16v18.96c-3.04-3.76-7.76-6.64-14.8-6.64-12.64 0-20.16 10.64-20.16 21.28 0 10.56 7.52 21.2 20.16 21.2Zm.72-6.88c-8.32 0-13.44-6.16-13.44-14.32 0-8.24 5.12-14.4 13.44-14.4 8.96 0 14.08 6.32 14.08 14.4 0 8-5.12 14.32-14.08 14.32Zm49.52 6.88c6.08 0 11.28-2 14.96-5.68.88-.96.72-2.56-.48-3.28l-2.4-1.52c-.8-.56-1.84-.48-2.56.16-2.4 2.16-5.84 3.44-9.52 3.44-8 0-12.88-4.56-14.08-11.2h29.68c1.52 0 2.8-1.28 2.8-2.8.4-13.44-9.36-21.6-19.68-21.6-11.92 0-20.48 9.52-20.48 21.28 0 11.68 8.32 21.2 21.76 21.2Zm10.8-24.4H570.2c1.12-6.72 5.84-11.2 12.8-11.2 6.88 0 11.12 4.4 12.08 11.2Zm26.88 24.4c10.72 0 15.92-6 15.92-13.12 0-6.16-3.36-9.28-13.28-11.36a72.88 72.88 0 0 0-1.514-.293l-1.02-.188-.507-.096-.504-.1c-3.51-.708-6.615-1.743-6.615-5.163 0-3.36 2.88-5.68 6.88-5.68 3.68 0 6 1.6 7.12 3.36.48.8 1.44 1.12 2.32.88l2.88-.8c1.28-.32 1.92-1.84 1.28-3.04-2.24-4.4-7.28-6.88-12.88-6.88-8.88 0-15.04 5.28-15.04 12.72 0 5.92 3.36 9.6 10.88 11.36.916.206 1.861.378 2.803.54l.564.096c4.69.796 9.113 1.493 9.113 5.364 0 3.6-2.96 5.76-8.24 5.76-5.12 0-7.6-1.76-8.72-3.52-.56-.8-1.52-1.2-2.48-.88l-3.2 1.12c-1.2.4-1.84 1.84-1.2 3.04 2.56 4.48 8.48 6.88 15.44 6.88Zm-352.4 72c6.08 0 11.28-2 14.96-5.68.88-.96.72-2.56-.48-3.28l-2.4-1.52c-.8-.56-1.84-.48-2.56.16-2.4 2.16-5.84 3.44-9.52 3.44-8 0-12.88-4.56-14.08-11.2h29.68c1.52 0 2.8-1.28 2.8-2.8.4-13.44-9.36-21.6-19.68-21.6-11.92 0-20.48 9.52-20.48 21.28 0 11.68 8.32 21.2 21.76 21.2Zm10.8-24.4h-24.88c1.12-6.72 5.84-11.2 12.8-11.2 6.88 0 11.12 4.4 12.08 11.2Zm19.2 23.44c1.2 0 2.16-.96 2.16-2.16v-21.12c0-4.72 3.04-11.36 10.72-11.36 7.6 0 10.08 5.68 10.08 11.36v21.12c0 1.2.96 2.16 2.08 2.16h3.04c1.2 0 2.16-.96 2.16-2.16v-23.2c0-8.64-6.48-16.16-15.6-16.16-6.16 0-10.08 3.04-12.48 6.64v-3.52c0-1.2-.96-2.16-2.16-2.16h-3.04c-1.2 0-2.08.96-2.08 2.16v36.24c0 1.2.88 2.16 2.08 2.16h3.04Zm44.16 15.44c1.2 0 2.16-.96 2.16-2.16v-18.96c3.04 3.76 7.68 6.64 14.72 6.64 12.64 0 20.24-10.64 20.24-21.2 0-10.64-7.6-21.28-20.24-21.28-7.04 0-11.68 2.88-14.72 6.64v-3.52c0-1.2-.96-2.16-2.16-2.16h-3.04c-1.12 0-2.08.96-2.08 2.16v51.68c0 1.2.96 2.16 2.08 2.16h3.04Zm16.16-21.36c-8.88 0-14-6.32-14-14.32 0-8.08 5.12-14.4 14-14.4 8.4 0 13.44 6.16 13.44 14.4 0 8.16-5.04 14.32-13.44 14.32Zm45.12 6.88c7.04 0 11.76-2.88 14.72-6.64v3.52c0 1.2.96 2.16 2.16 2.16h3.04c1.2 0 2.16-.96 2.16-2.16V118.6c0-1.2-.96-2.16-2.16-2.16h-3.04c-1.2 0-2.16.96-2.16 2.16v3.52c-2.96-3.76-7.68-6.64-14.72-6.64-12.64 0-20.16 10.64-20.16 21.28 0 10.56 7.52 21.2 20.16 21.2Zm.72-6.88c-8.4 0-13.44-6.16-13.44-14.32 0-8.24 5.04-14.4 13.44-14.4 8.96 0 14 6.32 14 14.4 0 8-5.04 14.32-14 14.32Zm35.36 5.92c1.12 0 2.08-.96 2.08-2.16v-16c0-7.2 1.44-15.84 12.08-15.28.8 0 1.52-.64 1.52-1.44v-5.2c0-.8-.72-1.44-1.6-1.36-4.72.4-9.52 2.96-12 7.92v-4.88c0-1.2-.96-2.16-2.08-2.16h-3.04c-1.2 0-2.16.96-2.16 2.16v36.24c0 1.2.96 2.16 2.16 2.16h3.04Zm39.76.96c6.08 0 11.28-2 14.96-5.68.88-.96.72-2.56-.48-3.28l-2.4-1.52c-.8-.56-1.84-.48-2.56.16-2.4 2.16-5.84 3.44-9.52 3.44-8 0-12.88-4.56-14.08-11.2h29.68c1.52 0 2.8-1.28 2.8-2.8.4-13.44-9.36-21.6-19.68-21.6-11.92 0-20.48 9.52-20.48 21.28 0 11.68 8.32 21.2 21.76 21.2Zm10.8-24.4h-24.88c1.12-6.72 5.84-11.2 12.8-11.2 6.88 0 11.12 4.4 12.08 11.2ZM510.92 157c1.2 0 2.08-.96 2.08-2.16v-51.68c0-1.2-.88-2.16-2.08-2.16h-3.04c-1.2 0-2.16.96-2.16 2.16v51.68c0 1.2.96 2.16 2.16 2.16h3.04Zm16.08 0c1.2 0 2.08-.96 2.08-2.16v-51.68c0-1.2-.88-2.16-2.08-2.16h-3.04c-1.2 0-2.16.96-2.16 2.16v51.68c0 1.2.96 2.16 2.16 2.16H527Zm28.64.96c7.04 0 11.76-2.88 14.72-6.64v3.52c0 1.2.96 2.16 2.16 2.16h3.04c1.2 0 2.16-.96 2.16-2.16V118.6c0-1.2-.96-2.16-2.16-2.16h-3.04c-1.2 0-2.16.96-2.16 2.16v3.52c-2.96-3.76-7.68-6.64-14.72-6.64-12.64 0-20.16 10.64-20.16 21.28 0 10.56 7.52 21.2 20.16 21.2Zm.72-6.88c-8.4 0-13.44-6.16-13.44-14.32 0-8.24 5.04-14.4 13.44-14.4 8.96 0 14 6.32 14 14.4 0 8-5.04 14.32-14 14.32Z" fill="#001233" /><path d="M135.345 25.354a8 8 0 0 1 2.582 2.5l.174.282 70.638 119.581a8 8 0 0 1-6.558 12.062l-.33.007H8a8 8 0 0 1-6.893-12.06l58.125-98.668a8 8 0 0 1 13.786 0l60.517 102.728h68.316l-27.863-47.167c-11.209.55-22.182-2.142-32.846-8.034-5.161-2.852-9.618-7.103-14.145-12.92l-.569-.74-.399-.536-.815-1.12-1.58-2.213-4.045-5.717-1.115-1.55-.498-.671-.21-.268c-1.963-2.42-4.443-3.56-7.777-3.457L102.83 79.26a4 4 0 0 1-6.956-3.947l.105-.185 28.383-47.055a8 8 0 0 1 10.982-2.719ZM66.125 53.12 8 151.786h41.898c.075-.247.174-.49.3-.726l.105-.185 25.989-43.109a4 4 0 0 1 6.956 3.946l-.105.184-24.048 39.89h65.155L66.125 53.12Zm65.088-20.914L114.544 59.84c3.7.835 6.887 2.83 9.435 5.97l.345.444.592.797 1.234 1.712 5.18 7.305.968 1.342.599.805c4.072 5.32 7.918 9.049 12.114 11.368 7.992 4.415 16.067 6.764 24.272 7.071l-38.07-64.45ZM187.015 0c13.255 0 24 10.745 24 24s-10.745 24-24 24-24-10.745-24-24 10.745-24 24-24Zm0 8c-8.836 0-16 7.163-16 16s7.164 16 16 16c8.837 0 16-7.163 16-16s-7.163-16-16-16Z" fill="#E5654B" /></g></svg>
								<span className="text-sm block mt-2.5">
									Escapadesenparella.cat és el recomanador
									especialista d'escapades en parella a
									Catalunya. Segueix-nos per estar al dia de totes les novetats:
								</span>
								<ul className="list-none flex items-center mx-0 mt-3 mb-4 p-0 space-x-3">
									<li className="py-1 text-sm leading-tight">
										<a
											href="https://www.instagram.com/escapadesenparella"
											title="Segueix-nos a Instagram"
											target="_blank"
											className="flex items-center justify-center"
											rel="noopener noreferrer"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="icon icon-tabler icon-tabler-brand-instagram"
												width="22"
												height="22"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="currentColor"
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path
													stroke="none"
													d="M0 0h24v24H0z"
													fill="none"
												/>
												<rect
													x="4"
													y="4"
													width="16"
													height="16"
													rx="4"
												/>
												<circle cx="12" cy="12" r="3" />
												<line
													x1="16.5"
													y1="7.5"
													x2="16.5"
													y2="7.501"
												/>
											</svg>
										</a>
									</li>
									<li className="py-1 text-sm leading-tight">
										<a
											href="https://twitter.com/escapaenparella"
											title="Segueix-nos a Twitter"
											target="_blank"
											className="flex items-center justify-center"
											rel="noopener noreferrer"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="icon icon-tabler icon-tabler-brand-twitter"
												width="22"
												height="22"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="currentColor"
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path
													stroke="none"
													d="M0 0h24v24H0z"
												/>
												<path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497 -3.753C20.18 7.773 21.692 5.25 22 4.009z" />
											</svg>
										</a>
									</li>
									<li className="py-1 text-sm leading-tight">
										<a
											href="https://facebook.com/escapadesenparella"
											title="Segueix-nos a Facebook"
											target="_blank"
											className="flex items-center justify-center"
											rel="noopener noreferrer"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="icon icon-tabler icon-tabler-brand-facebook"
												width="22"
												height="22"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="currentColor"
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path
													stroke="none"
													d="M0 0h24v24H0z"
													fill="none"
												/>
												<path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
											</svg>
										</a>
									</li>
								</ul>
								<span className="opacity-70 text-xs block">
									Copyright © {copyrightDate}. Tots els drets
									reservats. <br />
									Codi i UI/UX:{" "}
									<a
										href="https://github.com/juliramon"
										target="_blank"
										rel="noopener noreferrer nofollow"
									>
										<u>Juli Ramon</u>
									</a>
									<br />
									Il·lutracions i disseny gràfic:{" "}
									<a
										href="https://andreaprat.cat"
										target="_blank"
										rel="noopener noreferrer nofollow"
									>
										<u>Andrea Prat</u>
									</a>
									<br />
									Desenvolupat i gestionat amb{" "}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="icon icon-tabler icon-tabler-heart inline relative -top-0.5"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="#00206B"
										fill="none"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path
											stroke="none"
											d="M0 0h24v24H0z"
										></path>
										<path
											fill="red"
											stroke="none"
											d="M12 20l-7 -7a4 4 0 0 1 6.5 -6a.9 .9 0 0 0 1 0a4 4 0 0 1 6.5 6l-7 7"
										></path>
									</svg>{" "}
									a Catalunya
								</span>
							</div>
						</div>
						<div className="w-full mb-6 lg:mb-0">
							<div className="footer-content">
								<span className="footer-header text-xl mb-2 inline-block">
									Categories d'escapada
								</span>
								<ul className="list-none m-0 p-0">
									{state.activityCategories
										? state.activityCategories.map(
											(category, idx) => (
												<li
													key={idx}
													className="py-1 text-sm leading-tight"
												>
													<a href={"/" + category.slug} title={category.title}>{category.title}</a>
												</li>
											)
										)
										: null}
								</ul>
							</div>
						</div>
						<div className="w-full mb-6 lg:mb-0">
							<div className="footer-content">
								<span className="footer-header text-xl mb-2 inline-block">
									Categories d'allotjaments
								</span>
								<ul className="list-none m-0 p-0">
									{state.placeCategories
										? state.placeCategories.map(
											(category, idx) => (
												<li
													key={idx}
													className="py-1 text-sm leading-tight"
												>
													<a href={"/" + category.slug} title={category.title}>{category.title}</a>
												</li>
											)
										)
										: null}
								</ul>
							</div>
						</div>
						<div className="w-full mb-6 lg:mb-0 ">
							<div className="footer-about">
								<span className="footer-header text-xl mb-2 inline-block">
									Nosaltres
								</span>
								<ul className="list-none m-0 p-0">
									<li className="py-1 text-sm leading-tight">
										<Link href="/allotjaments">
											<a title="Allotjaments amb encant a Catalunya">
												Allotjaments
											</a>
										</Link>
									</li>
									<li className="py-1 text-sm leading-tight">
										<Link href="/activitats">
											<a title="Experiències en parella">
												Experiències
											</a>
										</Link>
									</li>
									<li className="py-1 text-sm leading-tight">
										<Link href="/histories">
											<a title="Històries en parella">
												Històries en parella
											</a>
										</Link>
									</li>
									<li className="py-1 text-sm leading-tight">
										<Link href="/empreses">
											<a title="Serveis per a empreses">Serveis empreses</a>
										</Link>
									</li>
									<li className="disabled py-1 text-sm leading-tight">
										<Link href="#">Qui som?</Link>
									</li>
									<li className="disabled py-1 text-sm leading-tight">
										<Link href="#">Què fem?</Link>
									</li>
									<li className="py-1 text-sm leading-tight">
										<Link href="/descomptes-viatjar">
											<a title="Descomptes per viatjar">Descomptes per viatjar</a>
										</Link>
									</li>
									<li className="py-1 text-sm leading-tight">
										<Link href="/newsletter">
											<a title="Subscriu-te a la newsletter">Subscriu-te a la newsletter</a>
										</Link>
									</li>
									<li className="pt-1 text-sm leading-tight">
										<Link href="/contacte">
											<a title="Contacte">Contacte</a>
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="w-full mt-8 md:mt-14">
						<ul className="list-none px-0 flex flex-col md:flex-row md:items-center -mx-3 md:justify-center">
							<li className="pb-1.5 px-3 text-sm">
								<Link href="/politica-privadesa">
									<a>Política de privadesa</a>
								</Link>
							</li>
							<li className="pb-1.5 px-3 text-sm">
								<Link href="/condicions-us">
									<a>Condicions d'ús</a>
								</Link>
							</li>
							<li className="pb-1.5 px-3 text-sm">
								<Link href="/politica-privadesa#politicacookies">
									<a>Política de cookies</a>
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<DynamicKoFiBadge />
			</footer>
		</>
	);
};

export default Footer;

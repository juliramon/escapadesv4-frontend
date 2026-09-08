import Head from "next/head";
import NavigationBar from "../global/NavigationBar";

/**
 * Bastida de les pàgines de composició de contingut.
 *
 * La capçalera, el títol, el botó de publicar i les pestanyes
 * "Contingut principal" / "SEO" eren idèntiques a les deu pàgines de crear i
 * editar publicacions.
 */
const ContentFormLayout = ({
	documentTitle,
	title,
	description,
	submitLabel,
	onSubmit,
	isSaving,
	errorMessage,
	user,
	path,
	tabs,
	activeTab,
	onTabChange,
	children,
}) => (
	<>
		<Head>
			<title>{documentTitle}</title>
		</Head>
		<div id="storyForm">
			<NavigationBar
				logo_url={
					"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
				}
				user={user}
				path={path}
			/>
			<section>
				<div className="container">
					<div className="pt-7 pb-12">
						<div className="flex items-center justify-between">
							<div className="w-full lg:w-1/2">
								<h1 className="text-3xl">{title}</h1>
								{description ? (
									<p className="text-base">{description}</p>
								) : null}
							</div>
							<div className="w-full lg:w-1/2 flex flex-col items-end">
								<button
									className="button__primary button__lg"
									type="button"
									onClick={onSubmit}
									disabled={isSaving}
								>
									{isSaving ? "Desant…" : submitLabel}
								</button>
								{errorMessage ? (
									<span className="mt-2 text-15 text-red-600 text-right">
										{errorMessage}
									</span>
								) : null}
							</div>
						</div>

						<div className="form-composer__body">
							<div className="flex items-center justify-between overflow-hidden border border-primary-100 mb-4 bg-white shadow rounded-md">
								{tabs.map((tab) => (
									<button
										key={tab.key}
										type="button"
										className={`flex-1 bg-none px-4 py-4 text-primary-500 !rounded-md-none focus:border-t-4 focus:border-primary-500 text-sm ${
											activeTab === tab.key
												? "border-t-4 border-primary-500"
												: ""
										}`}
										onClick={() => onTabChange(tab.key)}
									>
										{tab.label}
									</button>
								))}
							</div>
							{children}
						</div>
					</div>
				</div>
			</section>
		</div>
	</>
);

export default ContentFormLayout;

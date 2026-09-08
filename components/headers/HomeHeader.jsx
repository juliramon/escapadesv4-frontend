import Link from "next/link";
import Router from "next/router";
import { useState } from "react";
import { GETAWAY_CATEGORIES, STAY_CATEGORIES } from "../../utils/siteTaxonomy";

/**
 * Capçalera de la portada.
 *
 * Tres decisions:
 *  - La imatge de temporada, que fins ara només s'usava per a l'`og:image`,
 *    passa a ser el fons: dona context de viatge sense afegir cap descàrrega
 *    nova (els fitxers ja existien a /public).
 *  - El cercador és el primer element accionable. Era l'acció principal del
 *    web i estava amagada darrere una icona.
 *  - Els accessos ràpids per categoria posen els verticals a un sol clic des
 *    del primer pantall.
 */

const QUICK_LINKS = [
	GETAWAY_CATEGORIES.find((c) => c.slug === "escapades-romantiques"),
	GETAWAY_CATEGORIES.find((c) => c.slug === "escapades-gastronomiques"),
	GETAWAY_CATEGORIES.find((c) => c.slug === "escapades-aventura"),
	GETAWAY_CATEGORIES.find((c) => c.slug === "escapades-de-relax"),
	STAY_CATEGORIES.find((c) => c.slug === "cases-rurals"),
	STAY_CATEGORIES.find((c) => c.slug === "cabanyes-als-arbres"),
].filter(Boolean);

const HomeHeader = ({ slideImage, totals = {} }) => {
	const [query, setQuery] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		const trimmed = query.trim();
		if (!trimmed) return;
		Router.push(`/search?query=${encodeURIComponent(trimmed)}`);
	};

	return (
		<section id="hero" className="home-hero">
			{slideImage ? (
				<picture className="home-hero__media">
					<source
						srcSet={slideImage.picture_webp_mob}
						media="(max-width: 767px)"
						type="image/webp"
					/>
					<source
						srcSet={slideImage.picture_raw_mob}
						media="(max-width: 767px)"
					/>
					<source
						srcSet={slideImage.picture_webp}
						media="(min-width: 768px)"
						type="image/webp"
					/>
					<img
						src={slideImage.picture_raw}
						alt=""
						aria-hidden="true"
						width={1600}
						height={900}
						loading="eager"
						fetchpriority="high"
						className="w-full h-full object-cover"
					/>
				</picture>
			) : null}
			<span className="home-hero__overlay" aria-hidden="true" />

			<div className="container relative z-10">
				<div className="home-hero__inner">
					<Link href="/descomptes-viatjar">
						<a
							className="home-hero__badge"
							title="Descomptes per viatjar"
						>
							<span className="home-hero__badge-tag">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width={15}
									height={15}
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth={2}
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path
										stroke="none"
										d="M0 0h24v24H0z"
										fill="none"
									/>
									<path d="M17 17m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
									<path d="M7 7m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
									<path d="M6 18l12 -12" />
								</svg>
								Descomptes
							</span>
							Estalvia amb els descomptes per viatjar
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width={15}
								height={15}
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={2}
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path
									stroke="none"
									d="M0 0h24v24H0z"
									fill="none"
								/>
								<path d="M9 6l6 6l-6 6" />
							</svg>
						</a>
					</Link>

					<h1 className="h1--hero home-hero__title">
						La vostra propera escapada en parella comença aquí
					</h1>
					<p className="home-hero__subtitle">
						Experiències i allotjaments amb encant a Catalunya,
						visitats i verificats per nosaltres.
					</p>

					<form className="home-hero__search" onSubmit={handleSubmit}>
						<label htmlFor="hero-search" className="sr-only">
							Cerca experiències, allotjaments o destinacions
						</label>
						<span className="home-hero__search-icon">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width={22}
								height={22}
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={1.5}
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path
									stroke="none"
									d="M0 0h24v24H0z"
									fill="none"
								/>
								<circle cx="10" cy="10" r="7" />
								<line x1="21" y1="21" x2="15" y2="15" />
							</svg>
						</span>
						<input
							id="hero-search"
							type="text"
							name="query"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="On voleu anar?"
							className="home-hero__search-input"
							autoComplete="off"
						/>
						<button
							type="submit"
							className="home-hero__search-button button button__primary button__med"
						>
							Cercar
						</button>
					</form>

					<ul className="home-hero__quick-links">
						{QUICK_LINKS.map((link) => (
							<li key={link.slug} className="m-0">
								<Link href={`/${link.slug}`}>
									<a className="home-hero__chip">
										{link.label}
									</a>
								</Link>
							</li>
						))}
					</ul>

					<ul className="home-hero__trust">
						{totals.activities ? (
							<li>{totals.activities} experiències</li>
						) : null}
						{totals.places ? (
							<li>{totals.places} allotjaments amb encant</li>
						) : null}
						<li>Visitats i verificats per nosaltres</li>
					</ul>
				</div>
			</div>
		</section>
	);
};

export default HomeHeader;

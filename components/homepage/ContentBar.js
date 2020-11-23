import React from "react";
import {Container} from "react-bootstrap";

const ContentBar = (props) => {
	let contentBar = undefined;
	if (props.user === undefined) {
		contentBar = (
			<div className="content-bar">
				<Container fluid>
					<div className="content-bar---wrapper d-flex align-items-center">
						<div className="content-bar---item">
							<div className="content-bar---col left">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="icon icon-tabler icon-tabler-heart"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="#2c3e50"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" />
									<path d="M12 20l-7 -7a4 4 0 0 1 6.5 -6a.9 .9 0 0 0 1 0a4 4 0 0 1 6.5 6l-7 7" />
								</svg>
							</div>
							<div className="content-bar---col right">
								<p>
									Romantic
									<br />
									Getaways
								</p>
							</div>
						</div>
						<div className="content-bar---item">
							<div className="content-bar---col left">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="icon icon-tabler icon-tabler-directions"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="#2c3e50"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" />
									<path d="M9 5h10l2 2l-2 2h-10a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1" />
									<path d="M13 13h-7l-2 2l2 2h7a1 1 0 0 0 1 -1v-2a1 1 0 0 0 -1 -1" />
									<line x1="12" y1="22" x2="12" y2="17" />
									<line x1="12" y1="13" x2="12" y2="9" />
									<line x1="12" y1="5" x2="12" y2="3" />
								</svg>
							</div>
							<div className="content-bar---col right">
								<p>
									Adventure
									<br />
									Getaways
								</p>
							</div>
						</div>
						<div className="content-bar---item">
							<div className="content-bar---col left">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="icon icon-tabler icon-tabler-droplet"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="#2c3e50"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" />
									<path d="M12 3l5 5a7 7 0 1 1 -10 0l5 -5" />
								</svg>
							</div>
							<div className="content-bar---col right">
								<p>
									Relax
									<br />
									Getaways
								</p>
							</div>
						</div>
						<div className="content-bar---item">
							<div className="content-bar---col left">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="icon icon-tabler icon-tabler-glass"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="#2c3e50"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" />
									<line x1="8" y1="21" x2="16" y2="21" />
									<line x1="12" y1="15" x2="12" y2="21" />
									<path d="M16 4l1 6a5 5 0 0 1 -10 0l1 -6z" />
								</svg>
							</div>
							<div className="content-bar---col right">
								<p>
									Gastronomic
									<br />
									Getaways
								</p>
							</div>
						</div>
						<div className="content-bar---item">
							<div className="content-bar---col left">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="icon icon-tabler icon-tabler-snowflake"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="#2c3e50"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" />
									<path d="M10 4l2 1l2 -1m-2 -2v6.5l3 1.72" />
									<path
										d="M10 4l2 1l2 -1m-2 -2v6.5l3 1.72"
										transform="rotate(60 12 12)"
									/>
									<path
										d="M10 4l2 1l2 -1m-2 -2v6.5l3 1.72"
										transform="rotate(120 12 12)"
									/>
									<path
										d="M10 4l2 1l2 -1m-2 -2v6.5l3 1.72"
										transform="rotate(180 12 12)"
									/>
									<path
										d="M10 4l2 1l2 -1m-2 -2v6.5l3 1.72"
										transform="rotate(240 12 12)"
									/>
									<path
										d="M10 4l2 1l2 -1m-2 -2v6.5l3 1.72"
										transform="rotate(300 12 12)"
									/>
								</svg>
							</div>
							<div className="content-bar---col right">
								<p>
									Winter
									<br />
									Getaways
								</p>
							</div>
						</div>
						<div className="content-bar---item">
							<div className="content-bar---col left">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="icon icon-tabler icon-tabler-sun"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="#2c3e50"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" />
									<circle cx="12" cy="12" r="4" />
									<path d="M3 12h1M12 3v1M20 12h1M12 20v1M5.6 5.6l.7 .7M18.4 5.6l-.7 .7M17.7 17.7l.7 .7M6.3 17.7l-.7 .7" />
								</svg>
							</div>
							<div className="content-bar---col right">
								<p>
									Summer
									<br />
									Getaways
								</p>
							</div>
						</div>
						<div className="content-bar---item">
							<div className="content-bar---col left">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="icon icon-tabler icon-tabler-car"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="#2c3e50"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" />
									<circle cx="7" cy="17" r="2" />
									<circle cx="17" cy="17" r="2" />
									<path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
								</svg>
							</div>
							<div className="content-bar---col right">
								<p>
									Weekend
									<br />
									Getaways
								</p>
							</div>
						</div>
						<div className="content-bar---item">
							<div className="content-bar---col left">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="icon icon-tabler icon-tabler-building-bridge"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="#2c3e50"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" />
									<line x1="6" y1="5" x2="6" y2="19" />
									<line x1="18" y1="5" x2="18" y2="19" />
									<line x1="2" y1="15" x2="22" y2="15" />
									<path d="M3 8a7.5 7.5 0 0 0 3 -2a6.5 6.5 0 0 0 12 0a7.5 7.5 0 0 0 3 2" />
									<line x1="12" y1="10" x2="12" y2="15" />
								</svg>
							</div>
							<div className="content-bar---col right">
								<p>
									Cultural
									<br />
									Getaways
								</p>
							</div>
						</div>
					</div>
				</Container>
			</div>
		);
	}
	return <div>{contentBar}</div>;
};

export default ContentBar;

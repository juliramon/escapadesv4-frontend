import Head from "next/head";
import Router from "next/router";
import Link from "next/link";
import {useContext, useEffect, useState} from "react";
import {Form, Button, Alert} from "react-bootstrap";
import AuthService from "../services/authService";
import {useRouter} from "next/router";
import UserContext from "../contexts/UserContext";

const Login = () => {
	const {user, saveUserDetails} = useContext(UserContext);
	const router = useRouter();

	const initialState = {
		formData: {
			email: "",
			password: "",
		},
		errorMessage: {},
	};
	const [state, setState] = useState(initialState);
	const service = new AuthService();
	const handleChange = (e) => {
		setState({
			...state,
			formData: {...state.formData, [e.target.name]: e.target.value},
		});
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const {email, password} = state.formData;
		service.login(email, password).then((res) => {
			if (res.status) {
				setState({
					...state,
					errorMessage: res,
				});
			} else {
				setState(initialState);
				saveUserDetails(res);
			}
		});
	};
	let errorMessage;
	if (state.errorMessage.message) {
		if (state.errorMessage.message === "Missing credentials") {
			errorMessage = (
				<Alert variant="danger">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="icon icon-tabler icon-tabler-shield-x"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="#fff"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" />
						<path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
						<path d="M10 10l4 4m0 -4l-4 4" />
					</svg>
					{state.errorMessage.message}
				</Alert>
			);
		} else if (state.errorMessage.message === "Incorrect email") {
			errorMessage = (
				<Alert variant="danger">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="icon icon-tabler icon-tabler-at"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="#fff"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" />
						<circle cx="12" cy="12" r="4" />
						<path d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28" />
					</svg>
					{state.errorMessage.message}
				</Alert>
			);
		} else if (state.errorMessage.message === "Incorrect password") {
			errorMessage = (
				<Alert variant="danger">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="icon icon-tabler icon-tabler-key"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="#fff"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" />
						<circle cx="8" cy="15" r="4" />
						<line x1="10.85" y1="12.15" x2="19" y2="4" />
						<line x1="18" y1="5" x2="20" y2="7" />
						<line x1="15" y1="8" x2="17" y2="10" />
					</svg>
					{state.errorMessage.message}
				</Alert>
			);
		}
	} else {
		errorMessage = null;
	}

	useEffect(() => {
		if (user) {
			if (user !== undefined || user !== "null") {
				console.log(user);
				// router.push("/feed");
			}
		}
	}, [user]);

	if (user) {
		return null;
	}

	return (
		<>
			<Head>
				<title>Inicia sessió - Escapadesenparella.cat</title>
				<link rel="icon" href="/favicon.ico" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
				<meta
					name="description"
					content={`Accedeix al teu compte per cercar, descobrir i gaudir de la teva propera escapada en parella.`}
				/>
				<meta name="robots" content="index, follow" />
				<meta name="googlebot" content="index, follow" />
				<meta property="og:type" content="website" />
				<meta
					property="og:title"
					content={`Inicia sessió - Escapadesenparella.cat`}
				/>
				<meta
					property="og:description"
					content={`Accedeix al teu compte per cercar, descobrir i gaudir de la teva propera escapada en parella.`}
				/>
				<meta
					property="url"
					content={`https://escapadesenparella.cat${router.asPath}`}
				/>
				<meta property="og:site_name" content="Escapadesenparella.cat" />
				<meta property="og:locale" content="ca_ES" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta
					name="twitter:title"
					content={`Inicia sessió - Escapadesenparella.cat`}
				/>
				<meta
					name="twitter:description"
					content={`Accedeix al teu compte per cercar, descobrir i gaudir de la teva propera escapada en parella.`}
				/>
				{/* <meta name="twitter:image" content={state.place.images[0]} />
				<meta property="og:image" content={state.place.images[0]} /> */}
				<meta property="og:image:width" content="1200" />
				<meta property="og:image:heigth" content="1200" />
				<link
					rel="canonical"
					href={`https://escapadesenparella.cat${router.asPath}`}
				/>
				<link href={`https://escapadesenparella.cat`} rel="home" />
				<meta property="fb:pages" content="1725186064424579" />
				<meta
					name="B-verify"
					content="756319ea1956c99d055184c4cac47dbfa3c81808"
				/>
			</Head>
			<section id="signup">
				<div className="d-flex">
					<div className="signup-col left">
						<div className="title-area">
							<Link href="/">
								<img
									src="https://res.cloudinary.com/juligoodie/image/upload/c_scale,q_100,w_135/v1600008855/getaways-guru/static-files/logo-getaways-guru_vvbikk.svg"
									alt=""
								/>
							</Link>
							<h2>Descobreix les millors escapades en parella a Catalunya.</h2>
						</div>
						<div className="graphic">
							<img src="../../signup-graphic.svg" alt="" />
						</div>
					</div>
					<div className="signup-col right">
						<div className="signup-col-wrapper right">
							<div className="navlink">
								Encara no tens un compte? <Link href="/signup">Registra't</Link>
							</div>
							<div className="title-area">
								<h1>Inicia sessió a Escapadesenparella.cat</h1>
								<p className="sub-h1">
									Accedeix al teu compte per cercar, descobrir i gaudir de la
									teva propera escapada en parella.
								</p>
							</div>
							{/* <div className="social-signup d-flex align-items-center">
							<button type="submit" className="btn google">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="icon icon-tabler icon-tabler-brand-google"
									width="18"
									height="18"
									viewBox="0 0 24 24"
									strokeWidth="3"
									stroke="#ffffff"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" />
									<path d="M17.788 5.108A9 9 0 1021 12h-8" />
								</svg>
								Log in with Google
							</button>
							<button type="submit" className="btn facebook">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="icon icon-tabler icon-tabler-brand-facebook"
									width="25"
									height="25"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="none"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" />
									<path
										d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"
										style={{fill: "#666666"}}
									/>
								</svg>
							</button>
						</div> */}
							<Form onSubmit={handleSubmit}>
								{errorMessage}
								<Form.Group>
									<Form.Label>Correu electrònic</Form.Label>
									<Form.Control
										type="email"
										name="email"
										onChange={handleChange}
										placeholder="Escriu el teu correu electrònic"
									/>
								</Form.Group>
								<Form.Group>
									<Form.Label>Contrassenya</Form.Label>
									<Form.Control
										type="password"
										name="password"
										onChange={handleChange}
										placeholder="6+ caràcters"
									/>
								</Form.Group>
								<Button type="submit">Iniciar sessió</Button>
							</Form>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Login;

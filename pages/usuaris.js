import {useEffect, useCallback, useState, useContext} from "react";
import NavigationBar from "../components/global/NavigationBar";
import {Container, Row} from "react-bootstrap";
import ContentService from "../services/contentService";
import PublicUserBox from "../components/listings/PublicUserBox";
import UserContext from "../contexts/UserContext";
import Head from "next/head";

const UsersList = () => {
	const {user} = useContext(UserContext);

	const initialState = {
		users: [],
	};
	const [state, setState] = useState(initialState);
	const service = new ContentService();
	const getAllUsers = useCallback(() => {
		service
			.getAllUsers("/users")
			.then((res) => setState({...state, users: res}));
	}, [state, service]);
	useEffect(getAllUsers, []);
	const usersList = state.users.map((el) => (
		<PublicUserBox
			key={el._id}
			id={el._id}
			avatar={el.avatar}
			fullname={el.fullName}
			username={el.username}
		/>
	));
	return (
		<>
			<Head>
				<title>Comunitat - Escapadesenaprella.cat</title>
			</Head>
			<div id="usersList">
				<NavigationBar
					logo_url={
						"https://res.cloudinary.com/juligoodie/image/upload/c_scale,q_100,w_135/v1600008855/getaways-guru/static-files/logo-getaways-guru_vvbikk.svg"
					}
					user={user}
				/>
				<Container fluid className="mw-1600">
					<Row>
						<div className="box d-flex">
							<div className="col left">
								<div className="box bordered">
									<div className="page-meta">
										<div className="page-header d-flex">
											<h1 className="page-title">Comunitat</h1>
										</div>
										<ul>
											<li className="page-bookmarks">
												<span>{state.users.length}</span>{" "}
												{state.users.length > 1 ? "usuaris" : "usuari"}
											</li>
											<hr />
											<li className="page-description">
												Aquí trobaràs els membres de la comunitat
											</li>
										</ul>
									</div>
								</div>
							</div>

							<div className="col right">
								<div className="box wrapper d-flex">{usersList}</div>
							</div>
						</div>
					</Row>
				</Container>
			</div>
		</>
	);
};

export default UsersList;

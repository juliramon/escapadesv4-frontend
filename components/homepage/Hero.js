import Link from "next/link";
import {Container, Row, Col} from "react-bootstrap";
import SearchBar from "../homepage/SearchBar";

const Hero = ({background_url, title, subtitle}) => {
	return (
		<section
			id="hero"
			style={{
				background: `linear-gradient(rgba(11, 26, 58, 0.74), rgba(8, 24, 58, 0.26)),url('${background_url}')`,
			}}
		>
			<Container className="mw-1200">
				<Row>
					<Col lg={12}>
						<div className="wrapper">
							<div className="header-col left">
								<h1 className="header-title">{title}</h1>
								<p className="header-subtitle">{subtitle}</p>
								<SearchBar />
							</div>
						</div>
					</Col>
				</Row>
				<div className="header-indicator d-flex align-items-center">
					<Link href="/places/5f60cef2e9d2f2001783ba6d">
						Cabanes als arbres | Sant Hilari Sacalm, Girona
					</Link>
				</div>
			</Container>
		</section>
	);
};

export default Hero;

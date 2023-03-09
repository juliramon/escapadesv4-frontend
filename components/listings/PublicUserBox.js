import {useState} from "react";
import Link from "next/link";

const PublicUserBox = ({id, avatar, fullname, username, bio}) => {
	const initialState = {
		id: id,
		fullname: fullname,
		avatar: avatar,
		username: username,
		bio: bio,
	};
	const [state] = useState(initialState);
	return (
		<div id="publicUserBox">
			<Link href={`/usuaris/${state.id}`}>
				<a>
					<div className="box-wrapper">
						<div className="avatar">
							<img src={state.avatar} alt={state.fullname} />
						</div>
						<h3>{state.fullname}</h3>
						<p>@{state.username || "username"}</p>
						<p>{state.bio}</p>
					</div>
				</a>
			</Link>
		</div>
	);
};

export default PublicUserBox;

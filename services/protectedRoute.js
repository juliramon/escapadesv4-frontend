// const protectedRoute = ({component: Component, user, ...rest}) => {
// 	return (
// 		<Route
// 			{...rest}
// 			render={(props) => {
// 				if (user !== null) {
// 					return <Component {...props} user={user} />;
// 				} else {
// 					return (
// 						<Redirect
// 							to={{pathname: "/login", state: {from: props.location}}}
// 						/>
// 					);
// 				}
// 			}}
// 		/>
// 	);
// };
// export default protectedRoute;

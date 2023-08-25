import { useRouter } from "next/router";

const ShareBar = ({ color = "text-white", iconsSize = 24 }) => {
	const router = useRouter();
	const url = "https://escapadesenparella.cat" + router.asPath;

	return (
		<div className="flex flex-wrap items-center -mx-1.5">
			<span className="px-1.5 font-medium text-sm ">Comparteixa-ho!</span>
			<a
				href={`http://www.facebook.com/sharer.php?u=${url}`}
				className={
					`px-1.5 hover:text-secondary-500 transition-all duration-300 ease-in-out` +
					color
				}
				target="_blank"
				title="Comparteixa-ho a Facebook"
				rel="nofollow nofererrer"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={iconsSize}
					height={iconsSize}
					viewBox="0 0 24 24"
					strokeWidth="1"
					stroke="currentColor"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path
						d="M18 2a1 1 0 0 1 .993 .883l.007 .117v4a1 1 0 0 1 -.883 .993l-.117 .007h-3v1h3a1 1 0 0 1 .991 1.131l-.02 .112l-1 4a1 1 0 0 1 -.858 .75l-.113 .007h-2v6a1 1 0 0 1 -.883 .993l-.117 .007h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-6h-2a1 1 0 0 1 -.993 -.883l-.007 -.117v-4a1 1 0 0 1 .883 -.993l.117 -.007h2v-1a6 6 0 0 1 5.775 -5.996l.225 -.004h3z"
						strokeWidth={0}
						fill="currentColor"
					></path>
				</svg>
			</a>
			<a
				href={`https://twitter.com/intent/tweet?url=${url}`}
				className={
					`px-1.5 hover:text-secondary-500 transition-all duration-300 ease-in-out` +
					color
				}
				target="_blank"
				title="Comparteixa-ho a X"
				rel="nofollow nofererrer"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={iconsSize}
					height={iconsSize}
					viewBox="0 0 24 24"
					strokeWidth={1}
					stroke="currentColor"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path
						d="M8.267 3a1 1 0 0 1 .73 .317l.076 .092l4.274 5.828l5.946 -5.944a1 1 0 0 1 1.497 1.32l-.083 .094l-6.163 6.162l6.262 8.54a1 1 0 0 1 -.697 1.585l-.109 .006h-4.267a1 1 0 0 1 -.73 -.317l-.076 -.092l-4.276 -5.829l-5.944 5.945a1 1 0 0 1 -1.497 -1.32l.083 -.094l6.161 -6.163l-6.26 -8.539a1 1 0 0 1 .697 -1.585l.109 -.006h4.267z"
						strokeWidth={0}
						fill="currentColor"
					></path>
				</svg>
			</a>
			<a
				href={`mailto:?subject=Mira%20què%20he%20trobat%20a%20Escapadesenparella.cat&body=${url}`}
				className={
					`px-1.5 hover:text-secondary-500 transition-all duration-300 ease-in-out` +
					color
				}
				target="_blank"
				title="Comparteixa-ho per correu electrònic"
				rel="nofollow nofererrer"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={iconsSize}
					height={iconsSize}
					viewBox="0 0 24 24"
					strokeWidth="2"
					stroke="currentColor"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path
						d="M22 7.535v9.465a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-9.465l9.445 6.297l.116 .066a1 1 0 0 0 .878 0l.116 -.066l9.445 -6.297z"
						strokeWidth={0}
						fill="currentColor"
					></path>
					<path
						d="M19 4c1.08 0 2.027 .57 2.555 1.427l-9.555 6.37l-9.555 -6.37a2.999 2.999 0 0 1 2.354 -1.42l.201 -.007h14z"
						strokeWidth={0}
						fill="currentColor"
					></path>
				</svg>
			</a>
		</div>
	);
};

export default ShareBar;

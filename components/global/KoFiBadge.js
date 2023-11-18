const KoFiBadge = () => {
	return (
		<>
			<a
				href="https://ko-fi.com/Q5Q7R90ZZ"
				target="_blank"
				rel="nofollow noreferrer"
				className="fixed shadow-md z-40 bottom-5 right-5 rounded-full px-5 py-2.5 text-[15px] button button__primary text-white flex items-center justify-center"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="icon icon-tabler icon-tabler-pig-money"
					width={32}
					height={32}
					viewBox="0 0 24 24"
					strokeWidth={1}
					stroke="currentColor"
					fill="#ffbd5e"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M15 11v.01" />
					<path d="M5.173 8.378a3 3 0 1 1 4.656 -1.377" />
					<path d="M16 4v3.803a6.019 6.019 0 0 1 2.658 3.197h1.341a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-1.342c-.336 .95 -.907 1.8 -1.658 2.473v2.027a1.5 1.5 0 0 1 -3 0v-.583a6.04 6.04 0 0 1 -1 .083h-4a6.04 6.04 0 0 1 -1 -.083v.583a1.5 1.5 0 0 1 -3 0v-2l0 -.027a6 6 0 0 1 4 -10.473h2.5l4.5 -3h0z" />
				</svg>
				<span className="inline-block relative top-px">
					Ajuda'ns amb el projecte
				</span>
			</a>
		</>
	);
};

export default KoFiBadge;

import React from "react";

const ListingsTextareaFooter = ({ textareaFooter }) => {
	return (
		<section>
			<div className="container">
				<div className="border-t border-primary-50 py-8 mt-8 md:py-12 md:mt-12 lg:py-20 lg:mt-20">
					<div
						className="w-full max-w-prose mx-auto text-block"
						dangerouslySetInnerHTML={{
							__html: textareaFooter,
						}}
					></div>
				</div>
			</div>
		</section>
	);
};

export default ListingsTextareaFooter;

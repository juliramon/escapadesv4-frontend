import React from "react";

const MetricsBox = ({ integer, metricName }) => {
	return (
		<div className="rounded-md border border-primary-200 flex-1">
			<div className="metric-wrapper p-5">
				<h3>{integer}</h3>
				<p className="mb-0">{metricName}</p>
			</div>
		</div>
	);
};
export default MetricsBox;

import React from "react";

const MetricsBox = ({ integer, metricName }) => {
  return (
    <div className="metric-box">
      <div className="metric-wrapper">
        <h3>{integer}</h3>
        <p>{metricName}</p>
      </div>
    </div>
  );
};
export default MetricsBox;

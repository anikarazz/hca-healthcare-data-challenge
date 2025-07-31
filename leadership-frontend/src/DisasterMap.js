import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const DisasterMap = () => {
  const [plotData, setPlotData] = useState(null);

  useEffect(() => {
    fetch("/top5.json")  // Loads the JSON file from the public folder
      .then((response) => response.json())
      .then((data) => setPlotData(JSON.parse(data))) // Converts JSON into usable format
      .catch((error) => console.error("Error loading Plotly JSON:", error));
  }, []);

  return (
    <div>
      <h2>Disaster Map</h2>
      {plotData ? (
        <Plot data={plotData.data} layout={plotData.layout} />
      ) : (
        <p>Loading disaster map...</p>
      )}
    </div>
  );
};

export default DisasterMap;

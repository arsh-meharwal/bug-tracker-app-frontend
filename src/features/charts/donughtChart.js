import React from "react";
import Chart from "react-apexcharts";

const DonutChart = ({ data }) => {
  const options = {
    chart: {
      type: "donut",
    },
    labels: data.labels,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const series = data.series;

  return (
    <div className="donut-chart">
      <Chart options={options} series={series} type="donut" width="100%" />
    </div>
  );
};

export default DonutChart;

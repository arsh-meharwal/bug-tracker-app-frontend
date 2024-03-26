import React from "react";
import Chart from "react-apexcharts";

const StackedAreaChart = ({ chartData }) => {
  const options = {
    chart: {
      type: "area",
      stacked: true,
      height: 350,
    },
    series: chartData.series,
    xaxis: {
      categories: chartData.categories,
    },
    fill: {
      opacity: 0.5,
    },
    legend: {
      position: "top",
    },
  };

  return (
    <div>
      <Chart
        options={options}
        series={options.series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default StackedAreaChart;

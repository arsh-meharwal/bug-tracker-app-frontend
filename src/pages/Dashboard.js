import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import StackedAreaChart from "../features/charts/stackedAreaChart";
import { getTickets } from "../features/ticket/ticketsAPI";
import DonutChart from "../features/charts/donughtChart";
import LoadingSpinner from "../features/loader/LoadingSpinner";

const Dashboard = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const fetchData = async () => {
    try {
      let response = await getTickets();
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError(error.message);
    }
  };

  const ticketCountByDate = {};
  const ticketCountByProject = {};
  const ticketCountByPriority = {};

  // Iterate over ticketData to count tickets by date
  data &&
    data.map((ticket) => {
      const date = ticket.created_at;
      ticketCountByDate[date] = (ticketCountByDate[date] || 0) + 1;
      ticketCountByProject[ticket.project_name] =
        (ticketCountByProject[ticket.project_name] || 0) + 1;
      ticketCountByPriority[ticket.priority] =
        (ticketCountByPriority[ticket.priority] || 0) + 1;
    });

  // Extract counts into a new array
  const ticketCounts = Object.values(ticketCountByDate);
  const ticketDate = Object.keys(ticketCountByDate);
  const projects = Object.keys(ticketCountByProject);
  const TtByProjects = Object.values(ticketCountByProject);
  const priority = Object.keys(ticketCountByPriority);
  const TtByPriority = Object.values(ticketCountByPriority);

  const stackedData = {
    series: [
      {
        name: "Tickets Initiated",
        data: ticketCounts,
      },
    ],
    categories: ticketDate,
  };

  const donutChartData = {
    labels: projects,
    series: TtByProjects,
  };
  const donutChartData2 = {
    labels: priority,
    series: TtByPriority,
  };

  //   Expample option for donut chart
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-gray-600 min-w-96  lg:px-4 py-20">
      <div className="card-container  ">
        <div className="card-heading flex flex-col min-h-16">
          <div className="mx-4">
            <h2 className="card-heading-text text-2xl">All Tickets</h2>
          </div>
          <div className="pt-1">
            <p className="text-md text-white">Tickets Initiated per Day</p>
          </div>
        </div>
        <div className="bg-white pt-10 ">
          <StackedAreaChart chartData={stackedData} />
        </div>
      </div>
      <div className=" grid lg:grid-cols-2">
        <div className="lg:col-span-1 px-1">
          <div className="card-container pt-4">
            <div className="card-heading flex flex-col min-h-16">
              <div className="mx-4">
                <h2 className="card-heading-text text-2xl">
                  Tickets by Projects
                </h2>
              </div>
              <div className="pt-1">
                <p className="text-md text-white">
                  Tickets as percentage of total Projects
                </p>
              </div>
            </div>
            <div className="bg-white pt-10">
              <DonutChart data={donutChartData} />
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 px-1">
          <div className="card-container pt-4">
            <div className="card-heading flex flex-col min-h-16">
              <div className="mx-4">
                <h2 className="card-heading-text text-2xl">
                  Tickets by Priority
                </h2>
              </div>
              <div className="pt-1">
                <p className="text-md text-white">
                  Ticket percentage by priority
                </p>
              </div>
            </div>
            <div className="bg-white pt-10">
              <DonutChart data={donutChartData2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

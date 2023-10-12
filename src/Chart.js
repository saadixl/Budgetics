import Card from "react-bootstrap/Card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export function AllBudgetsChart(props) {
  const { chartData, title } = props;
  if (!chartData) {
    return null;
  }
  const { labels, data1, data2, data3 } = chartData;
  const data = {
    labels,
    datasets: [
      {
        label: "Spent",
        data: data1,
        backgroundColor: "#cd674d",
      },
      {
        label: "Balance",
        data: data2,
        backgroundColor: "#28a745",
      },
      {
        label: "Budget",
        data: data3,
        backgroundColor: "#b6d1f9",
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title,
      },
    },
  };
  return (
    <Card className="chart-wrapper" data-bs-theme="dark">
      <Bar options={options} data={data} />
    </Card>
  );
}

export function HistoryChart(props) {
  const { chartData, title } = props;
  if (!chartData) {
    return null;
  }
  const { labels, data1 } = chartData;
  const data = {
    labels,
    datasets: [
      {
        label: "Spent",
        data: data1,
        backgroundColor: "#cd674d",
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title,
      },
    },
  };
  return (
    <Card className="chart-wrapper" data-bs-theme="dark">
      <Bar options={options} data={data} />
    </Card>
  );
}

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
        backgroundColor: "rgba(0, 188, 212, 0.8)",
        borderColor: "rgba(0, 188, 212, 1)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#b0b0b0",
          font: {
            family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'",
            size: 12,
            weight: 500,
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(26, 26, 26, 0.95)",
        titleColor: "#fff",
        bodyColor: "#00BCD4",
        borderColor: "rgba(0, 188, 212, 0.3)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          family: "'Inter', -apple-system, BlinkMacSystemFont",
          size: 13,
          weight: 600,
        },
        bodyFont: {
          family: "'Inter', -apple-system, BlinkMacSystemFont",
          size: 14,
          weight: 600,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#888",
          font: {
            family: "'Inter', -apple-system, BlinkMacSystemFont",
            size: 11,
          },
        },
        border: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "#888",
          font: {
            family: "'Inter', -apple-system, BlinkMacSystemFont",
            size: 11,
          },
        },
        border: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };
  return (
    <Card className="chart-wrapper" data-bs-theme="dark">
      <Card.Body style={{ padding: '24px' }}>
        <h5 style={{ 
          color: '#fff', 
          fontSize: '18px', 
          fontWeight: 600, 
          marginBottom: '20px',
          letterSpacing: '-0.3px'
        }}>
          {title}
        </h5>
        <div style={{ height: '250px', position: 'relative' }}>
          <Bar options={options} data={data} />
        </div>
      </Card.Body>
    </Card>
  );
}

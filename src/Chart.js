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

export default function BarChart(props) {
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
                backgroundColor: "#74240c",
            },
            {
                label: "Balance",
                data: data2,
                backgroundColor: "#28a745",
            },
            {
                label: "Budget",
                data: data3,
                backgroundColor: "#6257a6",
            },
        ],
    };
    const options = {
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
    return <Card className="chart-wrapper" data-bs-theme="dark">
        <Bar height={300} options={options} data={data} />
    </Card>;
}

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Chart({
  labels,
  values,
  color = "#2FB686",
  height = "18rem",
  label,
}) {
  const data = {
    labels,
    datasets: [
      {
        label: label,
        data: values,
        backgroundColor: color,
        borderRadius: 10,
        barThickness: 40,
      },
    ],
  };

  const options = {
    indexAxis: "x",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 5 },
        grid: { color: "#eee" },
        font: {
          family: "BC Arabic",
          size: 14,
          weight: "700",
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          font: {
            family: "BC Arabic",
            size: 14,
            weight: "700",
          },
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (

    <div className="bg-white p-6 w-full rounded-lg" style={{ height }}>
      <Bar data={data} options={options} />
    </div>
  );
}

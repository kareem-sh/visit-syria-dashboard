import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { AlignRight } from "phosphor-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function LineChart({
  values,
  color = "#2FB686",
  labels = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ],
  height = "31.25rem",
  label = 'مقدار الارباح',
  tooltip_text = 'الأرباح'

}) {
  const data = {
    labels,
    datasets: [
      {
        label: label,
        data: values,
        borderColor: color,
        backgroundColor: color,
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointBackgroundColor: color,
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#eee" },
        ticks: { stepSize: 10 },
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
        padding: 0, // 👈 reduce padding between labels
        maxRotation: 0, // optional: force horizontal labels
        minRotation: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          font: {
            family: "BC Arabic",
            size: 14,
          },
          color: "#333",
          usePointStyle: true,
          pointStyle: "round",
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltip_text}: ${tooltipItem.raw}`,
        },
      },
    },
  };

  return (
    <div
      className="bg-white p-6 w-full rounded-lg shadow-sm"
      style={{ height: height }}
    >
      <Line data={data} options={options} />
    </div>
  );
}

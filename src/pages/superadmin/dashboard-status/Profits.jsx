import Chart from "@/components/common/Chart"; // your existing bar chart
import LineChart from "@/components/common/LineChart";

export default function Profits() {
  const profitLabels = [
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
  ];
  const profitValues = [100, 120, 130, 90, 75, 30, 80, 100];

  const companyLabels = [
    "شركة ألف",
    "شركة باء",
    "شركة جيم",
    "شركة دال",
    "شركة واو",
    "شركة زين",
    "شركة سين",
    "شركة عين",
    "شركة كاف",
    "شركة لام",
  ];
  const companyProfits = [10, 20, 35, 25, 40, 32, 15, 22, 18, 55];

  return (
    <div className="p-2 flex flex-col gap-8">
      <div>
        <h2 className="text-right text-h1-bold-24 mb-4">الأرباح</h2>
        <LineChart labels={profitLabels} values={profitValues} />
      </div>

      <div>
        <h2 className="text-right text-h1-bold-24 mb-4">أفضل الشركات</h2>
        <Chart
          labels={companyLabels}
          values={companyProfits}
          color="#2FB686"
          height="31.25rem"
          label="الأرباح"
        />
      </div>
    </div>
  );
}

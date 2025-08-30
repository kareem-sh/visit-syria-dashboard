import { useQuery } from '@tanstack/react-query';
import Chart from "@/components/common/Chart"; // your existing bar chart
import LineChart from "@/components/common/LineChart";
import { earningThisYearSA, topCompanies } from "@/services/statistics/statistics.js";
import { PageSkeleton } from "@/components/common/PageSkeleton.jsx"; // Import the skeleton component

export default function Profits() {
  // Fetch earnings data for the year
  const { data: earningsData, isLoading: earningsLoading } = useQuery({
    queryKey: ['earningsThisYear'],
    queryFn: earningThisYearSA,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch top companies by earnings
  const { data: topCompaniesData, isLoading: topCompaniesLoading } = useQuery({
    queryKey: ['topCompaniesByEarnings'],
    queryFn: () => topCompanies('earning'),
    staleTime: 5 * 60 * 1000,
  });

  // Show skeleton while loading
  if (earningsLoading || topCompaniesLoading) {
    return <PageSkeleton rows={4} />;
  }

  // Prepare monthly earnings data
  const profitLabels = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];

  // Use actual data from API or fallback to empty array
  // Check if we have data and it's an array with 12 elements
  const hasEarningsData = earningsData?.data?.monthlyEarnings &&
      Array.isArray(earningsData.data.monthlyEarnings) &&
      earningsData.data.monthlyEarnings.length === 12;

  const profitValues = hasEarningsData ? earningsData.data.monthlyEarnings : Array(12).fill(0);

  // Prepare top companies data
  const hasCompaniesData = topCompaniesData?.data?.companies &&
      Array.isArray(topCompaniesData.data.companies);

  const companyLabels = hasCompaniesData
      ? topCompaniesData.data.companies.map(company => company.name_of_company)
      : [];

  const companyProfits = hasCompaniesData
      ? topCompaniesData.data.companies.map(company => company.earning) // Use 'earning' field instead of 'total_earnings'
      : [];

  // Log the data for debugging
  console.log('Earnings data:', earningsData);
  console.log('Top companies data:', topCompaniesData);
  console.log('Company labels:', companyLabels);
  console.log('Company profits:', companyProfits);

  return (
      <div className="p-2 flex flex-col gap-8">
        <div>
          <h2 className="text-right text-h1-bold-24 mb-4">الأرباح السنوية</h2>
          <LineChart
              labels={profitLabels}
              values={profitValues}
              loading={earningsLoading}
          />
        </div>

        <div>
          <h2 className="text-right text-h1-bold-24 mb-4">أفضل الشركات حسب الأرباح</h2>
          <Chart
              labels={companyLabels}
              values={companyProfits}
              color="#2FB686"
              height="31.25rem"
              label="الأرباح"
              loading={topCompaniesLoading}
          />
        </div>
      </div>
  );
}
import StatCard from "../components/dashboard/StatCard";
import RestaurantsOverview from "../components/restaurants/RestaurantsOverview";
import PerformanceAnalytics from "../components/dashboard/PerformanceAnalytics";
import CustomerFeedback from "../components/dashboard/CustomerFeedback";
import TopDishes from "../components/dashboard/TopDishes";
import { dashboardKpis } from "../data/dashboard";
import { Store, Star, DollarSign } from "lucide-react";

const DashboardPage = () => {
  return (
    <div className="flex h-full flex-col space-y-4">
      {/* KPI row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StatCard
          title="Total Restaurants"
          value={dashboardKpis.totalRestaurants}
          icon={<Store className="h-5 w-5" />}
        />
        <StatCard
          title="Overall Rating"
          value={`${dashboardKpis.overallRating.toFixed(1)} ★`}
          icon={<Star className="h-5 w-5" />}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${dashboardKpis.monthlyRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RestaurantsOverview />
        <PerformanceAnalytics />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <CustomerFeedback />
        <div className="lg:col-span-2">
          <TopDishes />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
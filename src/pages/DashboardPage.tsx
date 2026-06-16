import { useCallback, useEffect, useState } from "react";
import StatCard from "../components/dashboard/StatCard";
import RestaurantsOverview from "../components/restaurants/RestaurantsOverview";
import PerformanceAnalytics from "../components/dashboard/PerformanceAnalytics";
import { Store, DollarSign } from "lucide-react";
import { apiFetch, getApiErrorMessages } from "../api/apiFetch";
import type { Restaurant, SingleRestaurantApiResponse } from "../types/restaurants-types";
import type { PerformanceAnalyticsResponse } from "../types/monthly-report-types";

const formatRevenue = (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const DashboardPage = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true);
  const [performanceAnalytics, setPerformanceAnalytics] = useState<PerformanceAnalyticsResponse | null>(null);
  const [isLoadingPerformanceAnalytics, setIsLoadingPerformanceAnalytics] = useState(true);
  const [performanceAnalyticsError, setPerformanceAnalyticsError] = useState<string | null>(null);

  const fetchRestaurants = useCallback(async () => {
    setIsLoadingRestaurants(true);

    try {
      const data = await apiFetch("api/restaurants", {
        method: "GET",
        showToast: false,
      });

      const restaurants = (data?.restaurants ?? []).map((r: SingleRestaurantApiResponse): Restaurant => ({
        id: r.id,
        name: r.name,
        description: r.description,
        status: r.status,
        cuisine: r.cuisine,
        location: r.location,
        imgUrl: r.imgUrl,
        ownerId: r.ownerId,
      }));

      setRestaurants(restaurants);
    } catch {
      setRestaurants([]);
    } finally {
      setIsLoadingRestaurants(false);
    }
  }, []);

  const fetchPerformanceAnalytics = useCallback(async () => {
    setIsLoadingPerformanceAnalytics(true);
    setPerformanceAnalyticsError(null);

    try {
      const data: PerformanceAnalyticsResponse = await apiFetch("api/dashboard/performance-analytics?months=6", {
        method: "GET",
        showToast: false,
      });

      setPerformanceAnalytics(data);
    } catch (error) {
      setPerformanceAnalytics(null);
      setPerformanceAnalyticsError(getApiErrorMessages(error, "Performance analytics could not be loaded.")[0]);
    } finally {
      setIsLoadingPerformanceAnalytics(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchRestaurants();
      void fetchPerformanceAnalytics();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchPerformanceAnalytics, fetchRestaurants]);

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StatCard
          title="Total Restaurants"
          value={restaurants.length}
          icon={<Store className="h-5 w-5" />}
        />
        <StatCard
          title="Average Monthly Revenue"
          value={
            isLoadingPerformanceAnalytics
              ? "Loading..."
              : performanceAnalytics
                ? formatRevenue(performanceAnalytics.averageMonthlyRevenue)
                : "N/A"
          }
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RestaurantsOverview restaurants={restaurants} isLoading={isLoadingRestaurants} />
        <PerformanceAnalytics
          months={performanceAnalytics?.months ?? []}
          isLoading={isLoadingPerformanceAnalytics}
          loadError={performanceAnalyticsError}
        />
      </div>

    </div>
  );
}

export default DashboardPage;

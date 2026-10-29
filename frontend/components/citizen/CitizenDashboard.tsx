"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Refresh } from "@mui/icons-material";
import { api } from "@/constant/api";

import type { DashboardData } from "./types";
import { SERVICES, createSummaryCards } from "./constants";

import DashboardLoading from "./DashboardLoading";
import DashboardError from "./DashboardError";
import WelcomeBanner from "./WelcomeBanner";
import SummaryCards from "./SummaryCards";
import ServiceGrid from "./ServiceGrid";
import RecentApplications from "./RecentApplications";
import ProfileCard from "./ProfileCard";
import PanchayatCard from "./PanchayatCard";
import AssistanceCard from "./AssistanceCard";

export default function CitizenDashboard() {
  const router = useRouter();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await api.get<DashboardData>("/citizen/");
      const data = response.data;

      if (!data.status) {
        throw new Error(data.message || "Failed to load dashboard.");
      }

      setDashboard(data);
    } catch (err: unknown) {
      let message = "Unable to load your dashboard.";

      if (typeof err === "object" && err !== null && "response" in err) {
        const response = (
          err as {
            response?: {
              data?: {
                message?: string;
              };
            };
          }
        ).response;

        message = response?.data?.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);

      if (isRefresh) {
        toast.error(message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchDashboard();
  }, [fetchDashboard]);

  const summaryCards = useMemo(
    () => createSummaryCards(dashboard?.summary),
    [dashboard?.summary],
  );

  const handleApply = useCallback(
    (serviceType: string) => {
      router.push(
        `/citizen/applications/new?service=${encodeURIComponent(serviceType)}`,
      );
    },
    [router],
  );

  const handleViewApplication = useCallback(
    (applicationId: string) => {
      router.push(`/citizen/applications/${applicationId}`);
    },
    [router],
  );

  const handleViewAllApplications = useCallback(() => {
    router.push("/citizen/applications");
  }, [router]);

  if (loading) {
    return <DashboardLoading />;
  }

  if (error && !dashboard) {
    return (
      <DashboardError error={error} onRetry={() => void fetchDashboard()} />
    );
  }

  if (!dashboard) return null;

  const citizenName = dashboard.citizen?.name || "Citizen";
  const summary = dashboard.summary;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        <WelcomeBanner
          citizenName={citizenName}
          panchayat={dashboard.panchayat}
          refreshing={refreshing}
          onApply={handleApply}
          onRefresh={() => void fetchDashboard(true)}
        />

        {error && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <span>{error} Showing the last successfully loaded data.</span>

            <button
              type="button"
              disabled={refreshing}
              onClick={() => void fetchDashboard(true)}
              className="inline-flex shrink-0 items-center gap-1 font-semibold underline disabled:opacity-60"
            >
              <Refresh
                fontSize="small"
                className={refreshing ? "animate-spin" : ""}
              />
              Retry
            </button>
          </div>
        )}

        <SummaryCards
          cards={summaryCards}
          rejected={summary?.rejected ?? 0}
          moreInformationRequired={summary?.moreInformationRequired ?? 0}
        />

        <ServiceGrid services={SERVICES} onApply={handleApply} />

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <RecentApplications
            applications={dashboard.recentApplications ?? []}
            onView={handleViewApplication}
            onViewAll={handleViewAllApplications}
            onApply={() => handleApply("Other")}
          />

          <div className="space-y-6">
            <ProfileCard citizen={dashboard.citizen} />

            <PanchayatCard panchayat={dashboard.panchayat} />

            <AssistanceCard panchayat={dashboard.panchayat} />
          </div>
        </section>
      </div>
    </main>
  );
}

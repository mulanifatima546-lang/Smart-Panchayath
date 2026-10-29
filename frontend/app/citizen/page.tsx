"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { api } from "@/constant/api";

import type { DashboardData } from "@/components/citizen/types";
import { SERVICES, createSummaryCards } from "@/components/citizen/constants";

import DashboardLoading from "@/components/citizen/DashboardLoading";
import DashboardError from "@/components/citizen/DashboardError";
import WelcomeBanner from "@/components/citizen/WelcomeBanner";
import SummaryCards from "@/components/citizen/SummaryCards";
import ServiceGrid from "@/components/citizen/ServiceGrid";
import RecentApplications from "@/components/citizen/RecentApplications";
import ProfileCard from "@/components/citizen/ProfileCard";
import PanchayatCard from "@/components/citizen/PanchayatCard";
import AssistanceCard from "@/components/citizen/AssistanceCard";
import { ArrowRight, Campaign } from "@mui/icons-material";

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

  if (!dashboard) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        <WelcomeBanner
          citizenName={dashboard.citizen?.name || "Citizen"}
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
              onClick={() => void fetchDashboard(true)}
              className="shrink-0 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}
        <SummaryCards
          cards={summaryCards}
          rejected={dashboard.summary?.rejected ?? 0}
          moreInformationRequired={
            dashboard.summary?.moreInformationRequired ?? 0
          }
        />

        <ServiceGrid services={SERVICES} onApply={handleApply} />

        <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Campaign fontSize="large" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Panchayat Notices
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  View announcements, public notices, and important updates.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/citizen/notices")}
              className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              View Notices
              <ArrowRight fontSize="small" />
            </button>
          </div>
        </section>

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

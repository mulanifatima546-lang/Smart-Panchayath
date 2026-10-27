"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  AccountCircle,
  Assignment,
  CheckCircle,
  ChevronRight,
  Description,
  ErrorOutlined,
  Home,
  LocationOn,
  Notifications,
  PendingActions,
  Refresh,
  Search,
  SupportAgent,
  WaterDrop,
  Person,
  TrendingUp,
  VerifiedUser,
} from "@mui/icons-material";
import { api } from "@/constant/api";

type Citizen = {
  _id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  isVerified: boolean;
  address?: {
    houseNumber?: string;
    street?: string;
    city?: string;
    state?: string;
    pinCode?: string;
  };
};

type Panchayat = {
  _id: string;
  name: string;
  state: string;
  district: string;
  taluka: string;
  village: string;
  address: string;
  contactNumber: string;
  email: string;
  sarpanch: string;
};

type ApplicationPanchayat = {
  _id: string;
  name: string;
  village?: string;
  district?: string;
  state?: string;
};

type CitizenApplication = {
  _id: string;
  applicationNumber?: string;
  serviceType: string;
  status:
    | "Pending"
    | "Under Review"
    | "More Information Required"
    | "Approved"
    | "Rejected";
  createdAt: string;
  updatedAt?: string;
  submitedAt?: string;
  remarks?: string;
  panchayat?: ApplicationPanchayat | string | null;
};

type DashboardData = {
  status: boolean;
  message?: string;
  citizen: Citizen;
  panchayat: Panchayat | null;
  summary: {
    total: number;
    pending: number;
    underReview: number;
    approved: number;
    rejected: number;
    moreInformationRequired: number;
  };
  recentApplications: CitizenApplication[];
  notifications: unknown[];
  announcements: unknown[];
};

const services = [
  {
    title: "Birth Certificate",
    description: "Apply for a birth certificate.",
    icon: <Description />,
    color: "bg-blue-50 text-blue-600",
    serviceType: "Birth Certificate",
  },
  {
    title: "Death Certificate",
    description: "Apply for a death certificate.",
    icon: <Assignment />,
    color: "bg-purple-50 text-purple-600",
    serviceType: "Death Certificate",
  },
  {
    title: "Residence Certificate",
    description: "Request proof of residence.",
    icon: <Home />,
    color: "bg-emerald-50 text-emerald-600",
    serviceType: "Residence Certificate",
  },
  {
    title: "Income Certificate",
    description: "Apply for an income certificate.",
    icon: <TrendingUp />,
    color: "bg-orange-50 text-orange-600",
    serviceType: "Income Certificate",
  },
  {
    title: "Caste Certificate",
    description: "Request a caste certificate.",
    icon: <VerifiedUser />,
    color: "bg-pink-50 text-pink-600",
    serviceType: "Caste Certificate",
  },
  {
    title: "Water Connection",
    description: "Request a new water connection.",
    icon: <WaterDrop />,
    color: "bg-cyan-50 text-cyan-600",
    serviceType: "Water Connection",
  },
  {
    title: "Register Complaint",
    description: "Report a local civic issue.",
    icon: <SupportAgent />,
    color: "bg-amber-50 text-amber-700",
    serviceType: "Complaint",
  },
];

const formatDate = (date?: string) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusStyle = (status: CitizenApplication["status"]) => {
  switch (status) {
    case "Approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Rejected":
      return "bg-red-50 text-red-700 border-red-200";
    case "Under Review":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "More Information Required":
      return "bg-orange-50 text-orange-700 border-orange-200";
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
};

export default function CitizenDashboard() {
  const router = useRouter();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredApplications = (dashboard?.recentApplications ?? []).filter(
    (application) => {
      const search = searchTerm.trim().toLowerCase();

      if (!search) return true;

      return (
        application.applicationNumber?.toLowerCase().includes(search) ||
        application.serviceType.toLowerCase().includes(search) ||
        application.status.toLowerCase().includes(search)
      );
    },
  );

  const summaryCards = [
    {
      title: "Total Applications",
      value: dashboard?.summary.total ?? 0,
      icon: <Assignment />,
      color: "bg-blue-50 text-blue-600",
      detail: "All submitted applications",
    },
    {
      title: "Pending",
      value: dashboard?.summary.pending ?? 0,
      icon: <PendingActions />,
      color: "bg-amber-50 text-amber-600",
      detail: "Awaiting review",
    },
    {
      title: "Under Review",
      value: dashboard?.summary.underReview ?? 0,
      icon: <Search />,
      color: "bg-purple-50 text-purple-600",
      detail: "Being processed",
    },
    {
      title: "Approved",
      value: dashboard?.summary.approved ?? 0,
      icon: <CheckCircle />,
      color: "bg-emerald-50 text-emerald-600",
      detail: "Successfully approved",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-5 md:p-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-36 rounded-2xl bg-slate-200" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <div key={card.title} className="h-32 rounded-2xl bg-slate-200" />
            ))}
          </div>
          <div className="h-80 rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <ErrorOutlined
            className="mx-auto mb-3 text-red-500"
            fontSize="large"
          />
          <h1 className="text-xl font-bold text-slate-900">
            Dashboard unavailable
          </h1>
          <p className="mt-2 text-sm text-slate-600">{error}</p>
          <button
            type="button"
            onClick={() => void fetchDashboard()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            <Refresh fontSize="small" />
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (!dashboard) return null;

  const citizenName = dashboard.citizen.name || "Citizen";
  const firstName = citizenName.trim().split(/\s+/)[0] || "Citizen";

  const panchayatLocation = [
    dashboard.panchayat?.village,
    dashboard.panchayat?.district,
    dashboard.panchayat?.state,
  ]
    .filter(Boolean)
    .join(", ");

  const handleApply = (serviceType: string) => {
    router.push(
      `/citizen/applications/new?service=${encodeURIComponent(serviceType)}`,
    );
  };

  const handleViewApplication = (applicationId: string) => {
    router.push(`/citizen/applications/${applicationId}`);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 p-6 text-white shadow-sm sm:p-8">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-28 right-40 h-64 w-64 rounded-full bg-white/5" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-emerald-100">
                Citizen Portal
              </p>
              <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                Welcome back, {firstName}!
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50 sm:text-base">
                Access Gram Panchayat services, submit applications, and track
                their progress from one place.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-2">
                  <Person fontSize="small" />
                  {citizenName}
                </span>

                {dashboard.panchayat && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-2">
                    <Home fontSize="small" />
                    {dashboard.panchayat.name}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleApply("Other")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
              >
                <Assignment fontSize="small" />
                New Application
              </button>

              <button
                type="button"
                disabled={refreshing}
                onClick={() => void fetchDashboard(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-60"
              >
                <Refresh
                  fontSize="small"
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>
        </section>

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

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Application Overview
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                A summary of your submitted service requests.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>
                    <p className="mt-3 text-3xl font-bold text-slate-900">
                      {card.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
                  >
                    {card.icon}
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-500">{card.detail}</p>
              </div>
            ))}
          </div>

          {(dashboard.summary.rejected > 0 ||
            dashboard.summary.moreInformationRequired > 0) && (
            <div className="mt-4 flex flex-wrap gap-3">
              {dashboard.summary.rejected > 0 && (
                <span className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  Rejected: {dashboard.summary.rejected}
                </span>
              )}
              {dashboard.summary.moreInformationRequired > 0 && (
                <span className="rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700">
                  More information required:{" "}
                  {dashboard.summary.moreInformationRequired}
                </span>
              )}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Available Services
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Select a service to start a new application.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => (
              <button
                key={service.serviceType}
                type="button"
                onClick={() => handleApply(service.serviceType)}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
              >
                <div className="flex w-full items-start justify-between gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${service.color}`}
                  >
                    {service.icon}
                  </div>
                  <ChevronRight className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-700" />
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-5 text-slate-500">
                  {service.description}
                </p>
                <span className="mt-4 text-sm font-semibold text-emerald-700">
                  Apply now
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-bold text-slate-900">
                  Recent Applications
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your five most recent applications.
                </p>
              </div>

              <div className="relative w-full sm:max-w-xs">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  fontSize="small"
                />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search applications..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {filteredApplications.length === 0 ? (
              <div className="px-5 py-14 text-center">
                <Assignment
                  className="mx-auto text-slate-300"
                  fontSize="large"
                />
                <h3 className="mt-3 font-semibold text-slate-800">
                  No applications found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {searchTerm
                    ? "Try another search term."
                    : "Your submitted applications will appear here."}
                </p>
                {!searchTerm && (
                  <button
                    type="button"
                    onClick={() => handleApply("Other")}
                    className="mt-4 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    Start an application
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredApplications.map((application) => (
                  <button
                    type="button"
                    key={application._id}
                    onClick={() => handleViewApplication(application._id)}
                    className="flex w-full flex-col gap-3 p-5 text-left transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        <Description fontSize="small" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-slate-900">
                          {application.serviceType}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          Application No:{" "}
                          {application.applicationNumber || application._id}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Submitted:{" "}
                          {formatDate(
                            application.submitedAt || application.createdAt,
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(application.status)}`}
                      >
                        {application.status}
                      </span>
                      <span className="text-xs font-medium text-emerald-700">
                        View details <ChevronRight fontSize="inherit" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="border-t border-slate-100 p-4">
              <button
                type="button"
                onClick={() => router.push("/citizen/applications")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
              >
                View all applications
                <ChevronRight fontSize="small" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <AccountCircle />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">My Profile</h2>
                  <p className="text-xs text-slate-500">
                    Your account information
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs text-slate-500">Full name</p>
                  <p className="mt-1 break-words text-sm font-medium text-slate-800">
                    {dashboard.citizen.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email address</p>
                  <p className="mt-1 break-all text-sm font-medium text-slate-800">
                    {dashboard.citizen.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Account verification</p>
                  <p
                    className={`mt-1 inline-flex items-center gap-1.5 text-sm font-medium ${
                      dashboard.citizen.isVerified
                        ? "text-emerald-700"
                        : "text-amber-700"
                    }`}
                  >
                    {dashboard.citizen.isVerified ? (
                      <CheckCircle fontSize="small" />
                    ) : (
                      <ErrorOutlined fontSize="small" />
                    )}
                    {dashboard.citizen.isVerified ? "Verified" : "Not verified"}
                  </p>
                </div>

                {dashboard.citizen.address && (
                  <div>
                    <p className="text-xs text-slate-500">Address</p>
                    <p className="mt-1 text-sm text-slate-800">
                      {[
                        dashboard.citizen.address.houseNumber,
                        dashboard.citizen.address.street,
                        dashboard.citizen.address.city,
                        dashboard.citizen.address.state,
                        dashboard.citizen.address.pinCode,
                      ]
                        .filter(Boolean)
                        .join(", ") || "Address not provided"}
                    </p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => router.push("/citizen/profile")}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Edit profile
                <ChevronRight fontSize="small" />
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <LocationOn />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">Gram Panchayat</h2>
                  <p className="text-xs text-slate-500">
                    Your local administration
                  </p>
                </div>
              </div>

              {dashboard.panchayat ? (
                <div className="mt-5 space-y-3">
                  <h3 className="font-semibold text-slate-900">
                    {dashboard.panchayat.name}
                  </h3>

                  <p className="flex items-start gap-2 text-sm text-slate-600">
                    <LocationOn
                      fontSize="small"
                      className="mt-0.5 shrink-0 text-slate-400"
                    />
                    <span>
                      {panchayatLocation || dashboard.panchayat.address}
                    </span>
                  </p>

                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-xs text-slate-500">Sarpanch</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {dashboard.panchayat.sarpanch}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Contact number</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {dashboard.panchayat.contactNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="mt-1 break-all text-sm font-medium text-slate-800">
                      {dashboard.panchayat.email}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-5 text-sm leading-6 text-slate-500">
                  No Gram Panchayat is linked to your account yet. Please
                  contact your administrator to link your account.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex items-center gap-3">
                <Notifications className="text-emerald-700" />
                <h2 className="font-bold text-emerald-950">Need assistance?</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-emerald-900/80">
                For application updates or help with a service request, contact
                your Gram Panchayat office.
              </p>
              {dashboard.panchayat?.contactNumber && (
                <a
                  href={`tel:${dashboard.panchayat.contactNumber}`}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  <SupportAgent fontSize="small" />
                  Contact Panchayat
                </a>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

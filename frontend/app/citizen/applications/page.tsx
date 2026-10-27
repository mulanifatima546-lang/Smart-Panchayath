"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  ArrowForward,
  Autorenew,
  CalendarMonth,
  CheckCircleOutlineOutlined,
  Close,
  DescriptionOutlined,
  ErrorOutlineOutlined,
  FilterAltOutlined,
  HourglassEmpty,
  InfoOutlined,
  LocationOnOutlined,
  Refresh,
  Search,
  VisibilityOutlined,
} from "@mui/icons-material";
import { api } from "@/constant/api";

type ApplicationStatus =
  | "Pending"
  | "Under Review"
  | "More Information Required"
  | "Approved"
  | "Rejected";

type Application = {
  _id: string;
  applicationNumber?: string;
  serviceType: string;
  status: ApplicationStatus | string;
  applicantDetails?: {
    applicantName?: string;
    name?: string;
    address?: string;
    mobile?: string;
    email?: string;
    [key: string]: unknown;
  };
  panchayat?:
    | {
        _id?: string;
        name?: string;
        village?: string;
        district?: string;
      }
    | string;
  documents?: {
    name: string;
    url: string;
    publicId?: string;
  }[];
  remarks?: string;
  submitedAt?: string;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ApplicationsResponse = {
  status?: boolean;
  message?: string;
  applications?: Application[];
  data?:
    | Application[]
    | {
        applications?: Application[];
      };
  results?: Application[];
};

const statusOptions = [
  "All",
  "Pending",
  "Under Review",
  "More Information Required",
  "Approved",
  "Rejected",
] as const;

type StatusFilter = (typeof statusOptions)[number];

function getStatusStyle(status: string) {
  switch (status) {
    case "Approved":
      return {
        className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
        icon: <CheckCircleOutlineOutlined fontSize="small" />,
      };

    case "Rejected":
      return {
        className: "bg-red-50 text-red-700 ring-red-600/20",
        icon: <Close fontSize="small" />,
      };

    case "Under Review":
      return {
        className: "bg-blue-50 text-blue-700 ring-blue-600/20",
        icon: <Autorenew fontSize="small" />,
      };

    case "More Information Required":
      return {
        className: "bg-orange-50 text-orange-700 ring-orange-600/20",
        icon: <InfoOutlined fontSize="small" />,
      };

    case "Pending":
    default:
      return {
        className: "bg-amber-50 text-amber-700 ring-amber-600/20",
        icon: <HourglassEmpty fontSize="small" />,
      };
  }
}

function formatDate(date?: string) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getApplicationDate(application: Application) {
  return (
    application.submitedAt || application.submittedAt || application.createdAt
  );
}

function getPanchayatName(application: Application) {
  if (application.panchayat && typeof application.panchayat === "object") {
    return application.panchayat.name || "Gram Panchayat";
  }

  return "Gram Panchayat";
}

function getApplicantName(application: Application) {
  return (
    application.applicantDetails?.applicantName ||
    application.applicantDetails?.name ||
    "Applicant"
  );
}

function extractApplications(response: ApplicationsResponse): Application[] {
  if (Array.isArray(response.applications)) {
    return response.applications;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (
    response.data &&
    !Array.isArray(response.data) &&
    Array.isArray(response.data.applications)
  ) {
    return response.data.applications;
  }

  if (Array.isArray(response.results)) {
    return response.results;
  }

  return [];
}

export default function Applications() {
  const router = useRouter();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const fetchApplications = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      // Real API endpoint protected by your backend's protect middleware.
      const response = await api.get<ApplicationsResponse>("/application/my");

      if (response.data?.status === false) {
        throw new Error(
          response.data.message || "Unable to load applications.",
        );
      }

      setApplications(extractApplications(response.data));
    } catch (err: unknown) {
      console.error("Failed to fetch applications:", err);

      const apiError = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      };

      const message =
        apiError.response?.data?.message ||
        apiError.message ||
        "Unable to load applications. Please try again.";

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
    void fetchApplications();
  }, [fetchApplications]);

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesStatus =
        statusFilter === "All" || application.status === statusFilter;

      const matchesSearch =
        !query ||
        [
          application.applicationNumber,
          application.serviceType,
          application.status,
          getApplicantName(application),
          getPanchayatName(application),
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query),
        );

      return matchesStatus && matchesSearch;
    });
  }, [applications, search, statusFilter]);

  const counts = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((app) => app.status === "Pending").length,
      review: applications.filter((app) => app.status === "Under Review")
        .length,
      approved: applications.filter((app) => app.status === "Approved").length,
      rejected: applications.filter((app) => app.status === "Rejected").length,
      moreInfo: applications.filter(
        (app) => app.status === "More Information Required",
      ).length,
    };
  }, [applications]);

  function openApplication(application: Application) {
    router.push(`/citizen/applications/${application._id}`);
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <DescriptionOutlined fontSize="small" />
              Citizen Services
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My Applications
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              View your submitted applications and track their status.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void fetchApplications(true)}
              disabled={loading || refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
            >
              <Refresh
                fontSize="small"
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => router.push("/citizen/applications/new")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
            >
              <DescriptionOutlined fontSize="small" />
              New Application
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <section className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {[
            {
              label: "Total",
              value: counts.total,
              icon: <DescriptionOutlined />,
              color: "bg-slate-100 text-slate-700",
            },
            {
              label: "Pending",
              value: counts.pending,
              icon: <HourglassEmpty />,
              color: "bg-amber-100 text-amber-700",
            },
            {
              label: "Under Review",
              value: counts.review,
              icon: <Autorenew />,
              color: "bg-blue-100 text-blue-700",
            },
            {
              label: "Approved",
              value: counts.approved,
              icon: <CheckCircleOutlineOutlined />,
              color: "bg-emerald-100 text-emerald-700",
            },
            {
              label: "Rejected",
              value: counts.rejected,
              icon: <Close />,
              color: "bg-red-100 text-red-700",
            },
            {
              label: "More Info",
              value: counts.moreInfo,
              icon: <InfoOutlined />,
              color: "bg-orange-100 text-orange-700",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500 sm:text-sm">
                  {item.label}
                </span>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.color}`}
                >
                  {item.icon}
                </span>
              </div>

              <p className="mt-4 text-2xl font-bold text-slate-900">
                {loading ? "—" : item.value}
              </p>
            </div>
          ))}
        </section>

        {/* Search and filters */}
        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by application number, service or Panchayat..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            <div className="flex items-center gap-3">
              <FilterAltOutlined className="shrink-0 text-slate-500" />

              <select
                aria-label="Filter applications by status"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 sm:min-w-52"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === "All" ? "All statuses" : status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <p>
              Showing{" "}
              <span className="font-bold text-slate-700">
                {loading ? "—" : filteredApplications.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-700">
                {loading ? "—" : applications.length}
              </span>{" "}
              applications
            </p>

            {(search || statusFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                className="font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Clear filters
              </button>
            )}
          </div>
        </section>

        {/* Applications list */}
        <section className="mt-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div className="h-5 w-1/3 rounded bg-slate-200" />
                  <div className="mt-4 h-4 w-2/3 rounded bg-slate-100" />
                  <div className="mt-6 h-10 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-white px-5 py-12 text-center shadow-sm">
              <ErrorOutlineOutlined
                sx={{ fontSize: 44 }}
                className="text-red-500"
              />
              <h2 className="mt-3 text-lg font-bold text-slate-900">
                Unable to load applications
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                {error}
              </p>
              <button
                type="button"
                onClick={() => void fetchApplications()}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                <Refresh fontSize="small" />
                Try again
              </button>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <DescriptionOutlined sx={{ fontSize: 32 }} />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                {applications.length === 0
                  ? "No applications yet"
                  : "No matching applications"}
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {applications.length === 0
                  ? "Your submitted applications will appear here. Start by applying for a Gram Panchayat service."
                  : "Try another search term or change the selected status filter."}
              </p>

              {applications.length === 0 ? (
                <button
                  type="button"
                  onClick={() => router.push("/citizen/applications/new")}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  Apply for a Service
                  <ArrowForward fontSize="small" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                  className="mt-5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => {
                const status = getStatusStyle(application.status);
                const applicationDate = getApplicationDate(application);

                return (
                  <article
                    key={application._id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                  >
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                            <DescriptionOutlined />
                          </div>

                          <div className="min-w-0">
                            <p className="break-words text-base font-bold text-slate-900 sm:text-lg">
                              {application.serviceType}
                            </p>

                            <p className="mt-1 break-all text-xs font-medium text-slate-500 sm:text-sm">
                              Application No:{" "}
                              <span className="text-slate-700">
                                {application.applicationNumber ||
                                  application._id}
                              </span>
                            </p>
                          </div>
                        </div>

                        <span
                          className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${status.className}`}
                        >
                          {status.icon}
                          {application.status}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
                        <div>
                          <p className="text-xs font-medium text-slate-500">
                            Applicant
                          </p>
                          <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                            {getApplicantName(application)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-slate-500">
                            Gram Panchayat
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                            <LocationOnOutlined
                              fontSize="small"
                              className="shrink-0 text-slate-400"
                            />
                            {getPanchayatName(application)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-slate-500">
                            Submission Date
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                            <CalendarMonth
                              fontSize="small"
                              className="text-slate-400"
                            />
                            {formatDate(applicationDate)}
                          </p>
                        </div>
                      </div>

                      {application.remarks && (
                        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3">
                          <p className="text-xs font-bold text-blue-800">
                            Remarks from the office
                          </p>
                          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-blue-900">
                            {application.remarks}
                          </p>
                        </div>
                      )}

                      <div className="mt-5 flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-slate-500">
                          Last updated:{" "}
                          {formatDate(application.updatedAt || applicationDate)}
                        </p>

                        <button
                          type="button"
                          onClick={() => openApplication(application)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                        >
                          <VisibilityOutlined fontSize="small" />
                          View Details
                          <ArrowForward fontSize="small" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

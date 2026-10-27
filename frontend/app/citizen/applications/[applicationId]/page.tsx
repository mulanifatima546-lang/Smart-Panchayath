"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowBack,
  AssignmentOutlined,
  CheckCircleOutlineOutlined,
  ScheduleOutlined,
  RateReviewOutlined,
  CancelOutlined,
  RefreshOutlined,
  OpenInNewOutlined,
  DescriptionOutlined,
  PersonOutlineOutlined,
  LocationOnOutlined,
  CalendarMonthOutlined,
  InfoOutlined,
  ErrorOutlineOutlined,
} from "@mui/icons-material";

import { api } from "@/constant/api";

type ApplicationStatus =
  | "Pending"
  | "Under Review"
  | "More Information Required"
  | "Approved"
  | "Rejected";

interface ApplicationDocument {
  name: string;
  url: string;
  publicId?: string;
}

interface Application {
  _id?: string;
  id?: string;
  applicationNumber?: string;
  serviceType?: string;
  status?: ApplicationStatus;
  applicantDetails?: Record<string, unknown>;
  documents?: ApplicationDocument[];
  remarks?: string;
  submitedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  reviewedAt?: string;
  panchayat?: {
    _id?: string;
    name?: string;
    village?: string;
    taluka?: string;
    district?: string;
    state?: string;
    address?: string;
    contactNumber?: string;
    email?: string;
    sarpanch?: string;
  };
  citizen?: {
    _id?: string;
    name?: string;
    email?: string;
    username?: string;
  };
}

const statusConfig: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: React.ReactNode;
  }
> = {
  Pending: {
    label: "Pending",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: <ScheduleOutlined fontSize="small" />,
  },
  "Under Review": {
    label: "Under Review",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: <RateReviewOutlined fontSize="small" />,
  },
  "More Information Required": {
    label: "More Information Required",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    icon: <InfoOutlined fontSize="small" />,
  },
  Approved: {
    label: "Approved",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    icon: <CheckCircleOutlineOutlined fontSize="small" />,
  },
  Rejected: {
    label: "Rejected",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: <CancelOutlined fontSize="small" />,
  },
};

function formatDate(value?: string) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(value?: string) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatLabel(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "Not provided";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
          {icon}
        </div>

        <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
          {title}
        </h2>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function DetailField({ label, value }: { label: string; value: unknown }) {
  const displayValue = formatValue(value);

  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="break-words text-sm font-medium text-gray-900">
        {displayValue}
      </p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl animate-pulse space-y-6">
        <div className="h-6 w-36 rounded bg-gray-200" />
        <div className="h-44 rounded-2xl bg-gray-200" />
        <div className="h-52 rounded-2xl bg-gray-200" />
        <div className="h-52 rounded-2xl bg-gray-200" />
      </div>
    </main>
  );
}

function ViewApplicationContent() {
  const params = useParams<{ applicationId: string }>();
  const router = useRouter();

  const applicationId = params?.applicationId;

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchApplication = useCallback(
    async (showRefresh = false) => {
      if (!applicationId) {
        setError("Application ID is missing.");
        setLoading(false);
        return;
      }

      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        // If your Express router is mounted at /api/applications,
        // this should be /applications/:applicationId.
        const response = await api.get(
          `/application/${encodeURIComponent(applicationId)}`,
        );

        const payload = response.data;

        // Supports common API response formats.
        const result: Application | null =
          payload?.application ??
          payload?.data?.application ??
          payload?.data ??
          payload;

        if (!result || typeof result !== "object" || Array.isArray(result)) {
          throw new Error("Invalid application data received from the server.");
        }

        setApplication(result);
      } catch (err: unknown) {
        console.error("Failed to fetch application:", err);

        const errorMessage =
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          typeof err.response === "object" &&
          err.response !== null &&
          "data" in err.response &&
          typeof err.response.data === "object" &&
          err.response.data !== null &&
          "message" in err.response.data
            ? String(err.response.data.message)
            : err instanceof Error
              ? err.message
              : "Unable to load application details.";

        setError(errorMessage);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [applicationId],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchApplication();
  }, [fetchApplication]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !application) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <ErrorOutlineOutlined fontSize="large" />
          </div>

          <h1 className="text-xl font-bold text-gray-900">
            Unable to load application
          </h1>

          <p className="mt-2 break-words text-sm text-gray-600">
            {error || "The requested application could not be found."}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => void fetchApplication(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshOutlined fontSize="small" />
              {refreshing ? "Retrying..." : "Try again"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <ArrowBack fontSize="small" />
              Go back
            </button>
          </div>
        </div>
      </main>
    );
  }

  const status = application.status ?? "Pending";
  const currentStatus = statusConfig[status] ?? statusConfig.Pending;

  const submittedDate = application.submitedAt ?? application.createdAt;

  const applicantDetails = application.applicantDetails ?? {};

  const reservedKeys = new Set(["password", "__v", "_id", "id"]);

  const applicantEntries = Object.entries(applicantDetails).filter(
    ([key]) => !reservedKeys.has(key),
  );

  const panchayat = application.panchayat;
  const documents = application.documents ?? [];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-green-700"
        >
          <ArrowBack fontSize="small" />
          Back
        </button>

        {/* Application heading */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-green-800 to-green-600 px-5 py-7 text-white sm:px-8 sm:py-9">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-sm text-green-100">
                  <AssignmentOutlined fontSize="small" />
                  Citizen Services
                </div>

                <h1 className="text-2xl font-bold sm:text-3xl">
                  Application Details
                </h1>

                <p className="mt-2 break-all text-sm text-green-100">
                  Application No:{" "}
                  <span className="font-semibold text-white">
                    {application.applicationNumber ||
                      application._id ||
                      applicationId}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => void fetchApplication(true)}
                disabled={refreshing}
                className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-60"
              >
                <RefreshOutlined
                  fontSize="small"
                  className={refreshing ? "animate-spin" : ""}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-3 sm:px-8 sm:py-6">
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                Service Type
              </p>
              <p className="font-semibold text-gray-900">
                {application.serviceType || "Not specified"}
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                Submitted On
              </p>
              <p className="font-semibold text-gray-900">
                {formatDate(submittedDate)}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                Current Status
              </p>

              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${currentStatus.bg} ${currentStatus.color} ${currentStatus.border}`}
              >
                {currentStatus.icon}
                {currentStatus.label}
              </span>
            </div>
          </div>
        </div>

        {/* Additional information needed */}
        {status === "More Information Required" && (
          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-orange-200 bg-orange-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <InfoOutlined className="mt-0.5 shrink-0 text-orange-700" />

              <div>
                <h2 className="font-semibold text-orange-900">
                  Additional information required
                </h2>

                <p className="mt-1 text-sm text-orange-800">
                  Your application requires additional information. Please
                  review the remarks below and follow the instructions provided
                  by the office.
                </p>
              </div>
            </div>

            <Link
              href="/citizen/applications"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-orange-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-800"
            >
              My Applications
            </Link>
          </div>
        )}

        <div className="space-y-6">
          {/* Applicant information */}
          <Section
            title="Applicant Information"
            icon={<PersonOutlineOutlined />}
          >
            {applicantEntries.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                {applicantEntries.map(([key, value]) => (
                  <DetailField
                    key={key}
                    label={formatLabel(key)}
                    value={value}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No applicant details were provided.
              </p>
            )}
          </Section>

          {/* Panchayat information */}
          <Section
            title="Gram Panchayat Information"
            icon={<LocationOnOutlined />}
          >
            {panchayat ? (
              <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                <DetailField label="Gram Panchayat" value={panchayat.name} />

                <DetailField label="Village" value={panchayat.village} />

                <DetailField label="Taluka" value={panchayat.taluka} />

                <DetailField label="District" value={panchayat.district} />

                <DetailField label="State" value={panchayat.state} />

                <DetailField label="Address" value={panchayat.address} />

                <DetailField
                  label="Contact Number"
                  value={panchayat.contactNumber}
                />

                <DetailField label="Email" value={panchayat.email} />

                <DetailField label="Sarpanch" value={panchayat.sarpanch} />
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Panchayat information is not available.
              </p>
            )}
          </Section>

          {/* Uploaded documents */}
          <Section
            title={`Uploaded Documents (${documents.length})`}
            icon={<DescriptionOutlined />}
          >
            {documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map((document, index) => (
                  <div
                    key={`${document.publicId ?? document.url}-${index}`}
                    className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                        <DescriptionOutlined />
                      </div>

                      <div className="min-w-0">
                        <p className="break-words text-sm font-semibold text-gray-900">
                          {document.name || `Document ${index + 1}`}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Uploaded document
                        </p>
                      </div>
                    </div>

                    {document.url ? (
                      <a
                        href={document.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-green-600 hover:text-green-700"
                      >
                        View Document
                        <OpenInNewOutlined fontSize="small" />
                      </a>
                    ) : (
                      <span className="text-sm text-gray-500">
                        Document link unavailable
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center">
                <DescriptionOutlined className="mb-2 text-gray-400" />

                <p className="text-sm text-gray-500">
                  No documents uploaded for this application.
                </p>
              </div>
            )}
          </Section>

          {/* Application remarks */}
          <Section title="Remarks & Review" icon={<RateReviewOutlined />}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <DetailField label="Application Status" value={status} />

              <DetailField
                label="Last Updated"
                value={formatDateTime(
                  application.reviewedAt ?? application.updatedAt,
                )}
              />
            </div>

            <div className="mt-5 border-t border-gray-100 pt-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                Remarks from Office
              </p>

              {application.remarks?.trim() ? (
                <div className="whitespace-pre-wrap break-words rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                  {application.remarks}
                </div>
              ) : (
                <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                  No remarks have been added yet.
                </p>
              )}
            </div>
          </Section>

          {/* Timeline */}
          <Section
            title="Application Timeline"
            icon={<CalendarMonthOutlined />}
          >
            <div className="relative space-y-6 pl-1">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <CheckCircleOutlineOutlined fontSize="small" />
                  </div>
                  <div className="min-h-8 w-px bg-gray-200" />
                </div>

                <div className="pb-5">
                  <p className="font-semibold text-gray-900">
                    Application Submitted
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {formatDateTime(submittedDate)}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Your application has been received by the system.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <AssignmentOutlined fontSize="small" />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    Current Status: {status}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Last updated:{" "}
                    {formatDateTime(
                      application.reviewedAt ?? application.updatedAt,
                    )}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {status === "Approved"
                      ? "Your application has been approved."
                      : status === "Rejected"
                        ? "Your application has been rejected. Please check the office remarks."
                        : status === "Under Review"
                          ? "Your application is currently being reviewed."
                          : status === "More Information Required"
                            ? "The office requires additional information for your application."
                            : "Your application is awaiting further processing."}
                  </p>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Bottom navigation */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <ArrowBack fontSize="small" />
            Go Back
          </button>

          <Link
            href="/citizen/applications"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            <AssignmentOutlined fontSize="small" />
            All My Applications
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ViewApplication() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ViewApplicationContent />
    </Suspense>
  );
}

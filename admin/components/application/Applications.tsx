import { isAxiosError } from "axios";
import {
  ApplicationItem,
  ApplicationStatus,
  RelatedPanchayat,
  RelatedUser,
} from "./applicationTypes";

export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      "Something went wrong while communicating with the server."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

export const normalizeStatus = (status: unknown): ApplicationStatus => {
  const normalized = String(status ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  switch (normalized) {
    case "pending":
      return "Pending";

    case "under review":
    case "in progress":
    case "inprogress":
      return "Under Review";

    case "more information required":
    case "more info required":
    case "information required":
      return "More Information Required";

    case "approved":
    case "completed":
      return "Approved";

    case "rejected":
      return "Rejected";

    default:
      return "Pending";
  }
};

export const getRelatedName = (
  value: RelatedUser | RelatedPanchayat | string | null | undefined,
): string => {
  if (!value) return "—";

  if (typeof value === "string") {
    return value;
  }

  if ("fullName" in value && value.fullName) {
    return value.fullName;
  }

  if ("name" in value && value.name) {
    return value.name;
  }

  if ("village" in value && value.village) {
    return value.village;
  }

  return "—";
};

export const getApplicantName = (application: ApplicationItem): string => {
  const details = application.applicantDetails;

  return (
    details?.fullName ||
    details?.applicantName ||
    details?.name ||
    getRelatedName(application.citizen) ||
    "Unknown applicant"
  );
};

export const getApplicantEmail = (application: ApplicationItem): string => {
  return (
    application.applicantDetails?.email ||
    (typeof application.citizen === "object" && application.citizen
      ? application.citizen.email || ""
      : "")
  );
};

export const getApplicantPhone = (application: ApplicationItem): string => {
  return (
    application.applicantDetails?.phone ||
    application.applicantDetails?.phoneNumber ||
    application.applicantDetails?.mobile ||
    (typeof application.citizen === "object" && application.citizen
      ? application.citizen.phone || ""
      : "")
  );
};

export const formatDate = (value?: string): string => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const extractApplications = (
  responseData: unknown,
): ApplicationItem[] => {
  type ResponseShape = {
    applications?: unknown;
    data?: ResponseShape;
  };

  const response = responseData as ResponseShape | null | undefined;

  const candidates = [
    response?.data?.applications,
    response?.applications,
    response?.data?.data?.applications,
    response?.data,
    response,
  ];

  const list = candidates.find(Array.isArray);

  if (!list) return [];

  return list.map((item: ApplicationItem) => ({
    ...item,
    status: normalizeStatus(item.status),
  }));
};

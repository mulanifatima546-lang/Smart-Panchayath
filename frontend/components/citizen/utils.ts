import type { CitizenApplication } from "./types";

export const formatDate = (date?: string): string => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const getStatusStyle = (
  status: CitizenApplication["status"],
): string => {
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

export const getApplicationSearchText = (
  application: CitizenApplication,
): string => {
  return [
    application.applicationNumber,
    application.serviceType,
    application.status,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
};

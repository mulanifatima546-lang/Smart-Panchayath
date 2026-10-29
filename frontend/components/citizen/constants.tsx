import {
  Assignment,
  CheckCircle,
  Description,
  Home,
  PendingActions,
  TrendingUp,
  VerifiedUser,
  WaterDrop,
  SupportAgent,
  Search,
} from "@mui/icons-material";

import type { DashboardService, SummaryCardData } from "./types";

export const SERVICES: DashboardService[] = [
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

export const createSummaryCards = (summary?: {
  total: number;
  pending: number;
  underReview: number;
  approved: number;
}): SummaryCardData[] => [
  {
    title: "Total Applications",
    value: summary?.total ?? 0,
    icon: <Assignment />,
    color: "bg-blue-50 text-blue-600",
    detail: "All submitted applications",
  },
  {
    title: "Pending",
    value: summary?.pending ?? 0,
    icon: <PendingActions />,
    color: "bg-amber-50 text-amber-600",
    detail: "Awaiting review",
  },
  {
    title: "Under Review",
    value: summary?.underReview ?? 0,
    icon: <Search />,
    color: "bg-purple-50 text-purple-600",
    detail: "Being processed",
  },
  {
    title: "Approved",
    value: summary?.approved ?? 0,
    icon: <CheckCircle />,
    color: "bg-emerald-50 text-emerald-600",
    detail: "Successfully approved",
  },
];

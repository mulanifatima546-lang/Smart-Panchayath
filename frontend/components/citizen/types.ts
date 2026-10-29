export type Citizen = {
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

export type Panchayat = {
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

export type ApplicationPanchayat = {
  _id: string;
  name: string;
  village?: string;
  district?: string;
  state?: string;
};

export type ApplicationStatus =
  | "Pending"
  | "Under Review"
  | "More Information Required"
  | "Approved"
  | "Rejected";

export type CitizenApplication = {
  _id: string;
  applicationNumber?: string;
  serviceType: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt?: string;
  submitedAt?: string;
  remarks?: string;
  panchayat?: ApplicationPanchayat | string | null;
};

export type DashboardSummary = {
  total: number;
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
  moreInformationRequired: number;
};

export type DashboardData = {
  status: boolean;
  message?: string;
  citizen: Citizen;
  panchayat: Panchayat | null;
  summary: DashboardSummary;
  recentApplications: CitizenApplication[];
  notifications: unknown[];
  announcements: unknown[];
};

export type DashboardService = {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  serviceType: string;
};

export type SummaryCardData = {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  detail: string;
};

export const APPLICATION_STATUSES = [
  "Pending",
  "Under Review",
  "More Information Required",
  "Approved",
  "Rejected",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type ApplicationDocument = {
  name?: string;
  url?: string;
  publicId?: string;
};

export type ApplicantDetails = {
  fullName?: string;
  name?: string;
  applicantName?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  mobile?: string;
  address?: string;
  description?: string;
  purpose?: string;
  message?: string;
  [key: string]: unknown;
};

export type RelatedUser = {
  _id?: string;
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
};

export type RelatedPanchayat = {
  _id?: string;
  name?: string;
  village?: string;
  district?: string;
};

export type ApplicationItem = {
  _id: string;
  applicationNumber?: string;
  serviceType?: string;
  applicantDetails?: ApplicantDetails;
  citizen?: RelatedUser | string | null;
  panchayat?: RelatedPanchayat | string | null;
  documents?: ApplicationDocument[];
  status: ApplicationStatus | string;
  remarks?: string;
  reviewedBy?: RelatedUser | string | null;
  reviewedAt?: string;
  submitedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ApplicationStats = {
  total: number;
  pending: number;
  underReview: number;
  moreInformationRequired: number;
  approved: number;
  rejected: number;
};

export const EMPTY_STATS: ApplicationStats = {
  total: 0,
  pending: 0,
  underReview: 0,
  moreInformationRequired: 0,
  approved: 0,
  rejected: 0,
};

export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

export const cardSx = {
  p: { xs: 2, sm: 2.5 },
  borderRadius: 3,
  border: "1px solid #e2e8f0",
  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
  bgcolor: "#ffffff",
};

export const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "#ffffff",
  },
};

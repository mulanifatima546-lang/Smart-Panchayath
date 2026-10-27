"use client";

import { Suspense, FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircle";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineIcon from "@mui/icons-material/Person";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import { api } from "@/constant/api";

const serviceTypes = [
  "Birth Certificate",
  "Death Certificate",
  "Residence Certificate",
  "Income Certificate",
  "Caste Certificate",
  "Water Connection",
  "Complaint",
  "Other",
] as const;

type ServiceType = (typeof serviceTypes)[number];

type DocumentItem = {
  name: string;
  url: string;
};

type Citizen = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  username?: string;
  address?:
    | {
        houseNumber?: string;
        street?: string;
        village?: string;
        taluka?: string;
        district?: string;
        state?: string;
        pincode?: string;
        [key: string]: unknown;
      }
    | string;
};

type Panchayat = {
  _id?: string;
  name?: string;
  village?: string;
  taluka?: string;
  district?: string;
  state?: string;
  address?: string;
};

type DashboardResponse = {
  status?: boolean;
  citizen?: Citizen;
  panchayat?: Panchayat;
  data?: {
    citizen?: Citizen;
    panchayat?: Panchayat;
  };
};

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

const labelClass = "text-sm font-semibold text-slate-700";

function NewApplicationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestedService = searchParams.get("service");
  const initialService = serviceTypes.find(
    (service) => service === requestedService,
  );

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [panchayat, setPanchayat] = useState<Panchayat | null>(null);

  const [serviceType, setServiceType] = useState<ServiceType>(
    initialService ?? "Birth Certificate",
  );

  const [form, setForm] = useState({
    applicantName: "",
    email: "",
    mobile: "",
    houseNumber: "",
    street: "",
    village: "",
    taluka: "",
    district: "",
    state: "",
    pincode: "",
    dateOfBirth: "",
    dateOfDeath: "",
    purpose: "",
    description: "",
  });

  const [documents, setDocuments] = useState<DocumentItem[]>([
    { name: "", url: "" },
  ]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await api.get<DashboardResponse>("/citizen");

        const result = response.data;
        const citizenData = result.citizen ?? result.data?.citizen ?? null;
        const panchayatData =
          result.panchayat ?? result.data?.panchayat ?? null;

        setCitizen(citizenData);
        setPanchayat(panchayatData);

        const address =
          citizenData?.address && typeof citizenData.address === "object"
            ? citizenData.address
            : {};

        setForm((previous) => ({
          ...previous,
          applicantName: citizenData?.name ?? "",
          email: citizenData?.email ?? "",
          houseNumber: String(address.houseNumber ?? ""),
          street: String(address.street ?? ""),
          village:
            String(address.village ?? "") || panchayatData?.village || "",
          taluka: String(address.taluka ?? "") || panchayatData?.taluka || "",
          district:
            String(address.district ?? "") || panchayatData?.district || "",
          state: String(address.state ?? "") || panchayatData?.state || "",
          pincode: String(address.pincode ?? ""),
        }));
      } catch (error) {
        console.error("Failed to load citizen dashboard:", error);
        toast.error(
          "Could not load your profile. Please sign in and try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  function updateField(field: keyof typeof form, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateDocument(
    index: number,
    field: keyof DocumentItem,
    value: string,
  ) {
    setDocuments((previous) =>
      previous.map((document, i) =>
        i === index ? { ...document, [field]: value } : document,
      ),
    );
  }

  function addDocument() {
    setDocuments((previous) => [...previous, { name: "", url: "" }]);
  }

  function removeDocument(index: number) {
    setDocuments((previous) => previous.filter((_, i) => i !== index));
  }

  function validateForm() {
    if (!form.applicantName.trim()) {
      toast.error("Please enter the applicant's name.");
      return false;
    }

    if (!/^[0-9]{10}$/.test(form.mobile.trim())) {
      toast.error("Enter a valid 10-digit mobile number.");
      return false;
    }

    if (!form.village.trim() || !form.district.trim() || !form.state.trim()) {
      toast.error("Please complete your address details.");
      return false;
    }

    if (serviceType === "Birth Certificate" && !form.dateOfBirth) {
      toast.error("Please enter the date of birth.");
      return false;
    }

    if (serviceType === "Death Certificate" && !form.dateOfDeath) {
      toast.error("Please enter the date of death.");
      return false;
    }

    if (
      [
        "Residence Certificate",
        "Income Certificate",
        "Caste Certificate",
      ].includes(serviceType) &&
      !form.purpose.trim()
    ) {
      toast.error("Please enter the purpose of the certificate.");
      return false;
    }

    if (
      ["Water Connection", "Complaint", "Other"].includes(serviceType) &&
      !form.description.trim()
    ) {
      toast.error("Please enter the application details.");
      return false;
    }

    const invalidDocument = documents.some((document) => {
      const hasName = document.name.trim().length > 0;
      const hasUrl = document.url.trim().length > 0;
      return hasName !== hasUrl;
    });

    if (invalidDocument) {
      toast.error("Enter both the name and URL for each document.");
      return false;
    }

    for (const document of documents) {
      if (!document.url.trim()) continue;

      try {
        const url = new URL(document.url.trim());
        if (!["http:", "https:"].includes(url.protocol)) {
          toast.error("Document URLs must use HTTP or HTTPS.");
          return false;
        }
      } catch {
        toast.error("Please enter a valid document URL.");
        return false;
      }
    }

    if (!panchayat?._id) {
      toast.error("Your Gram Panchayat is not linked to your profile.");
      return false;
    }

    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    const applicantDetails: Record<string, string> = {
      applicantName: form.applicantName.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim(),
      address: [
        form.houseNumber.trim(),
        form.street.trim(),
        form.village.trim(),
        form.taluka.trim(),
        form.district.trim(),
        form.state.trim(),
        form.pincode.trim(),
      ]
        .filter(Boolean)
        .join(", "),
      houseNumber: form.houseNumber.trim(),
      street: form.street.trim(),
      village: form.village.trim(),
      taluka: form.taluka.trim(),
      district: form.district.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
    };

    if (serviceType === "Birth Certificate") {
      applicantDetails.dateOfBirth = form.dateOfBirth;
    }

    if (serviceType === "Death Certificate") {
      applicantDetails.dateOfDeath = form.dateOfDeath;
    }

    if (
      [
        "Residence Certificate",
        "Income Certificate",
        "Caste Certificate",
      ].includes(serviceType)
    ) {
      applicantDetails.purpose = form.purpose.trim();
    }

    if (["Water Connection", "Complaint", "Other"].includes(serviceType)) {
      applicantDetails.description = form.description.trim();
    }

    const validDocuments = documents
      .filter((document) => document.name.trim() && document.url.trim())
      .map((document) => ({
        name: document.name.trim(),
        url: document.url.trim(),
      }));

    try {
      const response = await api.post("/application/create", {
        panchayat: panchayat?._id,
        serviceType,
        applicantDetails,
        documents: validDocuments,
      });

      if (response.data?.status === false) {
        throw new Error(
          response.data?.message || "Application submission failed.",
        );
      }

      toast.success(
        response.data?.message || "Application submitted successfully!",
      );

      router.push("/citizen/applications");
    } catch (error: unknown) {
      console.error("Application submission failed:", error);

      const apiError = error as {
        response?: {
          data?: {
            message?: string;
            errors?: { message?: string }[];
          };
        };
        message?: string;
      };

      toast.error(
        apiError.response?.data?.message ||
          apiError.response?.data?.errors?.[0]?.message ||
          apiError.message ||
          "Unable to submit your application. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const isCertificate = [
    "Residence Certificate",
    "Income Certificate",
    "Caste Certificate",
  ].includes(serviceType);

  const isDescriptionService = [
    "Water Connection",
    "Complaint",
    "Other",
  ].includes(serviceType);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-4xl animate-pulse space-y-5">
          <div className="h-28 rounded-2xl bg-slate-200" />
          <div className="h-16 rounded-2xl bg-slate-200" />
          <div className="h-96 rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700"
        >
          <ArrowBackIcon fontSize="small" />
          Back
        </button>

        {/* Page header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 p-6 text-white shadow-lg sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/10" />

          <div className="relative flex items-start gap-4">
            <div className="rounded-2xl bg-white/15 p-3">
              <DescriptionOutlinedIcon sx={{ fontSize: 32 }} />
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-100">
                Citizen Services
              </p>
              <h1 className="text-2xl font-bold sm:text-3xl">
                New Application
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
                Submit your request to your Gram Panchayat. Complete the details
                below and review them before submitting.
              </p>
            </div>
          </div>

          <div className="relative mt-6 flex flex-wrap gap-3 text-xs font-medium sm:text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
              <VerifiedUserOutlinedIcon fontSize="small" />
              Secure submission
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
              <AccountBalanceOutlinedIcon fontSize="small" />
              {panchayat?.name || "Gram Panchayat"}
            </span>
          </div>
        </section>

        {!panchayat?._id && (
          <div className="mt-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <InfoOutlinedIcon className="shrink-0" />
            <div>
              <p className="font-bold">Gram Panchayat not linked</p>
              <p className="mt-1 leading-6">
                Contact your administrator to link a Gram Panchayat to your
                profile before submitting an application.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-7 space-y-6">
          {/* Service selection */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-start gap-3">
              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
                <DescriptionOutlinedIcon />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Service Details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Select the service for which you want to apply.
                </p>
              </div>
            </div>

            <label htmlFor="serviceType" className={labelClass}>
              Select Service <span className="text-red-500">*</span>
            </label>

            <select
              id="serviceType"
              value={serviceType}
              onChange={(event) =>
                setServiceType(event.target.value as ServiceType)
              }
              className={inputClass}
              required
            >
              {serviceTypes.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>

            <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
              <p className="font-semibold">Selected service</p>
              <p className="mt-1">{serviceType}</p>
            </div>
          </section>

          {/* Applicant information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-start gap-3">
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
                <PersonOutlineIcon />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Applicant Information
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Check your personal details.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="applicantName" className={labelClass}>
                  Applicant Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="applicantName"
                  value={form.applicantName}
                  onChange={(e) => updateField("applicantName", e.target.value)}
                  className={inputClass}
                  placeholder="Enter full name"
                  autoComplete="name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={inputClass}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="mobile" className={labelClass}>
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="mobile"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.mobile}
                  onChange={(e) =>
                    updateField(
                      "mobile",
                      e.target.value.replace(/\D/g, "").slice(0, 10),
                    )
                  }
                  className={inputClass}
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                  required
                />
              </div>

              <div>
                <label htmlFor="panchayat" className={labelClass}>
                  Gram Panchayat
                </label>
                <input
                  id="panchayat"
                  value={panchayat?.name || ""}
                  className={`${inputClass} bg-slate-50 text-slate-500`}
                  placeholder="Your linked Gram Panchayat"
                  readOnly
                />
              </div>
            </div>
          </section>

          {/* Address */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-start gap-3">
              <div className="rounded-xl bg-orange-50 p-2.5 text-orange-700">
                <LocationOnOutlinedIcon />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Residential Address
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter your residential details.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="houseNumber" className={labelClass}>
                  House / Flat Number
                </label>
                <input
                  id="houseNumber"
                  value={form.houseNumber}
                  onChange={(e) => updateField("houseNumber", e.target.value)}
                  className={inputClass}
                  placeholder="House number"
                />
              </div>

              <div>
                <label htmlFor="street" className={labelClass}>
                  Street / Area
                </label>
                <input
                  id="street"
                  value={form.street}
                  onChange={(e) => updateField("street", e.target.value)}
                  className={inputClass}
                  placeholder="Street or area"
                />
              </div>

              <div>
                <label htmlFor="village" className={labelClass}>
                  Village <span className="text-red-500">*</span>
                </label>
                <input
                  id="village"
                  value={form.village}
                  onChange={(e) => updateField("village", e.target.value)}
                  className={inputClass}
                  placeholder="Village name"
                  required
                />
              </div>

              <div>
                <label htmlFor="taluka" className={labelClass}>
                  Taluka
                </label>
                <input
                  id="taluka"
                  value={form.taluka}
                  onChange={(e) => updateField("taluka", e.target.value)}
                  className={inputClass}
                  placeholder="Taluka name"
                />
              </div>

              <div>
                <label htmlFor="district" className={labelClass}>
                  District <span className="text-red-500">*</span>
                </label>
                <input
                  id="district"
                  value={form.district}
                  onChange={(e) => updateField("district", e.target.value)}
                  className={inputClass}
                  placeholder="District name"
                  required
                />
              </div>

              <div>
                <label htmlFor="state" className={labelClass}>
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  id="state"
                  value={form.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  className={inputClass}
                  placeholder="State name"
                  required
                />
              </div>

              <div>
                <label htmlFor="pincode" className={labelClass}>
                  PIN Code
                </label>
                <input
                  id="pincode"
                  inputMode="numeric"
                  maxLength={6}
                  value={form.pincode}
                  onChange={(e) =>
                    updateField(
                      "pincode",
                      e.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  className={inputClass}
                  placeholder="6-digit PIN code"
                />
              </div>
            </div>
          </section>

          {/* Birth/death fields */}
          {(serviceType === "Birth Certificate" ||
            serviceType === "Death Certificate") && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-lg font-bold text-slate-900">
                {serviceType} Details
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter the applicable date.
              </p>

              {serviceType === "Birth Certificate" && (
                <div className="mt-5 max-w-md">
                  <label htmlFor="dateOfBirth" className={labelClass}>
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    value={form.dateOfBirth}
                    onChange={(e) => updateField("dateOfBirth", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              )}

              {serviceType === "Death Certificate" && (
                <div className="mt-5 max-w-md">
                  <label htmlFor="dateOfDeath" className={labelClass}>
                    Date of Death <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="dateOfDeath"
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    value={form.dateOfDeath}
                    onChange={(e) => updateField("dateOfDeath", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              )}
            </section>
          )}

          {/* Certificate purpose */}
          {isCertificate && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-lg font-bold text-slate-900">
                Certificate Details
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Explain why you need this certificate.
              </p>

              <div className="mt-5">
                <label htmlFor="purpose" className={labelClass}>
                  Purpose <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="purpose"
                  rows={4}
                  value={form.purpose}
                  onChange={(e) => updateField("purpose", e.target.value)}
                  className={inputClass}
                  placeholder="Describe the purpose..."
                  required
                />
              </div>
            </section>
          )}

          {/* Water connection, complaint, other */}
          {isDescriptionService && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-lg font-bold text-slate-900">
                Application Description
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Provide details about your request.
              </p>

              <div className="mt-5">
                <label htmlFor="description" className={labelClass}>
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows={5}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className={inputClass}
                  placeholder={
                    serviceType === "Complaint"
                      ? "Describe your complaint..."
                      : serviceType === "Water Connection"
                        ? "Describe the water connection you need..."
                        : "Describe your application..."
                  }
                  required
                />
              </div>
            </section>
          )}

          {/* Documents */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-violet-50 p-2.5 text-violet-700">
                  <UploadFileOutlinedIcon />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Supporting Documents
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Add document links if available.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addDocument}
                className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                <AddIcon fontSize="small" />
                Add
              </button>
            </div>

            <div className="mb-5 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
              <InfoOutlinedIcon className="mt-0.5 shrink-0" />
              <p>
                Enter a publicly accessible HTTP/HTTPS URL. This version does
                not upload files directly from your device.
              </p>
            </div>

            <div className="space-y-4">
              {documents.map((document, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-700">
                      Document {index + 1}
                    </p>

                    {documents.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        aria-label={`Remove document ${index + 1}`}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <CloseIcon fontSize="small" />
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor={`document-name-${index}`}
                        className={labelClass}
                      >
                        Document Name
                      </label>
                      <input
                        id={`document-name-${index}`}
                        value={document.name}
                        onChange={(e) =>
                          updateDocument(index, "name", e.target.value)
                        }
                        className={inputClass}
                        placeholder="e.g. Aadhaar Card"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`document-url-${index}`}
                        className={labelClass}
                      >
                        Document URL
                      </label>
                      <input
                        id={`document-url-${index}`}
                        type="url"
                        value={document.url}
                        onChange={(e) =>
                          updateDocument(index, "url", e.target.value)
                        }
                        className={inputClass}
                        placeholder="https://example.com/document.pdf"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Submit */}
          <section className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <CheckCircleOutlineIcon className="mt-0.5 shrink-0 text-emerald-700" />
              <div>
                <h3 className="font-bold text-slate-900">
                  Review before submitting
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Check your information carefully. You can track your
                  application status from your applications dashboard.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => router.push("/citizen/applications")}
                disabled={submitting}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting || !panchayat?._id}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <CircularProgress size={18} sx={{ color: "white" }} />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowForwardIcon fontSize="small" />
                  </>
                )}
              </button>
            </div>
          </section>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Smart Grampanchayat Portal · Citizen Services
        </p>
      </div>
    </main>
  );
}

export default function NewApplication() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-4xl animate-pulse space-y-5">
            <div className="h-28 rounded-2xl bg-slate-200" />
            <div className="h-16 rounded-2xl bg-slate-200" />
            <div className="h-96 rounded-2xl bg-white" />
          </div>
        </main>
      }
    >
      <NewApplicationForm />
    </Suspense>
  );
}

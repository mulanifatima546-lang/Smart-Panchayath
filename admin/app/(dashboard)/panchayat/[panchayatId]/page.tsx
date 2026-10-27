"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/constant/api";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import type { Panchayat } from "@/context/panchayat.context";

import {
  Alert,
  Avatar,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => (
  <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
    <Typography
      sx={{
        color: "#64748b",
        fontSize: 12,
        fontWeight: 600,
        mb: 1,
      }}
    >
      {label}
    </Typography>

    <Typography
      sx={{
        color: "#0f172a",
        fontSize: 14,
        fontWeight: 600,
        overflowWrap: "anywhere",
        whiteSpace: "pre-wrap",
      }}
    >
      {value?.trim() || "—"}
    </Typography>
  </div>
);

const formatDate = (date?: string) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const PanchayatViewContent = () => {
  const params = useParams<{ panchayatId: string }>();
  const router = useRouter();
  const panchayatId = params.panchayatId;

  const [panchayat, setPanchayat] = useState<Panchayat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const getPanchayat = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await api.get(`/panchayat/${panchayatId}`);
        const result: Panchayat = data.panchayat ?? data.data ?? data;

        if (!result?._id) {
          throw new Error("Invalid Panchayat response.");
        }

        if (!cancelled) {
          setPanchayat(result);
        }
      } catch (err) {
        const message = isAxiosError(err)
          ? err.response?.data?.message || "Failed to load Panchayat details."
          : err instanceof Error
            ? err.message
            : "Something went wrong.";

        if (!cancelled) {
          setError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (panchayatId) {
      getPanchayat();
    }

    return () => {
      cancelled = true;
    };
  }, [panchayatId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <CircularProgress size={34} />
        <Typography sx={{ color: "#64748b", fontSize: 14 }}>
          Loading Panchayat details...
        </Typography>
      </div>
    );
  }

  if (error || !panchayat) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4 py-8">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{ textTransform: "none" }}
        >
          Go Back
        </Button>

        <Alert severity="error">
          {error || "Panchayat details could not be found."}
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-300 space-y-6 pb-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <Button
            variant="outlined"
            onClick={() => router.back()}
            aria-label="Go back"
            sx={{
              minWidth: 42,
              width: 42,
              height: 42,
              p: 0,
              borderColor: "#e2e8f0",
              borderRadius: 2.5,
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </Button>

          <div>
            <Typography
              sx={{
                color: "#0f172a",
                fontSize: { xs: 24, md: 30 },
                fontWeight: 800,
                letterSpacing: "-0.6px",
              }}
            >
              Panchayat Details
            </Typography>

            <Typography sx={{ mt: 0.5, color: "#64748b", fontSize: 13 }}>
              View the complete registered Panchayat information.
            </Typography>
          </div>
        </div>

        <Button
          variant="contained"
          startIcon={<EditOutlinedIcon />}
          onClick={() =>
            router.push(`/panchayat/${encodeURIComponent(panchayat._id)}/edit`)
          }
          sx={{
            alignSelf: { xs: "stretch", sm: "auto" },
            px: 2.5,
            py: 1.25,
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Edit Panchayat
        </Button>
      </div>

      <Paper
        elevation={0}
        sx={{
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          borderRadius: 3,
        }}
      >
        <div className="flex flex-col gap-4 bg-linear-to-r from-blue-700 to-indigo-700 p-5 sm:flex-row sm:items-center sm:p-7">
          <Avatar
            variant="rounded"
            sx={{
              width: 68,
              height: 68,
              bgcolor: "rgba(255,255,255,0.16)",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 3,
            }}
          >
            <AccountBalanceOutlinedIcon sx={{ fontSize: 34 }} />
          </Avatar>

          <div className="min-w-0 flex-1">
            <Typography
              sx={{
                color: "#ffffff",
                fontWeight: 800,
                fontSize: { xs: 22, md: 27 },
                overflowWrap: "anywhere",
              }}
            >
              {panchayat.name}
            </Typography>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="flex items-center gap-1.5 text-sm text-blue-100">
                <LocationOnOutlinedIcon sx={{ fontSize: 17 }} />
                {[panchayat.village, panchayat.taluka, panchayat.district]
                  .filter(Boolean)
                  .join(", ") || "Location not provided"}
              </span>
            </div>

            <Typography
              sx={{
                mt: 1,
                color: "#dbeafe",
                fontSize: 12,
                overflowWrap: "anywhere",
              }}
            >
              Panchayat ID: {panchayat._id}
            </Typography>
          </div>
        </div>

        <div className="space-y-7 p-4 sm:p-6">
          <section>
            <div className="mb-4 flex items-center gap-2">
              <AccountBalanceOutlinedIcon sx={{ color: "#2563eb" }} />
              <Typography
                sx={{ color: "#0f172a", fontSize: 16, fontWeight: 800 }}
              >
                General Information
              </Typography>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <DetailItem label="Panchayat Name" value={panchayat.name} />
              <DetailItem label="Village" value={panchayat.village} />
              <DetailItem label="State" value={panchayat.state} />
              <DetailItem label="District" value={panchayat.district} />
              <DetailItem label="Taluka" value={panchayat.taluka} />
              <DetailItem label="Full Address" value={panchayat.address} />
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-2">
              <ContactPhoneOutlinedIcon sx={{ color: "#059669" }} />
              <Typography
                sx={{ color: "#0f172a", fontSize: 16, fontWeight: 800 }}
              >
                Contact Information
              </Typography>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailItem
                label="Contact Number"
                value={panchayat.contactNumber}
              />
              <DetailItem label="Email Address" value={panchayat.email} />
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-2">
              <PersonOutlineOutlinedIcon sx={{ color: "#7c3aed" }} />
              <Typography
                sx={{ color: "#0f172a", fontSize: 16, fontWeight: 800 }}
              >
                Leadership
              </Typography>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailItem label="Sarpanch Name" value={panchayat.sarpanch} />
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-2">
              <CalendarTodayOutlinedIcon sx={{ color: "#d97706" }} />
              <Typography
                sx={{ color: "#0f172a", fontSize: 16, fontWeight: 800 }}
              >
                Record Information
              </Typography>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailItem
                label="Created At"
                value={formatDate(panchayat.createdAt)}
              />
              <DetailItem
                label="Last Updated"
                value={formatDate(panchayat.updatedAt)}
              />
            </div>
          </section>
        </div>
      </Paper>
    </div>
  );
};

const PanchayatView = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
          <CircularProgress size={34} />
          <Typography sx={{ color: "#64748b", fontSize: 14 }}>
            Loading Panchayat details...
          </Typography>
        </div>
      }
    >
      <PanchayatViewContent />
    </Suspense>
  );
};

export default PanchayatView;

"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/constant/api";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import type { Panchayat } from "@/context/panchayat.context";

import SelectState from "@/components/SelectState";
import SelectDistrict from "@/components/SelectDistrict";
import SelectTaluka from "@/components/SelectTaluka";

import {
  Alert,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhone";

type PanchayatForm = {
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

type LocationOption = {
  code: string | number;
  name: string;
};

const LOCATION_API = "https://lgd-json-api.vercel.app/api";

const initialForm: PanchayatForm = {
  name: "",
  state: "",
  district: "",
  taluka: "",
  village: "",
  address: "",
  contactNumber: "",
  email: "",
  sarpanch: "",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    backgroundColor: "#ffffff",
  },
  "& .MuiInputLabel-root": {
    color: "#64748b",
  },
};

async function fetchLocationOptions(
  url: string,
  signal: AbortSignal,
): Promise<LocationOption[]> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error("Unable to load location information.");
  }

  const result = await response.json();

  return Array.isArray(result.data) ? result.data : [];
}

const EditPanchayatContent = () => {
  const params = useParams<{ panchayatId: string }>();
  const router = useRouter();
  const panchayatId = params.panchayatId;

  const [form, setForm] = useState<PanchayatForm>(initialForm);
  const [stateCode, setStateCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchPanchayat = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get(`/panchayat/${panchayatId}`);
        const item: Panchayat = data.panchayat ?? data.data ?? data;

        if (!item?._id) {
          throw new Error("Panchayat details could not be found.");
        }

        if (controller.signal.aborted) return;

        setForm({
          name: item.name ?? "",
          state: item.state ?? "",
          district: item.district ?? "",
          taluka: item.taluka ?? "",
          village: item.village ?? "",
          address: item.address ?? "",
          contactNumber: item.contactNumber ?? "",
          email: item.email ?? "",
          sarpanch: item.sarpanch ?? "",
        });

        try {
          const states = await fetchLocationOptions(
            `${LOCATION_API}/states`,
            controller.signal,
          );

          const selectedState = states.find(
            (option) =>
              option.name.trim().toLowerCase() ===
              (item.state ?? "").trim().toLowerCase(),
          );

          if (controller.signal.aborted) return;

          if (!selectedState) {
            toast.error(
              "Saved state was not found in the location list. Please select it again.",
            );
            return;
          }

          const resolvedStateCode = String(selectedState.code);
          setStateCode(resolvedStateCode);

          const districts = await fetchLocationOptions(
            `${LOCATION_API}/districts?stateCode=${encodeURIComponent(
              resolvedStateCode,
            )}`,
            controller.signal,
          );

          const selectedDistrict = districts.find(
            (option) =>
              option.name.trim().toLowerCase() ===
              (item.district ?? "").trim().toLowerCase(),
          );

          if (controller.signal.aborted) return;

          if (!selectedDistrict) {
            toast.error(
              "Saved district was not found. Please select the district again.",
            );
            return;
          }

          setDistrictCode(String(selectedDistrict.code));
        } catch (locationError) {
          if (
            locationError instanceof Error &&
            locationError.name === "AbortError"
          ) {
            return;
          }

          toast.error(
            "Panchayat loaded, but location options could not be resolved. Please check the location selections.",
          );
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        const message = isAxiosError(err)
          ? err.response?.data?.message || "Failed to load Panchayat details."
          : err instanceof Error
            ? err.message
            : "Something went wrong.";

        setError(message);
        toast.error(message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (panchayatId) {
      void fetchPanchayat();
    }

    return () => controller.abort();
  }, [panchayatId]);

  const handleChange = (field: keyof PanchayatForm, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleStateChange = (name: string, code: string) => {
    setForm((previous) => ({
      ...previous,
      state: name,
      district: "",
      taluka: "",
    }));

    setStateCode(code);
    setDistrictCode("");
  };

  const handleDistrictChange = (name: string, code: string) => {
    setForm((previous) => ({
      ...previous,
      district: name,
      taluka: "",
    }));

    setDistrictCode(code);
  };

  const handleTalukaChange = (name: string, _code: string) => {
    handleChange("taluka", name);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.state.trim() ||
      !form.district.trim() ||
      !form.taluka.trim() ||
      !form.village.trim() ||
      !form.address.trim() ||
      !form.contactNumber.trim() ||
      !form.sarpanch.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);

      const payload: PanchayatForm = {
        name: form.name.trim(),
        state: form.state.trim(),
        district: form.district.trim(),
        taluka: form.taluka.trim(),
        village: form.village.trim(),
        address: form.address.trim(),
        contactNumber: form.contactNumber.trim(),
        email: form.email.trim(),
        sarpanch: form.sarpanch.trim(),
      };

      const { data } = await api.put(`/panchayat/${panchayatId}`, payload);

      if (data?.status === false) {
        throw new Error(data.message || "Failed to update Panchayat.");
      }

      toast.success(data?.message || "Panchayat updated successfully.");

      router.push(`/panchayat/${encodeURIComponent(panchayatId)}`);
      router.refresh();
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.message || "Failed to update Panchayat."
        : err instanceof Error
          ? err.message
          : "Something went wrong.";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <CircularProgress size={34} />
        <Typography sx={{ color: "#64748b", fontSize: 14 }}>
          Loading Panchayat information...
        </Typography>
      </div>
    );
  }

  if (error && !form.name) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-8">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{ textTransform: "none" }}
        >
          Go Back
        </Button>
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-300 space-y-6 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button
          variant="outlined"
          onClick={() => router.back()}
          aria-label="Go back"
          sx={{
            minWidth: 42,
            width: 42,
            height: 42,
            borderRadius: 2.5,
            borderColor: "#e2e8f0",
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
            Edit Panchayat
          </Typography>

          <Typography sx={{ mt: 0.5, color: "#64748b", fontSize: 13 }}>
            Update the registered Panchayat information below.
          </Typography>
        </div>
      </div>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid #e2e8f0",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div className="flex items-center gap-3 bg-linear-to-r from-blue-700 to-indigo-700 p-5 sm:p-7">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
            <AccountBalanceOutlinedIcon fontSize="large" />
          </div>

          <div>
            <Typography
              sx={{ color: "#ffffff", fontWeight: 800, fontSize: 20 }}
            >
              Panchayat Information
            </Typography>

            <Typography sx={{ color: "#dbeafe", fontSize: 13, mt: 0.5 }}>
              Edit details and save your changes.
            </Typography>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-7 p-4 sm:p-7">
            <section>
              <div className="mb-4 flex items-center gap-2">
                <LocationOnOutlinedIcon sx={{ color: "#2563eb" }} />

                <Typography
                  sx={{ color: "#0f172a", fontWeight: 800, fontSize: 16 }}
                >
                  General and Location Details
                </Typography>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <TextField
                  fullWidth
                  label="Panchayat Name"
                  required
                  value={form.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  sx={fieldSx}
                />

                <SelectState value={form.state} onChange={handleStateChange} />

                <SelectDistrict
                  stateCode={stateCode}
                  value={form.district}
                  onChange={handleDistrictChange}
                />

                <SelectTaluka
                  districtCode={districtCode}
                  value={form.taluka}
                  onChange={handleTalukaChange}
                />

                <TextField
                  fullWidth
                  label="Village"
                  required
                  value={form.village}
                  onChange={(event) =>
                    handleChange("village", event.target.value)
                  }
                  sx={fieldSx}
                />

                <TextField
                  fullWidth
                  label="Full Address"
                  required
                  multiline
                  minRows={2}
                  value={form.address}
                  onChange={(event) =>
                    handleChange("address", event.target.value)
                  }
                  sx={fieldSx}
                />
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-2">
                <ContactPhoneOutlinedIcon sx={{ color: "#059669" }} />

                <Typography
                  sx={{ color: "#0f172a", fontWeight: 800, fontSize: 16 }}
                >
                  Contact and Leadership
                </Typography>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <TextField
                  fullWidth
                  label="Contact Number"
                  required
                  value={form.contactNumber}
                  onChange={(event) =>
                    handleChange("contactNumber", event.target.value)
                  }
                  sx={fieldSx}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    handleChange("email", event.target.value)
                  }
                  sx={fieldSx}
                />

                <TextField
                  fullWidth
                  label="Sarpanch Name"
                  required
                  value={form.sarpanch}
                  onChange={(event) =>
                    handleChange("sarpanch", event.target.value)
                  }
                  sx={fieldSx}
                />
              </div>
            </section>

            <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-200 pt-5 sm:flex-row">
              <Button
                variant="outlined"
                onClick={() => router.back()}
                disabled={saving}
                sx={{
                  borderRadius: 2.5,
                  px: 3,
                  py: 1.25,
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                startIcon={
                  saving ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <SaveOutlinedIcon />
                  )
                }
                disabled={saving}
                sx={{
                  borderRadius: 2.5,
                  px: 3,
                  py: 1.25,
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </Paper>
    </div>
  );
};

const EditPanchayatPage = () => (
  <Suspense
    fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <CircularProgress size={34} />
      </div>
    }
  >
    <EditPanchayatContent />
  </Suspense>
);

export default EditPanchayatPage;

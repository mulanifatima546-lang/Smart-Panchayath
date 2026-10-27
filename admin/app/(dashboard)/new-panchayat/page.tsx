"use client";

import { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Paper,
  Divider,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import {
  AccountBalanceRounded,
  LocationOnRounded,
  PersonRounded,
  EmailRounded,
  PhoneRounded,
  ArrowBackRounded,
  AddBusinessRounded,
} from "@mui/icons-material";

import SelectState from "@/components/SelectState";
import SelectDistrict from "@/components/SelectDistrict";
import SelectTaluka from "@/components/SelectTaluka";

import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { api } from "@/constant/api";
import { useRouter } from "next/navigation";

export default function NewPanchatat() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [state, setState] = useState("");
  const [stateCode, setStateCode] = useState("");

  const [district, setDistrict] = useState("");
  const [districtCode, setDistrictCode] = useState("");

  const [taluka, setTaluka] = useState("");
  const [talukaCode, setTalukaCode] = useState("");
  const [village, setVillage] = useState("");

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [sarpanch, setSarpanch] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (
      !name.trim() ||
      !address.trim() ||
      !contactNumber.trim() ||
      !email.trim() ||
      !sarpanch.trim() ||
      !state ||
      !district ||
      !taluka ||
      !village.trim()
    ) {
      setError("Please complete all required fields before continuing.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/panchayat/create", {
        name: name.trim(),
        address: address.trim(),
        contactNumber: contactNumber.trim(),
        email: email.trim(),
        sarpanch: sarpanch.trim(),
        state,
        district,
        taluka,
        village: village.trim(),
      });

      if (data.status) {
        toast.success(data.message || "Panchayat created successfully!");
        router.push("/dashboard");
      } else {
        setError(data.message || "Unable to create the Panchayat.");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Something went wrong. Please try again.";
        setError(message);
        toast.error(message);
      } else {
        setError("An unexpected error occurred. Please try again.");
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#fff",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#93c5fd",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#2563eb",
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#2563eb",
    },
  };

  return (
    <Box className="mx-auto w-full max-w-5xl pb-10">
      {/* Page header */}
      <Box className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <Box>
          <Box className="mb-2 flex items-center gap-2 text-blue-600">
            <AddBusinessRounded sx={{ fontSize: 20 }} />
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              Panchayat Management
            </Typography>
          </Box>

          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 26, sm: 32 },
              fontWeight: 800,
              letterSpacing: "-0.7px",
              color: "#0f172a",
            }}
          >
            Create New Panchayat
          </Typography>

          <Typography sx={{ mt: 1, color: "#64748b", fontSize: 14 }}>
            Add Panchayat details and assign its location.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowBackRounded />}
          onClick={() => router.push("/dashboard")}
          sx={{
            alignSelf: { xs: "flex-start", sm: "center" },
            borderColor: "#cbd5e1",
            color: "#475569",
            borderRadius: "10px",
            px: 2,
            py: 1,
            textTransform: "none",
            fontWeight: 700,
            "&:hover": {
              borderColor: "#2563eb",
              backgroundColor: "#eff6ff",
            },
          }}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* Form card */}
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          borderRadius: { xs: "16px", sm: "22px" },
          backgroundColor: "#fff",
        }}
      >
        {/* Card banner */}
        <Box
          className="flex items-center gap-4"
          sx={{
            px: { xs: 3, sm: 4 },
            py: 3,
            background: "linear-gradient(110deg, #eff6ff 0%, #f5f3ff 100%)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 52,
              height: 52,
              flexShrink: 0,
              borderRadius: "15px",
              backgroundColor: "#fff",
              color: "#2563eb",
              boxShadow: "0 4px 14px rgba(37,99,235,0.08)",
            }}
          >
            <AccountBalanceRounded sx={{ fontSize: 28 }} />
          </Box>

          <Box>
            <Typography
              sx={{ fontSize: 17, fontWeight: 800, color: "#0f172a" }}
            >
              Panchayat Information
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: 13, color: "#64748b" }}>
              Fields marked as required must be completed.
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box className="flex flex-col gap-8 p-5 sm:p-8">
          {error && (
            <Alert
              severity="error"
              onClose={() => setError("")}
              sx={{ borderRadius: 2 }}
            >
              {error}
            </Alert>
          )}

          {/* Basic details */}
          <Box>
            <Box className="mb-5">
              <Typography
                sx={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}
              >
                Basic Details
              </Typography>
              <Typography sx={{ mt: 0.5, fontSize: 12, color: "#64748b" }}>
                Enter the official Panchayat contact information.
              </Typography>
            </Box>

            <Box className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <TextField
                required
                fullWidth
                label="Panchayat Name"
                placeholder="Enter Panchayat name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={fieldSx}
              />

              <TextField
                required
                fullWidth
                label="Contact Number"
                placeholder="Enter contact number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                type="tel"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneRounded sx={{ color: "#94a3b8", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={fieldSx}
              />

              <TextField
                required
                fullWidth
                type="email"
                label="Official Email"
                placeholder="office@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailRounded sx={{ color: "#94a3b8", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={fieldSx}
              />

              <TextField
                required
                fullWidth
                label="Sarpanch Name"
                placeholder="Enter Sarpanch full name"
                value={sarpanch}
                onChange={(e) => setSarpanch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonRounded
                          sx={{ color: "#94a3b8", fontSize: 20 }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={fieldSx}
              />

              <Box className="md:col-span-2">
                <TextField
                  required
                  fullWidth
                  label="Full Address"
                  placeholder="Building, street, and other address details"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  multiline
                  minRows={2}
                  sx={fieldSx}
                />
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Location details */}
          <Box>
            <Box className="mb-5 flex items-center gap-3">
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "12px",
                  bgcolor: "#ecfdf5",
                  color: "#059669",
                }}
              >
                <LocationOnRounded />
              </Box>

              <Box>
                <Typography
                  sx={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}
                >
                  Location Details
                </Typography>
                <Typography sx={{ mt: 0.5, fontSize: 12, color: "#64748b" }}>
                  Select the administrative location in order.
                </Typography>
              </Box>
            </Box>

            <Box className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <SelectState
                value={state}
                onChange={(name, code) => {
                  setState(name);
                  setStateCode(code);
                  setDistrict("");
                  setDistrictCode("");
                  setTaluka("");
                  setTalukaCode("");
                  setVillage("");
                }}
              />

              <SelectDistrict
                stateCode={stateCode}
                value={district}
                onChange={(name, code) => {
                  setDistrict(name);
                  setDistrictCode(code);
                  setTaluka("");
                  setTalukaCode("");
                  setVillage("");
                }}
              />

              <SelectTaluka
                districtCode={districtCode}
                value={taluka}
                onChange={(name, code) => {
                  setTaluka(name);
                  setTalukaCode(code);
                  setVillage("");
                }}
              />

              <TextField
                required
                fullWidth
                label="Village"
                placeholder="Enter village name"
                value={village}
                disabled={!taluka}
                onChange={(e) => setVillage(e.target.value)}
                helperText={
                  taluka ? "Enter the village name" : "Select a taluka first"
                }
                sx={fieldSx}
              />
            </Box>
          </Box>

          <Divider />

          {/* Form actions */}
          <Box className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>
              Please verify all details before submitting.
            </Typography>

            <Box className="flex flex-col-reverse gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outlined"
                disabled={loading}
                onClick={() => router.push("/dashboard")}
                sx={{
                  borderRadius: "11px",
                  px: 3,
                  py: 1.3,
                  borderColor: "#cbd5e1",
                  color: "#475569",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <AddBusinessRounded />
                  )
                }
                sx={{
                  borderRadius: "11px",
                  px: 3,
                  py: 1.3,
                  fontWeight: 700,
                  textTransform: "none",
                  background: "linear-gradient(100deg, #2563eb, #4f46e5)",
                  boxShadow: "0 5px 14px rgba(37,99,235,0.2)",
                  "&:hover": {
                    background: "linear-gradient(100deg, #1d4ed8, #4338ca)",
                    boxShadow: "0 7px 18px rgba(37,99,235,0.28)",
                  },
                }}
              >
                {loading ? "Creating Panchayat..." : "Create Panchayat"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

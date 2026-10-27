"use client";

import { api } from "@/constant/api";
import {
  Box,
  Card,
  TextField,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";

import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";

import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "react-hot-toast";

const SignIn = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!identifier.trim() || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/admin/sign-in", {
        identifier: identifier.trim(),
        password,
      });

      toast.success(data.message || "Signed in successfully");
      router.push("/dashboard");
    } catch (error) {
      if (isAxiosError(error)) {
        const errMessage =
          error.response?.data?.message ||
          "Unable to sign in. Please try again.";

        toast.error(errMessage);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6"
      sx={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #172554 48%, #1e40af 100%)",
      }}
    >
      {/* Decorative background elements */}
      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          width: { xs: 220, sm: 360 },
          height: { xs: 220, sm: 360 },
          borderRadius: "50%",
          background: "#3b82f6",
          opacity: 0.16,
          filter: "blur(75px)",
          top: "-100px",
          right: "-80px",
          pointerEvents: "none",
        }}
      />

      <Box
        aria-hidden="true"
        sx={{
          position: "absolute",
          width: { xs: 200, sm: 320 },
          height: { xs: 200, sm: 320 },
          borderRadius: "50%",
          background: "#06b6d4",
          opacity: 0.12,
          filter: "blur(70px)",
          bottom: "-100px",
          left: "-80px",
          pointerEvents: "none",
        }}
      />

      <Box className="relative z-10 w-full max-w-md">
        {/* Brand heading */}
        <Box className="mb-7 flex flex-col items-center text-center sm:mb-8">
          <Box
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
            sx={{
              color: "#ffffff",
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              boxShadow: "0 12px 30px rgba(37, 99, 235, 0.3)",
            }}
          >
            <AdminPanelSettingsRoundedIcon sx={{ fontSize: 36 }} />
          </Box>

          <Typography
            component="h1"
            sx={{
              color: "#ffffff",
              fontSize: { xs: "1.7rem", sm: "2rem" },
              fontWeight: 800,
              letterSpacing: "-0.04em",
            }}
          >
            Smart Panchayath
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#bfdbfe",
              fontSize: "0.9rem",
            }}
          >
            Digital governance. Better communities.
          </Typography>
        </Box>

        {/* Login card */}
        <Card
          component="form"
          onSubmit={handleSignIn}
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: "24px",
            background: "#ffffff",
            border: "1px solid rgba(255,255,255,0.6)",
            boxShadow: "0 24px 70px rgba(0,0,0,0.24)",
          }}
        >
          <Box className="mb-6">
            <Typography
              component="h2"
              sx={{
                color: "#172554",
                fontSize: "1.55rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Welcome back! 👋
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "#64748b",
                fontSize: "0.9rem",
                lineHeight: 1.7,
              }}
            >
              Sign in to access your administrator dashboard.
            </Typography>
          </Box>

          <Box className="flex flex-col gap-5">
            <TextField
              label="Email or Username"
              placeholder="Enter your email or username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              fullWidth
              disabled={loading}
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AlternateEmailRoundedIcon sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#f8fafc",
                  "&.Mui-focused fieldset": {
                    borderColor: "#2563eb",
                    borderWidth: "2px",
                  },
                },
              }}
            />

            <TextField
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              fullWidth
              disabled={loading}
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        onClick={() => setShowPassword((previous) => !previous)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffRoundedIcon />
                        ) : (
                          <VisibilityRoundedIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#f8fafc",
                  "&.Mui-focused fieldset": {
                    borderColor: "#2563eb",
                    borderWidth: "2px",
                  },
                },
              }}
            />

            <Button
              type="submit"
              disabled={loading}
              variant="contained"
              fullWidth
              endIcon={
                loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <ArrowForwardRoundedIcon />
                )
              }
              sx={{
                mt: 1,
                py: 1.6,
                borderRadius: "12px",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 700,
                background: "linear-gradient(90deg, #2563eb, #1d4ed8)",
                boxShadow: "0 8px 20px rgba(37, 99, 235, 0.22)",
                "&:hover": {
                  background: "linear-gradient(90deg, #1d4ed8, #1e40af)",
                  boxShadow: "0 10px 25px rgba(37, 99, 235, 0.3)",
                },
                "&.Mui-disabled": {
                  background: "#93b4f5",
                  color: "#ffffff",
                },
              }}
            >
              {loading ? "Signing in..." : "Sign In to Dashboard"}
            </Button>
          </Box>

          {/* Security note */}
          <Box
            className="mt-6 flex items-start gap-3 rounded-xl p-3"
            sx={{ backgroundColor: "#eff6ff" }}
          >
            <VerifiedUserRoundedIcon
              sx={{ color: "#2563eb", fontSize: 21, mt: 0.1 }}
            />

            <Box>
              <Typography
                sx={{
                  color: "#1e40af",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                }}
              >
                Secure Administrator Access
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  color: "#64748b",
                  fontSize: "0.75rem",
                  lineHeight: 1.6,
                }}
              >
                Authorized personnel only. Keep your login credentials private.
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Static year avoids time-dependent prerendering */}
        <Typography
          sx={{
            mt: 5,
            color: "#bfdbfe",
            fontSize: "0.78rem",
            textAlign: "center",
          }}
        >
          © 2026 Smart Panchayath · Digital Governance
        </Typography>
      </Box>
    </Box>
  );
};

export default SignIn;

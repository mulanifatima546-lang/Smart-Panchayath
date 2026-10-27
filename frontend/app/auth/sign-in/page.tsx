"use client";

import { useState, type FormEvent } from "react";
import {
  Alert,
  Button,
  Divider,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import {
  AlternateEmailOutlined,
  ArrowForwardRounded,
  LockOutlined,
  LoginRounded,
  VerifiedUserOutlined,
} from "@mui/icons-material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { toast } from "react-hot-toast";

import bg from "@/assets/images/SignIn.png";
import { api } from "@/constant/api";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    "& fieldset": {
      borderColor: "#d1d5db",
    },
    "&:hover fieldset": {
      borderColor: "#16a34a",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#15803d",
      borderWidth: "2px",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#15803d",
  },
};

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const router = useRouter();

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!identifier.trim() || !password) {
      setFormError("Please enter your email/username and password.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/auth/sign-in", {
        identifier: identifier.trim(),
        password,
      });

      toast.success(data.message || "Signed in successfully!");
      router.push("/citizen");
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Unable to sign in. Please try again.";
        setFormError(message);
        toast.error(message);
      } else {
        setFormError("Something went wrong. Please try again.");
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-100 px-4 py-8 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-green-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-emerald-300/30 blur-3xl" />

      <section className="relative grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl shadow-green-900/10 md:min-h-[650px] md:grid-cols-2">
        {/* Sign-in form */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
          <div className="w-full max-w-md">
            {/* Mobile branding */}
            <div className="mb-8 flex items-center gap-3 md:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-700 text-white shadow-lg shadow-green-700/20">
                <VerifiedUserOutlined fontSize="large" />
              </div>
              <div>
                <Typography className="!font-extrabold !text-gray-900">
                  Smart Grampanchayat
                </Typography>
                <Typography className="!text-xs !text-gray-500">
                  Your village, digitally connected
                </Typography>
              </div>
            </div>

            <div className="mb-8">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-800">
                <LoginRounded sx={{ fontSize: 30 }} />
              </div>

              <Typography
                component="h1"
                className="!text-3xl !font-extrabold tracking-tight !text-gray-900 sm:!text-4xl"
              >
                Welcome back!
              </Typography>

              <Typography className="!mt-3 !text-sm !leading-6 !text-gray-500 sm:!text-base">
                Sign in to access your panchayat services, manage applications,
                and stay connected with your village.
              </Typography>
            </div>

            <form onSubmit={handleSignIn} className="space-y-5">
              {formError && (
                <Alert
                  severity="error"
                  onClose={() => setFormError("")}
                  sx={{ borderRadius: "12px" }}
                >
                  {formError}
                </Alert>
              )}

              <div className="space-y-2">
                <Typography
                  component="label"
                  htmlFor="identifier"
                  className="!text-sm !font-semibold !text-gray-700"
                >
                  Email or Username
                </Typography>

                <TextField
                  id="identifier"
                  name="identifier"
                  placeholder="Enter your email or username"
                  type="text"
                  autoComplete="username"
                  fullWidth
                  required
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  sx={fieldSx}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <AlternateEmailOutlined className="text-gray-400" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Typography
                    component="label"
                    htmlFor="password"
                    className="!text-sm !font-semibold !text-gray-700"
                  >
                    Password
                  </Typography>
                </div>

                <TextField
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                  autoComplete="current-password"
                  fullWidth
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  sx={fieldSx}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined className="text-gray-400" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </div>

              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={loading}
                endIcon={!loading && <ArrowForwardRounded />}
                sx={{
                  mt: "12px",
                  py: 1.7,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "16px",
                  fontWeight: 700,
                  backgroundColor: "#15803d",
                  boxShadow: "0 8px 18px rgba(21, 128, 61, 0.18)",
                  "&:hover": {
                    backgroundColor: "#166534",
                    boxShadow: "0 10px 22px rgba(21, 128, 61, 0.25)",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#86b995",
                    color: "#ffffff",
                  },
                }}
              >
                {loading ? "Signing in..." : "Sign in to your account"}
              </Button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <Divider className="flex-1" />
              <Typography className="!text-xs !font-medium !text-gray-400">
                NEW TO SMART GRAMPANCHAYAT?
              </Typography>
              <Divider className="flex-1" />
            </div>

            <Typography className="!text-center !text-sm !text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                underline="none"
                className="!font-bold !text-green-700 hover:!text-green-900"
              >
                Create account
              </Link>
            </Typography>

            <div className="mt-8 flex items-center justify-center gap-2 text-center">
              <VerifiedUserOutlined sx={{ fontSize: 17, color: "#15803d" }} />
              <Typography className="!text-xs !text-gray-500">
                A simpler way to access your village services
              </Typography>
            </div>
          </div>
        </div>

        {/* Branding panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 p-10 text-white md:flex lg:p-14">
          <div className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full border-[50px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-80 rounded-full border-[50px] border-white/5" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur">
              <VerifiedUserOutlined sx={{ fontSize: 29 }} />
            </div>
            <div>
              <Typography className="!font-extrabold !tracking-wide">
                SMART GRAMPANCHAYAT
              </Typography>
              <Typography className="!text-xs !text-green-100">
                Digital services for every village
              </Typography>
            </div>
          </div>

          <div className="relative z-10 my-10">
            <Typography
              component="h2"
              className="!text-4xl !font-extrabold !leading-tight lg:!text-5xl"
            >
              Your Village.
              <br />
              Your Services.
              <br />
              <span className="text-green-200">All Connected.</span>
            </Typography>

            <Typography className="!mt-6 !max-w-md !text-base !leading-7 !text-green-50 lg:!text-lg">
              Access panchayat services, submit applications, track
              certificates, and stay updated — all from one convenient digital
              platform.
            </Typography>

            <div className="mt-8 space-y-4">
              {[
                "Apply for services online",
                "Track your application status",
                "Stay connected with your panchayat",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm text-green-100">
                    ✓
                  </span>
                  <Typography className="!text-sm !font-medium !text-white lg:!text-base">
                    {item}
                  </Typography>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
            <Image
              src={bg}
              alt="Smart Grampanchayat digital services"
              priority
              className="h-44 w-full rounded-xl object-cover lg:h-52"
              sizes="(max-width: 768px) 0px, 50vw"
            />
          </div>

          <Typography className="relative z-10 mt-5 !text-xs !text-green-100/80">
            Empowering citizens through accessible digital governance.
          </Typography>
        </div>
      </section>
    </main>
  );
};

export default SignIn;

"use client";

import { useState, type FormEvent } from "react";
import { states } from "@/constant/states";
import Image from "next/image";

import {
  Alert,
  Button,
  Divider,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";

import {
  AccountCircleOutlined,
  AlternateEmailOutlined,
  BadgeOutlined,
  HomeOutlined,
  LockOutlined,
  LocationCityOutlined,
  LocationOnOutlined,
  MarkunreadMailboxOutlined,
  PersonAddAlt1Outlined,
  PlaceOutlined,
  ArrowForwardRounded,
  VerifiedUserOutlined,
  GroupsOutlined,
} from "@mui/icons-material";

import bg from "@/assets/images/SignUp.png";
import { isAxiosError } from "axios";
import { api } from "@/constant/api";
import toast from "react-hot-toast";
import { usePanchayat } from "@/context/panchayat.context";
import { useRouter } from "next/navigation";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    transition: "all 0.2s ease",

    "& fieldset": {
      borderColor: "#dce5df",
    },

    "&:hover fieldset": {
      borderColor: "#86b59a",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#16804a",
      borderWidth: "1.5px",
    },
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#16804a",
  },
};

const SignUp = () => {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [cityName, setCityName] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [panchayat, setPanchayat] = useState("");

  const { panchayats } = usePanchayat();
  const router = useRouter();

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !name.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password ||
      !selectedState ||
      !panchayat
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/auth/sign-up", {
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        password,

        address: {
          houseNo: houseNo.trim(),
          street: street.trim(),
          pinCode: pinCode.trim(),
          cityName: cityName.trim(),
          state: selectedState,
        },

        panchayat,
      });

      toast.success(data.message || "Account created successfully");
      router.push("/citizen");
    } catch (error: unknown) {
      console.error("Signup failed:", error);

      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Unable to create your account.",
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f8f5] px-4 py-8 sm:px-6 lg:px-10">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-green-200/40 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-28 -right-20 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_24px_90px_-30px_rgba(20,83,45,0.22)] lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left branding panel */}
          <aside className="relative hidden min-h-full flex-col overflow-hidden bg-gradient-to-br from-[#123d2a] via-[#17623d] to-[#218653] p-10 text-white lg:flex xl:p-12">
            <div className="pointer-events-none absolute -right-20 top-20 h-64 w-64 rounded-full border border-white/10" />

            <div className="pointer-events-none absolute -right-8 top-32 h-40 w-40 rounded-full border border-white/10" />

            <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-lime-300/10 blur-2xl" />

            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                <HomeOutlined sx={{ fontSize: 28 }} />
              </div>

              <div>
                <p className="text-lg font-bold tracking-wide">
                  Smart Grampanchayat
                </p>

                <p className="text-xs text-green-100">
                  Digital services for every village
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-16">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-green-50">
                <VerifiedUserOutlined sx={{ fontSize: 16 }} />
                Your village, digitally connected
              </span>

              <h1 className="mt-6 text-4xl font-bold leading-[1.2] xl:text-5xl">
                Your Village.
                <br />
                <span className="text-lime-300">Connected.</span>
              </h1>

              <p className="mt-5 max-w-md text-base leading-7 text-green-50/90">
                One account, easier access. Connect with your Gram Panchayat,
                submit service applications, and stay updated on your requests
                from one convenient place.
              </p>
            </div>

            <div className="relative z-10 mt-8 overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-sm">
              <Image
                src={bg}
                alt="Smart Grampanchayat registration"
                priority
                className="h-52 w-full rounded-xl object-cover xl:h-60"
                sizes="(min-width: 1280px) 440px, 40vw"
              />
            </div>

            <div className="relative z-10 mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <GroupsOutlined />
                </div>

                <p className="text-sm font-semibold">Community first</p>

                <p className="mt-1 text-xs leading-5 text-green-100">
                  Services for your local community
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <VerifiedUserOutlined />
                </div>

                <p className="text-sm font-semibold">One digital account</p>

                <p className="mt-1 text-xs leading-5 text-green-100">
                  Manage your applications online
                </p>
              </div>
            </div>

            <p className="relative z-10 mt-auto pt-8 text-xs text-green-100/70">
              Bringing local governance closer to you.
            </p>
          </aside>

          {/* Signup form */}
          <section className="min-w-0 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 xl:px-14 xl:py-12">
            {/* Mobile branding */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-700 text-white shadow-lg shadow-green-700/20">
                <HomeOutlined />
              </div>

              <div>
                <p className="font-bold text-gray-900">Smart Grampanchayat</p>

                <p className="text-xs text-gray-500">
                  Digital village services
                </p>
              </div>
            </div>

            <div className="mb-7">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-800">
                <PersonAddAlt1Outlined sx={{ fontSize: 16 }} />
                CITIZEN REGISTRATION
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Join your local digital community. Enter your details below to
                get started.
              </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-7">
              {/* Personal details */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-700">
                    <BadgeOutlined fontSize="small" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Personal details
                    </h3>

                    <p className="text-xs text-gray-500">Tell us who you are</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <TextField
                    label="Full name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    fullWidth
                    autoComplete="name"
                    sx={fieldSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccountCircleOutlined sx={{ color: "#7b8d81" }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <TextField
                    label="Username"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    fullWidth
                    autoComplete="username"
                    sx={fieldSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeOutlined sx={{ color: "#7b8d81" }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <TextField
                    label="Email address"
                    placeholder="you@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                    autoComplete="email"
                    className="sm:col-span-2"
                    sx={fieldSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <AlternateEmailOutlined sx={{ color: "#7b8d81" }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <TextField
                    label="Password"
                    placeholder="Create a secure password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                    autoComplete="new-password"
                    className="sm:col-span-2"
                    sx={fieldSx}
                    slotProps={{
                      htmlInput: {
                        minLength: 8,
                      },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined sx={{ color: "#7b8d81" }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    helperText="Use at least 8 characters."
                  />
                </div>
              </div>

              <Divider sx={{ borderColor: "#edf1ee" }} />

              {/* Address details */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-700">
                    <LocationOnOutlined fontSize="small" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Your address
                    </h3>

                    <p className="text-xs text-gray-500">
                      Add your residential details
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <TextField
                    label="House number"
                    placeholder="e.g. 12/A"
                    value={houseNo}
                    onChange={(e) => setHouseNo(e.target.value)}
                    fullWidth
                    sx={fieldSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeOutlined sx={{ color: "#7b8d81" }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <TextField
                    label="Street / Area"
                    placeholder="Enter street or area"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    fullWidth
                    sx={fieldSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PlaceOutlined sx={{ color: "#7b8d81" }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <TextField
                    label="City / Village"
                    placeholder="Enter city or village"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    fullWidth
                    sx={fieldSx}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationCityOutlined sx={{ color: "#7b8d81" }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <TextField
                    label="PIN code"
                    placeholder="6-digit PIN code"
                    value={pinCode}
                    onChange={(e) =>
                      setPinCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    fullWidth
                    slotProps={{
                      htmlInput: {
                        inputMode: "numeric",
                        maxLength: 6,
                      },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <MarkunreadMailboxOutlined
                              sx={{ color: "#7b8d81" }}
                            />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={fieldSx}
                  />

                  <TextField
                    select
                    label="State"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    required
                    fullWidth
                    className="sm:col-span-2"
                    helperText="Select your state or union territory"
                    sx={fieldSx}
                  >
                    {states.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </div>

              <Divider sx={{ borderColor: "#edf1ee" }} />

              {/* Panchayat */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-700">
                    <GroupsOutlined fontSize="small" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Local governance
                    </h3>

                    <p className="text-xs text-gray-500">
                      Choose your Gram Panchayat
                    </p>
                  </div>
                </div>

                <TextField
                  select
                  label="Gram Panchayat"
                  value={panchayat}
                  onChange={(e) => setPanchayat(e.target.value)}
                  required
                  fullWidth
                  sx={fieldSx}
                  helperText="Select your Panchayat from the list"
                >
                  {panchayats.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>

                {panchayats.length === 0 && (
                  <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                    No Panchayats are currently available. Please try again
                    later or contact your administrator.
                  </Alert>
                )}
              </div>

              {/* Submit */}
              <div className="pt-1">
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={loading || panchayats.length === 0}
                  endIcon={!loading ? <ArrowForwardRounded /> : undefined}
                  sx={{
                    minHeight: 54,
                    borderRadius: "14px",
                    textTransform: "none",
                    fontSize: "15px",
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #176b40 0%, #16804a 100%)",
                    boxShadow: "0 8px 20px rgba(22, 128, 74, 0.2)",

                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #125532 0%, #116b3d 100%)",
                      boxShadow: "0 10px 24px rgba(22, 128, 74, 0.28)",
                    },

                    "&.Mui-disabled": {
                      background: "#a7b8ad",
                      color: "#fff",
                    },
                  }}
                >
                  {loading ? "Creating your account..." : "Create my account"}
                </Button>

                <p className="mt-3 text-center text-xs leading-5 text-gray-500">
                  Please ensure your details are accurate before creating your
                  citizen account.
                </p>
              </div>
            </form>

            {/* Sign in link */}
            <div className="mt-7 rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-5 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/auth/sign-in"
                  className="font-bold text-green-700 transition hover:text-green-900 hover:underline"
                >
                  Sign in
                </a>
              </p>
            </div>

            <p className="mt-5 text-center text-xs text-gray-400">
              Smart Grampanchayat · Digital services for your village
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default SignUp;

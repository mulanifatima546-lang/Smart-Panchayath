"use client";

import { usePanchayat } from "@/context/panchayat.context";
import { Box, Button, Card, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

const Hero = () => {
  const router = useRouter();
  const { panchayats } = usePanchayat();

  const stats = [
    {
      value: `${panchayats.length}+`,
      label: "Panchayats Connected",
      icon: <AccountBalanceRoundedIcon />,
    },
    {
      value: "100%",
      label: "Digital Processing",
      icon: <VerifiedUserRoundedIcon />,
    },
    {
      value: "24/7",
      label: "Citizen Access",
      icon: <AccessTimeRoundedIcon />,
    },
  ];

  return (
    <Card
      elevation={0}
      className="relative overflow-hidden rounded-3xl border border-blue-100"
      sx={{
        background:
          "linear-gradient(135deg, #ffffff 0%, #f4f8ff 55%, #eaf2ff 100%)",
      }}
    >
      {/* Decorative background elements */}
      <Box
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl sm:h-80 sm:w-80"
      />
      <Box
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-cyan-200/30 blur-3xl"
      />

      <Box className="relative z-10 p-5 sm:p-8 md:p-12 lg:p-14">
        {/* Intro badge */}
        <Box className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-2 shadow-sm sm:mb-7 sm:px-4">
          <Box className="h-2 w-2 rounded-full bg-green-500" />
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: "#2456a6", letterSpacing: "0.04em" }}
          >
            YOUR VILLAGE, DIGITALLY CONNECTED
          </Typography>
        </Box>

        {/* Main heading */}
        <Box className="max-w-3xl">
          <Typography
            component="h1"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.045em",
              lineHeight: 1.12,
              fontSize: {
                xs: "2.15rem",
                sm: "3rem",
                md: "3.75rem",
                lg: "4.25rem",
              },
              color: "#172554",
            }}
          >
            Your Gram Panchayat,
          </Typography>

          <Typography
            component="span"
            sx={{
              display: "block",
              fontWeight: 800,
              letterSpacing: "-0.045em",
              lineHeight: 1.12,
              fontSize: {
                xs: "2.15rem",
                sm: "3rem",
                md: "3.75rem",
                lg: "4.25rem",
              },
              background: "linear-gradient(90deg, #2563eb 0%, #0891b2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Now at Your Fingertips.
          </Typography>
        </Box>

        {/* Description */}
        <Typography
          sx={{
            mt: 3,
            maxWidth: "620px",
            color: "#52627a",
            fontSize: { xs: "0.98rem", sm: "1.1rem" },
            lineHeight: 1.85,
          }}
        >
          Access essential Panchayat services, submit applications, track
          requests, and receive digital certificates online — simply,
          transparently, and securely from the comfort of your home.
        </Typography>

        {/* Actions */}
        <Box className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
          <Button
            onClick={() => router.push("/auth/sign-up")}
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              width: { xs: "100%", sm: "fit-content" },
              px: 3.5,
              py: 1.5,
              borderRadius: "12px",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 700,
              background: "linear-gradient(90deg, #2563eb, #1d4ed8)",
              boxShadow: "0 8px 20px rgba(37, 99, 235, 0.22)",
              "&:hover": {
                background: "linear-gradient(90deg, #1d4ed8, #1e40af)",
                boxShadow: "0 10px 24px rgba(37, 99, 235, 0.3)",
              },
            }}
          >
            Get Started
          </Button>

          <Box className="flex items-center justify-center gap-2 px-2 py-2 sm:justify-start">
            <VerifiedUserRoundedIcon sx={{ fontSize: 20, color: "#16a34a" }} />
            <Typography
              variant="body2"
              sx={{ color: "#52627a", fontWeight: 500 }}
            >
              Simple, secure &amp; accessible
            </Typography>
          </Box>
        </Box>

        {/* Statistics */}
        <Box className="mt-9 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4">
          {stats.map((stat) => (
            <Box
              key={stat.label}
              className="flex items-center gap-4 rounded-2xl border border-white/80 bg-white/75 p-4 shadow-sm backdrop-blur-sm sm:p-5"
            >
              <Box
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50"
                sx={{ color: "#2563eb" }}
              >
                {stat.icon}
              </Box>

              <Box className="min-w-0">
                <Typography
                  sx={{
                    color: "#172554",
                    fontSize: { xs: "1.3rem", sm: "1.5rem" },
                    fontWeight: 800,
                    lineHeight: 1.3,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    fontSize: { xs: "0.78rem", sm: "0.82rem" },
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  );
};

export default Hero;

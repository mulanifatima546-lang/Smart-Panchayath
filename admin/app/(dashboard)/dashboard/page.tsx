"use client";

import { useAdmin } from "@/context/admin.context";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Button,
} from "@mui/material";
import {
  WavingHandRounded,
  DashboardRounded,
  GroupsRounded,
  MiscellaneousServicesRounded,
  ArrowForwardRounded,
  AccountCircleRounded,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { admin, loading } = useAdmin();
  const router = useRouter();

  if (loading) {
    return (
      <Box className="flex min-h-[60vh] items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  const firstName = admin?.name?.trim().split(/\s+/)[0] || "Admin";

  const stats = [
    {
      title: "Total Services",
      value: "Explore",
      description: "Manage Panchayath services",
      icon: <MiscellaneousServicesRounded />,
      color: "#2563eb",
      bg: "#eff6ff",
      path: "/dashboard/services",
    },
    {
      title: "Administration",
      value: "Manage",
      description: "Access administration tools",
      icon: <DashboardRounded />,
      color: "#7c3aed",
      bg: "#f5f3ff",
      path: "/dashboard",
    },
    {
      title: "Community",
      value: "Connect",
      description: "Support your local community",
      icon: <GroupsRounded />,
      color: "#059669",
      bg: "#ecfdf5",
      path: "/dashboard",
    },
  ];

  return (
    <Box className="flex flex-col gap-6">
      {/* Welcome banner */}
      <Card
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "24px",
          background:
            "linear-gradient(120deg, #1d4ed8 0%, #4338ca 60%, #6366f1 100%)",
          color: "#fff",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 230,
            height: 230,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
            right: -50,
            top: -100,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            right: 100,
            bottom: -100,
          }}
        />

        <CardContent
          sx={{
            position: "relative",
            zIndex: 1,
            p: { xs: 3, sm: 4 },
            "&:last-child": { pb: { xs: 3, sm: 4 } },
          }}
        >
          <Box className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <Box>
              <Box className="mb-3 flex items-center gap-2">
                <WavingHandRounded sx={{ color: "#fde68a" }} />
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#dbeafe",
                  }}
                >
                  WELCOME TO YOUR WORKSPACE
                </Typography>
              </Box>

              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: 25, sm: 32 },
                  fontWeight: 800,
                  letterSpacing: "-0.7px",
                  lineHeight: 1.3,
                }}
              >
                Welcome back, {firstName}!
              </Typography>

              <Typography
                sx={{
                  mt: 1.5,
                  maxWidth: 480,
                  fontSize: 14,
                  lineHeight: 1.8,
                  color: "#e0e7ff",
                }}
              >
                Manage your Grampanchayat administration and keep essential
                services running smoothly from one place.
              </Typography>
            </Box>

            <Avatar
              sx={{
                width: 72,
                height: 72,
                bgcolor: "rgba(255,255,255,0.18)",
                color: "#fff",
                border: "2px solid rgba(255,255,255,0.35)",
              }}
            >
              <AccountCircleRounded sx={{ fontSize: 48 }} />
            </Avatar>
          </Box>
        </CardContent>
      </Card>

      {/* Section heading */}
      <Box>
        <Typography
          component="h2"
          sx={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}
        >
          Dashboard Overview
        </Typography>
        <Typography sx={{ mt: 0.5, fontSize: 13, color: "#64748b" }}>
          Quick access to your administration workspace.
        </Typography>
      </Box>

      {/* Quick-access cards */}
      <Box className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => (
          <Card
            key={item.title}
            elevation={0}
            sx={{
              height: "100%",
              border: "1px solid #e2e8f0",
              borderRadius: "20px",
              transition: "all 200ms ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 12px 28px rgba(15, 23, 42, 0.07)",
                borderColor: "#bfdbfe",
              },
            }}
          >
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Box className="flex items-start justify-between gap-3">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    borderRadius: "14px",
                    backgroundColor: item.bg,
                    color: item.color,
                  }}
                >
                  {item.icon}
                </Box>

                <Typography
                  sx={{
                    px: 1.25,
                    py: 0.5,
                    borderRadius: "20px",
                    bgcolor: "#f8fafc",
                    color: "#64748b",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  QUICK ACCESS
                </Typography>
              </Box>

              <Typography
                sx={{
                  mt: 2.5,
                  fontSize: 17,
                  fontWeight: 750,
                  color: "#0f172a",
                }}
              >
                {item.title}
              </Typography>

              <Typography sx={{ mt: 0.75, fontSize: 13, color: "#64748b" }}>
                {item.description}
              </Typography>

              <Button
                onClick={() => router.push(item.path)}
                endIcon={<ArrowForwardRounded />}
                sx={{
                  mt: 2.5,
                  px: 0,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 13,
                  color: item.color,
                  "&:hover": {
                    bgcolor: "transparent",
                    gap: 0.5,
                  },
                }}
              >
                Open section
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Admin information */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid #e2e8f0",
          borderRadius: "20px",
          background: "#fff",
        }}
      >
        <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
          <Box className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Box className="flex items-center gap-3">
              <Avatar
                sx={{
                  bgcolor: "#dbeafe",
                  color: "#1d4ed8",
                  width: 48,
                  height: 48,
                }}
              >
                <AccountCircleRounded />
              </Avatar>

              <Box>
                <Typography sx={{ fontWeight: 750, color: "#0f172a" }}>
                  Administrator Profile
                </Typography>
                <Typography sx={{ mt: 0.4, fontSize: 13, color: "#64748b" }}>
                  Signed in as {admin?.name || "Administrator"}
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                width: "fit-content",
                px: 1.5,
                py: 0.75,
                borderRadius: "20px",
                bgcolor: "#dcfce7",
                color: "#15803d",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              ● Account active
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;

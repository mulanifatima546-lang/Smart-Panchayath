"use client";

import { Suspense } from "react";
import { links } from "@/constant/links";
import { Box, Button, Divider, Drawer, Typography } from "@mui/material";
import {
  DashboardRounded,
  ChevronRightRounded,
  LocationCityRounded,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";

function SidebarNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Box className="flex w-full flex-col gap-1.5">
      {links.map((link, i) => {
        const isActive =
          pathname === link.path ||
          (link.path !== "/" && pathname.startsWith(`${link.path}/`));

        return (
          <Button
            key={link.path ?? i}
            onClick={() => router.push(link.path)}
            fullWidth
            disableElevation
            endIcon={
              isActive ? <ChevronRightRounded sx={{ fontSize: 20 }} /> : null
            }
            sx={{
              justifyContent: "flex-start",
              textAlign: "left",
              textTransform: "none",
              borderRadius: "12px",
              px: 1.75,
              py: 1.35,
              minHeight: 46,
              fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? "#ffffff" : "#475569",
              background: isActive
                ? "linear-gradient(100deg, #2563eb, #4f46e5)"
                : "transparent",
              boxShadow: isActive
                ? "0 5px 12px rgba(37, 99, 235, 0.18)"
                : "none",
              transition: "all 180ms ease",
              "& .MuiButton-endIcon": {
                marginLeft: "auto",
              },
              "&:hover": {
                background: isActive
                  ? "linear-gradient(100deg, #1d4ed8, #4338ca)"
                  : "#eff6ff",
                color: isActive ? "#ffffff" : "#1d4ed8",
                transform: "translateX(3px)",
              },
            }}
          >
            {link.name}
          </Button>
        );
      })}
    </Box>
  );
}

function SidebarFallback() {
  return (
    <Box className="flex w-full flex-col gap-1.5">
      {links.map((link, i) => (
        <Button
          key={link.path ?? i}
          fullWidth
          disabled
          sx={{
            justifyContent: "flex-start",
            textAlign: "left",
            textTransform: "none",
            borderRadius: "12px",
            px: 1.75,
            py: 1.35,
            minHeight: 46,
            fontSize: 13,
          }}
        >
          {link.name}
        </Button>
      ))}
    </Box>
  );
}

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        height: "100%",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 260,
          position: "relative",
          height: "100%",
          boxSizing: "border-box",
          border: "none",
          borderRight: "1px solid #e2e8f0",
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
          padding: 2,
          overflowY: "auto",
          overflowX: "hidden",
        },
      }}
    >
      <Box className="flex h-full flex-col">
        <Box className="mb-5 flex items-center gap-3 rounded-2xl bg-linear-to-r from-blue-700 to-indigo-600 p-4 text-white shadow-md shadow-blue-100">
          <Box className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <LocationCityRounded sx={{ fontSize: 25 }} />
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 14, lineHeight: 1.5 }}>
              Smart Panchayath
            </Typography>
            <Typography sx={{ fontSize: 11, opacity: 0.8 }}>
              Admin Workspace
            </Typography>
          </Box>
        </Box>

        <Typography
          sx={{
            px: 1.5,
            mb: 1.5,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "1.5px",
            color: "#94a3b8",
            textTransform: "uppercase",
          }}
        >
          Main Menu
        </Typography>

        <Suspense fallback={<SidebarFallback />}>
          <SidebarNavigation />
        </Suspense>

        <Box className="mt-auto">
          <Divider sx={{ my: 2, borderColor: "#e2e8f0" }} />

          <Box className="rounded-xl border border-blue-100 bg-blue-50 p-3">
            <Box className="flex items-center gap-2">
              <DashboardRounded sx={{ fontSize: 18, color: "#2563eb" }} />
              <Typography
                sx={{ fontSize: 12, fontWeight: 700, color: "#1e40af" }}
              >
                Administration
              </Typography>
            </Box>

            <Typography
              sx={{
                mt: 0.75,
                fontSize: 11,
                lineHeight: 1.6,
                color: "#64748b",
              }}
            >
              Manage your Panchayath services in one place.
            </Typography>
          </Box>

          <Typography
            sx={{
              mt: 2,
              textAlign: "center",
              fontSize: 10,
              color: "#94a3b8",
            }}
          >
            Smart Grampanchayat © 2026
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}

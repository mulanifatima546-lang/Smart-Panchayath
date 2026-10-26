"use client";

import { services } from "@/constant/services";
import { Box, Card, Typography } from "@mui/material";

const Services = () => {
  return (
    <Box className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {services.map((service, i) => (
        <Card
          key={service.title ?? i}
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: { xs: 2.5, sm: 3 },
            height: "100%",
            borderRadius: "18px",
            border: "1px solid #e5edf9",
            background: "linear-gradient(145deg, #ffffff 0%, #f8faff 100%)",
            transition: "all 220ms ease",
            "&:hover": {
              transform: "translateY(-4px)",
              borderColor: "#bfdbfe",
              boxShadow: "0 12px 28px rgba(37, 99, 235, 0.09)",
            },
            "&:hover .service-icon": {
              backgroundColor: "#2563eb",
              color: "#ffffff",
            },
          }}
        >
          {/* Icon */}
          <Box
            className="service-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
            sx={{
              backgroundColor: "#eff6ff",
              color: "#2563eb",
              transition: "all 220ms ease",
              "& svg": {
                fontSize: 26,
              },
            }}
          >
            {service.icon}
          </Box>

          {/* Text */}
          <Box className="min-w-0">
            <Typography
              component="h3"
              sx={{
                fontWeight: 700,
                color: "#172554",
                fontSize: { xs: "1rem", sm: "1.05rem" },
                lineHeight: 1.5,
              }}
            >
              {service.title}
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                color: "#64748b",
                fontSize: "0.8rem",
                lineHeight: 1.6,
              }}
            >
              {service.caption}
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default Services;

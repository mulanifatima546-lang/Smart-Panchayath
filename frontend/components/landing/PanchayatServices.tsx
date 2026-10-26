"use client";

import { panchayatServices } from "@/constant/panchatat.services";
import { Box, Card, Typography } from "@mui/material";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";

const PanchayatServices = () => {
  return (
    <Box className="flex flex-col gap-7 sm:gap-9">
      {/* Section heading */}
      <Box className="max-w-3xl">
        <Typography
          component="h2"
          sx={{
            fontWeight: 800,
            letterSpacing: "-0.035em",
            color: "#172554",
            fontSize: {
              xs: "1.85rem",
              sm: "2.4rem",
              md: "3rem",
            },
            lineHeight: 1.2,
          }}
        >
          Panchayat Services,
          <Box
            component="span"
            sx={{
              display: { xs: "block", sm: "inline" },
              color: "#2563eb",
            }}
          >
            {" "}
            Made Simpler
          </Box>
        </Typography>

        <Typography
          sx={{
            mt: 2,
            maxWidth: "720px",
            color: "#64748b",
            fontSize: { xs: "0.95rem", sm: "1.05rem" },
            lineHeight: 1.8,
          }}
        >
          Explore digital administration services designed to reduce procedural
          delays and give every resident transparent access. Available services
          depend on your Gram Panchayat jurisdiction.
        </Typography>
      </Box>

      {/* Service cards */}
      <Box className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5 lg:gap-6">
        {panchayatServices.map((service, i) => (
          <Card
            key={service.title ?? i}
            elevation={0}
            className="group h-full"
            sx={{
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: { xs: 2.5, sm: 3 },
              borderRadius: "20px",
              border: "1px solid #e5edf9",
              background: "linear-gradient(145deg, #ffffff 0%, #f8faff 100%)",
              transition:
                "transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease",
              "&:hover": {
                transform: "translateY(-5px)",
                borderColor: "#bfdbfe",
                boxShadow: "0 16px 32px rgba(37, 99, 235, 0.10)",
              },
              "&:hover .service-icon": {
                backgroundColor: "#2563eb",
                color: "#ffffff",
                transform: "scale(1.05)",
              },
              "&:hover .service-arrow": {
                color: "#2563eb",
                transform: "translate(2px, -2px)",
              },
            }}
          >
            {/* Decorative accent */}
            <Box
              aria-hidden="true"
              sx={{
                position: "absolute",
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "#dbeafe",
                opacity: 0.35,
                top: -55,
                right: -45,
                pointerEvents: "none",
              }}
            />

            {/* Icon and arrow */}
            <Box className="relative z-10 flex items-center justify-between">
              <Box
                className="service-icon flex h-12 w-12 items-center justify-center rounded-2xl"
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

              <ArrowOutwardRoundedIcon
                className="service-arrow"
                sx={{
                  color: "#94a3b8",
                  fontSize: 21,
                  transition: "all 220ms ease",
                }}
              />
            </Box>

            {/* Service information */}
            <Box className="relative z-10 flex flex-1 flex-col gap-2">
              <Typography
                component="h3"
                sx={{
                  color: "#172554",
                  fontSize: { xs: "1.05rem", sm: "1.15rem" },
                  fontWeight: 700,
                  lineHeight: 1.5,
                }}
              >
                {service.title}
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: "0.875rem",
                  lineHeight: 1.8,
                }}
              >
                {service.caption}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default PanchayatServices;

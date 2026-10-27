"use client";

import Image from "next/image";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import icon from "@/assests/images/icon.png";

const Nav = () => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        color: "#1e293b",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 72, sm: 84 },
          px: { xs: 2, sm: 4, md: 6 },
        }}
        className="flex items-center justify-between"
      >
        <Box className="flex items-center gap-3">
          <Box
            sx={{
              width: { xs: 44, sm: 56 },
              height: { xs: 44, sm: 56 },
              position: "relative",
              flexShrink: 0,
            }}
          >
            <Image
              src={icon}
              alt="Smart Grampanchayat logo"
              fill
              sizes="(max-width: 600px) 44px, 56px"
              className="object-contain"
              priority
            />
          </Box>

          <Box>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "1rem", sm: "1.25rem" },
                fontWeight: 700,
                lineHeight: 1.4,
                color: "#0f172a",
              }}
            >
              Smart Grampanchayat
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "0.7rem", sm: "0.8rem" },
                color: "#64748b",
                mt: 0.25,
              }}
            >
              Administration Portal
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;

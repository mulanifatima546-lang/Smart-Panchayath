"use client";

import type { ReactNode } from "react";
import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import { cardSx } from "./applicationTypes";

type Props = {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
};

export default function ApplicationStatCard({
  title,
  value,
  icon,
  color,
}: Props) {
  return (
    <Paper sx={cardSx}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          sx={{
            width: 46,
            height: 46,
            borderRadius: 2.5,
            bgcolor: `${color}15`,
            color,
          }}
        >
          {icon}
        </Avatar>

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ color: "#64748b", fontSize: 13, fontWeight: 600 }}>
            {title}
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              color: "#0f172a",
              fontSize: 25,
              fontWeight: 800,
              lineHeight: 1.2,
            }}
          >
            {value}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

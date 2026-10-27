"use client";

import { Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type Props = {
  onAdd: () => void;
};

export default function PanchayatPageHeader({ onAdd }: Props) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <Typography
          sx={{
            color: "#0f172a",
            fontSize: { xs: 25, md: 32 },
            fontWeight: 800,
            letterSpacing: "-0.8px",
          }}
        >
          Panchayat Management
        </Typography>

        <Typography sx={{ mt: 0.75, color: "#64748b", fontSize: 14 }}>
          Manage your registered Gram Panchayats and their details.
        </Typography>
      </div>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAdd}
        sx={{
          alignSelf: { xs: "stretch", sm: "auto" },
          px: 2.5,
          py: 1.25,
          borderRadius: 2.5,
          textTransform: "none",
          fontWeight: 700,
          boxShadow: "0 4px 12px rgba(37,99,235,0.18)",
        }}
      >
        Add Panchayat
      </Button>
    </div>
  );
}

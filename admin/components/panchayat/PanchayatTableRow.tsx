"use client";

import {
  Avatar,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import type { Panchayat } from "@/context/panchayat.context";

type Props = {
  panchayat: Panchayat;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
};

function formatDate(date?: string) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PanchayatTableRow({
  panchayat,
  onView,
  onEdit,
}: Props) {
  return (
    <TableRow
      hover
      sx={{
        "&:last-child td": { borderBottom: 0 },
        "&:hover": { bgcolor: "#f8fafc" },
      }}
    >
      <TableCell sx={{ py: 2 }}>
        <div className="flex items-center gap-3">
          <Avatar
            variant="rounded"
            sx={{
              width: 42,
              height: 42,
              bgcolor: "#eff6ff",
              color: "#2563eb",
              fontWeight: 800,
              borderRadius: 2,
            }}
          >
            {(panchayat.name || "P").charAt(0).toUpperCase()}
          </Avatar>

          <div className="min-w-0">
            <Typography
              sx={{ color: "#0f172a", fontSize: 13, fontWeight: 700 }}
            >
              {panchayat.name || "Unnamed Panchayat"}
            </Typography>

            <Typography sx={{ mt: 0.4, color: "#94a3b8", fontSize: 11 }}>
              ID: {panchayat._id}
            </Typography>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <Typography sx={{ color: "#334155", fontSize: 12, fontWeight: 600 }}>
          {panchayat.village || "—"}
        </Typography>

        <Typography sx={{ mt: 0.4, color: "#64748b", fontSize: 11 }}>
          {[panchayat.taluka, panchayat.district].filter(Boolean).join(", ") ||
            "—"}
        </Typography>

        <Typography sx={{ mt: 0.3, color: "#94a3b8", fontSize: 11 }}>
          {panchayat.state || "—"}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography sx={{ color: "#334155", fontSize: 12, fontWeight: 600 }}>
          {panchayat.sarpanch || "—"}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography sx={{ color: "#334155", fontSize: 12 }}>
          {panchayat.contactNumber || "—"}
        </Typography>

        <Typography sx={{ mt: 0.4, color: "#64748b", fontSize: 11 }}>
          {panchayat.email || "—"}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography sx={{ color: "#475569", fontSize: 12 }}>
          {formatDate(panchayat.createdAt)}
        </Typography>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-1">
          <Tooltip title="View Panchayat">
            <IconButton
              size="small"
              aria-label={`View ${panchayat.name}`}
              onClick={() => onView(panchayat._id)}
              sx={{
                color: "#64748b",
                "&:hover": {
                  bgcolor: "#eff6ff",
                  color: "#2563eb",
                },
              }}
            >
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit Panchayat">
            <IconButton
              size="small"
              aria-label={`Edit ${panchayat.name}`}
              onClick={() => onEdit(panchayat._id)}
              sx={{
                color: "#2563eb",
                "&:hover": { bgcolor: "#eff6ff" },
              }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
}

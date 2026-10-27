"use client";

import {
  Avatar,
  Button,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import type { Panchayat } from "@/context/panchayat.context";
import PanchayatTableRow from "@/components/panchayat/PanchayatTableRow";

type Props = {
  panchayats: Panchayat[];
  total: number;
  search: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
};

const headings = [
  "PANCHAYAT",
  "LOCATION",
  "SARPANCH",
  "CONTACT DETAILS",
  "CREATED ON",
  "ACTIONS",
];

export default function PanchayatTable({
  panchayats,
  total,
  search,
  onSearchChange,
  onAdd,
  onView,
  onEdit,
}: Props) {
  return (
    <Paper
      elevation={0}
      sx={{
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        borderRadius: 3,
      }}
    >
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:p-5">
        <div>
          <Typography sx={{ color: "#0f172a", fontSize: 17, fontWeight: 800 }}>
            Registered Panchayats
          </Typography>

          <Typography sx={{ mt: 0.5, color: "#64748b", fontSize: 12 }}>
            {panchayats.length} records found
          </Typography>
        </div>

        <TextField
          size="small"
          placeholder="Search by name, village, district..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          sx={{
            width: { xs: "100%", sm: 330 },
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "#f8fafc",
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#94a3b8" }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </div>

      <TableContainer sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f8fafc" }}>
              {headings.map((heading) => (
                <TableCell
                  key={heading}
                  sx={{
                    py: 1.75,
                    color: "#64748b",
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: "0.5px",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  {heading}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {panchayats.length > 0 ? (
              panchayats.map((panchayat) => (
                <PanchayatTableRow
                  key={panchayat._id}
                  panchayat={panchayat}
                  onView={onView}
                  onEdit={onEdit}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 8, textAlign: "center" }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      mx: "auto",
                      mb: 2,
                      bgcolor: "#eff6ff",
                      color: "#2563eb",
                    }}
                  >
                    <AccountBalanceOutlinedIcon />
                  </Avatar>

                  <Typography sx={{ color: "#334155", fontWeight: 700 }}>
                    {search ? "No matching Panchayats" : "No Panchayats yet"}
                  </Typography>

                  <Typography sx={{ mt: 0.75, color: "#94a3b8", fontSize: 13 }}>
                    {search
                      ? "Try another search term."
                      : "Add your first Panchayat to get started."}
                  </Typography>

                  {!search && (
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={onAdd}
                      sx={{
                        mt: 2,
                        textTransform: "none",
                        borderRadius: 2,
                      }}
                    >
                      Add Panchayat
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="flex flex-col justify-between gap-2 border-t border-slate-200 bg-slate-50/70 px-5 py-3 sm:flex-row sm:items-center">
        <Typography sx={{ color: "#64748b", fontSize: 12 }}>
          Showing {panchayats.length} of {total} Panchayats
        </Typography>

        <Typography sx={{ color: "#94a3b8", fontSize: 11 }}>
          Smart Grampanchayat Administration Portal
        </Typography>
      </div>
    </Paper>
  );
}

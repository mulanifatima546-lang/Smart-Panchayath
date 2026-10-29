"use client";

import {
  Avatar,
  Box,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmpty";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import {
  APPLICATION_STATUSES,
  ApplicationItem,
  ApplicationStatus,
  PAGE_SIZE_OPTIONS,
  cardSx,
  fieldSx,
} from "./applicationTypes";

import {
  formatDate,
  getApplicantEmail,
  getApplicantName,
  getRelatedName,
  normalizeStatus,
} from "./applicationUtils";

type Props = {
  applications: ApplicationItem[];
  filteredApplications: ApplicationItem[];
  paginatedApplications: ApplicationItem[];
  loading: boolean;
  searchInput: string;
  setSearchInput: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  page: number;
  setPage: (value: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (value: number) => void;
  onView: (application: ApplicationItem) => void;
};

const getStatusColor = (
  status: ApplicationStatus,
): "warning" | "info" | "secondary" | "success" | "error" => {
  switch (status) {
    case "Pending":
      return "warning";
    case "Under Review":
      return "info";
    case "More Information Required":
      return "secondary";
    case "Approved":
      return "success";
    case "Rejected":
      return "error";
    default:
      return "warning";
  }
};

const getStatusIcon = (status: ApplicationStatus) => {
  switch (status) {
    case "Approved":
      return <CheckCircleOutlineIcon fontSize="small" />;
    case "Rejected":
      return <CancelOutlinedIcon fontSize="small" />;
    case "Under Review":
      return <EditNoteOutlinedIcon fontSize="small" />;
    case "More Information Required":
      return <ChatBubbleOutlineIcon fontSize="small" />;
    default:
      return <HourglassEmptyOutlinedIcon fontSize="small" />;
  }
};

export default function ApplicationTable({
  applications,
  filteredApplications,
  paginatedApplications,
  loading,
  searchInput,
  setSearchInput,
  statusFilter,
  setStatusFilter,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  onView,
}: Props) {
  return (
    <Paper sx={{ ...cardSx, p: 0, overflow: "hidden" }}>
      <Stack
        sx={{
          direction: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          p: 2.5,
        }}
        // direction={{ xs: "column", md: "row" }}
        // alignItems={{ xs: "stretch", md: "center" }}
        spacing={2}
        // sx={{ p: 2.5 }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
            Application Records
          </Typography>

          <Typography sx={{ mt: 0.5, fontSize: 13, color: "#64748b" }}>
            {filteredApplications.length} application
            {filteredApplications.length === 1 ? "" : "s"} found
          </Typography>
        </Box>

        <TextField
          size="small"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search applications..."
          sx={{ ...fieldSx, width: { xs: "100%", md: 280 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#94a3b8" }} />
                </InputAdornment>
              ),
              endAdornment: searchInput ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    aria-label="Clear search"
                    onClick={() => setSearchInput("")}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            },
          }}
        />

        <FormControl
          size="small"
          sx={{ ...fieldSx, minWidth: { xs: "100%", md: 220 } }}
        >
          <Select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(0);
            }}
            inputProps={{ "aria-label": "Filter by status" }}
          >
            <MenuItem value="All">All statuses</MenuItem>
            {APPLICATION_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Divider />

      <TableContainer sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 850 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f8fafc" }}>
              {[
                "Application",
                "Applicant",
                "Service",
                "Panchayat",
                "Submitted",
                "Status",
                "Action",
              ].map((heading) => (
                <TableCell
                  key={heading}
                  sx={{
                    py: 1.75,
                    color: "#64748b",
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {heading}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedApplications.map((application) => {
              const status = normalizeStatus(application.status);

              return (
                <TableRow
                  key={application._id}
                  hover
                  sx={{
                    "&:last-child td": { borderBottom: 0 },
                    "& td": { borderColor: "#f1f5f9" },
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Typography
                      sx={{
                        color: "#0f172a",
                        fontSize: 13,
                        fontWeight: 800,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {application.applicationNumber ||
                        `APP-${application._id.slice(-6).toUpperCase()}`}
                    </Typography>

                    <Typography
                      sx={{ mt: 0.4, color: "#94a3b8", fontSize: 11 }}
                    >
                      ID: {application._id.slice(-8)}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Stack
                      sx={{
                        direction: "row",
                        alignItems: "center",
                      }}
                      spacing={1.25}
                    >
                      <Avatar
                        sx={{
                          width: 34,
                          height: 34,
                          bgcolor: "#e0e7ff",
                          color: "#4338ca",
                        }}
                      >
                        <PersonOutlineIcon fontSize="small" />
                      </Avatar>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            color: "#0f172a",
                            fontSize: 13,
                            fontWeight: 700,
                            maxWidth: 180,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {getApplicantName(application)}
                        </Typography>

                        <Typography
                          sx={{
                            color: "#64748b",
                            fontSize: 11,
                            maxWidth: 180,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {getApplicantEmail(application) || "No email"}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Typography
                      sx={{ color: "#334155", fontSize: 13, fontWeight: 600 }}
                    >
                      {application.serviceType || "General Service"}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Stack
                      sx={{
                        direction: "row",
                        alignItems: "center",
                      }}
                      spacing={0.75}
                    >
                      <LocationOnOutlinedIcon
                        sx={{ fontSize: 16, color: "#94a3b8" }}
                      />
                      <Typography sx={{ color: "#475569", fontSize: 12 }}>
                        {getRelatedName(application.panchayat)}
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Typography
                      sx={{
                        color: "#475569",
                        fontSize: 12,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(
                        application.submitedAt || application.createdAt,
                      )}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      size="small"
                      icon={getStatusIcon(status)}
                      label={status}
                      color={getStatusColor(status)}
                      sx={{
                        fontWeight: 700,
                        fontSize: 11,
                        maxWidth: 210,
                        "& .MuiChip-label": { px: 1 },
                      }}
                    />
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Tooltip title="View and update application">
                      <IconButton
                        aria-label="View application"
                        onClick={() => onView(application)}
                        sx={{
                          color: "#2563eb",
                          bgcolor: "#eff6ff",
                          borderRadius: 2,
                          "&:hover": { bgcolor: "#dbeafe" },
                        }}
                      >
                        <VisibilityOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}

            {!loading && paginatedApplications.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} sx={{ py: 8, textAlign: "center" }}>
                  <AssignmentOutlinedIcon
                    sx={{ fontSize: 42, color: "#cbd5e1", mb: 1 }}
                  />
                  <Typography
                    sx={{ color: "#334155", fontWeight: 700, fontSize: 15 }}
                  >
                    No applications found
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: 13, mt: 0.5 }}>
                    Try changing the search text or status filter.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider />

      <TablePagination
        component="div"
        count={filteredApplications.length}
        page={page}
        onPageChange={(_, nextPage) => setPage(nextPage)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={PAGE_SIZE_OPTIONS}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value));
          setPage(0);
        }}
        sx={{
          color: "#64748b",
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            {
              fontSize: 12,
            },
        }}
      />
    </Paper>
  );
}

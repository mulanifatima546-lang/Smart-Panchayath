"use client";

import { api } from "@/constant/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNote";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmpty";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  ApplicationItem,
  ApplicationStats,
  ApplicationStatus,
  cardSx,
  EMPTY_STATS,
} from "@/components/application/applicationTypes";
import {
  extractApplications,
  getApplicantEmail,
  getApplicantName,
  getApplicantPhone,
  getErrorMessage,
  getRelatedName,
  normalizeStatus,
} from "@/components/application/applicationUtils";
import ApplicationStatCard from "@/components/application/ApplicationStatCard";
import ApplicationTable from "@/components/application/ApplicationTable";
import ApplicationDetailsDialog from "@/components/application/ApplicationDetailsDialog";

export default function Applications() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationItem | null>(null);

  const [editStatus, setEditStatus] = useState<ApplicationStatus>("Pending");

  const [editRemarks, setEditRemarks] = useState("");

  // Fetch all applications for the administrator.
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/application/admin");
      const list = extractApplications(response.data);

      setApplications(list);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchApplications();
  }, [fetchApplications]);

  // Debounce the search input.
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim().toLowerCase());
      setPage(0);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  // Calculate statistics from the complete application list.
  const stats = useMemo<ApplicationStats>(() => {
    return applications.reduce<ApplicationStats>(
      (result, application) => {
        const status = normalizeStatus(application.status);

        result.total += 1;

        if (status === "Pending") result.pending += 1;
        if (status === "Under Review") result.underReview += 1;

        if (status === "More Information Required") {
          result.moreInformationRequired += 1;
        }

        if (status === "Approved") result.approved += 1;
        if (status === "Rejected") result.rejected += 1;

        return result;
      },
      { ...EMPTY_STATS },
    );
  }, [applications]);

  // Apply status and text filters.
  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const normalizedStatus = normalizeStatus(application.status);

      if (statusFilter !== "All" && normalizedStatus !== statusFilter) {
        return false;
      }

      if (!search) return true;

      const searchValues = [
        application.applicationNumber,
        application.serviceType,
        application._id,
        getApplicantName(application),
        getApplicantEmail(application),
        getApplicantPhone(application),
        getRelatedName(application.panchayat),
        normalizedStatus,
      ];

      return searchValues.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(search),
      );
    });
  }, [applications, search, statusFilter]);

  // Keep pagination inside the filtered results.
  const paginatedApplications = useMemo(() => {
    const start = page * rowsPerPage;

    return filteredApplications.slice(start, start + rowsPerPage);
  }, [filteredApplications, page, rowsPerPage]);

  const openDetails = (application: ApplicationItem) => {
    setSelectedApplication(application);
    setEditStatus(normalizeStatus(application.status));
    setEditRemarks(application.remarks ?? "");
  };

  const closeDetails = () => {
    if (saving) return;

    setSelectedApplication(null);
    setEditRemarks("");
  };

  // FIXED: use the backend's PATCH /admin/:applicationId/status route.
  const handleSave = async () => {
    if (!selectedApplication?._id) {
      toast.error("Please select an application.");
      return;
    }

    setSaving(true);

    try {
      const applicationId = selectedApplication._id;

      const response = await api.patch(
        `/application/admin/${applicationId}/status`,
        {
          status: editStatus,
          remarks: editRemarks.trim(),
        },
      );

      const responseData = response.data;

      // Support common API response formats.
      const updatedFromServer: Partial<ApplicationItem> | undefined =
        responseData?.data?.application ??
        responseData?.application ??
        responseData?.data;

      const updatedApplication: ApplicationItem = {
        ...selectedApplication,
        ...(updatedFromServer ?? {}),
        _id: applicationId,
        status: normalizeStatus(updatedFromServer?.status ?? editStatus),
        remarks: updatedFromServer?.remarks ?? editRemarks.trim(),
      };

      setApplications((previous) =>
        previous.map((application) =>
          application._id === applicationId ? updatedApplication : application,
        ),
      );

      setSelectedApplication(updatedApplication);
      setEditStatus(normalizeStatus(updatedApplication.status));
      setEditRemarks(updatedApplication.remarks ?? "");

      toast.success("Application status updated successfully.");
    } catch (err) {
      const message = getErrorMessage(err);

      toast.error(message);
      console.error("Application status update failed:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2.5, md: 3 },
        bgcolor: "#f8fafc",
        minHeight: "100%",
      }}
    >
      {/* Page heading */}
      <Stack
        // direction={{ xs: "column", sm: "row" }}
        // justifyContent="space-between"
        // alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{
          mb: 3,
          direction: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#0f172a",
              fontSize: { xs: 24, sm: 30 },
              fontWeight: 800,
              letterSpacing: "-0.5px",
            }}
          >
            Applications
          </Typography>

          <Typography sx={{ mt: 0.5, color: "#64748b", fontSize: 14 }}>
            Review applications and manage their status.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
          onClick={() => void fetchApplications()}
          disabled={loading}
          sx={{
            alignSelf: { xs: "flex-start", sm: "center" },
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            borderColor: "#cbd5e1",
            color: "#334155",
          }}
        >
          Refresh
        </Button>
      </Stack>

      {/* Error display */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => void fetchApplications()}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Statistics cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(3, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <ApplicationStatCard
          title="Total Applications"
          value={stats.total}
          icon={<AssignmentOutlinedIcon />}
          color="#2563eb"
        />

        <ApplicationStatCard
          title="Pending"
          value={stats.pending}
          icon={<HourglassEmptyOutlinedIcon />}
          color="#d97706"
        />

        <ApplicationStatCard
          title="Under Review"
          value={stats.underReview}
          icon={<EditNoteOutlinedIcon />}
          color="#0284c7"
        />

        <ApplicationStatCard
          title="More Information Required"
          value={stats.moreInformationRequired}
          icon={<ChatBubbleOutlineIcon />}
          color="#7c3aed"
        />

        <ApplicationStatCard
          title="Approved"
          value={stats.approved}
          icon={<CheckCircleOutlineIcon />}
          color="#16a34a"
        />

        <ApplicationStatCard
          title="Rejected"
          value={stats.rejected}
          icon={<CancelOutlinedIcon />}
          color="#dc2626"
        />
      </Box>

      {/* Applications table */}
      {loading && applications.length === 0 ? (
        <Paper sx={cardSx}>
          <Stack
            // alignItems="center"
            // justifyContent="center"
            spacing={2}
            sx={{
              py: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />

            <Typography sx={{ color: "#64748b", fontSize: 14 }}>
              Loading applications...
            </Typography>
          </Stack>
        </Paper>
      ) : (
        <ApplicationTable
          applications={applications}
          filteredApplications={filteredApplications}
          paginatedApplications={paginatedApplications}
          loading={loading}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          onView={openDetails}
        />
      )}

      {/* Application details and review dialog */}
      <ApplicationDetailsDialog
        application={selectedApplication}
        editStatus={editStatus}
        editRemarks={editRemarks}
        saving={saving}
        onStatusChange={setEditStatus}
        onRemarksChange={setEditRemarks}
        onClose={closeDetails}
        onSave={handleSave}
      />
    </Box>
  );
}

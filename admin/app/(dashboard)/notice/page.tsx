"use client";

import { api } from "@/constant/api";
import {
  Add,
  ArticleOutlined,
  CampaignOutlined,
  CheckCircleOutlineOutlined,
  Close,
  EditOutlined,
  FilterList,
  Refresh,
  Search,
  VisibilityOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
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
import type { SelectChangeEvent } from "@mui/material/Select";
import React, { useCallback, useEffect, useState } from "react";

type NoticeStatus = "draft" | "published" | "withdrawn";
type NoticeType = "general" | "application";
type Audience = "panchayat" | "selected_citizens";

interface Notice {
  _id: string;
  title: string;
  description: string;
  category: string;
  noticeType: NoticeType;
  panchayatId?: string;
  audience: Audience;
  recipients?: string[];
  applicationId?: string;
  attachments?: string[];
  status: NoticeStatus;
  createdBy?: string;
  publishedAt?: string;
  expiresAt?: string;
  readBy?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface NoticeForm {
  title: string;
  description: string;
  category: string;
  noticeType: NoticeType;
  audience: Audience;
  recipients: string;
  applicationId: string;
  expiresAt: string;
  attachments: string;
}

const EMPTY_FORM: NoticeForm = {
  title: "",
  description: "",
  category: "General",
  noticeType: "general",
  audience: "panchayat",
  recipients: "",
  applicationId: "",
  expiresAt: "",
  attachments: "",
};

interface ApiResponse<T> {
  status: boolean;
  message?: string;
  data?: T;
}

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (
      error as {
        response?: {
          data?: { message?: string };
        };
      }
    ).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
};

const apiRequest = async <T,>(
  endpoint: string,
  method: "GET" | "POST" | "PATCH" = "GET",
  data?: unknown,
): Promise<ApiResponse<T>> => {
  const response =
    method === "POST"
      ? await api.post(endpoint, data)
      : method === "PATCH"
        ? await api.patch(endpoint, data)
        : await api.get(endpoint);

  const result = response.data as ApiResponse<T>;

  if (result?.status === false) {
    throw new Error(result.message || "Something went wrong.");
  }

  return result;
};

const formatDate = (date?: string) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  return Number.isNaN(parsedDate.getTime())
    ? "—"
    : parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const statusColor = (
  status: NoticeStatus,
): "default" | "success" | "warning" => {
  if (status === "published") return "success";
  if (status === "withdrawn") return "warning";
  return "default";
};

const Notice: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [form, setForm] = useState<NoticeForm>(EMPTY_FORM);

  const [confirmNotice, setConfirmNotice] = useState<{
    notice: Notice;
    action: "publish" | "withdraw";
  } | null>(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const showMessage = (
    message: string,
    severity: "success" | "error" = "success",
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  // GET notices
  const fetchNotices = useCallback(async () => {
    setLoading(true);

    try {
      const result = await apiRequest<Notice[]>("/notice");
      setNotices(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      showMessage(
        getErrorMessage(error) || "Failed to fetch notices.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchNotices();
  }, [fetchNotices]);

  const openCreateDialog = () => {
    setEditingNotice(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEditDialog = (notice: Notice) => {
    setEditingNotice(notice);

    setForm({
      title: notice.title || "",
      description: notice.description || "",
      category: notice.category || "General",
      noticeType: notice.noticeType || "general",
      audience: notice.audience || "panchayat",
      recipients: (notice.recipients || []).join(", "),
      applicationId: notice.applicationId || "",
      expiresAt: notice.expiresAt
        ? new Date(notice.expiresAt).toISOString().slice(0, 10)
        : "",
      attachments: (notice.attachments || []).join("\n"),
    });

    setFormOpen(true);
  };

  const updateForm = (field: keyof NoticeForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  // POST or PATCH notice
  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      showMessage("Title and description are required.", "error");
      return;
    }

    if (form.audience === "selected_citizens" && !form.recipients.trim()) {
      showMessage(
        "Enter at least one citizen ID for selected-citizen notices.",
        "error",
      );
      return;
    }

    if (form.noticeType === "application" && !form.applicationId.trim()) {
      showMessage(
        "Application ID is required for application notices.",
        "error",
      );
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      noticeType: form.noticeType,
      audience: form.audience,
      recipients:
        form.audience === "selected_citizens"
          ? form.recipients
              .split(",")
              .map((id) => id.trim())
              .filter(Boolean)
          : [],
      applicationId:
        form.noticeType === "application"
          ? form.applicationId.trim()
          : undefined,
      expiresAt: form.expiresAt
        ? new Date(`${form.expiresAt}T23:59:59`).toISOString()
        : undefined,
      attachments: form.attachments
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean),
    };

    setSaving(true);

    try {
      if (editingNotice) {
        await apiRequest<Notice>(
          `/notice/${editingNotice._id}`,
          "PATCH",
          payload,
        );

        showMessage("Notice updated successfully.");
      } else {
        await apiRequest<Notice>("/notice", "POST", payload);

        showMessage("Notice created successfully.");
      }

      setFormOpen(false);
      setEditingNotice(null);
      setForm(EMPTY_FORM);
      await fetchNotices();
    } catch (error) {
      showMessage(getErrorMessage(error) || "Failed to save notice.", "error");
    } finally {
      setSaving(false);
    }
  };

  // GET notice details
  const handleView = async (notice: Notice) => {
    try {
      const result = await apiRequest<Notice>(`/notice/${notice._id}`);
      setSelectedNotice(result.data || notice);
    } catch {
      setSelectedNotice(notice);
    }

    setViewOpen(true);
  };

  // Publish or withdraw notice
  const handleStatusChange = async () => {
    if (!confirmNotice) return;

    const { notice, action } = confirmNotice;
    setSaving(true);

    try {
      await apiRequest<Notice>(`/notice/${notice._id}/${action}`, "PATCH");

      showMessage(
        action === "publish"
          ? "Notice published successfully."
          : "Notice withdrawn successfully.",
      );

      setConfirmNotice(null);
      await fetchNotices();
    } catch (error) {
      showMessage(
        getErrorMessage(error) || `Failed to ${action} notice.`,
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const categories = Array.from(
    new Set(notices.map((notice) => notice.category).filter(Boolean)),
  );

  const filteredNotices = notices.filter((notice) => {
    const term = search.toLowerCase();

    const matchesSearch =
      notice.title?.toLowerCase().includes(term) ||
      notice.description?.toLowerCase().includes(term) ||
      notice.category?.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "all" || notice.status === statusFilter;

    const matchesCategory =
      categoryFilter === "all" || notice.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const publishedCount = notices.filter(
    (notice) => notice.status === "published",
  ).length;

  const draftCount = notices.filter(
    (notice) => notice.status === "draft",
  ).length;

  const withdrawnCount = notices.filter(
    (notice) => notice.status === "withdrawn",
  ).length;

  const inputSx = {
    "& .MuiOutlinedInput-root": { borderRadius: 2 },
  };

  const statCards = [
    {
      label: "Total notices",
      value: notices.length,
      icon: <ArticleOutlined />,
    },
    {
      label: "Published",
      value: publishedCount,
      icon: <CampaignOutlined />,
    },
    {
      label: "Drafts",
      value: draftCount,
      icon: <EditOutlined />,
    },
    {
      label: "Withdrawn",
      value: withdrawnCount,
      icon: <WarningAmberOutlined />,
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f7f8fc", minHeight: "100vh" }}>
      <Stack
        spacing={2}
        sx={{
          mb: 4,
          direction: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800 }}
            color="text.primary"
          >
            Notice Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Create, publish, and manage Gram Panchayat announcements.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => void fetchNotices()}
            disabled={loading}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openCreateDialog}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              boxShadow: "none",
            }}
          >
            Create Notice
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {statCards.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={stat.label}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, fontWeight: 800 }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "primary.50",
                    color: "primary.main",
                  }}
                >
                  {stat.icon}
                </Avatar>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "stretch", md: "center" },
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                All Notices
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredNotices.length} notice
                {filteredNotices.length !== 1 ? "s" : ""} found
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ minWidth: { md: 500 } }}
            >
              <TextField
                size="small"
                fullWidth
                placeholder="Search notices..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(0);
                }}
                sx={inputSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <Search sx={{ color: "text.secondary", mr: 1 }} />
                    ),
                  },
                }}
              />

              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(event: SelectChangeEvent) => {
                    setStatusFilter(event.target.value);
                    setPage(0);
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All statuses</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="withdrawn">Withdrawn</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(event: SelectChangeEvent) => {
                    setCategoryFilter(event.target.value);
                    setPage(0);
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Box>

        <Divider />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
            <CircularProgress />
          </Box>
        ) : filteredNotices.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8, px: 2 }}>
            <Avatar
              sx={{
                mx: "auto",
                mb: 2,
                bgcolor: "action.hover",
                color: "text.secondary",
                width: 56,
                height: 56,
              }}
            >
              <FilterList />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              No notices found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try changing your filters or create a new notice.
            </Typography>
            <Button
              startIcon={<Add />}
              onClick={openCreateDialog}
              sx={{ mt: 2, textTransform: "none" }}
            >
              Create your first notice
            </Button>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#fafbfe" }}>
                    <TableCell sx={{ fontWeight: 700 }}>Notice</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Audience</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredNotices
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((notice) => (
                      <TableRow
                        hover
                        key={notice._id}
                        sx={{ "&:last-child td": { borderBottom: 0 } }}
                      >
                        <TableCell sx={{ maxWidth: 320 }}>
                          <Typography sx={{ fontWeight: 700 }} noWrap>
                            {notice.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mt: 0.5,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {notice.description}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            size="small"
                            label={notice.category || "General"}
                            variant="outlined"
                          />
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2">
                            {notice.audience === "selected_citizens"
                              ? `Selected citizens (${notice.recipients?.length || 0})`
                              : "All citizens"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {notice.noticeType === "application"
                              ? "Application notice"
                              : "General notice"}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            size="small"
                            label={notice.status}
                            color={statusColor(notice.status)}
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(notice.createdAt || notice.publishedAt)}
                          </Typography>
                        </TableCell>

                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={0.25}
                            sx={{ justifyContent: "flex-end" }}
                          >
                            <Tooltip title="View details">
                              <IconButton
                                size="small"
                                onClick={() => void handleView(notice)}
                                aria-label="View notice"
                              >
                                <VisibilityOutlined fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            {notice.status !== "withdrawn" && (
                              <Tooltip title="Edit notice">
                                <IconButton
                                  size="small"
                                  onClick={() => openEditDialog(notice)}
                                  aria-label="Edit notice"
                                >
                                  <EditOutlined fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}

                            {notice.status === "draft" && (
                              <Tooltip title="Publish notice">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() =>
                                    setConfirmNotice({
                                      notice,
                                      action: "publish",
                                    })
                                  }
                                  aria-label="Publish notice"
                                >
                                  <CheckCircleOutlineOutlined fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}

                            {notice.status === "published" && (
                              <Tooltip title="Withdraw notice">
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={() =>
                                    setConfirmNotice({
                                      notice,
                                      action: "withdraw",
                                    })
                                  }
                                  aria-label="Withdraw notice"
                                >
                                  <WarningAmberOutlined fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredNotices.length}
              page={page}
              onPageChange={(_, nextPage) => setPage(nextPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(Number(event.target.value));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </>
        )}
      </Paper>

      <Dialog
        open={formOpen}
        onClose={() => {
          if (!saving) setFormOpen(false);
        }}
        fullWidth
        maxWidth="md"
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {editingNotice ? "Edit Notice" : "Create Notice"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fill in the notice information below.
              </Typography>
            </Box>
            <IconButton
              onClick={() => setFormOpen(false)}
              disabled={saving}
              aria-label="Close dialog"
            >
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Notice title"
                required
                fullWidth
                value={form.title}
                onChange={(event) => updateForm("title", event.target.value)}
                sx={inputSx}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Description"
                required
                multiline
                minRows={4}
                fullWidth
                value={form.description}
                onChange={(event) =>
                  updateForm("description", event.target.value)
                }
                sx={inputSx}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  value={form.category}
                  onChange={(event) =>
                    updateForm("category", event.target.value)
                  }
                  sx={{ borderRadius: 2 }}
                >
                  {[
                    "General",
                    "Announcement",
                    "Meeting",
                    "Scheme",
                    "Tax",
                    "Water Supply",
                    "Application Update",
                    "Other",
                  ].map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Notice type</InputLabel>
                <Select
                  label="Notice type"
                  value={form.noticeType}
                  onChange={(event) =>
                    updateForm("noticeType", event.target.value)
                  }
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="application">Application-related</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Audience</InputLabel>
                <Select
                  label="Audience"
                  value={form.audience}
                  onChange={(event) =>
                    updateForm("audience", event.target.value)
                  }
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="panchayat">
                    All citizens in the Panchayat
                  </MenuItem>
                  <MenuItem value="selected_citizens">
                    Selected citizens
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {form.audience === "selected_citizens" && (
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Citizen IDs"
                  required
                  fullWidth
                  value={form.recipients}
                  onChange={(event) =>
                    updateForm("recipients", event.target.value)
                  }
                  helperText="Enter citizen IDs separated by commas."
                  placeholder="ID001, ID002"
                  sx={inputSx}
                />
              </Grid>
            )}

            {form.noticeType === "application" && (
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Application ID"
                  required
                  fullWidth
                  value={form.applicationId}
                  onChange={(event) =>
                    updateForm("applicationId", event.target.value)
                  }
                  sx={inputSx}
                />
              </Grid>
            )}

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Expiry date"
                type="date"
                fullWidth
                value={form.expiresAt}
                onChange={(event) =>
                  updateForm("expiresAt", event.target.value)
                }
                slotProps={{ inputLabel: { shrink: true } }}
                sx={inputSx}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Attachment URLs"
                multiline
                minRows={2}
                fullWidth
                value={form.attachments}
                onChange={(event) =>
                  updateForm("attachments", event.target.value)
                }
                helperText="Optional. Enter one URL per line."
                sx={inputSx}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setFormOpen(false)}
            disabled={saving}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => void handleSave()}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={18} /> : undefined}
            sx={{ borderRadius: 2, textTransform: "none", boxShadow: "none" }}
          >
            {saving
              ? "Saving..."
              : editingNotice
                ? "Save Changes"
                : "Create Notice"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        fullWidth
        maxWidth="sm"
        sx={{ "& .MuiDialog-paper": { borderRadius: 3 } }}
      >
        <DialogTitle>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            Notice Details
            <IconButton onClick={() => setViewOpen(false)} aria-label="Close">
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          {selectedNotice && (
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {selectedNotice.title}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                sx={{ flexWrap: "wrap" }}
              >
                <Chip
                  label={selectedNotice.status}
                  color={statusColor(selectedNotice.status)}
                  size="small"
                />
                <Chip
                  label={selectedNotice.category}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={
                    selectedNotice.noticeType === "application"
                      ? "Application"
                      : "General"
                  }
                  size="small"
                  variant="outlined"
                />
              </Stack>

              <Typography
                variant="body2"
                sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
              >
                {selectedNotice.description}
              </Typography>

              <Divider />

              <Typography variant="body2">
                <strong>Audience:</strong>{" "}
                {selectedNotice.audience === "selected_citizens"
                  ? "Selected citizens"
                  : "All Panchayat citizens"}
              </Typography>

              {selectedNotice.applicationId && (
                <Typography variant="body2">
                  <strong>Application ID:</strong>{" "}
                  {selectedNotice.applicationId}
                </Typography>
              )}

              <Typography variant="body2">
                <strong>Created:</strong> {formatDate(selectedNotice.createdAt)}
              </Typography>

              <Typography variant="body2">
                <strong>Published:</strong>{" "}
                {formatDate(selectedNotice.publishedAt)}
              </Typography>

              <Typography variant="body2">
                <strong>Expires:</strong> {formatDate(selectedNotice.expiresAt)}
              </Typography>

              <Typography variant="body2">
                <strong>Read count:</strong>{" "}
                {selectedNotice.readBy?.length || 0}
              </Typography>

              {!!selectedNotice.attachments?.length && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 700 }}
                  >
                    Attachments
                  </Typography>
                  <Stack spacing={1}>
                    {selectedNotice.attachments.map((url, index) => (
                      <Typography
                        key={`${url}-${index}`}
                        component="a"
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="body2"
                        sx={{ overflowWrap: "anywhere" }}
                      >
                        Attachment {index + 1}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setViewOpen(false)}
            sx={{ textTransform: "none" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(confirmNotice)}
        onClose={() => !saving && setConfirmNotice(null)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {confirmNotice?.action === "publish"
            ? "Publish this notice?"
            : "Withdraw this notice?"}
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {confirmNotice?.action === "publish"
              ? "This notice will be published and made available to its intended audience."
              : "This notice will be withdrawn and should no longer be treated as an active announcement."}
          </Typography>

          {confirmNotice && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {confirmNotice.notice.title}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setConfirmNotice(null)}
            disabled={saving}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color={confirmNotice?.action === "withdraw" ? "warning" : "primary"}
            onClick={() => void handleStatusChange()}
            disabled={saving}
            sx={{ textTransform: "none", boxShadow: "none" }}
          >
            {saving
              ? "Please wait..."
              : confirmNotice?.action === "publish"
                ? "Publish"
                : "Withdraw"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((current) => ({ ...current, open: false }))
          }
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Notice;

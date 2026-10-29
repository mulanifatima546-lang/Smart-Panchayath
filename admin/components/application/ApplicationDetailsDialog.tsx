"use client";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";

import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import CloseIcon from "@mui/icons-material/Close";

import {
  APPLICATION_STATUSES,
  ApplicationItem,
  ApplicationStatus,
  fieldSx,
} from "./applicationTypes";

import {
  formatDate,
  getApplicantEmail,
  getApplicantName,
  getApplicantPhone,
  getRelatedName,
  normalizeStatus,
} from "./applicationUtils";

type Props = {
  application: ApplicationItem | null;
  editStatus: ApplicationStatus;
  editRemarks: string;
  saving: boolean;
  onStatusChange: (status: ApplicationStatus) => void;
  onRemarksChange: (remarks: string) => void;
  onClose: () => void;
  onSave: () => void;
};

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <Box
      sx={{
        p: 1.75,
        border: "1px solid #e2e8f0",
        borderRadius: 2,
        bgcolor: "#f8fafc",
        minWidth: 0,
      }}
    >
      <Typography
        sx={{ mb: 0.75, color: "#64748b", fontSize: 12, fontWeight: 700 }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          color: "#0f172a",
          fontSize: 14,
          fontWeight: 600,
          overflowWrap: "anywhere",
          whiteSpace: "pre-wrap",
        }}
      >
        {value?.trim() || "—"}
      </Typography>
    </Box>
  );
}

export default function ApplicationDetailsDialog({
  application,
  editStatus,
  editRemarks,
  saving,
  onStatusChange,
  onRemarksChange,
  onClose,
  onSave,
}: Props) {
  const details = application?.applicantDetails;
  const documents = application?.documents ?? [];

  return (
    <Dialog
      open={Boolean(application)}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      slotProps={{ paper: { sx: { borderRadius: 3, bgcolor: "#ffffff" } } }}
    >
      <DialogTitle sx={{ p: 2.5 }}>
        <Stack
          sx={{
            direction: "row",
            alignItems: "center",
          }}
          spacing={1.5}
        >
          <Avatar
            sx={{ bgcolor: "#eff6ff", color: "#2563eb", borderRadius: 2 }}
          >
            <AssignmentOutlinedIcon />
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}
            >
              Application Details
            </Typography>

            <Typography sx={{ mt: 0.3, fontSize: 12, color: "#64748b" }}>
              {application?.applicationNumber || application?._id}
            </Typography>
          </Box>

          <IconButton
            onClick={onClose}
            disabled={saving}
            aria-label="Close application details"
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        {application && (
          <Stack spacing={3}>
            <Box>
              <Typography
                sx={{
                  mb: 1.5,
                  color: "#0f172a",
                  fontSize: 14,
                  fontWeight: 800,
                }}
              >
                Applicant Information
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                  },
                  gap: 1.5,
                }}
              >
                <DetailItem
                  label="Applicant Name"
                  value={getApplicantName(application)}
                />
                <DetailItem
                  label="Email"
                  value={getApplicantEmail(application)}
                />
                <DetailItem
                  label="Phone"
                  value={getApplicantPhone(application)}
                />
                <DetailItem
                  label="Service Type"
                  value={application.serviceType}
                />
                <DetailItem
                  label="Panchayat"
                  value={getRelatedName(application.panchayat)}
                />
                <DetailItem
                  label="Submitted At"
                  value={formatDate(
                    application.submitedAt || application.createdAt,
                  )}
                />
                <DetailItem label="Address" value={details?.address} />
                <DetailItem
                  label="Current Status"
                  value={normalizeStatus(application.status)}
                />
              </Box>
            </Box>

            <Box>
              <Typography
                sx={{
                  mb: 1.5,
                  color: "#0f172a",
                  fontSize: 14,
                  fontWeight: 800,
                }}
              >
                Application Description
              </Typography>

              <Box
                sx={{
                  p: 2,
                  border: "1px solid #e2e8f0",
                  borderRadius: 2,
                  bgcolor: "#f8fafc",
                }}
              >
                <Typography
                  sx={{
                    color: "#475569",
                    fontSize: 13,
                    lineHeight: 1.8,
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                  }}
                >
                  {details?.description ||
                    details?.purpose ||
                    details?.message ||
                    "No description provided."}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography
                sx={{
                  mb: 1.5,
                  color: "#0f172a",
                  fontSize: 14,
                  fontWeight: 800,
                }}
              >
                Uploaded Documents ({documents.length})
              </Typography>

              {documents.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  No documents have been uploaded for this application.
                </Alert>
              ) : (
                <Stack spacing={1}>
                  {documents.map((document, index) => (
                    <Box
                      key={`${document.publicId || document.url || document.name || "document"}-${index}`}
                      sx={{
                        p: 1.5,
                        border: "1px solid #e2e8f0",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <DescriptionOutlinedIcon sx={{ color: "#64748b" }} />

                      <Typography
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          color: "#334155",
                          fontSize: 13,
                          fontWeight: 600,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {document.name || `Document ${index + 1}`}
                      </Typography>

                      {document.url && (
                        <Button
                          component="a"
                          href={document.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                          variant="outlined"
                          sx={{
                            borderRadius: 1.5,
                            textTransform: "none",
                            whiteSpace: "nowrap",
                          }}
                        >
                          View
                        </Button>
                      )}
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>

            <Divider />

            <Box>
              <Typography
                sx={{
                  mb: 1.5,
                  color: "#0f172a",
                  fontSize: 14,
                  fontWeight: 800,
                }}
              >
                Review Application
              </Typography>

              <Stack spacing={2}>
                <FormControl fullWidth size="small" sx={fieldSx}>
                  <Typography
                    component="label"
                    sx={{
                      mb: 0.75,
                      color: "#475569",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    Application Status
                  </Typography>

                  <Select
                    value={editStatus}
                    onChange={(event) =>
                      onStatusChange(normalizeStatus(event.target.value))
                    }
                    disabled={saving}
                  >
                    {APPLICATION_STATUSES.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Remarks"
                  value={editRemarks}
                  onChange={(event) => onRemarksChange(event.target.value)}
                  placeholder="Add review notes or instructions for the applicant..."
                  fullWidth
                  multiline
                  minRows={3}
                  disabled={saving}
                  sx={fieldSx}
                />

                {application.remarks && (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 0.5 }}>
                      Previously saved remarks
                    </Typography>
                    <Typography sx={{ fontSize: 13 }}>
                      {application.remarks}
                    </Typography>
                  </Alert>
                )}
              </Stack>
            </Box>
          </Stack>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2.5, gap: 1, flexWrap: "wrap" }}>
        <Button
          onClick={onClose}
          disabled={saving}
          sx={{
            px: 2.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            color: "#475569",
          }}
        >
          Close
        </Button>

        <Button
          onClick={onSave}
          disabled={saving || !application}
          variant="contained"
          startIcon={
            saving ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <EditNoteOutlinedIcon />
            )
          }
          sx={{
            px: 2.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            bgcolor: "#2563eb",
            boxShadow: "none",
            "&:hover": { bgcolor: "#1d4ed8", boxShadow: "none" },
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

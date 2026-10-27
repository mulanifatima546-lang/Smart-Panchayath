import { Avatar, Paper, Typography } from "@mui/material";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";

type Props = {
  total: number;
  districts: number;
  talukas: number;
};

export default function PanchayatStats({ total, districts, talukas }: Props) {
  const stats = [
    {
      title: "Total Panchayats",
      value: total,
      icon: <AccountBalanceOutlinedIcon />,
      color: "#2563eb",
      background: "#eff6ff",
    },
    {
      title: "Districts Covered",
      value: districts,
      icon: <LocationCityOutlinedIcon />,
      color: "#059669",
      background: "#ecfdf5",
    },
    {
      title: "Talukas Covered",
      value: talukas,
      icon: <MapOutlinedIcon />,
      color: "#7c3aed",
      background: "#f5f3ff",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <Paper
          key={stat.title}
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2.5,
            border: "1px solid #e2e8f0",
            borderRadius: 3,
          }}
        >
          <div>
            <Typography
              sx={{ color: "#64748b", fontSize: 13, fontWeight: 600 }}
            >
              {stat.title}
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "#0f172a",
                fontWeight: 800,
                fontSize: 29,
              }}
            >
              {stat.value}
            </Typography>
          </div>

          <Avatar
            variant="rounded"
            sx={{
              width: 52,
              height: 52,
              bgcolor: stat.background,
              color: stat.color,
              borderRadius: 2.5,
            }}
          >
            {stat.icon}
          </Avatar>
        </Paper>
      ))}
    </div>
  );
}

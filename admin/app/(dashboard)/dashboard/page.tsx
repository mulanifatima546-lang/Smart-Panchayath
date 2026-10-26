"use client";
import { useAdmin } from "@/context/admin.contex";
import { Card, CircularProgress, Typography } from "@mui/material";
import React from "react";

const Dashboard = () => {
  const { admin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex">
        <Card className="p-4">
          <Typography variant="h6">
            Welcome back, {admin?.name.split(" ")[0]}
          </Typography>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

"use client";

import { useEffect, useState } from "react";
import { TextField, MenuItem } from "@mui/material";
import type { LocationOption } from "./SelectState";

type SelectTalukaProps = {
  districtCode: string;
  value: string;
  onChange: (name: string, code: string) => void;
};

const API = "https://lgd-json-api.vercel.app/api";

export default function SelectTaluka({
  districtCode,
  value,
  onChange,
}: SelectTalukaProps) {
  const [talukas, setTalukas] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!districtCode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTalukas([]);
      return;
    }

    const controller = new AbortController();

    async function loadTalukas() {
      try {
        setLoading(true);
        setError("");
        setTalukas([]);

        const response = await fetch(
          `${API}/subdistricts?districtCode=${encodeURIComponent(districtCode)}`,
          { signal: controller.signal },
        );

        if (!response.ok) throw new Error("Unable to load talukas");

        const result = await response.json();
        setTalukas(result.data ?? []);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadTalukas();
    return () => controller.abort();
  }, [districtCode]);

  return (
    <TextField
      select
      fullWidth
      label="Taluka"
      value={value}
      disabled={!districtCode || loading}
      error={Boolean(error)}
      helperText={error || (loading ? "Loading talukas..." : "")}
      onChange={(e) => {
        const selected = talukas.find((item) => item.name === e.target.value);
        if (selected) onChange(selected.name, String(selected.code));
      }}
    >
      <MenuItem value="">Select a taluka</MenuItem>
      {talukas.map((item) => (
        <MenuItem key={item.code} value={item.name}>
          {item.name}
        </MenuItem>
      ))}
    </TextField>
  );
}

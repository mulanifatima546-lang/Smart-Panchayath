"use client";

import { useEffect, useState } from "react";
import { TextField, MenuItem } from "@mui/material";
import type { LocationOption } from "./SelectState";

type SelectDistrictProps = {
  stateCode: string;
  value: string;
  onChange: (name: string, code: string) => void;
};

const API = "https://lgd-json-api.vercel.app/api";

export default function SelectDistrict({
  stateCode,
  value,
  onChange,
}: SelectDistrictProps) {
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!stateCode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDistricts([]);
      return;
    }

    const controller = new AbortController();

    async function loadDistricts() {
      try {
        setLoading(true);
        setError("");
        setDistricts([]);

        const response = await fetch(
          `${API}/districts?stateCode=${encodeURIComponent(stateCode)}`,
          { signal: controller.signal },
        );

        if (!response.ok) throw new Error("Unable to load districts");

        const result = await response.json();
        setDistricts(result.data ?? []);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadDistricts();
    return () => controller.abort();
  }, [stateCode]);

  return (
    <TextField
      select
      fullWidth
      label="District"
      value={value}
      disabled={!stateCode || loading}
      error={Boolean(error)}
      helperText={error || (loading ? "Loading districts..." : "")}
      onChange={(e) => {
        const selected = districts.find((item) => item.name === e.target.value);
        if (selected) onChange(selected.name, String(selected.code));
      }}
    >
      <MenuItem value="">Select a district</MenuItem>
      {districts.map((item) => (
        <MenuItem key={item.code} value={item.name}>
          {item.name}
        </MenuItem>
      ))}
    </TextField>
  );
}

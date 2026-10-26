"use client";

import { useEffect, useState } from "react";
import { TextField, MenuItem } from "@mui/material";

export type LocationOption = {
  code: string | number;
  name: string;
};

type SelectStateProps = {
  value: string;
  onChange: (name: string, code: string) => void;
};

const API = "https://lgd-json-api.vercel.app/api";

export default function SelectState({ value, onChange }: SelectStateProps) {
  const [states, setStates] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadStates() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API}/states`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Unable to load states");

        const result = await response.json();
        setStates(result.data ?? []);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadStates();
    return () => controller.abort();
  }, []);

  return (
    <TextField
      select
      fullWidth
      label="State"
      value={value}
      disabled={loading}
      error={Boolean(error)}
      helperText={error || (loading ? "Loading states..." : "")}
      onChange={(e) => {
        const selected = states.find((item) => item.name === e.target.value);
        if (selected) onChange(selected.name, String(selected.code));
      }}
    >
      <MenuItem value="">Select a state</MenuItem>
      {states.map((item) => (
        <MenuItem key={item.code} value={item.name}>
          {item.name}
        </MenuItem>
      ))}
    </TextField>
  );
}

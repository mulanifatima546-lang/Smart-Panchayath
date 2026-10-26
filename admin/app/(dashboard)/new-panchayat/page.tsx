"use client";

import { useState } from "react";
import { Typography, TextField, Button, Box, Alert } from "@mui/material";

import SelectState from "@/components/SelectState";
import SelectDistrict from "@/components/SelectDistrict";
import SelectTaluka from "@/components/SelectTaluka";

import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { api } from "@/constant/api";
import { useRouter } from "next/navigation";

export default function NewPanchatat() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [state, setState] = useState("");
  const [stateCode, setStateCode] = useState("");

  const [district, setDistrict] = useState("");
  const [districtCode, setDistrictCode] = useState("");

  const [taluka, setTaluka] = useState("");
  const [talukaCode, setTalukaCode] = useState("");
  const [village, setVillage] = useState("");

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [sarpanch, setSarpanch] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (
      !name.trim() ||
      !address.trim() ||
      !contactNumber.trim() ||
      !email.trim() ||
      !sarpanch.trim() ||
      !state ||
      !district ||
      !taluka ||
      !village.trim()
    ) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/panchayat/create", {
        name,
        address,
        contactNumber,
        email,
        sarpanch,
        state,
        district,
        taluka,
        village,
      });

      console.log(data);

      if (data.status) {
        toast.success(data.message);
        router.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
      if (isAxiosError(error)) {
        const errMessage = error.response?.data.message;
        toast.error(errMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="max-w-2xl p-4">
      <Typography variant="h6" className="mb-6">
        New Panchayat
      </Typography>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <Box className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <TextField
          fullWidth
          label="Name of panchayat"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          fullWidth
          label="Address of panchayat"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <TextField
          fullWidth
          label="Contact No. of panchayat"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
        />

        <TextField
          fullWidth
          type="email"
          label="Email of panchayat"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Name of sarpanch"
          value={sarpanch}
          onChange={(e) => setSarpanch(e.target.value)}
        />

        <SelectState
          value={state}
          onChange={(name, code) => {
            setState(name);
            setStateCode(code);
            setDistrict("");
            setDistrictCode("");
            setTaluka("");
            setTalukaCode("");
            setVillage("");
          }}
        />

        <SelectDistrict
          stateCode={stateCode}
          value={district}
          onChange={(name, code) => {
            setDistrict(name);
            setDistrictCode(code);
            setTaluka("");
            setTalukaCode("");
            setVillage("");
          }}
        />

        <SelectTaluka
          districtCode={districtCode}
          value={taluka}
          onChange={(name, code) => {
            setTaluka(name);
            setTalukaCode(code);
            setVillage("");
          }}
        />

        <TextField
          fullWidth
          label="Village"
          value={village}
          disabled={!taluka}
          onChange={(e) => setVillage(e.target.value)}
          helperText={taluka ? "Enter village name" : "Select a taluka first"}
        />
      </Box>

      <Button
        variant="contained"
        disabled={loading}
        className="mt-2"
        onClick={handleSubmit}
      >
        {loading ? "Creating Panchayat..." : "Create Panchayat"}
      </Button>
    </Box>
  );
}

"use client";

import { useState } from "react";
import { states } from "@/constant/states";
import Image from "next/image";
import {
  Button,
  Card,
  InputLabel,
  Link,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import bg from "@/assets/images/SignUp.png";
import { isAxiosError } from "axios";
import { api } from "@/constant/api";
import toast from "react-hot-toast";
import { usePanchayat } from "@/context/panchayat.context";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [cityName, setCityName] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [panchayat, setPanchayat] = useState("");

  const { panchayats } = usePanchayat();

  const router = useRouter();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/sign-up", {
        name,
        username,
        email,
        password,
        address: {
          houseNo,
          street,
          pinCode,
          cityName,
          state: selectedState,
        },
        panchayat,
      });

      console.log(data);

      toast.success(data.message || "Account created successfully");
      router.push("/citizen");
    } catch (error) {
      console.log(error);
      if (isAxiosError(error)) {
        const errMessage = error.response?.data?.message || "An error occurred";
        toast.error(errMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <Card className="relative isolate w-[90%] flex flex-col md:flex-row gap-5 min-h-[90vh] overflow-hidden p-2 md:p-6">
        {/* <div className="absolute pointer-events-none top-0 left-0 bg-blue-500 w-80 h-80 blur-3xl opacity-25 -z-10" /> */}

        <div className="relative z-10 w-[40%] hidden md:flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Your Village.</h1>
          <h1 className="text-4xl font-bold">Connected.</h1>
          <p className="text-xl">
            Access panchayath services, submit applications, and track
            certificates - all in one unified digital window.
          </p>
          <Image src={bg} alt="Sign Up Background" />
        </div>

        <div className="relative z-10 w-full md:w-[60%] p-4 flex flex-col gap-3">
          <h1 className="md:text-4xl text-2xl font-bold">
            Create your account
          </h1>

          <div className="flex md:flex-row flex-col gap-3 mt-2 w-full justify-between">
            <TextField
              label="Name"
              variant="outlined"
              className="md:w-[48%]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Username"
              variant="outlined"
              className="md:w-[48%]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <TextField
            label="Email"
            type="email"
            variant="outlined"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            className="w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <InputLabel>Address</InputLabel>

          <div className="flex md:flex-row flex-col gap-4">
            <TextField
              type="number"
              label="House No."
              value={houseNo}
              onChange={(e) => setHouseNo(e.target.value)}
            />
            <TextField
              label="Street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
            <TextField
              label="Pin code"
              value={pinCode}
              type="number"
              onChange={(e) => setPinCode(e.target.value)}
            />
          </div>

          <div className="flex md:flex-row flex-col gap-4">
            <TextField
              label="City name"
              fullWidth
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
            />

            <TextField
              select
              fullWidth
              label="State"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              helperText="Please select your state"
            >
              {states.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Panchayat"
              value={panchayat}
              onChange={(e) => setPanchayat(e.target.value)}
              helperText="Please select your panchayat"
            >
              {panchayats.map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <Button
            variant="contained"
            type="button"
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create your account"}
          </Button>

          <Typography className="text-center">OR</Typography>

          <Typography className="text-center">
            Already have an Account? <Link href="/auth/sign-in">Sign In</Link>
          </Typography>
        </div>

        {/* <div className="absolute pointer-events-none bottom-0 right-0 bg-green-500 w-80 h-80 blur-3xl opacity-25 -z-10" /> */}
      </Card>
    </div>
  );
};

export default SignUp;

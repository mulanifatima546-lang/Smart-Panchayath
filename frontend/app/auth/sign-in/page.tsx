"use client";

import { Button, Card, Link, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

import bg from "@/assets/images/SignIn.png";
import { api } from "@/constant/api";
import { isAxiosError } from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);

    try {
      const { data } = await api.post("/auth/sign-in", {
        identifier,
        password,
      });

      toast.success(data.message || "Account created successfully");
      router.push("/citizen");
      console.log(data);
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
      <Card className="relative isolate w-[90%] flex flex-col md:flex-row gap-5 min-h-[90vh]  overflow-hidden p-4 md:p-6">
        {/* <div className="absolute pointer-events-none top-0 left-0 bg-blue-500 w-80 h-80 blur-3xl opacity-25 -z-10" /> */}

        <div className="relative z-10 w-full md:w-[40%] justify-center items-center flex flex-col gap-4">
          <h1 className="md:text-4xl text-2xl font-bold">
            Sign in to your account
          </h1>

          <TextField
            label="Email or Username"
            type="email"
            variant="outlined"
            className="w-full"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
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

          <Button
            variant="contained"
            fullWidth
            type="button"
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <Typography className="text-center">OR</Typography>

          <Typography className="text-center">
            Do not have an Account? <Link href="/auth/sign-up">Sign Up</Link>
          </Typography>
        </div>

        <div className="relative px-32 justify-center z-10 w-[60%] p-4 hidden md:flex flex-col gap-3">
          <h1 className="text-4xl font-bold">Your Village.</h1>
          <h1 className="text-4xl font-bold">Connected.</h1>
          <p className="text-xl text-center">
            Access panchayath services, submit applications, and track
            certificates - all in one unified digital window.
          </p>
          <Image src={bg} alt="Sign Up Background" />
        </div>

        {/* <div className="absolute pointer-events-none bottom-0 right-0 bg-green-500 w-80 h-80 blur-3xl opacity-25 -z-10" /> */}
      </Card>
    </div>
  );
};

export default SignIn;

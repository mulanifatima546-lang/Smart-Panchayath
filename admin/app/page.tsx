"use client";
import { api } from "@/constant/api";
import { Card, TextField, Typography, Button } from "@mui/material";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

const SignIn = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    setLoading(true);

    if (!identifier || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { data } = await api.post("/admin/sign-in", {
        identifier,
        password,
      });

      console.log(data);

      toast.success(data.message || "Signed in successfully");
      router.push("/dashboard");
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
    <div className="bg-gray-200 h-screen flex items-center justify-center">
      <Card className="p-6 flex flex-col gap-2 bg-white">
        <Typography variant="h6">Welcome back! Admin 👋</Typography>

        <TextField
          label="Email or Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <TextField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button disabled={loading} variant="contained" onClick={handleSignIn}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </Card>
    </div>
  );
};

export default SignIn;

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signin } from "@/auth";
import Swal from "sweetalert2";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    const user = await signin(username, password);
    if (user) {
      localStorage.setItem("token", user.data.data.token);
      localStorage.setItem("user", user.data.data.user);
      router.push("/dashboard");
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        timer: 1500,
        text: "Invalid phone number or password",
      });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center flex-col bg-black">
      <div className="bg-white h-1/2 flex flex-col items-center justify-center rounded-lg px-12 gap-y-4">
        <div className="text-black text-2xl font-bold">Tourify</div>
        <div>
          <Input
            placeholder="Phone Number"
            className="w-56"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <Input
            placeholder="Password"
            className="w-56"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Button className="w-56" onClick={login}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { TbLoader3 } from "react-icons/tb";
import { useAuth } from "@/app/context/authContext";
// import * as Yup from "yup";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [auth, setAuth] = useAuth();

  //   Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      return toast.error("Email is required!") + setLoading(false);
    }
    if (!password) {
      return toast.error("Password is required!") + setLoading(false);
    }
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/user/login-user`,
        { email, password }
      );
      if (data?.success) {
        localStorage.setItem("authUser", JSON.stringify(data));
        setAuth({ ...auth, user: data?.user, token: data?.token });
        router.push("/addRecord");
        toast.success("Login successfully!", { duration: 3000 });
        setLoading(false);
      } else {
        toast.error(data?.message, { duration: 3000 });
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error?.response?.data?.message, { duration: 3000 });
    }
  };
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-3">
      <div className="w-[30rem] py-6 px-2 sm:px-4 rounded-md shadow-md bg-gray-50 shadow-gray-300 flex flex-col gap-4">
        <h1
          className=" text-2xl sm:text-3xl font-bold text-center"
          style={{ textShadow: "-.5px 1px 0px #999" }}
        >
          Sign In
        </h1>
        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
          <div className="flex flex-col gap-1 w-full">
            <span className="font-medium">Email</span>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[2.8rem] px-3 rounded-md shadow-md outline-none border-2 border-gray-800"
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <span className="font-medium">Password</span>
            <div className="relative w-full">
              <span
                className="absolute top-2 right-2 cursor-pointer"
                onClick={() => setShow(!show)}
              >
                {show ? (
                  <AiOutlineEye className="h-7 w-7 text-gray-800 hover:text-gray-950 transition duration-150" />
                ) : (
                  <AiOutlineEyeInvisible className="h-7 w-7 text-gray-800 hover:text-gray-950 transition duration-150" />
                )}
              </span>
              <input
                type={show ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[2.8rem] px-3 rounded-md shadow-md outline-none border-2 border-gray-800"
              />
            </div>
          </div>
          <button
            className={`w-full flex items-center justify-center gap-1 rounded-3xl mt-4 h-[2.7rem] cursor-pointer shadow-md hover:shadow-xl hover:shadow-gray-300 transition duration-100 bg-sky-500 hover:bg-sky-600 text-white outline-none ${
              loading && "animate-pulse pointer-events-none"
            }`}
          >
            Sign In{" "}
            {loading && (
              <TbLoader3 className="h-5 w-5 text-white animate-spin" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

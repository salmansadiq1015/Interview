"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { BiLoaderCircle } from "react-icons/bi";

export default function Spinner() {
  const router = useRouter();
  return (
    <div className=" w-full min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-5">
        <BiLoaderCircle className=" h-9 sm:h-12 w-9 sm:w-12 animate-spin text-sky-500" />
        <h3 className="text-3xl font-semibold text-red-600">
          UnAuthorized User
        </h3>
        <button
          className="w-[8rem] flex items-center justify-center gap-1 rounded-3xl mt-4 h-[2.7rem] cursor-pointer shadow-md hover:shadow-xl hover:shadow-gray-300 transition duration-100 bg-sky-500 hover:bg-sky-600 text-white outline-none"
          onClick={() => router.push("/")}
        >
          Login
        </button>
      </div>
    </div>
  );
}

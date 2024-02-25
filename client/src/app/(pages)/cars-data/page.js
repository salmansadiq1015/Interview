"use client";
import AllCarsData from "@/app/components/AllCarsData";
import Spinner from "@/app/components/Spinner";
import { useAuth } from "@/app/context/authContext";

export default function AllCars() {
  const [auth] = useAuth();

  return auth?.token ? <AllCarsData /> : <Spinner />;
}

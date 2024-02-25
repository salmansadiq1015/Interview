"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

export default function AllCarsData() {
  const [cars, setCars] = useState([]);
  console.log("Image:", cars);

  // Get Data
  const carData = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/car/get-cards`
      );
      if (data?.success) {
        setCars(data?.carData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message, { duration: 2000 });
    }
  };

  useEffect(() => {
    carData();
  }, []);

  return (
    <div className="w-full min-h-screen py-6 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cars?.map((car, i) => (
          <div key={i} className="rounded-md shadow-md">
            {/* <Carousel>
              {car?.images?.map((img, index) => {
                const imageUrl = img?.imageURL.replace(/'/g, "");

                return (
                  <div
                    key={index}
                    className="relative w-full h-[10rem] object-fill border-b"
                  >
                    <img src={imageUrl} alt={`CarImage ${index}`} />
                  </div>
                );
              })}
            </Carousel> */}
            <div className="flex flex-col gap-2 py-3 px-3">
              <h3 className="text-xl font-medium text-black">
                <span className="font-semibold">Modle:</span>
                {car?.carModel}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

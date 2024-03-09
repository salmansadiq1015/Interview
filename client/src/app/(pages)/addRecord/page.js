"use client";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { FiUploadCloud } from "react-icons/fi";
import { TbLoader3 } from "react-icons/tb";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useAuth } from "@/app/context/authContext";
import Spinner from "@/app/components/Spinner";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
// import { FiChevronsRight } from "react-icons/fi";

export default function AddNewRecord() {
  const [carModel, setCarModel] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCopies, setSelectedCopies] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [auth, setAuth] = useAuth();
  const userId = auth?.user?.id;
  const router = useRouter();
  console.log("Auth User:", auth);

  //   <----------Validate User---------->
  if (!auth?.token) {
    return <Spinner />;
  }

  //   <-------------Field Data--------->
  const cities = ["Lahore", "Karachi", "Islamabad", "Fasilabad"];
  const numbers = ["Select", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

  //   <-----------------Convert Image Into URL----------------->
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files
      .slice(0, Math.min(selectedCopies, files.length))
      .map((file) => ({ imageURL: URL.createObjectURL(file) }));
    setImages(urls);
  };

  //   <-----------------Validation Schema---------------->

  const validationSchema = Yup.object().shape({
    carModel: Yup.string()
      .required("Car model is required!")
      .min(3, "Car mondel must be at least 3 characters"),
    price: Yup.number()
      .required("Price is required!")
      .positive("Price must be positive"),
    phone: Yup.string()
      .required("Phone number is required!")
      .min(11, "Phone number must be at least 11 characters!")
      .max(11, "Phone number must be 11 characters"),
    selectedCity: Yup.string().required("City is required!"),
    selectedCopies: Yup.number().required("Number of copies is required!"),
    images: Yup.array().min(1, "At least one image is required!"),
  });

  //   <------------------Handle Create Record------------------>
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      return toast.error("User Id is required!");
    }
    try {
      setLoading(true);
      await validationSchema.validate(
        { carModel, price, phone, selectedCity, selectedCopies, images },
        { abortEarly: false }
      );

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/car/create-card`,
        { userId: userId, carModel, price, phone, city: selectedCity, images }
      );
      if (data?.success) {
        toast.success("Car data added successfully!");
        setLoading(false);
        setCarModel("");
        setImages([]);
        setPhone("");
        setPrice("");
        setSelectedCity("");
        setSelectedCopies("");
      } else {
        toast.error(data?.message);
        setLoading(false);
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // Yup validation error, set errors state
        const yupErrors = {};
        error.inner.forEach((err) => {
          yupErrors[err.path] = err.message;
        });
        setErrors(yupErrors);
        setLoading(false);
      } else {
        console.log(error);
        toast.error(error?.response?.data?.message, { duration: 2000 });
        setLoading(false);
      }
    }
  };

  //   Handle Drop Image
  const handleDrop = (url) => {
    const newImages = images.filter((img) => img.imageURL !== url);
    setImages(newImages);
  };

  //   <------------------Handle Logout------------------>
  const handleLogout = () => {
    localStorage.removeItem("authUser");
    setAuth({ ...auth, user: null, token: "" });
    router.push("/");
    toast.success("Logout Successfully!");
  };
  return (
    <div className="w-full  py-8 px-2 sm:px-5 flex items-center justify-center">
      <div className="absolute top-3 right-3 cursor-pointer">
        <div className="flex items-center gap-6">
          <RiLogoutCircleLine
            className="w-6 h-6 text-sky-500 hover:text-sky-600 cursor-pointer"
            onClick={handleLogout}
          />
          {/* <FiChevronsRight
            className="w-6 h-6 text-sky-500 hover:text-sky-600 cursor-pointer"
            onClick={() => router.push("/cars-data")}
          /> */}
        </div>
      </div>
      <div className="w-[98%] sm:w-[80%] mt-[1.5rem] sm:mt-[.5rem] py-4 px-2 sm:px-4 rounded-md shadow-md border hover:shadow-md shadow-gray-200 flex flex-col gap-4">
        <h1 className="text-3xl sm:text-4xl font-semibold text-center ">
          Add New Car Model
        </h1>
        <form
          onSubmit={handleSubmit}
          className="w-full mt-4 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1 w-full">
            <span className="text-lg font-medium">
              Car Model <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              placeholder="Enter Car Model"
              autoFocus
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              className="w-full h-[2.8rem] px-3 rounded-md shadow-md outline-none border-2 border-gray-800"
            />
            {errors.carModel && (
              <span className="text-red-500">{errors.carModel}</span>
            )}
          </div>
          {/* Price */}
          <div className="flex flex-col gap-1 w-full">
            <span className="text-lg font-medium">
              Price <span className="text-red-500">*</span>
            </span>
            <input
              type="number"
              placeholder="Enter Car Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full h-[2.8rem] px-3 rounded-md shadow-md outline-none border-2 border-gray-800"
            />
            {errors.price && (
              <span className="text-red-500">{errors.price}</span>
            )}
          </div>
          {/* Phone Number */}
          <div className="flex flex-col gap-1 w-full">
            <span className="text-lg font-medium">
              Phone Number <span className="text-red-500">*</span>
            </span>
            <input
              type="number"
              placeholder="Enter Car Price"
              value={phone}
              onChange={(e) => {
                const inputValue = e.target.value.replace(/\D/g, "");
                if (inputValue.length <= 11) {
                  setPhone(inputValue);
                }
              }}
              className="w-full h-[2.8rem] px-3 rounded-md shadow-md outline-none border-2 border-gray-800"
            />
            {errors.phone && (
              <span className="text-red-500">{errors.phone}</span>
            )}
          </div>
          {/* City */}
          <div className="flex flex-col gap-1 w-full">
            <span className="text-lg font-medium">
              City <span className="text-red-500">*</span>
            </span>
            <div className="flex items-center flex-wrap gap-4  sm:gap-6 ml-3">
              {cities.map((city) => (
                <div key={city} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={city}
                    name="city"
                    value={city}
                    checked={selectedCity === city}
                    onChange={() => handleCityChange(city)}
                  />
                  <label htmlFor={city}>{city}</label>
                </div>
              ))}
            </div>
            {errors.selectedCity && (
              <span className="text-red-500">{errors.selectedCity}</span>
            )}
          </div>
          {/*  */}
          <div className="flex flex-col gap-1 w-full">
            <span className="text-lg font-medium">
              No. of Copies <span className="text-red-500">*</span>
            </span>
            <select
              value={selectedCopies}
              onChange={(e) => setSelectedCopies(e.target.value)}
              className="w-full h-[2.8rem] px-3 rounded-md shadow-md outline-none border-2 border-gray-800"
            >
              {numbers.map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
            {errors.selectedCopies && (
              <span className="text-red-500">{errors.selectedCopies}</span>
            )}
          </div>

          {/* Upload Image */}

          <div className="flex items-center flex-wrap gap-4">
            <input
              type="file"
              id="selectImage"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />

            <label
              htmlFor="selectImage"
              className="w-[6rem] h-[6rem] border rounded-md hover:shadow-xl shadow-gray-200 shadow-md cursor-pointer flex items-center justify-center flex-col gap-2"
            >
              <FiUploadCloud className="w-8 h-8 text-sky-500" />
              <span className="text-[13px] font-semibold">Add Image</span>
            </label>

            {images.map((img, index) => (
              <div
                key={index}
                className="relative w-[6rem] h-[6rem] overflow-hidden border shadow-gray-300 filter drop-shadow-md rounded-md shadow-md object-fill"
              >
                <div className="absolute top-[.1rem] right-[.1rem] z-40 cursor-pointer">
                  <IoMdCloseCircleOutline
                    className="h-5 w-5 text-sky-500 hover:text-red-500 "
                    onClick={() => handleDrop(img?.imageURL)}
                  />
                </div>
                <Image
                  src={img?.imageURL}
                  alt={`Image ${index + 1}`}
                  fill
                  className="w-full h-full"
                />
              </div>
            ))}
          </div>
          <button
            className={`w-full flex items-center justify-center gap-1 rounded-3xl mt-4 h-[2.7rem] cursor-pointer shadow-md hover:shadow-xl hover:shadow-gray-300 transition duration-100 bg-sky-500 hover:bg-sky-600 text-white outline-none ${
              loading && "animate-pulse pointer-events-none"
            }`}
          >
            Add Car{" "}
            {loading && (
              <TbLoader3 className="h-5 w-5 text-white animate-spin" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

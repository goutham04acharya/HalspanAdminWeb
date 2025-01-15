import React from "react";
import { Link } from "react-router-dom"; // Use react-router-dom's Link
import Button from "../../Components/Button/button"; // Adjust the import path if needed
import Layout from "../Layout";

export default function NotFound() {
  return (
      <><Layout />
          <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
          <div className="text-center">
               <div className="relative mb-4 text-[120px] font-bold text-gray-900 md:text-[180px]">
                <img src="/Images/notfound.svg" alt="" width="250" height="250" />
          </div>
                  {/* <span className="absolute right-[-12px] top-[-6px] h-6 w-6 rounded-full bg-red-500 md:right-[-16px] md:top-[-8px] md:h-8 md:w-8" /> */}
              </div>
              <h1 className="mb-8 text-lg text-gray-600">
                  Oops! The page you&apos;re looking for doesn&apos;t exist.
              </h1>
              <button 
                className="bg-gray-900 font-bold text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                 onClick={() => window.history.back()}
                >
                Go Back
                </button>
  

          </div>
      </>
  );
}

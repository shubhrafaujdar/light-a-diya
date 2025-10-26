"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SpiritualLanding: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Trigger entrance animation after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    setIsEntering(true);
    // Navigate to main content after animation
    setTimeout(() => {
      router.push("/aartis");
    }, 800);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ height: '100vh', minHeight: '100dvh' }}>
      {/* Divine Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/landing/landing.png"
          alt="Divine spiritual background"
          fill
          className="w-full h-full object-cover object-[30%_30%] sm:object-center md:object-center"
          priority
          quality={90}
          sizes="100vw"
        />
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-6 md:px-8 text-center min-h-screen">
        {/* Spiritual Title */}
        <div
          className={`transform transition-all duration-1000 ease-out ${isLoaded
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
            }`}
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-wide">
            <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-400 bg-clip-text text-transparent devanagari">
              धर्म
            </span>
            <span className="text-white ml-2">Dharma</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
            Enter the sacred realm of devotion, prayers, and spiritual connection
          </p>
        </div>

        {/* Enter Button */}
        <div
          className={`transform transition-all duration-1000 ease-out delay-300 ${isLoaded
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-8 opacity-0 scale-95"
            }`}
        >
          <button
            onClick={handleEnter}
            disabled={isEntering}
            className={`
              group relative px-8 py-3 sm:px-12 sm:py-4 md:px-16 md:py-5 
              bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500
              text-white font-semibold text-base sm:text-lg md:text-xl
              rounded-full shadow-2xl
              transform transition-all duration-300 ease-out
              hover:scale-105 hover:shadow-3xl
              focus:outline-none focus:ring-4 focus:ring-yellow-400/50
              disabled:opacity-70 disabled:cursor-not-allowed
              active:scale-95
              ${isEntering ? "animate-pulse" : ""}
            `}
          >
            {/* Button Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl" />

            {/* Button Content */}
            <span className="relative z-10 flex items-center justify-center">
              {isEntering ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entering...
                </>
              ) : (
                <>
                  Enter Sacred Space
                  <svg
                    className="ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </span>
          </button>
        </div>

        {/* Floating Spiritual Elements - Hidden on small mobile for better readability */}
        <div className="absolute inset-0 pointer-events-none hidden sm:block">
          {/* Floating Om Symbol */}
          <div
            className={`absolute top-1/4 left-1/4 transform transition-all duration-2000 ease-out delay-500 ${isLoaded
              ? "translate-y-0 opacity-30"
              : "translate-y-4 opacity-0"
              }`}
          >
            <div className="text-4xl sm:text-5xl md:text-6xl text-yellow-300/30 animate-pulse">ॐ</div>
          </div>

          {/* Floating Lotus */}
          <div
            className={`absolute top-1/3 right-1/4 transform transition-all duration-2000 ease-out delay-700 ${isLoaded
              ? "translate-y-0 opacity-20"
              : "translate-y-4 opacity-0"
              }`}
          >
            <div className="text-3xl sm:text-4xl text-orange-300/30 animate-bounce">🪷</div>
          </div>
        </div>
      </div>

      {/* Subtle Particle Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-300/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SpiritualLanding;
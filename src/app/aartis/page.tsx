import React from "react";

export default function AartisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-spiritual-primary mb-4">
            आरती संग्रह
          </h1>
          <h2 className="text-2xl md:text-3xl text-spiritual-primary-light mb-6">
            Aarti Sangrah
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to our collection of sacred aartis and devotional songs. 
            Choose your preferred deity to begin your spiritual journey.
          </p>
        </div>
        
        {/* Placeholder content - will be implemented in future tasks */}
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🙏</div>
          <p className="text-xl text-gray-500">
            Aarti collection coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
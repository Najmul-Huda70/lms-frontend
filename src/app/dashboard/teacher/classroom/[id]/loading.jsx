import React from "react";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto p-6 animate-pulse">
      {/* Header Skeleton */}
      {/* <div className="flex flex-col items-center mb-10 space-y-4">
        <div className="h-10 bg-gray-800 rounded-lg w-1/3"></div>
        <div className="h-4 bg-gray-800 rounded w-1/4"></div>
      </div> */}

      {/* Action Bar Skeleton (Search & Buttons) */}
      <div className="flex justify-between items-center mb-8 gap-4">
        <div className="h-12 bg-gray-800 rounded-xl grow max-w-2xl"></div>
        <div className="flex gap-3">
          <div className="h-12 w-24 bg-gray-800 rounded-xl"></div>
          <div className="h-12 w-36 bg-gray-800 rounded-xl"></div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Feed (Post Cards) Skeleton */}
        <div className="grow space-y-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-[#0D1117] border border-gray-800 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gray-800"></div>
                <div className="space-y-2 flex-1">
                  {/* Name & Badge */}
                  <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                  {/* Meta info */}
                  <div className="h-3 bg-gray-800 rounded w-1/3"></div>
                </div>
              </div>
              {/* Text lines */}
              <div className="space-y-3 mb-6">
                <div className="h-4 bg-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gray-800 rounded w-5/6"></div>
              </div>
              {/* Document/Image placeholder */}
              <div className="h-20 bg-gray-800/50 rounded-xl border border-gray-800 w-full"></div>
            </div>
          ))}
        </div>

        {/* Sidebar (Upcoming) Skeleton */}
        <div className="hidden lg:block w-80">
          <div className="bg-[#0D1117] border border-gray-800 rounded-2xl p-6 sticky top-24">
            <div className="h-6 bg-gray-800 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-full mb-6"></div>
            <div className="h-4 bg-gray-800 rounded w-1/3 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
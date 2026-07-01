"use client";
import React, { useState } from "react";
import fileData from "../../../../data/file.json";
import Link from "next/link";
import Image from "next/image";
import {
  MoreVertical,
  Clock,
  Calendar,
  FileText,
  Download,
} from "lucide-react";

export default function File() {
  const [open, setOpen] = useState(false);
  const [Value, setValue] = useState("");
  const [filters, setFilters] = useState({
    year: "All",
    semester: "All",
    type: "All",
  });

  const HandleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFilterBtn = () => {
    setOpen(!open);
    HandleFilterChange("year", "All");
    HandleFilterChange("semester", "All");
    HandleFilterChange("type", "All");
  };

  return (
    <div className="m-5 p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center my-5 gap-4">
        <div className="w-full flex items-center h-11 text-lg bg-[#0f172a] text-[#d1d5db] rounded-lg shadow-md overflow-hidden px-2">
          <input
            type="text"
            name="search"
            defaultValue={Value}
            autoComplete="off"
            onChange={(e) => setValue(e.target.value)}
            id="input"
            placeholder="Search course id , title..."
            className="w-full h-full outline-none text-lg px-2 caret-blue-500"
          />
          <label htmlFor="input" className="px-2 cursor-text">
            <svg viewBox="0 0 512 512" className="w-3 fill-gray-500">
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
          </label>
          <div className="h-4/5 w-0.5 bg-gray-800"></div>
          <button className="p-3 m-1 h-full rounded-md hover:bg-gray-800 transition">
            <svg viewBox="0 0 384 512" className="w-3 fill-blue-500">
              <path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-24 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z" />
            </svg>
          </button>
        </div>
        <div className="w-30">
          <button
            onClick={handleFilterBtn}
            className="
              px-6 py-1 rounded-lg min-h-[2.4em] min-w-[3em]
              flex items-center gap-2
              text-[18px] font-bold tracking-wide leading-none text-white/90
              bg-[linear-gradient(140deg,#0f172a_0%,#1e293b_50%,rgba(15,23,42,0.7)_100%)]
              shadow-[inset_0.4px_1px_4px_rgba(128,128,128,0.8)]
              transition-all duration-100 ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:scale-110
              hover:shadow-[inset_0.4px_1px_4px_rgba(128,128,128,1),2px_4px_8px_rgba(0,0,0,0.3)] hover:text-white
              hover:[text-shadow:0_0_10px_rgba(255,255,255,0.4)]
              active:scale-100 active:tracking-widest active:text-white
              active:shadow-[inset_0.4px_1px_8px_rgba(128,128,128,1),0_0_8px_rgba(96,165,250,0.6)] active:[text-shadow:0_0_20px_rgba(255,255,255,1)]
            "
          >
            Filter
          </button>
        </div>
      </div>
      
      <div
        className={`${open ? "flex" : "hidden"} flex-col gap-6 my-8 items-center transition-all duration-300`}
      >
        {/* Year Filter Pills */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Year
          </span>
          <div className="flex bg-[#0f172a] p-1 rounded-full border border-gray-800 shadow-lg">
            {["All", "1st", "2nd", "3rd", "4th"].map((year) => (
              <button
                key={year}
                onClick={() => HandleFilterChange("year", year)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 
                  ${
                    year === filters.year
                      ? "bg-[#0A66C2] text-white shadow-[0_0_15px_rgba(10,102,194,0.4)]"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
              >
                {year === "All" ? "All Years" : `${year} Year`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-12">
          {/* Semester Pills */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Semester
            </span>
            <div className="flex bg-[#0f172a] p-1 rounded-full border border-gray-800">
              {["All", "1st", "2nd"].map((sem) => (
                <button
                  key={sem}
                  onClick={() => HandleFilterChange("semester", sem)}
                  className={`px-5 py-2 rounded-full text-sm font-medium text-gray-400 hover:text-white transition-all ${
                    sem === filters.semester
                      ? "bg-[#0A66C2] text-white shadow-[0_0_15px_rgba(10,102,194,0.4)]"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {sem === "All" ? "All" : `${sem} Sem`}
                </button>
              ))}
            </div>
          </div>

          {/* Course Type Pills */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Type
            </span>
            <div className="flex bg-[#0f172a] p-1 rounded-full border border-gray-800">
              {["All", "Theory", "Lab"].map((type) => (
                <button
                  key={type}
                  onClick={() => HandleFilterChange("type", type)}
                  className={`px-5 py-2 rounded-full text-sm font-medium text-gray-400 hover:text-white transition-all ${
                    type === filters.type
                      ? "bg-[#0A66C2] text-white shadow-[0_0_15px_rgba(10,102,194,0.4)]"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid grid-cols-2 justify-center gap-5">
        {fileData.length ? (
          fileData.map((file, index) => {
            return (
              <div
                key={index}
                className="group relative w-full p-4 pb-15 rounded-xl bg-[#0f172a] text-white overflow-hidden 
                  shadow-[inset_0_-16px_24px_rgba(255,255,255,0.15)]"
              >
                <h2 className="text-lg font-bold mb-5 text-center text-cyan-400 hover:underline cursor-pointer">
                  {file.title}
                </h2>

                {/* Post Document */}
                {file.attachments && file.attachments.hasFile && (
                  <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 flex items-center justify-between group hover:bg-gray-800/60 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-red-500/10 p-3 rounded-lg text-red-500">
                        <FileText size={24} />
                      </div>
                      <div className="max-w-37.5 md:max-w-xs">
                        <p className="text-sm font-semibold text-gray-200 truncate">
                          {file.attachments.fileName?.split("/").pop()}
                        </p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">
                          PDF • {file.attachments.fileSize}
                        </p>
                      </div>
                    </div>
                    <a
                      href={file.attachments.fileUrl}
                      className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-all"
                    >
                      <Download size={18} />
                    </a>
                  </div>
                )}
                
                <div className="absolute w-[95%] mx-auto bottom-2">
                  <div className="w-full h-0.5 bg-gray-700 my-1"></div>

                  <div className="flex gap-10 justify-between items-center text-sm">
                    <span>
                      <span className="text-green-400">Lecture:</span>{" "}
                      {file.lecture}
                    </span>
                    <span>
                      <span className="text-yellow-400">Chapter:</span>{" "}
                      {file.chapter}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-gray-400 font-semibold text-center col-span-full">
            No Course Available
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Mic, SlidersHorizontal, Book, GitBranch,
  Users, Folder, MoreVertical, Calendar, BookOpen,
  Tag, RefreshCw, ChevronLeft, ChevronRight,
  GraduationCap, Sparkles, CircleCheck, CirclePlay
} from "lucide-react";
import Link from "next/link";
import CourseAdd from "./CourseAdd";
import {fetchPrerequisites} from "@/lib/data"

const COURSES_PER_PAGE = 8;

// ── Animations ──────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" }
  }),
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

const filterVariants = {
  hidden: { opacity: 0, height: 0, marginBottom: 0 },
  show: { opacity: 1, height: "auto", marginBottom: 12, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.25, ease: "easeIn" } },
};

const typeColor = {
  Theory: { bg: "bg-indigo-500/10", text: "text-indigo-300", border: "border-indigo-500/30" },
  Lab:    { bg: "bg-emerald-500/10", text: "text-emerald-300", border: "border-emerald-500/30" },
};

// Status pill colors
function StatusPill({ active, status, onClick }) {
  const isRunning = status === "Running";
  const activeStyle = isRunning
    ? "bg-emerald-600 text-white border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
    : "bg-slate-600 text-white border-slate-500 shadow-[0_0_10px_rgba(100,116,139,0.3)]";
  const inactiveStyle = isRunning
    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
    : "bg-slate-500/10 text-slate-400 border-slate-500/30 hover:bg-slate-500/20";
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium transition-all duration-200 border
        ${active ? activeStyle : inactiveStyle}`}
    >
      {isRunning
        ? <CirclePlay size={11} />
        : <CircleCheck size={11} />}
      {status}
    </motion.button>
  );
}

// ── Empty State ──────────────────────────────────────────────
function EmptyState({ hasFilters, onReset }) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-32 text-center"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="relative mb-6"
      >
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
          <GraduationCap size={44} className="text-indigo-400" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles size={18} className="text-cyan-400" />
        </motion.div>
      </motion.div>

      {hasFilters ? (
        <>
          <p className="text-lg font-semibold text-slate-300 mb-1">No courses match your filters</p>
          <p className="text-sm text-slate-500 mb-5">Try widening your search or adjusting the filters</p>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-sm hover:bg-indigo-600/30 transition-colors"
          >
            <RefreshCw size={14} /> Clear filters
          </button>
        </>
      ) : (
        <>
          <p className="text-lg font-semibold text-slate-300 mb-1">No courses assigned yet</p>
          <p className="text-sm text-slate-500 mb-5">
            You haven&apos;t been assigned to teach any courses.<br />
            Contact your department coordinator or add a course.
          </p>
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0d1630] border border-[#1e2a45] text-slate-500 text-xs">
            <GraduationCap size={13} /> Waiting for course assignment
          </div>
        </>
      )}
    </motion.div>
  );
}

// ── Course Card ──────────────────────────────────────────────
function CourseCard({ course, index }) {
  const tc = typeColor[course.type] || typeColor.Theory;
  const courseSlug = course.courseCode;
  const [pre,setPre]=useState([]);
  useEffect(()=>{
    if(!courseSlug) return;
       const resolve=async()=>{
          try{
            const data =await fetchPrerequisites(courseSlug);
            setPre(data);
          }
          catch (err) {
          console.error("Failed to resolve prerequisites:", err);
        } 
       
       }
       resolve();
    
  },[courseSlug]);
  // console.log('classroom prerequisites: ',pre);
  return (
    <motion.div
      layout
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      exit="exit"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col bg-[#0d1630] border border-[#1e2a45] rounded-2xl overflow-hidden"
    >
      <div className="h-[3px] w-full bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-indigo-400 tracking-wider mb-1">
              {course.courseCode}
            </p>
            <Link
              href={`/dashboard/teacher/classroom/${courseSlug}`}
              className="block text-sm font-bold text-white leading-snug line-clamp-2 hover:text-cyan-300 transition-colors duration-200 cursor-pointer"
            >
              {course.title}
            </Link>
          </div>
          <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tc.bg} ${tc.text} ${tc.border}`}>
            {course.type || "Theory"}
          </span>
        </div>

        <div className="h-px bg-[#1e2a45]" />

        {/* Meta */}
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-2 text-xs">
            <Book size={12} className="text-indigo-400 shrink-0" />
            <span className="text-slate-400">Credits:</span>
            <span className="text-white font-semibold">{course.credits ?? "—"}</span>
            {course.section && (
              <>
                <span className="ml-auto text-slate-500">|</span>
                <GitBranch size={12} className="text-slate-500 shrink-0" />
                <span className="text-slate-400">Section:</span>
                <span className="text-white font-semibold">{course.section}</span>
              </>
            )}
          </div>
        </div>
        {/* Prerequisites Section */}
<div className="flex flex-wrap items-center gap-1 text-xs mt-1">
  <span className="text-slate-500 mr-1">Prereqs:</span>
  {pre ? (
    pre.map((req,index) => (
      <span key={req?.preCourseCode || index} className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-mono">
        {req?.preCourseCode}
      </span>
    ))
  ) : (
    <span className="text-slate-600 text-[11px]">N/A</span>
  )}
</div>
        {/* Footer */}
        <div className="border-t border-[#1e2a45] pt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Calendar size={11} className="text-slate-600" />
            <span className="text-[11px] text-slate-500">
              {course.runningYear ? `${course.runningYear} Year · ` : ""}
              {course.runningSemester ? `${course.runningSemester} Sem` : course.session || "—"}
            </span>
          </div>
          <div className="flex gap-3">
            {[
              { Icon: Users, label: "Students" },
              { Icon: Folder, label: "Files" },
              { Icon: MoreVertical, label: "More" },
            ].map(({ Icon, label }) => (
              <button
                key={label}
                aria-label={label}
                className="text-slate-600 hover:text-slate-300 transition-colors duration-150"
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Pill Button ──────────────────────────────────────────────
function Pill({ active, onClick, children }) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all duration-200 border
        ${active
          ? "bg-indigo-600 text-white border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]"
          : "bg-[#1a2138] text-slate-400 border-transparent hover:text-white hover:border-slate-600"
        }`}
    >
      {children}
    </motion.button>
  );
}

// ── Skeleton Card ────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 p-4 bg-[#0d1630] border border-[#1e2a45] rounded-2xl animate-pulse">
      <div className="h-3 w-20 bg-[#1e2a45] rounded-full" />
      <div className="h-4 w-full bg-[#1e2a45] rounded-full" />
      <div className="h-px bg-[#1e2a45]" />
      <div className="h-3 w-3/4 bg-[#1e2a45] rounded-full" />
      <div className="h-3 w-1/2 bg-[#1e2a45] rounded-full" />
      <div className="border-t border-[#1e2a45] pt-3 flex justify-between">
        <div className="h-3 w-24 bg-[#1e2a45] rounded-full" />
        <div className="h-3 w-16 bg-[#1e2a45] rounded-full" />
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function Classroom({ courses = [], loading = false }) {

  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selYear, setSelYear] = useState("All");
  const [selSem, setSelSem] = useState("All");
  const [selType, setSelType] = useState("All");
  const [selStatus, setSelStatus] = useState("Running"); 
  const [currentPage, setCurrentPage] = useState(1);

  // ── Detect running session from data ──────────────────────
  // Find the most common runningYear + runningSemester combo (the "current" session)
  const runningSession = useMemo(() => {
    if (!courses.length) return { year: null, semester: null };
    const freq = {};
    courses.forEach(c => {
      const key = `${c.runningYear}__${c.runningSemester}`;
      freq[key] = (freq[key] || 0) + 1;
    });
    const topKey = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0];
    const [year, semester] = topKey?.split("__") ?? [null, null];
    return { year, semester };
  }, [courses]);

  // ── Status helper ─────────────────────────────────────────
  // A course is "Running" if its session matches the running session
  const isRunning = (c) =>
    c.runningYear === runningSession.year &&
    c.runningSemester === runningSession.semester;

  // ── Filter logic ──────────────────────────────────────────
  // "showFilter" closed → default = running session only
  // "showFilter" open   → user controls all filters
  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return courses.filter(c => {
      const matchQ = !q ||
        (c.title || "").toLowerCase().includes(q) ||
        (c.courseCode || "").toLowerCase().includes(q);

      // When filter panel is closed → show only running session
      if (!showFilter) {
        const matchRunning =
          (!runningSession.year     || c.runningYear === runningSession.year) &&
          (!runningSession.semester || c.runningSemester === runningSession.semester);
        return matchQ && matchRunning;
      }

      // When filter panel is open → respect all pills
      const matchY = selYear === "All" || c.runningYear === selYear;
      const matchS = selSem  === "All" || c.runningSemester === selSem;
      const matchT = selType === "All" || (c.type || "Theory") === selType;
      const matchStatus =
        selStatus === "All"
          ? true
          : selStatus === "Running"
          ? isRunning(c)
          : !isRunning(c);
      return matchQ && matchY && matchS && matchT && matchStatus;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses, search, showFilter, selYear, selSem, selType, selStatus, runningSession]);

  const totalPages = Math.ceil(filtered.length / COURSES_PER_PAGE);
  const paginated  = filtered.slice((currentPage - 1) * COURSES_PER_PAGE, currentPage * COURSES_PER_PAGE);

  const setFilter = (setter) => (val) => { setter(val); setCurrentPage(1); };

  const resetFilters = () => {
    setSelYear("All"); setSelSem("All"); setSelType("All"); setSelStatus("Running"); setCurrentPage(1);
  };

  // Close filter panel → reset pills + go back to running default
  const handleToggleFilter = () => {
    setShowFilter(prev => {
      if (prev) resetFilters(); // closing → reset
      return !prev;
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = selYear !== "All" || selSem !== "All" || selType !== "All" || selStatus !== "All" || search;

  const activeTags = [
    !showFilter && runningSession.year && { label: `Running: ${runningSession.year} Year · ${runningSession.semester} Sem`, Icon: Sparkles },
    showFilter  && selStatus !== "All" && { label: selStatus, Icon: selStatus === "Running" ? CirclePlay : CircleCheck },
    showFilter  && selYear   !== "All" && { label: `${selYear} Year`, Icon: Calendar },
    showFilter  && selSem    !== "All" && { label: `${selSem} Sem`,   Icon: BookOpen },
    showFilter  && selType   !== "All" && { label: selType,           Icon: Tag },
  ].filter(Boolean);

  // Unique year/sem values for filter pills
  const years = ["All", ...new Set(courses.map(c => c.runningYear).filter(Boolean))];
  const sems  = ["All", ...new Set(courses.map(c => c.runningSemester).filter(Boolean))];

  return (
    <div className="min-h-screen bg-[#080d1a] text-white pb-16">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center pt-14 pb-8 px-6 mt-20"
      >
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2 tracking-tight">
          My Classroom
        </h1>
        <p className="text-slate-500 text-base">
          Manage and access your assigned courses
        </p>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="max-w-6xl mx-auto px-6 mb-3"
      >
        <div className="flex gap-3 mb-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search course code, title..."
              className="w-full bg-[#0f1629] border border-[#1e2a45] focus:border-indigo-500 rounded-xl py-3 pl-10 pr-10 text-white text-sm outline-none transition-colors duration-200 placeholder:text-slate-600"
            />
            <Mic size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cyan-400 cursor-pointer hover:text-cyan-300 transition-colors" />
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleToggleFilter}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all duration-200
              ${showFilter
                ? "border-indigo-500 bg-indigo-500/15 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                : "border-[#1e2a45] bg-[#0f1629] text-white hover:border-indigo-500/60"
              }`}
          >
            <SlidersHorizontal size={15} />
            Filter
          </motion.button>

          <CourseAdd />
        </div>

        {/* Filter panel — only visible when open */}
        <AnimatePresence>
          {showFilter && (
            <motion.div
              variants={filterVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="overflow-hidden"
            >
              <div className="bg-[#0d1630] border border-[#1e2a45] rounded-2xl p-5">
                <div className="flex flex-wrap gap-x-8 gap-y-4">

                  {/* Status */}
                  <div>
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-2">Status</p>
                    <div className="flex gap-2">
                      {["All", "Running", "Completed"].map(s => (
                        s === "All"
                          ? <Pill key={s} active={selStatus === "All"} onClick={() => setFilter(setSelStatus)("All")}>All</Pill>
                          : <StatusPill key={s} status={s} active={selStatus === s} onClick={() => setFilter(setSelStatus)(s)} />
                      ))}
                    </div>
                  </div>

                  {/* Year */}
                  <div>
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-2">Year</p>
                    <div className="flex gap-2 flex-wrap">
                      {["All", "1st", "2nd", "3rd", "4th"].map(y => (
                        <Pill key={y} active={selYear === y} onClick={() => setFilter(setSelYear)(y)}>
                          {y === "All" ? "All years" : `${y} year`}
                        </Pill>
                      ))}
                    </div>
                  </div>

                  {/* Semester */}
                  <div>
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-2">Semester</p>
                    <div className="flex gap-2">
                      {["All", "1st", "2nd"].map(s => (
                        <Pill key={s} active={selSem === s} onClick={() => setFilter(setSelSem)(s)}>
                          {s === "All" ? "All" : `${s} sem`}
                        </Pill>
                      ))}
                    </div>
                  </div>

                  {/* Type */}
                  <div>
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-2">Type</p>
                    <div className="flex gap-2">
                      {["All", "Theory", "Lab"].map(t => (
                        <Pill key={t} active={selType === t} onClick={() => setFilter(setSelType)(t)}>
                          {t}
                        </Pill>
                      ))}
                    </div>
                  </div>

                </div>
                <button
                  onClick={resetFilters}
                  className="mt-4 flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <RefreshCw size={12} /> Reset filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Active filter tags */}
      <div className="max-w-6xl mx-auto px-6 mb-5 flex gap-2 flex-wrap items-center">
        <AnimatePresence>
          {activeTags.map(({ label, Icon }) => (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs"
            >
              <Icon size={11} /> {label}
            </motion.span>
          ))}
        </AnimatePresence>
        {!loading && (
          <span className="px-3 py-1 rounded-full bg-[#1a2138] text-slate-500 text-xs">
            {filtered.length} course{filtered.length !== 1 ? "s" : ""} found
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : paginated.length === 0 ? (
            <EmptyState
              hasFilters={!!hasActiveFilters || showFilter}
              onReset={() => { resetFilters(); setSearch(""); setShowFilter(false); }}
            />
          ) : (
            <motion.div
              key={`page-${currentPage}-${selYear}-${selSem}-${selType}-${showFilter}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <AnimatePresence>
                {paginated.map((course, i) => (
                  <CourseCard
                    key={course.courseCode + (course.section || "")}
                    course={course}
                    index={i}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 mt-10"
          >
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#1e2a45] bg-[#0f1629] text-slate-400 text-sm disabled:opacity-30 hover:border-indigo-500 hover:text-white transition-all"
            >
              <ChevronLeft size={15} /> Prev
            </motion.button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <motion.button
                key={page}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200
                  ${currentPage === page
                    ? "bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]"
                    : "border border-[#1e2a45] bg-[#0f1629] text-slate-400 hover:border-indigo-500 hover:text-white"
                  }`}
              >
                {page}
              </motion.button>
            ))}

            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#1e2a45] bg-[#0f1629] text-slate-400 text-sm disabled:opacity-30 hover:border-indigo-500 hover:text-white transition-all"
            >
              Next <ChevronRight size={15} />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
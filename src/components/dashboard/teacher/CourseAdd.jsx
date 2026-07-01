"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { X, BookOpen, Hash, Calendar, ShieldCheck } from "lucide-react";
import { fetchCourses,fetchSection, fetchTeacherByUserId } from "@/lib/data";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─── field wrapper ──────────────────────────────────────────────────────────
function Field({ label, icon: Icon, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400 uppercase tracking-wider">
        {Icon && <Icon size={12} className="text-indigo-400" />}
        {label}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

const selectCls =
  "w-full rounded-xl border border-[#1e2a45] bg-[#0a0f1e] px-4 py-2.5 text-sm text-white outline-none transition-all duration-200 focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

const inputCls =
  "w-full rounded-xl border border-[#1e2a45] bg-[#0a0f1e] px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200 focus:border-indigo-500/70 focus:bg-[#0d1428] focus:ring-1 focus:ring-indigo-500/20";

// ─── main ───────────────────────────────────────────────────────────────────
export default function CourseAdd() {
const router =useRouter();
  const { data: sessionData } = useSession();
  const user     = sessionData?.user;
  const userId   = user?.id;

  const [open, setOpen]               = useState(false);
  const [loading, setLoading]         = useState(false);
  const [errors, setErrors]           = useState({});

  // teacher
  const [teacher, setTeacher]               = useState(null);
  const [teacherLoading, setTeacherLoading] = useState(false);

  // dropdown data
  const [courses, setCourses]               = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  // sessions (all, loaded once)
  const [sessions, setSessions]             = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  // all sections loaded once — filtered client-side by selected session
  const [allSections, setAllSections]       = useState([]);

  const [formData, setFormData] = useState({
    courseCode: "",
    session:    "",
    section:    "",
  });

  // sections filtered from allSections based on selected session
  const filteredSections = formData.session
    ? allSections.filter(s => s.session === formData.session)
    : [];

  // ── fetch teacher ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    const resolve = async () => {
      setTeacherLoading(true);
      try {
        const data = await fetchTeacherByUserId(userId);
        setTeacher(data);
      } catch (err) {
        console.error("Failed to resolve teacher:", err);
      } finally {
        setTeacherLoading(false);
      }
    };
    resolve();
  }, [userId]);

  // ── fetch courses + ALL sections once (when modal opens) ──────────────────
  useEffect(() => {
    if (!open) return;
    const fetchAll = async () => {
      setCoursesLoading(true);
      setSessionsLoading(true);
      try {
        const [cData, sData] = await Promise.all([
          fetchCourses(),
          fetchSection(), 
        ]);
       

        setCourses(cData ?? []);

        const rawSections = sData ?? [];
        setAllSections(rawSections);

        const uniqueSessions = [...new Map(
          rawSections.map(s => [s.session, s])
        ).values()];
        setSessions(uniqueSessions);
      } catch (err) {
        console.error("Failed to fetch dropdown data:", err);
      } finally {
        setCoursesLoading(false);
        setSessionsLoading(false);
      }
    };
    fetchAll();
  }, [open]);

  // ── handlers ──────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // reset section whenever session changes
      ...(name === "session" ? { section: "" } : {}),
    }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!teacher?.teacherId) e.teacher    = "Teacher not resolved — please refresh";
    if (!formData.courseCode) e.courseCode = "Please select a course";
    if (!formData.session)    e.session    = "Please select a session first";
    if (!formData.section)    e.section    = "Please select a section";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/assign-teacher-section`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId:  teacher.teacherId,
          courseCode: formData.courseCode,
          section:    formData.section,
          session:    formData.session,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      toast.success(result.message || "Teacher assigned successfully!");
      router.refresh();
      handleClose();
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setFormData({ courseCode: "", session: "", section: "" });
      setErrors({});
    }, 300);
  };

  const selectedCourse = courses.find(c => c.courseCode === formData.courseCode);
  const showSummary    = formData.courseCode && formData.section && formData.session;
  const dataLoading    = coursesLoading || sessionsLoading;

  return (
    <>
      {/* ── trigger ── */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200
          ${open
            ? "border-indigo-500 bg-indigo-500/15 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]"
            : "border-[#1e2a45] bg-[#0f1629] text-white hover:border-indigo-500/60"
          }`}
      >
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.22 }} className="inline-flex">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5"  y1="12" x2="19" y2="12" />
          </svg>
        </motion.span>
        Add course
      </motion.button>

      {/* ── modal ── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={handleClose}
              className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm"
            />

            <motion.div key="panel"
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-xl rounded-2xl border border-[#1e2a45] bg-[#090d1a] shadow-2xl overflow-hidden">

                {/* header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2a45]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
                      <BookOpen size={14} className="text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-white">Add New Course</h2>
                      <p className="text-xs text-slate-500">Teaches table — fill all fields</p>
                    </div>
                  </div>
                  <button onClick={handleClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors">
                    <X size={14} />
                  </button>
                </div>

                {/* body */}
                <div className="px-5 py-5 flex flex-col gap-4">

                  {/* Teacher ID */}
                  <Field label="Teacher ID" icon={ShieldCheck} error={errors.teacher}>
                    <div className={`${inputCls} flex items-center gap-2 cursor-not-allowed select-none`}>
                      {teacherLoading ? (
                        <span className="flex items-center gap-2 text-slate-500">
                          <Spinner /> Resolving teacher…
                        </span>
                      ) : teacher ? (
                        <span className="flex items-center gap-2">
                          <span className="text-indigo-400 font-medium">{teacher.teacherId}</span>
                          <span className="text-slate-500">·</span>
                          <span className="text-slate-300">{teacher.name}</span>
                        </span>
                      ) : (
                        <span className="text-red-400 text-xs">Teacher not found for this account</span>
                      )}
                    </div>
                  </Field>

                  {/* Course */}
                  <Field label="Course" icon={BookOpen} error={errors.courseCode}>
                    <select
                      name="courseCode"
                      className={selectCls}
                      value={formData.courseCode}
                      onChange={handleChange}
                      disabled={coursesLoading}
                    >
                      <option value="">{coursesLoading ? "Loading courses…" : "Select a course"}</option>
                      {courses.map(c => (
                        <option key={c.courseCode} value={c.courseCode}>
                          {c.courseCode} — {c.title}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* Session → Section (order matters: session first) */}
                  <div className="grid grid-cols-2 gap-3">

                    {/* 1️⃣ Session — select this first */}
                    <Field label="Session" icon={Calendar} error={errors.session}>
                      <select
                        name="session"
                        className={selectCls}
                        value={formData.session}
                        onChange={handleChange}
                        disabled={sessionsLoading}
                      >
                        <option value="">{sessionsLoading ? "Loading…" : "Select session"}</option>
                        {sessions.map(s => (
                          <option key={s.session ?? s} value={s.session ?? s}>
                            {s.session ?? s}
                          </option>
                        ))}
                      </select>
                    </Field>

                    {/* 2️⃣ Section — filtered client-side from allSections */}
                    <Field label="Section" icon={Hash} error={errors.section}>
                      <select
                        name="section"
                        className={selectCls}
                        value={formData.section}
                        onChange={handleChange}
                        disabled={!formData.session || sessionsLoading}
                      >
                        <option value="">
                          {!formData.session
                            ? "Select session first"
                            : filteredSections.length === 0
                            ? "No sections found"
                            : "Select section"}
                        </option>
                        {filteredSections.map(s => (
                          <option key={s.sectionId ?? s.section} value={s.section}>
                            {s.section}
                          </option>
                        ))}
                      </select>
                    </Field>

                  </div>

                  {/* summary preview */}
                  <AnimatePresence>
                    {showSummary && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-4 py-3 text-xs text-slate-400 space-y-1">
                          <p className="text-indigo-400 font-medium mb-1.5">Will be saved as</p>
                          {teacher     && <p>👤 <span className="text-slate-300">{teacher.teacherId}</span> — {teacher.name}</p>}
                          {selectedCourse && <p>📚 <span className="text-slate-300">{selectedCourse.courseCode}</span> — {selectedCourse.title}</p>}
                          <p>📅 Session <span className="text-slate-300">{formData.session}</span></p>
                          <p>🔖 Section <span className="text-slate-300">{formData.section}</span></p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* footer */}
                <div className="flex items-center justify-end gap-2 px-5 pb-5">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 rounded-xl border border-[#1e2a45] text-sm text-slate-400 hover:text-white hover:border-slate-600 transition-all"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleSubmit}
                    disabled={loading || dataLoading || teacherLoading || !teacher}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
                  >
                    {loading && <Spinner />}
                    {loading ? "Saving…" : "Save course"}
                  </motion.button>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── tiny spinner ────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
export default function CourseHeader({
  title = "Programming Lab",
  code = "CSE-1102",
  year = "1st Year",
  semester = "1st Semester",
  department = "Dept. of CSE",
  teacher = "Md. Hasan",
  teacherInitials = "MH",
  type = "Lab",
  credits = "1.5",
  prerequisites = "N/A",
}) {
  return (
    <div className="w-full">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center gap-0">

        {/* ── Course title + code ── */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600/20 ring-1 ring-blue-500/30 shrink-0">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-semibold text-slate-100 tracking-tight leading-none">
                {title}
              </h1>
              <span className="text-sm font-medium text-blue-400 leading-none">{code}</span>
              <span className="hidden sm:inline-block h-3.5 w-px bg-white/15" />
              <span className="hidden sm:inline text-xs text-slate-500">{department}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] text-slate-600">{year} · {semester}</span>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="hidden lg:block w-px h-8 bg-white/10 mx-5 shrink-0" />

        {/* ── Teacher ── */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-full bg-indigo-500/20 ring-1 ring-indigo-400/30 flex items-center justify-center text-[10px] font-bold text-indigo-300">
            {teacherInitials}
          </div>
          <div>
            <p className="text-[10px] text-slate-600 uppercase tracking-widest leading-none mb-0.5">Teacher</p>
            <p className="text-xs font-medium text-slate-300 leading-none">{teacher}</p>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="hidden lg:block w-px h-8 bg-white/10 mx-5 shrink-0" />

        {/* ── Badges row ── */}
        <div className="flex items-center gap-3 shrink-0">

          {/* Type */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-600">Type</span>
            <span className="rounded-md bg-blue-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-blue-400 ring-1 ring-blue-500/20">
              {type}
            </span>
          </div>

          {/* Credits */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-600">Credits</span>
            <span className="rounded-md bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
              {credits}
            </span>
          </div>

          {/* Prerequisites */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-600">Pre-req</span>
            <span className="text-xs font-medium text-slate-400">{prerequisites}</span>
          </div>

        </div>

      </div>
    </div>
  );
}
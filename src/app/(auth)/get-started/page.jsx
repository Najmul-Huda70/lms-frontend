"use client";

import { useEffect, useState } from "react";
import {
  ImageIcon,
  Lock,
  User,
  GraduationCap,
  Briefcase,
  CalendarIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Stepper, { Step } from "@/components/UI/stepper";
import { signUp } from "@/lib/auth-client";
import { fetchDepartments, fetchSection } from "@/lib/data";
export default function SignupPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [deptData, sessionData] = await Promise.all([
          fetchDepartments(),
          fetchSection(),
        ]);
        setDepartments(deptData);
        setSections(sessionData);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);
  console.log("sections: ", sections);
  const [formData, setFormData] = useState({
    name: "",
    departmentID: "",
    regNumber: "",
    TeacherId: "",
    section: "",
    session: "",
    role: "student",
    image: "",
    password: "",
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isStep1Valid =
    formData.name.trim() !== "" &&
    formData.departmentID.trim() !== "" &&
    (formData.role === "student"
      ? formData.section?.trim() !== "" && formData.session?.trim() != ""
      : true);

  const isStep2Valid = true;

  const isStep3Valid = {
    minLength: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

  const isPasswordValid =
    isStep3Valid.minLength &&
    isStep3Valid.uppercase &&
    isStep3Valid.lowercase &&
    isStep3Valid.number &&
    isStep3Valid.special;

  const goNextStep =
    (currentStep === 1 && isStep1Valid) ||
    (currentStep === 2 && isStep2Valid) ||
    (currentStep === 3 && isPasswordValid);
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const handleStepCompleted = async () => {
    const {
      name,
      regNumber,
      TeacherId,
      image,
      role,
      departmentID,
      password,
      section,
      session,
    } = formData;
    console.log("formData: ", formData);
    const shortName = departments
      .find((dept) => dept.deptId === departmentID)
      ?.shortName?.toLowerCase();
    const loadingToast = toast.loading("Creating your account...");

    const targetId = role === "student" ? regNumber : TeacherId;
    const fakeEmail = `${shortName}${targetId}@neu.ac.bd`;

    try {
      const { data, error } = await signUp.email({
        name: name,
        email: fakeEmail,
        password: password,
        image:
          image || `https://api.dicebear.com/9.x/initials/svg?seed=${name}`,
        role: role,
      });

      if (error) {
        toast.dismiss(loadingToast);
        console.log("Auth Error Details:", error);
        toast.error(error.message || "Registration failed!");
        return;
      }

      const newUserId = data?.user?.id;

      const profileResponse = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: newUserId,
          role: role,
          name: name,
          deptId: departmentID,
          studentId: regNumber,
          section: section,
          session: session,
          teacherId: TeacherId,
        }),
      });

      const profileResult = await profileResponse.json();
      toast.dismiss(loadingToast);

      if (!profileResponse.ok) {
        toast.error(
          profileResult.message || "Failed to create student/teacher profile!",
        );
        return;
      }

      toast.success("Registration Successfully! Wait for approval.");

      setTimeout(() => {
        router.push("/signin");
      }, 1500);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Something went wrong!");
      console.error(err);
    }
  };
  // console.log("departments: ", departments);
  const uniqueSessions = [...new Set(sections.map((s) => s.session))];
  if (loading) return <div>Loading...</div>;
  return (
    <div className="text-white">
      <Stepper
        initialStep={1}
        onStepChange={(step) => setCurrentStep(step)}
        onFinalStepCompleted={handleStepCompleted}
        backButtonText="Previous"
        nextButtonText="Next"
        disableStepIndicators={!goNextStep}
      >
        <Step>
          <h2 className="text-3xl font-bold">Welcome to the LMS Register!</h2>

          <div className="mb-4 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="mb-2 block text-lg text-slate-300">
                Enter Your Name *
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-900"
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                  className="rounded-lg border border-gray-800 w-full py-3 pl-11 pr-4 text-white outline-none focus:border-gray-500 bg-transparent"
                />
              </div>
            </div>

            <div className="flex-1">
              <label className="mb-2 block text-lg text-slate-300">
                Department Name *
              </label>
              <div className="relative">
                <select
                  name="departmentID"
                  value={formData.departmentID}
                  onChange={handleChange}
                  required
                  className="rounded-lg border border-gray-800 w-full py-3 px-4 text-white outline-none focus:border-gray-500 bg-slate-900 appearance-none cursor-pointer"
                >
                  <option value="" className="focus:border-gray-800" disabled>
                    Select Department
                  </option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept.deptId}>
                      {dept.name} ({dept.shortName})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* ----- Role Toggle ----- */}
          <div className="mb-4">
            <label className="mb-2 block text-lg text-slate-300">Role *</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "student" })}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg border py-3 transition-colors ${
                  formData.role === "student"
                    ? "border-indigo-500 bg-indigo-500/15 text-indigo-300"
                    : "border-gray-800 bg-transparent text-slate-400"
                }`}
              >
                <GraduationCap size={18} />
                Student
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "teacher" })}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg border py-3 transition-colors ${
                  formData.role === "teacher"
                    ? "border-indigo-500 bg-indigo-500/15 text-indigo-300"
                    : "border-gray-800 bg-transparent text-slate-400"
                }`}
              >
                <Briefcase size={18} />
                Teacher
              </button>
            </div>
          </div>

          <div className="mb-4 flex flex-col md:flex-row gap-2 flex-wrap justify-between">
            {/* Left Column: Registration Number or Employee ID */}
            <div className="">
              <label className="mb-2 block text-lg text-slate-300">
                {formData.role === "teacher"
                  ? "Teacher ID *"
                  : "Registration Number *"}
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-900"
                />
                <input
                  type="text"
                  name={formData.role === "teacher" ? "TeacherId" : "regNumber"}
                  value={
                    formData.role === "teacher"
                      ? formData.TeacherId
                      : formData.regNumber
                  }
                  onChange={handleChange}
                  required
                  placeholder={
                    formData.role === "teacher"
                      ? "e.g. 202204001"
                      : "e.g. 2021331045"
                  }
                  className="rounded-lg border border-gray-800 w-full py-3 pl-11 pr-4 text-white outline-none focus:border-gray-500 bg-transparent"
                />
              </div>
            </div>

            {/* (Only for Student) */}
            {formData.role === "student" && (
              <>
                <div className="flex gap-2">
                  {/* ------------------ Running Session Dropdown ------------------ */}
                  <div className="w-1/2 min-w-58">
                    <label className="mb-2 block text-lg text-slate-300">
                      Running session *
                    </label>
                    <div className="relative">
                      <CalendarIcon
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400"
                      />
                      <select
                        name="session"
                        value={formData.session}
                        onChange={handleChange}
                        required
                        className="rounded-lg border border-gray-800 w-full py-3 pl-11 pr-4 text-white outline-none focus:border-gray-500 bg-slate-950 appearance-none cursor-pointer"
                      >
                        <option value="" disabled>
                          -- Select session --
                        </option>
                        {uniqueSessions.map((sessionName) => (
                          <option key={sessionName} value={sessionName}>
                            {sessionName}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* ------------------ Running Section Dropdown ------------------ */}
                  <div className="w-1/2 min-w-58">
                    <label className="mb-2 block text-lg text-slate-300">
                      Running section *
                    </label>
                    <div className="relative">
                      <CalendarIcon
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400"
                      />
                      <select
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        required
                        disabled={!formData.session} // সেশন সিলেক্ট না করা পর্যন্ত ডিসেবল থাকবে
                        className="rounded-lg border border-gray-800 w-full py-3 pl-11 pr-4 text-white outline-none focus:border-gray-500 bg-slate-950 appearance-none cursor-pointer disabled:opacity-50"
                      >
                        <option value="" disabled>
                          -- Select section --
                        </option>
                        {sections
                          .filter((s) => s.session === formData.session) // সিলেক্টেড সেশনের ডাটা ফিল্টার
                          .map((s) => (
                            <option
                              key={`${s.session}-${s.section}`} // সম্পূর্ণ ইউনিক কি (Key) জেনারেট করা হয়েছে
                              value={s.section}
                            >
                              {s.section}
                            </option>
                          ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </Step>

        <Step>
          <h2 className="text-3xl font-bold">Welcome to the LMS Register!</h2>
          <div className="mb-6">
            <label className="mb-2 mt-4 block text-lg my-2 text-slate-300">
              Profile Image URL
            </label>

            <div className="relative">
              <ImageIcon
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-900"
              />

              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com"
                className="rounded-lg border border-gray-800 w-[60%] py-3 pl-11 pr-4 text-white outline-none focus:border-gray-500"
              />
            </div>
          </div>
        </Step>

        <Step>
          <h2 className="text-3xl font-bold">Welcome to the LMS Register!</h2>

          <div className="mb-6">
            <label className="mb-2 mt-4 block text-lg my-2 text-slate-300">
              Password *
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-900"
              />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="your password"
                className="rounded-lg border border-gray-800 w-[60%] py-3 pl-11 pr-4 text-white outline-none focus:border-gray-500"
              />
            </div>

            {formData.password && (
              <>
                <p
                  className={
                    isStep3Valid.minLength ? "text-green-500" : "text-red-500"
                  }
                >
                  ✓ Minimum 8 characters
                </p>

                <p
                  className={
                    isStep3Valid.uppercase ? "text-green-500" : "text-red-500"
                  }
                >
                  ✓ One uppercase letter
                </p>

                <p
                  className={
                    isStep3Valid.lowercase ? "text-green-500" : "text-red-500"
                  }
                >
                  ✓ One lowercase letter
                </p>

                <p
                  className={
                    isStep3Valid.number ? "text-green-500" : "text-red-500"
                  }
                >
                  ✓ One number
                </p>

                <p
                  className={
                    isStep3Valid.special ? "text-green-500" : "text-red-500"
                  }
                >
                  ✓ One special character
                </p>
              </>
            )}
          </div>
        </Step>
      </Stepper>
    </div>
  );
}

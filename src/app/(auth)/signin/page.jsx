"use client";

import { useState, useEffect } from "react";
import { Lock, MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";
import { fetchDepartments ,fetchUser} from "@/lib/data";

export default function SignInPage() {
  const router = useRouter();

  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });

  useEffect(() => {
    const getDepartmentsData = async () => {
      const data = await fetchDepartments();
      setDepartments(data);
    };
    getDepartmentsData();
  }, []);
  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUser();
      setUsers(data);
    };
    getUserData();
  }, []);
  console.log('users: ',users)
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { id, password } = formData;

    if (!id.trim() || !password.trim()) {
      toast.error("Please fill in all fields!");
      return;
    }

    const deptId = id.substring(4, 6);
    const dept = departments.find((d) => d.deptId === deptId);

    if (!dept) {
      toast.error("Department not found for this ID!");
      return;
    }

    const shortName = dept.shortName?.toLowerCase();
    const email = `${shortName}${id}@neu.ac.bd`;

    const isValidEmail = email.includes("@") && email.includes(".");
    if (!isValidEmail) {
      toast.error("Could not construct a valid email!");
      return;
    }
    console.log('email: ',email)
    const emailUser = users?.find((u) => u.email === email) ?? null;

console.log("Found User Details: ", emailUser);
    console.log(emailUser);
    const eStatus =emailUser?.status;
    const eRole =emailUser?.role;
    console.log('eStatus: ',eStatus);
    if(eStatus==='pending')
    {
      toast.error("Could not construct a approved email!");
      return;
    }
    const loadingToast = toast.loading("Signing in...");
    setLoading(true);

    try {
      const { error } = await signIn.email({ email, password });

      toast.dismiss(loadingToast);
      setLoading(false);

      if (error) {
        toast.error(error.message || "Invalid email or password!");
        return;
      }

      toast.success("Signed in successfully!");
      console.log("SignIn completed!");
      if(eRole==='student') router.push("/dashboard/student/classroom");
      else if(eRole==='teacher') router.push("/dashboard/teacher/classroom");
      router.refresh();
    } catch (err) {
      toast.dismiss(loadingToast);
      setLoading(false);
      toast.error("Something went wrong!");
      console.error("SignIn Error:", err);
    }
  };

  const isFormFilled = formData.id && formData.password;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030712] px-4">
      <div className="w-full max-w-[650px] rounded-2xl border border-gray-800 bg-[#090d16] p-8 md:p-12 shadow-2xl relative">

        <div className="absolute top-6 left-6 h-3 w-3 rounded-full bg-indigo-600 shadow-[0_0_10px_#4f46e5]" />

        <h2 className="mb-8 text-3xl font-bold text-white tracking-wide">
          Welcome to the Hire Loop — Sign In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-md font-medium text-slate-300">
              User ID *
            </label>
            <div className="relative">
              <MailIcon
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                required
                placeholder="e.g. 202204089"
                className="w-full rounded-xl border border-gray-800 bg-slate-900/50 py-3.5 pl-12 pr-4 text-white outline-none transition-all focus:border-gray-600 focus:bg-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-md font-medium text-slate-300">
              Password *
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="your password"
                className="w-full rounded-xl border border-gray-800 bg-slate-900/50 py-3.5 pl-12 pr-4 text-white outline-none transition-all focus:border-gray-600 focus:bg-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading || !isFormFilled}
              className={`rounded-xl px-8 py-2.5 font-medium text-sm transition-all duration-200
                ${isFormFilled && !loading
                  ? "bg-slate-200 text-black hover:bg-white cursor-pointer"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
            >
              {loading ? "Processing..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
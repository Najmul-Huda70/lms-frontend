import toast from "react-hot-toast";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 1. Create a generic helper function
export const apiFetch = async (endpoint) => {
  try {
    const url = `${BASE_URL}/${endpoint}`;
    console.log('url: ', url);
    
    const response = await fetch(url);
    const result = await response.json();

    if (response.ok && result.success) {
      return result.data;
    } else {
      toast.error(result.message || "Failed to load data");
      return [];
    }
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    toast.error("Network error! Could not connect to backend.");
    return [];
  }
};

// 2. Export your specific functions using the helper
export const fetchDepartments = () => apiFetch('departments');
export const fetchSessions    = () => apiFetch('sessions');
export const fetchUser        = () => apiFetch('users');
export const fetchCourses     = () => apiFetch('courses');
export const fetchSection     =()  =>apiFetch('sections');
export const fetchTeachers    = () => apiFetch('teachers');
export const fetchStudents   = () => apiFetch('students');
export const fetchPrerequisites = async (courseCode) => {
  try {
    const res = await fetch(`${BASE_URL}/prerequisites/${courseCode}`);
    // console.log('res from frontend: ',res);
    if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);

    const result = await res.json();
    return result.data ?? []; 
  } catch (error) {
    console.error("Fetch prerequisites error:", error);
    return [];   // error হলে empty array, throw না
  }
};
export const fetchStudentCourses = async (userId, token) => {
  try {
    const res = await fetch(`${BASE_URL}/student-courses/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    const result = await res.json();
    return result || {};
  } catch (error) {
    console.error("Error fetching student courses:", error);
    return {};
  }
};
export const fetchTeachesCoursesByUserId= async (userId, token) => {
  try {
    // console.log('userId with data.js:',userId);
    const res = await fetch(`${BASE_URL}/teaches/search?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch teaches: ${res.status}`);
    }

    const data = await res.json();
    return data || {};
  } catch (error) {
    console.error("Error fetching teaches data in frontend:", error);
    return {};
  }
};
export async function fetchTeacherByUserId(userId) {
  try {
    const res = await fetch(`${BASE_URL}/teachers?userId=${userId}`);
    console.log(res);
    if (!res.ok) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    }
    
    const result = await res.json(); 
   if (result.success && result.data && result.data.length > 0) {
      return result.data[0]; 
    } else {
      throw new Error("This user is not registered as a teacher in the database.");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
export async function fetchTeachesEachCourse(userId,courseCode,token) {
  try {
    const res = await fetch(`${BASE_URL}/teaches/search?userId=${userId}&courseCode=${courseCode}`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    console.log(res);
    if (!res.ok) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    }
    
    const result = await res.json(); 
   if (result.success && result.data && result.data.length > 0) {
      return result.data[0]; 
    } else {
      throw new Error("This user is not registered as a teacher in the database.");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
export async function enrollInCourse(enrollData) {
  // enrollData = { studentId: "S-2026-045", courseCode: "CSE-2201", section: "A", session: "Fall 2026" }
  const res = await fetch("${BASE_URL}//takes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(enrollData),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Enrollment failed");
  return result;
}


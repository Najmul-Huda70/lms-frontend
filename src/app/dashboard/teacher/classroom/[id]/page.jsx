import React from 'react'
import CourseDetailsPage from '@/components/dashboard/teacher/CourseDetails'
import { fetchTeachesEachCourse } from '@/lib/data';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { sec } from 'better-auth/plugins';
export default async function page({params}) {
  const {courseCode}=await params;
  const session= await auth.api.getSession({ headers: await headers() });
  const { token } = await auth.api.getToken({ headers: await headers() });
  const u=session?.user;
  const userId=session?.user.id;
   const c=await fetchTeachesEachCourse(userId,courseCode,token);
   console.log('teaches Courses: ',c);
  
  return (
    <CourseDetailsPage role={u.role} courseCode={c.courseCode} courseTitle={c.courseTitle} section={c.section} session={c.session} teacherName={u.name} credits={c.credits}/>
  )
}

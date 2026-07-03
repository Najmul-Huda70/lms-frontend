import React from 'react'
import {auth} from "@/lib/auth"
import { headers } from "next/headers";
import Classroom from '@/components/dashboard/teacher/Classroom';
import { fetchTeachesCoursesByUserId } from '@/lib/data';
export default async function page() {
  const session= await auth.api.getSession({ headers: await headers() });
  const { token } = await auth.api.getToken({ headers: await headers() });
  const userId=session?.user.id;
  const teachesCourses=await fetchTeachesCoursesByUserId(userId,token);
  return (
    <>
    <Classroom courses={teachesCourses.data} loading={false}/>
    </>
  )
}

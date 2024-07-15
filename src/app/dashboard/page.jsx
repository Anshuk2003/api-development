"use client"
import React from 'react'
import { signOut } from "next-auth/react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Dashboard =() => {
  const { status, data: session  } = useSession();
  const router = useRouter();
  return (
    <div>
      Welcome to Dashboard
      <br />
      <p>Welcome, {session?.user?.email}</p>
      <br />
      <button onClick={() => signOut({ callbackUrl: 'http://localhost:3000/Login' })}>
        Sign Out
      </button>
    </div>
  )
}
export default Dashboard

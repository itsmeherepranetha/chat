'use client'

import { useSession } from "next-auth/react"
import Image from "next/image";
import Button from "./Button";

export default function Navbar() {
  const { data, status } = useSession();
  //console.log(data,status);
  if (status == 'loading') return null;

  return (
    <nav style={{height:'30px'}}>
      {data?.user ? (
        <>
          <Image src={data.user.image!} alt="Profile" width={40} height={40} className="rounded-full" />
          <span>{data.user.name}</span>
        </>
      ) : (
        <Button>Sign in with Google</Button>
      )}
    </nav>
  )
}
import Link from "next/link";

export default function Button({children}:{children:React.ReactNode}){
    return(
        <Link href={'/api/auth/signin/google'} type="button" style={{height:'30px'}}>{children}</Link>
    )
}
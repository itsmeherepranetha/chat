import { getServerSession } from "next-auth";
import { options } from "../../api/auth/[...nextauth]/options";

export default async function Page({params}:{params:Promise<{roomName:string}>})
{
    const roomName=(await params).roomName;

    

    const session=await getServerSession(options);

    if (session) {
      console.log(session);
    }
    return(
        <div>
            <h1>room-{roomName}</h1>
        </div>
    )
}
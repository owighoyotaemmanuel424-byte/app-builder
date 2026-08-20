import {NextResponse} from 'next/server'
import {auth} from '@/auth'
import {db} from '@/lib/db'
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){const session=await auth();if(!session?.user?.id)return NextResponse.json({error:'Unauthorized'},{status:401});const {id}=await params;const project=await db.project.findFirst({where:{id,userId:session.user.id},include:{files:true,conversations:{orderBy:{createdAt:'asc'},take:100}}});if(!project)return NextResponse.json({error:'Not found'},{status:404});return NextResponse.json(project)}

import {NextResponse} from 'next/server'
import {hash} from 'bcryptjs'
import {z} from 'zod'
import {db} from '@/lib/db'
const schema=z.object({name:z.string().min(2).max(80),email:z.string().email(),password:z.string().min(8).max(128)})
export async function POST(req:Request){try{const input=schema.parse(await req.json());const email=input.email.toLowerCase();const exists=await db.user.findUnique({where:{email}});if(exists)return NextResponse.json({error:'An account with this email already exists.'},{status:409});const user=await db.user.create({data:{name:input.name,email,passwordHash:await hash(input.password,12)}});return NextResponse.json({id:user.id,email:user.email})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Invalid request'},{status:400})}}

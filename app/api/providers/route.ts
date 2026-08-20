import {NextResponse} from 'next/server'
import {auth} from '@/auth'
import {db} from '@/lib/db'
import {encryptSecret} from '@/lib/crypto'
import {z} from 'zod'
const schema=z.object({provider:z.enum(['openai','gemini','deepseek','groq','openrouter','glm']),apiKey:z.string().min(10),defaultModel:z.string().min(1)})
export async function GET(){const session=await auth();if(!session?.user?.id)return NextResponse.json({error:'Unauthorized'},{status:401});const rows=await db.aIProvider.findMany({where:{userId:session.user.id},select:{id:true,provider:true,defaultModel:true,status:true,createdAt:true}});return NextResponse.json(rows)}
export async function POST(req:Request){const session=await auth();if(!session?.user?.id)return NextResponse.json({error:'Unauthorized'},{status:401});try{const input=schema.parse(await req.json());const row=await db.aIProvider.upsert({where:{userId_provider:{userId:session.user.id,provider:input.provider}},update:{encryptedApiKey:encryptSecret(input.apiKey),defaultModel:input.defaultModel,status:'connected'},create:{userId:session.user.id,provider:input.provider,encryptedApiKey:encryptSecret(input.apiKey),defaultModel:input.defaultModel}});return NextResponse.json({id:row.id,provider:row.provider,defaultModel:row.defaultModel,status:row.status})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Invalid request'},{status:400})}}

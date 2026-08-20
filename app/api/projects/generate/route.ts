import {NextResponse} from 'next/server'
import {auth} from '@/auth'
import {db} from '@/lib/db'
import {decryptSecret} from '@/lib/crypto'
import {generateWithProvider,ProviderName} from '@/lib/providers'
import {z} from 'zod'

const inputSchema=z.object({prompt:z.string().min(3).max(20000),provider:z.enum(['openai','gemini','deepseek','groq','openrouter','glm']),model:z.string().min(1)})
const outputSchema=z.object({project:z.object({name:z.string(),description:z.string().optional()}),files:z.array(z.object({path:z.string().min(1).max(300),content:z.string(),language:z.string().optional()})).min(1).max(150)})
const system=`You are PATCHBAY's application generation engine. Return ONLY valid JSON matching {project:{name,description},files:[{path,content,language}]}. Generate a complete Next.js TypeScript Tailwind application. Never include markdown fences. Never include secrets, API keys, shell commands, or executable server-side installers. Prefer small coherent files. The generated project is untrusted and will be sandbox-built later.`

export async function POST(req:Request){
 const session=await auth();if(!session?.user?.id)return NextResponse.json({error:'Unauthorized'},{status:401})
 try{
  const input=inputSchema.parse(await req.json())
  const provider=await db.aIProvider.findUnique({where:{userId_provider:{userId:session.user.id,provider:input.provider}}})
  if(!provider)return NextResponse.json({error:`Connect ${input.provider} in Settings before building.`},{status:400})
  const prompt=`${system}\n\nUSER REQUEST:\n${input.prompt}`
  const project=await db.project.create({data:{userId:session.user.id,name:'New project',description:input.prompt,selectedProvider:input.provider,selectedModel:input.model,status:'building'}})
  const generation=await db.generation.create({data:{projectId:project.id,provider:input.provider,model:input.model,prompt:input.prompt,status:'running'}})
  await db.conversation.create({data:{userId:session.user.id,projectId:project.id,role:'user',content:input.prompt}})
  try{
   const text=await generateWithProvider(input.provider as ProviderName,decryptSecret(provider.encryptedApiKey),input.model,prompt)
   const clean=text.trim().replace(/^```json\s*/,'').replace(/```$/,'').trim()
   const parsed=outputSchema.parse(JSON.parse(clean))
   await db.project.update({where:{id:project.id},data:{name:parsed.project.name,description:parsed.project.description,status:'ready'}})
   await db.projectFile.createMany({data:parsed.files.map(f=>({projectId:project.id,path:f.path,content:f.content,language:f.language}))})
   await db.conversation.create({data:{userId:session.user.id,projectId:project.id,role:'assistant',content:`Created ${parsed.files.length} project files.`}})
   await db.generation.update({where:{id:generation.id},data:{status:'completed',completedAt:new Date()}})
   return NextResponse.json({projectId:project.id,name:parsed.project.name,files:parsed.files})
  }catch(error){await db.generation.update({where:{id:generation.id},data:{status:'failed',error:error instanceof Error?error.message:'Generation failed'}});await db.project.update({where:{id:project.id},data:{status:'error'}});throw error}
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Generation failed'},{status:500})}
}

import {createOpenAI} from '@ai-sdk/openai'
import {generateText,streamText} from 'ai'
import {createGoogleGenerativeAI} from '@ai-sdk/google'

export type ProviderName='openai'|'gemini'|'deepseek'|'groq'|'openrouter'|'glm'
const compatibleBase:Record<Exclude<ProviderName,'openai'|'gemini'>,string>={
 deepseek:'https://api.deepseek.com/v1',groq:'https://api.groq.com/openai/v1',openrouter:'https://openrouter.ai/api/v1',glm:'https://open.bigmodel.cn/api/paas/v4'
}
export function provider(name:ProviderName,key:string){
 if(name==='gemini')return createGoogleGenerativeAI({apiKey:key})
 if(name==='openai')return createOpenAI({apiKey:key})
 return createOpenAI({apiKey:key,baseURL:compatibleBase[name]})
}
export async function generateWithProvider(name:ProviderName,key:string,model:string,prompt:string){const p=provider(name,key);const result=await generateText({model:p(model),prompt});return result.text}
export function streamWithProvider(name:ProviderName,key:string,model:string,prompt:string){const p=provider(name,key);return streamText({model:p(model),prompt})}

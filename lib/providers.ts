import {createOpenAI} from '@ai-sdk/openai'
import {generateText,streamText} from 'ai'
import {createGoogleGenerativeAI} from '@ai-sdk/google'

export type ProviderName='openai'|'gemini'
export function provider(name:ProviderName,key:string){
 if(name==='openai')return createOpenAI({apiKey:key})
 return createGoogleGenerativeAI({apiKey:key})
}
export async function generateWithProvider(name:ProviderName,key:string,model:string,prompt:string){
 const p=provider(name,key); const result=await generateText({model:p(model),prompt}); return result.text
}
export function streamWithProvider(name:ProviderName,key:string,model:string,prompt:string){
 const p=provider(name,key); return streamText({model:p(model),prompt})
}

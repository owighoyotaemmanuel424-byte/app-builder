import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import {db} from '@/lib/db'
import {compare} from 'bcryptjs'

export const {handlers,auth,signIn,signOut}=NextAuth({
 session:{strategy:'jwt'},
 providers:[Credentials({name:'credentials',credentials:{email:{},password:{}},async authorize(credentials){
  const email=String(credentials?.email||'').toLowerCase().trim(); const password=String(credentials?.password||'')
  if(!email||!password)return null
  const user=await db.user.findUnique({where:{email}})
  if(!user?.passwordHash||!(await compare(password,user.passwordHash)))return null
  return {id:user.id,email:user.email,name:user.name||undefined,image:user.avatar||undefined}
 }})],
 callbacks:{async jwt({token,user}){if(user)token.userId=user.id;return token},async session({session,token}){if(token.userId)session.user.id=String(token.userId);return session}},
 pages:{signIn:'/login'}
})

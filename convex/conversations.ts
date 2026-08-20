import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const role = v.union(v.literal("user"), v.literal("assistant"), v.literal("system"));

export const list = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => ctx.db.query("conversations").withIndex("by_project", q => q.eq("projectId", projectId)).order("desc").collect(),
});

export const messages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => ctx.db.query("messages").withIndex("by_conversation", q => q.eq("conversationId", conversationId)).order("asc").collect(),
});

export const create = mutation({
  args: { projectId: v.id("projects"), userId: v.id("users"), title: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const now = Date.now();
    return ctx.db.insert("conversations", { ...args, createdAt: now, updatedAt: now });
  },
});

export const addMessage = mutation({
  args: { conversationId: v.id("conversations"), role, content: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("messages", { ...args, createdAt: now, updatedAt: now });
    await ctx.db.patch(args.conversationId, { updatedAt: now });
    return id;
  },
});

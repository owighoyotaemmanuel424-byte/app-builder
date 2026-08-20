import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => ctx.db.query("projects").withIndex("by_user", q => q.eq("userId", userId)).order("desc").collect(),
});

export const create = mutation({
  args: { userId: v.id("users"), name: v.string(), description: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const now = Date.now();
    return ctx.db.insert("projects", { ...args, status: "draft", framework: "nextjs", createdAt: now, updatedAt: now });
  },
});

export const update = mutation({
  args: { projectId: v.id("projects"), name: v.optional(v.string()), description: v.optional(v.string()), status: v.optional(v.string()), previewUrl: v.optional(v.string()) },
  handler: async (ctx, { projectId, ...patch }) => {
    const clean = Object.fromEntries(Object.entries(patch).filter(([, value]) => value !== undefined));
    await ctx.db.patch(projectId, { ...clean, updatedAt: Date.now() });
  },
});

export const saveFile = mutation({
  args: { projectId: v.id("projects"), path: v.string(), content: v.string(), language: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("projectFiles").withIndex("by_project", q => q.eq("projectId", args.projectId)).collect();
    const file = existing.find(f => f.path === args.path);
    if (file) { await ctx.db.patch(file._id, { content: args.content, language: args.language, updatedAt: Date.now() }); return file._id; }
    const now = Date.now();
    return ctx.db.insert("projectFiles", { ...args, createdAt: now, updatedAt: now });
  },
});

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) =>
    ctx.db.query("projectFiles").withIndex("by_project", q => q.eq("projectId", projectId)).order("asc").collect(),
});

export const get = query({
  args: { projectId: v.id("projects"), path: v.string() },
  handler: async (ctx, { projectId, path }) => {
    const files = await ctx.db.query("projectFiles").withIndex("by_project", q => q.eq("projectId", projectId)).collect();
    return files.find(file => file.path === path) ?? null;
  },
});

export const save = mutation({
  args: { projectId: v.id("projects"), path: v.string(), content: v.string(), language: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const files = await ctx.db.query("projectFiles").withIndex("by_project", q => q.eq("projectId", args.projectId)).collect();
    const existing = files.find(file => file.path === args.path);
    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { content: args.content, language: args.language, updatedAt: now });
      return existing._id;
    }
    return ctx.db.insert("projectFiles", { ...args, createdAt: now, updatedAt: now });
  },
});

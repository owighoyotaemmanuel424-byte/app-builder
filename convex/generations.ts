import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => ctx.db.query("generations").withIndex("by_project", q => q.eq("projectId", projectId)).order("desc").collect(),
});

export const create = mutation({
  args: { projectId: v.id("projects"), userId: v.id("users"), provider: v.string(), model: v.string(), prompt: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    return ctx.db.insert("generations", { ...args, status: "queued", createdAt: now, updatedAt: now });
  },
});

export const updateStatus = mutation({
  args: { generationId: v.id("generations"), status: v.string(), error: v.optional(v.string()) },
  handler: async (ctx, { generationId, ...patch }) => ctx.db.patch(generationId, { ...patch, updatedAt: Date.now() }),
});

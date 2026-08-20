import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => ctx.db.query("deployments").withIndex("by_project", q => q.eq("projectId", projectId)).order("desc").collect(),
});

export const create = mutation({
  args: { projectId: v.id("projects"), userId: v.id("users"), provider: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    return ctx.db.insert("deployments", { ...args, status: "queued", createdAt: now, updatedAt: now });
  },
});

export const update = mutation({
  args: { deploymentId: v.id("deployments"), status: v.string(), url: v.optional(v.string()), provider: v.optional(v.string()), deploymentIdExternal: v.optional(v.string()), error: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { deploymentId, deploymentIdExternal, ...rest } = args;
    await ctx.db.patch(deploymentId, { ...rest, deploymentId: deploymentIdExternal, updatedAt: Date.now() });
  },
});

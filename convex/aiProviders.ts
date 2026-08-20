import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => ctx.db.query("aiProviders").withIndex("by_user", q => q.eq("userId", userId)).collect(),
});

export const upsert = mutation({
  args: { userId: v.id("users"), provider: v.string(), label: v.string(), encryptedApiKey: v.string(), model: v.optional(v.string()), isDefault: v.boolean() },
  handler: async (ctx, args) => {
    const existing = (await ctx.db.query("aiProviders").withIndex("by_user", q => q.eq("userId", args.userId)).collect()).find(p => p.provider === args.provider);
    const now = Date.now();
    if (existing) { await ctx.db.patch(existing._id, { ...args, updatedAt: now }); return existing._id; }
    return ctx.db.insert("aiProviders", { ...args, createdAt: now, updatedAt: now });
  },
});

export const remove = mutation({
  args: { providerId: v.id("aiProviders") },
  handler: async (ctx, { providerId }) => ctx.db.delete(providerId),
});

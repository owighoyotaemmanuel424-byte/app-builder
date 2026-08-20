import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) =>
    ctx.db.query("users").withIndex("by_email", q => q.eq("email", email.toLowerCase())).unique(),
});

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => ctx.db.get(userId),
});

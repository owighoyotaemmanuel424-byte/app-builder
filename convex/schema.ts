import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const timestamps = { createdAt: v.number(), updatedAt: v.number() };

export default defineSchema({
  users: defineTable({
    email: v.string(), name: v.optional(v.string()), image: v.optional(v.string()),
    passwordHash: v.optional(v.string()), emailVerified: v.optional(v.number()), ...timestamps,
  }).index("by_email", ["email"]),

  aiProviders: defineTable({
    userId: v.id("users"), provider: v.string(), label: v.string(), encryptedApiKey: v.string(),
    model: v.optional(v.string()), isDefault: v.boolean(), ...timestamps,
  }).index("by_user", ["userId"]),

  projects: defineTable({
    userId: v.id("users"), name: v.string(), description: v.optional(v.string()),
    status: v.string(), framework: v.optional(v.string()), repositoryUrl: v.optional(v.string()),
    previewUrl: v.optional(v.string()), ...timestamps,
  }).index("by_user", ["userId"]),

  projectFiles: defineTable({
    projectId: v.id("projects"), path: v.string(), content: v.string(), language: v.optional(v.string()),
    ...timestamps,
  }).index("by_project", ["projectId"]),

  conversations: defineTable({
    projectId: v.id("projects"), userId: v.id("users"), title: v.optional(v.string()), ...timestamps,
  }).index("by_project", ["projectId"]),

  messages: defineTable({
    conversationId: v.id("conversations"), role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    content: v.string(), ...timestamps,
  }).index("by_conversation", ["conversationId"]),

  generations: defineTable({
    projectId: v.id("projects"), userId: v.id("users"), provider: v.string(), model: v.string(),
    prompt: v.string(), status: v.string(), error: v.optional(v.string()), ...timestamps,
  }).index("by_project", ["projectId"]),

  deployments: defineTable({
    projectId: v.id("projects"), userId: v.id("users"), provider: v.string(), status: v.string(),
    url: v.optional(v.string()), deploymentId: v.optional(v.string()), error: v.optional(v.string()), ...timestamps,
  }).index("by_project", ["projectId"]),
});

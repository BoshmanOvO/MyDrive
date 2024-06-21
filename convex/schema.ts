import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const fileType = v.union(
  v.literal("jpeg"),
  v.literal("csv"),
  v.literal("pdf"),
  v.literal("zip"),
  v.literal("png"),
  v.literal("video"),
  v.literal("svg"),
);
export const roles = v.union(v.literal("admin"), v.literal("member"));

export default defineSchema({
  files: defineTable({
    name: v.string(),
    fileId: v.id("_storage"),
    orgId: v.string(),
    fileType,
  }).index("org_id", ["orgId"]),

  favourite: defineTable({
    userId: v.id("users"),
    orgId: v.string(),
    fileId: v.id("files"),
  }).index("by_userId_fileId_orgId", ["userId", "orgId", "fileId"]),

  users: defineTable({
    tokenIdentifier: v.string(),
    orgIds: v.array(v.object({ orgId: v.string(), roles })),
  }).index("token_identifier", ["tokenIdentifier"]),
});

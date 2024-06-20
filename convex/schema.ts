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

export default defineSchema({
  files: defineTable({
    name: v.string(),
    fileId: v.id("_storage"),
    orgId: v.optional(v.string()),
    fileType,
  }).index("org_id", ["orgId"]),

  users: defineTable({
    tokenIdentifier: v.string(),
    orgIds: v.array(v.string()),
  }).index("token_identifier", ["tokenIdentifier"]),
});

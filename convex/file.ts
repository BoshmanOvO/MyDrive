import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUser } from "./users";
import { fileType } from "./schema";

export async function hasAccessToOrg(
  ctx: MutationCtx | QueryCtx,
  tokenIdentifier: string,
  orgId: string | undefined,
) {
  const user = await getUser(ctx, tokenIdentifier);
  return (
    user.orgIds.includes(<string>orgId) ||
    user.tokenIdentifier.includes(<string>orgId)
  );
}

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError(
      "Not authenticated, you must logged in to create a file",
    );
  }
  return await ctx.storage.generateUploadUrl();
});

export const createFile = mutation({
  args: {
    name: v.string(),
    fileId: v.id("_storage"),
    fileType: fileType,
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError(
        "Not authenticated, you must logged in to create a file",
      );
    }

    // user should be authorized to get a file in an organization, check is authorized
    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId,
    );
    if (!hasAccess) {
      throw new ConvexError(
        "You are not authorized to create a file in this organization",
      );
    }

    await ctx.db.insert("files", {
      name: args.name,
      fileId: args.fileId,
      orgId: args.orgId,
      fileType: args.fileType,
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId,
    );
    if (!hasAccess) {
      throw new ConvexError(
        "You are not authorized to view files in this organization",
      );
    }
    const files = await ctx.db
      .query("files")
      .withIndex("org_id", (q) => q.eq("orgId", args.orgId))
      .collect();

    let query = args.query;
    if (query) {
      return files.filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase()),
      );
    }
    return files;
  },
});

export const deleteFile = mutation({
  args: {
    fileId: v.id("files"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError(
        "Not authenticated, you must logged in to delete a file",
      );
    }

    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new ConvexError("File not found");
    }

    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      file.orgId,
    );
    if (!hasAccess) {
      throw new ConvexError(
        "You are not authorized to delete files in this organization",
      );
    }
    await ctx.db.delete(args.fileId);
  },
});

// get file url saved in storage
export const getUrl = query({
  args: {
    fileId: v.id("_storage"),
  },
  async handler(ctx, args) {
    return ctx.storage.getUrl(args.fileId);
  },
});

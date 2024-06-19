import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUser } from "./users";

export async function hasAccessToOrg(
  ctx: MutationCtx | QueryCtx,
  tokenIdentifier: string,
  orgId: string,
) {
  const user = await getUser(ctx, tokenIdentifier);
  return (
    user.orgIds.includes(orgId) || user.tokenIdentifier !== tokenIdentifier
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
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError(
        "Not authenticated, you must logged in to create a file",
      );
    }

    // user should be authorized to create a file in a organization, check is authorized
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
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
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
    return ctx.db
      .query("files")
      .withIndex("org_id", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

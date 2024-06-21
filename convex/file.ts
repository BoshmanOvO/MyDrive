import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { fileType } from "./schema";
import { hasAccessToFile, hasAccessToOrg } from "./fileutils";

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
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);
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
    favourite: v.optional(v.boolean()),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);
    if (!hasAccess) {
      throw new ConvexError(
        "You are not authorized to view files in this organization",
      );
    }
    let files = await ctx.db
      .query("files")
      .withIndex("org_id", (q) => q.eq("orgId", args.orgId))
      .collect();

    let query = args.query;
    if (query) {
      files = files.filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase()),
      );
    }

    // if there is a lot of files in the system they may have to change these
    if (args.favourite) {
      const fav = await ctx.db
        .query("favourite")
        .withIndex("by_userId_fileId_orgId", (q) =>
          q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId),
        )
        .collect();
      files = files.filter((file) => fav.some((f) => f.fileId === file._id));
    }
    return files;
  },
});

export const toggleFavourite = mutation({
  args: {
    fileId: v.id("files"),
  },
  async handler(ctx, args) {
    const access = await hasAccessToFile(ctx, args.fileId);
    if (!access) {
      throw new ConvexError("No access to file");
    }
    const favourite = await ctx.db
      .query("favourite")
      .withIndex("by_userId_fileId_orgId", (q) =>
        q
          .eq("userId", access.user._id)
          .eq("orgId", access.file.orgId)
          .eq("fileId", access.file._id),
      )
      .first();

    if (!favourite) {
      await ctx.db.insert("favourite", {
        userId: access.user._id,
        fileId: access.file._id,
        orgId: access.file.orgId,
      });
    } else {
      await ctx.db.delete(favourite._id);
    }
  },
});

export const getAllFavourites = query({
  args: { orgId: v.string() },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);
    if (!hasAccess) {
      return [];
    }
    return await ctx.db
      .query("favourite")
      .withIndex("by_userId_fileId_orgId", (q) =>
        q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId),
      )
      .collect();
  },
});

export const deleteFile = mutation({
  args: {
    fileId: v.id("files"),
  },
  async handler(ctx, args) {
    const access = await hasAccessToFile(ctx, args.fileId);
    if (!access) {
      throw new ConvexError("No access to file");
    }
    const isAdmin = access.user.orgIds
      .find((org) => org.orgId === access.file.orgId)
      ?.roles.includes("admin");

    if (!isAdmin) {
      throw new ConvexError("You have no admin access to delete this file.");
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

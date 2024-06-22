import {
  internalMutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { roles } from "./schema";

export async function getUser(
  ctx: MutationCtx | QueryCtx,
  tokenIdentifier: string,
) {
  const user = await ctx.db
    .query("users")
    .withIndex("token_identifier", (q) =>
      q.eq("tokenIdentifier", tokenIdentifier),
    )
    .first();
  if (!user) {
    throw new ConvexError("User not found.");
  }
  return user;
}

export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    imageUrl: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      orgIds: [],
      name: args.name,
      imageUrl: args.imageUrl,
    });
  },
});

export const updateUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    imageUrl: v.string(),
  },
  async handler(ctx, args) {
    const user = await getUser(ctx, args.tokenIdentifier);
    await ctx.db.patch(user._id, {
      name: args.name,
      imageUrl: args.imageUrl,
    });
  },
});

export const addOrgIdToUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    orgId: v.string(),
    roles: roles,
  },
  async handler(ctx, args) {
    const user = await getUser(ctx, args.tokenIdentifier);
    await ctx.db.patch(user._id, {
      orgIds: [...user.orgIds, { orgId: args.orgId, roles: args.roles }],
    });
  },
});

export const updateRoleInOrg = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    orgId: v.string(),
    roles: roles,
  },
  async handler(ctx, args) {
    const user = await getUser(ctx, args.tokenIdentifier);
    const org = user.orgIds.find((org) => org.orgId === args.orgId);
    if (!org) {
      throw new ConvexError("User not part of org");
    }
    org.roles = args.roles;

    await ctx.db.patch(user._id, {
      orgIds: user.orgIds,
    });
  },
});

export const getUserProfile = query({
  args: {
    userId: v.id("users"),
  },
  async handler(ctx, args) {
    const user = await ctx.db.get(args.userId);
    return {
      name: user?.name,
      imageUrl: user?.imageUrl,
    };
  },
});

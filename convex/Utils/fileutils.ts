import { MutationCtx, QueryCtx } from "../_generated/server";
import {Doc, Id} from "../_generated/dataModel";
import {ConvexError} from "convex/values";

export async function hasAccessToOrg(
    ctx: MutationCtx | QueryCtx,
    orgId: string,
) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        return null;
    }
    const user = await ctx.db
        .query("users")
        .withIndex("token_identifier", (q) =>
            q.eq("tokenIdentifier", identity.tokenIdentifier),
        )
        .first();
    if (!user) {
        return null;
    }
    const hasAccess =
        user.orgIds.some((Id) => Id.orgId === orgId) ||
        user.tokenIdentifier.includes(orgId);
    if (!hasAccess) {
        return null;
    }
    return { user };
}

export async function hasAccessToFile(
    ctx: MutationCtx | QueryCtx,
    fileId: Id<"files">,
) {
    const file = await ctx.db.get(fileId);
    if (!file) {
        return null;
    }
    const hasAccess = await hasAccessToOrg(ctx, file.orgId);
    if (!hasAccess) {
        return null;
    }
    return { user: hasAccess.user, file };
}

export function canDelete(user: Doc<"users">, file: Doc<"files">) {
    const canDelete =
        file.userId === user._id ||
        user.orgIds
            .find((org) => org.orgId === file.orgId)
            ?.roles.includes("admin");

    if (!canDelete) {
        throw new ConvexError("You have no access to delete this file.");
    }
}
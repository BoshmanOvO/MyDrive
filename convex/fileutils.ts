import { MutationCtx, QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

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

import {MutationCtx, QueryCtx} from "../_generated/server";
import {ConvexError} from "convex/values";

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

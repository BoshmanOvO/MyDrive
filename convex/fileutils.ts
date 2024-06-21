import {MutationCtx, QueryCtx} from "./_generated/server";
import {Id} from "./_generated/dataModel";
import {getUser} from "./users";



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


export async function hasAccessToFile(
	ctx: MutationCtx | QueryCtx,
	fileId: Id<"files">,
) {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) {
		return null;
	}
	const file = await ctx.db.get(fileId);
	if (!file) {
		return null;
	}
	const hasAccess = await hasAccessToOrg(
		ctx,
		identity.tokenIdentifier,
		file.orgId,
	);
	if (!hasAccess) {
		return null;
	}
	const user = await getUser(ctx, identity.tokenIdentifier);
	if (!user) {
		return null;
	}
	return { user, file };
}
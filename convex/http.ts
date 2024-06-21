import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";

const handleClerkWebhook = httpAction(async (ctx, request) => {
  const event = await validateRequest(request);
  if (!event) {
    return new Response("Error occurred", {
      status: 400,
    });
  }
  switch (event.type) {
    case "user.created":
      await ctx.runMutation(internal.users.createUser, {
        tokenIdentifier: `https://busy-wahoo-3.clerk.accounts.dev|${event.data.id}`,
      });
      break;
    case "organizationMembership.created":
      await ctx.runMutation(internal.users.addOrgIdToUser, {
        tokenIdentifier: `https://busy-wahoo-3.clerk.accounts.dev|${event.data.public_user_data.user_id}`,
        orgId: event.data.organization.id,
        roles: event.data.role == 'org:admin' ? 'admin' : 'member',
      });
      break;
    case "organizationMembership.updated":
      await ctx.runMutation(internal.users.updateRoleInOrg, {
        tokenIdentifier: `https://busy-wahoo-3.clerk.accounts.dev|${event.data.public_user_data.user_id}`,
        orgId: event.data.organization.id,
        roles: event.data.role == 'org:admin' ? 'admin' : 'member',
      });
      break;
  }
  return new Response(null, {
    status: 200,
  });
});

const http = httpRouter();
http.route({
  path: "/clerk",
  method: "POST",
  handler: handleClerkWebhook,
});

const validateRequest = async (
  req: Request,
): Promise<WebhookEvent | undefined> => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;
  if (!webhookSecret) {
    throw new Error("CLERK_WEBHOOK_SECRET is not defined");
  }
  const payloadString = await req.text();
  const headerPayload = req.headers;
  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };
  const wh = new Webhook(webhookSecret);
  const event = wh.verify(payloadString, svixHeaders);
  return event as unknown as WebhookEvent;
};

export default http;

import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const cron = cronJobs();

cron.interval(
    "Delete files after 15 days",
    { hours: 360 }, // every minute
    internal.file.deleteAfterDays, // function to delete files after 15 days
);

export default cron;
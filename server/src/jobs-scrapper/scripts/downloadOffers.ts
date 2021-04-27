import launchScrapping from "../LaunchScrapping";

launchScrapping().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});

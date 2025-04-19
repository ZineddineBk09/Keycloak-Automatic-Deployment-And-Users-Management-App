export function getSystemInfo() {
  const ua = navigator.userAgent;
  const browserRegex = /(chrome|safari|firefox|opera|edge|msie|trident(?=\/))\/?\s*(\d+)/i;
  const match = ua.match(browserRegex) || [];
  const browser = match[1] || "unknown";
  const version = match[2] || "unknown";

  return {
    browser: `${browser} ${version}`,
    os: navigator.platform,
    language: navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    userAgent: ua
  };
}

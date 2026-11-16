export function pushToDataLayer(
  event: string,
  data: Record<string, unknown> = {}
) {
  if (import.meta.env.VITE_IS_PRODUCTION == "false") {
    return;
  }

  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event,
    ...data,
  });
}

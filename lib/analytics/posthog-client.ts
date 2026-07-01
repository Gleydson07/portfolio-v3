type PostHogClient = typeof import("posthog-js").default;

let loadPromise: Promise<PostHogClient | null> | null = null;
let initAttempted = false;

export function isAnalyticsEnabled() {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim());
}

function scheduleIdle(task: () => void) {
  if (typeof window === "undefined") return;

  const idleCallback = window.requestIdleCallback;
  if (typeof idleCallback === "function") {
    idleCallback(() => task(), { timeout: 2000 });
    return;
  }

  globalThis.setTimeout(task, 1);
}

function loadPostHog(): Promise<PostHogClient | null> {
  if (!isAnalyticsEnabled()) {
    return Promise.resolve(null);
  }

  if (!loadPromise) {
    loadPromise = import("posthog-js")
      .then(({ default: posthog }) => {
        if (!initAttempted) {
          initAttempted = true;

          try {
            posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
              api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
              person_profiles: "identified_only",
              capture_pageview: false,
              capture_pageleave: true,
              autocapture: false,
            });
          } catch {
            return null;
          }
        }

        return posthog;
      })
      .catch(() => null);
  }

  return loadPromise;
}

export function warmPostHogClient() {
  if (!isAnalyticsEnabled()) return;
  scheduleIdle(() => {
    void loadPostHog();
  });
}

export function captureSafe(event: string, properties?: Record<string, unknown>) {
  if (!isAnalyticsEnabled()) return;

  scheduleIdle(() => {
    void loadPostHog()
      .then((client) => {
        if (!client) return;

        try {
          client.capture(event, properties);
        } catch {
          // Analytics must never break the app.
        }
      })
      .catch(() => {
        // Ignore network/import failures.
      });
  });
}

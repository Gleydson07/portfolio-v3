import {
  AnalyticsEvents,
  type ArticleSpeechAction,
  type BlogPostAnalyticsProps,
  type ButtonClickProps,
  type CommentFormProps,
  type PageType,
  type SectionViewProps,
} from "@/lib/analytics/events";
import { captureSafe } from "@/lib/analytics/posthog-client";

function inferPageType(path: string): PageType {
  if (path === "/") return "home";
  if (path === "/blog") return "blog_list";
  if (path.startsWith("/blog/") && !path.startsWith("/blog/admin")) return "blog_post";
  return "other";
}

export function capturePageView(path: string, search = "") {
  captureSafe(AnalyticsEvents.pageViewed, {
    path,
    search: search || undefined,
    page_type: inferPageType(path),
    url: typeof window !== "undefined" ? window.location.href : undefined,
  });
}

export function captureBlogListViewed(totalPosts: number) {
  captureSafe(AnalyticsEvents.blogListViewed, {
    total_posts: totalPosts,
  });
}

export function captureBlogPostViewed(props: BlogPostAnalyticsProps) {
  captureSafe(AnalyticsEvents.blogPostViewed, {
    post_id: props.postId,
    post_slug: props.postSlug,
    post_title: props.postTitle,
    tags: props.tags,
  });
}

export function captureBlogPostClicked(props: BlogPostAnalyticsProps & { source: string }) {
  captureSafe(AnalyticsEvents.blogPostClicked, {
    post_id: props.postId,
    post_slug: props.postSlug,
    post_title: props.postTitle,
    source: props.source,
  });
}

export function captureSectionViewed(props: SectionViewProps) {
  captureSafe(AnalyticsEvents.sectionViewed, {
    section_id: props.sectionId,
    section_label: props.sectionLabel,
  });
}

export function captureButtonClick(props: ButtonClickProps) {
  captureSafe(AnalyticsEvents.buttonClicked, {
    button_id: props.buttonId,
    button_label: props.buttonLabel,
    location: props.location,
    href: props.href,
  });
}

export function captureArticleSpeechControl(
  action: ArticleSpeechAction,
  props: Pick<BlogPostAnalyticsProps, "postSlug" | "postTitle">,
) {
  captureSafe(AnalyticsEvents.articleSpeechControl, {
    action,
    post_slug: props.postSlug,
    post_title: props.postTitle,
  });
}

export function captureCommentFormStarted(props: CommentFormProps) {
  captureSafe(AnalyticsEvents.commentFormStarted, {
    post_id: props.postId,
    post_slug: props.postSlug,
    post_title: props.postTitle,
  });
}

export function captureCommentFormSubmitted(props: CommentFormProps) {
  captureSafe(AnalyticsEvents.commentFormSubmitted, {
    post_id: props.postId,
    post_slug: props.postSlug,
    post_title: props.postTitle,
  });
}

export function captureCommentFormAbandoned(
  props: CommentFormProps & {
    hadBody: boolean;
    hadName: boolean;
    bodyLength: number;
  },
) {
  captureSafe(AnalyticsEvents.commentFormAbandoned, {
    post_id: props.postId,
    post_slug: props.postSlug,
    post_title: props.postTitle,
    had_body: props.hadBody,
    had_name: props.hadName,
    body_length: props.bodyLength,
  });
}

export function captureBlogFilterApplied(props: {
  filterType: "search" | "tag" | "clear";
  query?: string;
  tag?: string;
}) {
  captureSafe(AnalyticsEvents.blogFilterApplied, {
    filter_type: props.filterType,
    query: props.query,
    tag: props.tag,
  });
}

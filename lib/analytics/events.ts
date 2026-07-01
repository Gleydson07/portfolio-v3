export const AnalyticsEvents = {
  pageViewed: "page_viewed",
  blogListViewed: "blog_list_viewed",
  blogPostViewed: "blog_post_viewed",
  blogPostClicked: "blog_post_clicked",
  sectionViewed: "section_viewed",
  buttonClicked: "button_clicked",
  articleSpeechControl: "article_speech_control",
  commentFormStarted: "comment_form_started",
  commentFormSubmitted: "comment_form_submitted",
  commentFormAbandoned: "comment_form_abandoned",
  blogFilterApplied: "blog_filter_applied",
} as const;

export type AnalyticsEvent = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

export type PageType = "home" | "blog_list" | "blog_post" | "other";

export type BlogPostAnalyticsProps = {
  postId: string;
  postSlug: string;
  postTitle: string;
  tags?: string[];
};

export type ButtonClickProps = {
  buttonId: string;
  buttonLabel: string;
  location: string;
  href?: string;
};

export type SectionViewProps = {
  sectionId: string;
  sectionLabel: string;
};

export type ArticleSpeechAction = "play" | "pause" | "resume" | "stop" | "completed" | "error";

export type CommentFormProps = {
  postId: string;
  postSlug: string;
  postTitle: string;
};

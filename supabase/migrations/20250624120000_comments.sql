create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_slug text not null,
  post_title text,
  author_name text check (
    author_name is null or char_length(trim(author_name)) between 1 and 80
  ),
  body text not null check (char_length(body) between 3 and 2000),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  rejected_at timestamptz,
  rejection_reason text check (
    rejection_reason is null or char_length(trim(rejection_reason)) between 3 and 500
  ),
  moderated_by text,
  ip_hash text,
  notification_sent_at timestamptz,
  notification_error text,
  constraint comments_status_dates_check check (
    (status = 'pending' and approved_at is null and rejected_at is null and rejection_reason is null)
    or (status = 'approved' and approved_at is not null and rejected_at is null and rejection_reason is null)
    or (status = 'rejected' and rejected_at is not null and rejection_reason is not null and approved_at is null)
  )
);

create index if not exists comments_pending_idx on comments (status, created_at desc)
  where status = 'pending';

create index if not exists comments_post_approved_idx on comments (post_slug, created_at asc)
  where status = 'approved';

alter table comments enable row level security;

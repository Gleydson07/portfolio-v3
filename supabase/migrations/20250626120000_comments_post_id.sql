alter table comments
  add column if not exists post_id text;

create index if not exists comments_post_id_approved_idx on comments (post_id, created_at desc)
  where status = 'approved' and post_id is not null;

alter table comments drop constraint if exists comments_post_id_check;

alter table comments add constraint comments_post_id_check check (
  post_id is null or char_length(trim(post_id)) between 1 and 128
);

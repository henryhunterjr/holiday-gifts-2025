-- Additive analytics setup. Apply to this guide's existing Supabase project.
create table public.guide_events (
 id bigint generated always as identity primary key,
 created_at timestamptz not null default now(),
 session_id uuid not null,
 event text not null check (event in ('page_view','product_view','gift_save','gift_remove','partner_click','offer_click','outbound_click','collection_click')),
 product text not null default '', brand text not null default '', path text not null,
 source text not null default 'direct', medium text not null default '', campaign text not null default '',
 device text not null check (device in ('mobile','desktop')),
 environment text not null check (environment in ('production','preview'))
);
create index guide_events_date_idx on public.guide_events(environment,created_at);
create index guide_events_session_idx on public.guide_events(session_id,created_at);
alter table public.guide_events enable row level security;
revoke all on public.guide_events from anon, authenticated;
-- No public table access. Admin reports are aggregate-only and role checked.
create function public.record_guide_event(payload jsonb) returns void
language plpgsql security definer set search_path=public as $$
declare sid uuid;
begin
 if octet_length(payload::text)>2200 then return; end if;
 if payload->>'event' not in ('page_view','product_view','gift_save','gift_remove','partner_click','offer_click','outbound_click','collection_click') then return; end if;
 if payload->>'device' not in ('mobile','desktop') or payload->>'environment' not in ('production','preview') then return; end if;
 sid := (payload->>'session')::uuid;
 if (select count(*) from public.guide_events where session_id=sid and created_at>now()-interval '30 minutes')>=250 then return; end if;
 insert into public.guide_events(session_id,event,product,brand,path,source,medium,campaign,device,environment)
 values(sid,payload->>'event',left(coalesce(payload->>'product',''),160),left(coalesce(payload->>'brand',''),100),left(payload->>'path',200),left(coalesce(payload->>'source','direct'),100),left(coalesce(payload->>'medium',''),80),left(coalesce(payload->>'campaign',''),100),payload->>'device',payload->>'environment');
exception when invalid_text_representation then return;
end; $$;
revoke all on function public.record_guide_event(jsonb) from public;
grant execute on function public.record_guide_event(jsonb) to anon,authenticated;

create function public.get_guide_report(days integer default 30, env text default 'production') returns jsonb
language plpgsql security definer set search_path=public as $$
declare result jsonb;
begin
 if auth.uid() is null or not public.has_role(auth.uid(),'admin') then raise exception 'Admin access required' using errcode='42501'; end if;
 if days not in (7,30,90) or env not in ('production','preview') then raise exception 'Invalid report range'; end if;
 with events as (select * from public.guide_events where created_at>=now()-make_interval(days=>days) and environment=env),
 totals as (select count(distinct session_id) as sessions,count(*) filter(where event='page_view') as views,count(*) filter(where event='gift_save') as saves,count(*) filter(where event in ('partner_click','offer_click')) as clicks from events),
 sources as (select source,medium,campaign,count(distinct session_id) as sessions,count(*) filter(where event in ('partner_click','offer_click')) as clicks from events group by source,medium,campaign order by sessions desc limit 50),
 products as (select product,brand,count(*) filter(where event='product_view') as views,count(*) filter(where event='gift_save') as saves,count(*) filter(where event='partner_click') as clicks from events where product<>'' and event in ('product_view','gift_save','partner_click') group by product,brand order by clicks desc,views desc limit 100),
 devices as (select device,count(distinct session_id) as sessions from events group by device)
 select jsonb_build_object('totals',(select to_jsonb(t) from totals t),'sources',coalesce((select jsonb_agg(s) from sources s),'[]'::jsonb),'products',coalesce((select jsonb_agg(p) from products p),'[]'::jsonb),'devices',coalesce((select jsonb_agg(d) from devices d),'[]'::jsonb)) into result;
 return result;
end; $$;
revoke all on function public.get_guide_report(integer,text) from public,anon;
grant execute on function public.get_guide_report(integer,text) to authenticated;

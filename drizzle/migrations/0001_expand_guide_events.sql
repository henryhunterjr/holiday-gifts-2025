alter table public.guide_events add column if not exists section text not null default '';

CREATE OR REPLACE FUNCTION public.record_guide_event(payload jsonb)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare sid uuid;
begin
 if octet_length(payload::text)>2200 then return; end if;
 if payload->>'event' not in ('page_view','product_view','gift_save','gift_remove','partner_click','offer_click','outbound_click','collection_click',
   'outbound_affiliate_click','promo_code_copy','academy_cert_cta_click','academy_cert_email_copy','quiz_start','quiz_step','quiz_complete','quiz_pick_click','filter_used','wishlist_toggle','giveaway_modal_open','free_guide_click','maker_door_click') then return; end if;
 if payload->>'device' not in ('mobile','desktop') or payload->>'environment' not in ('production','preview') then return; end if;
 sid := (payload->>'session')::uuid;
 if (select count(*) from public.guide_events where session_id=sid and created_at>now()-interval '30 minutes')>=250 then return; end if;
 insert into public.guide_events(session_id,event,product,brand,section,path,source,medium,campaign,device,environment)
 values(sid,payload->>'event',left(coalesce(payload->>'product',''),160),left(coalesce(payload->>'brand',''),100),left(coalesce(payload->>'section',''),80),left(payload->>'path',200),left(coalesce(nullif(payload->>'source',''),'direct'),100),left(coalesce(payload->>'medium',''),80),left(coalesce(payload->>'campaign',''),100),payload->>'device',payload->>'environment');
exception when invalid_text_representation then return;
end; $function$;

CREATE OR REPLACE FUNCTION public.get_guide_report(days integer DEFAULT 30, env text DEFAULT 'production'::text)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare result jsonb;
begin
 if auth.uid() is null or not public.has_role(auth.uid(),'admin') then raise exception 'Admin access required' using errcode='42501'; end if;
 if days not in (7,30,90) or env not in ('production','preview') then raise exception 'Invalid report range'; end if;
 with events as (select * from public.guide_events where created_at>=now()-make_interval(days=>days) and environment=env),
 clicks as (select * from events where event in ('partner_click','offer_click','outbound_affiliate_click','quiz_pick_click')),
 totals as (select count(distinct session_id) as sessions,count(*) filter(where event='page_view') as views,
   count(*) filter(where event='gift_save' or event='wishlist_toggle') as saves,
   (select count(*) from clicks) as clicks from events),
 sources as (select source,medium,campaign,count(distinct session_id) as sessions,count(*) filter(where event in ('partner_click','offer_click','outbound_affiliate_click','quiz_pick_click')) as clicks from events group by source,medium,campaign order by sessions desc limit 50),
 products as (select product,brand,count(*) filter(where event='product_view') as views,count(*) filter(where event in ('gift_save','wishlist_toggle')) as saves,count(*) filter(where event in ('partner_click','outbound_affiliate_click','quiz_pick_click')) as clicks from events where product<>'' group by product,brand order by clicks desc,views desc limit 100),
 devices as (select device,count(distinct session_id) as sessions from events group by device),
 event_counts as (select event,count(*) as count,count(distinct session_id) as sessions from events group by event order by count desc),
 brands as (select brand,count(*) as actions,count(*) filter(where event in ('partner_click','offer_click','outbound_affiliate_click','quiz_pick_click')) as clicks,count(*) filter(where event='promo_code_copy') as code_copies,count(*) filter(where event='maker_door_click') as maker_doors from events where brand<>'' group by brand order by actions desc limit 50),
 sections as (select section,count(*) as actions,count(distinct session_id) as sessions,count(*) filter(where event in ('partner_click','offer_click','outbound_affiliate_click','quiz_pick_click')) as clicks from events where section<>'' group by section order by actions desc limit 50)
 select jsonb_build_object('totals',(select to_jsonb(t) from totals t),'sources',coalesce((select jsonb_agg(s) from sources s),'[]'),'products',coalesce((select jsonb_agg(p) from products p),'[]'),'devices',coalesce((select jsonb_agg(d) from devices d),'[]'),
  'events',coalesce((select jsonb_agg(e) from event_counts e),'[]'),'brands',coalesce((select jsonb_agg(b) from brands b),'[]'),'sections',coalesce((select jsonb_agg(x) from sections x),'[]')) into result;
 return result;
end; $function$;
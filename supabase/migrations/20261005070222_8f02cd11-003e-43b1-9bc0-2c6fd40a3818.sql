create policy "admins read all roles" on public.user_roles for select to authenticated
  using (private.has_role(auth.uid(), 'admin'));

create or replace function public.admin_set_role(_user_id uuid, _role public.app_role, _grant boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not private.has_role(auth.uid(), 'admin') then raise exception 'FORBIDDEN'; end if;
  if not _grant and _user_id = auth.uid() and _role = 'admin' then raise exception 'CANNOT_REMOVE_SELF'; end if;
  if _grant then
    insert into public.user_roles(user_id, role) values (_user_id, _role) on conflict do nothing;
  else
    delete from public.user_roles where user_id = _user_id and role = _role;
  end if;
end $$;

create or replace function public.claim_first_admin()
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'FORBIDDEN'; end if;
  if exists (select 1 from public.user_roles where role = 'admin') then return false; end if;
  insert into public.user_roles(user_id, role) values (auth.uid(), 'admin') on conflict do nothing;
  return true;
end $$;

revoke execute on function public.admin_set_role(uuid, public.app_role, boolean) from public, anon;
revoke execute on function public.claim_first_admin() from public, anon;
grant execute on function public.admin_set_role(uuid, public.app_role, boolean) to authenticated;
grant execute on function public.claim_first_admin() to authenticated;
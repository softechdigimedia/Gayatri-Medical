create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare _initial_role public.app_role;
begin
  -- Serialize initial account creation so concurrent sign-ups cannot both claim administrator.
  perform pg_advisory_xact_lock(hashtext('aarogya-first-admin-bootstrap'));
  if exists (select 1 from public.user_roles where role = 'admin') then
    _initial_role := 'patient';
  else
    _initial_role := 'admin';
  end if;
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), new.email)
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, _initial_role)
  on conflict do nothing;
  return new;
end $$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Managers/staff remain able to manage appointments and doctor schedules, but only admins can manage master clinic data.
-- Already updated clinic/department/doctor policies in prior migration.

-- Admins may view all patient profile cards in the administration area; others may only view their own.
drop policy if exists "own profile read" on public.profiles;
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile or admin" on public.profiles for select to authenticated
  using (id = auth.uid() or private.has_role(auth.uid(), 'admin'));

-- Permit tightly scoped role assignment/removal through RLS. The role check is backed by the private DB function.
grant insert, delete on public.user_roles to authenticated;
create policy "admins assign roles" on public.user_roles for insert to authenticated
  with check (private.has_role(auth.uid(), 'admin'));
create policy "admins remove roles" on public.user_roles for delete to authenticated
  using (private.has_role(auth.uid(), 'admin') and not (user_id = auth.uid() and role = 'admin'));

-- These SECURITY DEFINER routines are not part of the client access path.
revoke execute on function public.admin_set_role(uuid, public.app_role, boolean) from public, anon, authenticated;
grant execute on function public.admin_set_role(uuid, public.app_role, boolean) to service_role;
revoke execute on function public.claim_first_admin() from public, anon, authenticated;
grant execute on function public.claim_first_admin() to service_role;
drop policy if exists "staff write clinics" on public.clinics;
create policy "admin write clinics" on public.clinics for all to authenticated
  using (private.has_role(auth.uid(), 'admin')) with check (private.has_role(auth.uid(), 'admin'));

drop policy if exists "staff write departments" on public.departments;
create policy "admin write departments" on public.departments for all to authenticated
  using (private.has_role(auth.uid(), 'admin')) with check (private.has_role(auth.uid(), 'admin'));

drop policy if exists "staff write doctors" on public.doctors;
create policy "admin write doctors" on public.doctors for all to authenticated
  using (private.has_role(auth.uid(), 'admin')) with check (private.has_role(auth.uid(), 'admin'));

-- Role changes are only made by the protected admin server function, which uses the server-only client.
revoke execute on function public.admin_set_role(uuid, public.app_role, boolean) from public, anon, authenticated;
grant execute on function public.admin_set_role(uuid, public.app_role, boolean) to service_role;
revoke execute on function public.claim_first_admin() from public, anon, authenticated;
grant execute on function public.claim_first_admin() to service_role;
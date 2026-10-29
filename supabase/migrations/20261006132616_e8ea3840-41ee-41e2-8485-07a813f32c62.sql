revoke execute on function public.admin_set_role(uuid, public.app_role, boolean) from public, anon, authenticated;
revoke execute on function public.claim_first_admin() from public, anon, authenticated;
grant execute on function public.admin_set_role(uuid, public.app_role, boolean) to service_role;
grant execute on function public.claim_first_admin() to service_role;
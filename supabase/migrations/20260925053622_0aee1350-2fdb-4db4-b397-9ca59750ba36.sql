
create schema if not exists private;
grant usage on schema private to authenticated, service_role;

create or replace function private.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
create or replace function private.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','manager','staff'))
$$;
revoke execute on function private.has_role(uuid, public.app_role) from public;
revoke execute on function private.is_staff(uuid) from public;
grant execute on function private.has_role(uuid, public.app_role) to authenticated, service_role;
grant execute on function private.is_staff(uuid) to authenticated, service_role;

-- recreate policies against the private helpers
drop policy "own profile read" on public.profiles;
create policy "own profile read" on public.profiles for select to authenticated
  using (id = auth.uid() or private.is_staff(auth.uid()));

drop policy "read own roles" on public.user_roles;
create policy "read own roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or private.has_role(auth.uid(),'admin'));

drop policy "staff write clinics" on public.clinics;
create policy "staff write clinics" on public.clinics for all to authenticated
  using (private.is_staff(auth.uid())) with check (private.is_staff(auth.uid()));

drop policy "staff write departments" on public.departments;
create policy "staff write departments" on public.departments for all to authenticated
  using (private.is_staff(auth.uid())) with check (private.is_staff(auth.uid()));

drop policy "staff write doctors" on public.doctors;
create policy "staff write doctors" on public.doctors for all to authenticated
  using (private.is_staff(auth.uid())) with check (private.is_staff(auth.uid()));

drop policy "manage own schedule" on public.doctor_schedules;
create policy "manage own schedule" on public.doctor_schedules for all to authenticated
  using (private.is_staff(auth.uid()) or exists (select 1 from public.doctors d where d.id = doctor_id and d.user_id = auth.uid()))
  with check (private.is_staff(auth.uid()) or exists (select 1 from public.doctors d where d.id = doctor_id and d.user_id = auth.uid()));

drop policy "manage own breaks" on public.doctor_breaks;
create policy "manage own breaks" on public.doctor_breaks for all to authenticated
  using (private.is_staff(auth.uid()) or exists (select 1 from public.doctors d where d.id = doctor_id and d.user_id = auth.uid()))
  with check (private.is_staff(auth.uid()) or exists (select 1 from public.doctors d where d.id = doctor_id and d.user_id = auth.uid()));

drop policy "manage own leave" on public.doctor_leave;
create policy "manage own leave" on public.doctor_leave for all to authenticated
  using (private.is_staff(auth.uid()) or exists (select 1 from public.doctors d where d.id = doctor_id and d.user_id = auth.uid()))
  with check (private.is_staff(auth.uid()) or exists (select 1 from public.doctors d where d.id = doctor_id and d.user_id = auth.uid()));

drop policy "staff write holidays" on public.clinic_holidays;
create policy "staff write holidays" on public.clinic_holidays for all to authenticated
  using (private.is_staff(auth.uid())) with check (private.is_staff(auth.uid()));

drop policy "staff write reviews" on public.reviews;
create policy "staff write reviews" on public.reviews for all to authenticated
  using (private.is_staff(auth.uid())) with check (private.is_staff(auth.uid()));

drop policy "admin write settings" on public.app_settings;
create policy "admin write settings" on public.app_settings for all to authenticated
  using (private.has_role(auth.uid(),'admin')) with check (private.has_role(auth.uid(),'admin'));

drop policy "patients read own" on public.patients;
create policy "patients read own" on public.patients for select to authenticated
  using (profile_id = auth.uid() or private.is_staff(auth.uid())
    or exists (select 1 from public.appointments a join public.doctors d on d.id = a.doctor_id
               where a.patient_id = patients.id and d.user_id = auth.uid()));
drop policy "patients insert own" on public.patients;
create policy "patients insert own" on public.patients for insert to authenticated
  with check (profile_id = auth.uid() or private.is_staff(auth.uid()));
drop policy "patients update own" on public.patients;
create policy "patients update own" on public.patients for update to authenticated
  using (profile_id = auth.uid() or private.is_staff(auth.uid()));
drop policy "patients delete staff" on public.patients;
create policy "patients delete staff" on public.patients for delete to authenticated
  using (private.is_staff(auth.uid()));

drop policy "appointments read" on public.appointments;
create policy "appointments read" on public.appointments for select to authenticated
  using (private.is_staff(auth.uid())
    or exists (select 1 from public.patients p where p.id = patient_id and p.profile_id = auth.uid())
    or exists (select 1 from public.doctors d where d.id = doctor_id and d.user_id = auth.uid()));
drop policy "appointments insert" on public.appointments;
create policy "appointments insert" on public.appointments for insert to authenticated
  with check (private.is_staff(auth.uid())
    or exists (select 1 from public.patients p where p.id = patient_id and p.profile_id = auth.uid()));
drop policy "appointments update" on public.appointments;
create policy "appointments update" on public.appointments for update to authenticated
  using (private.is_staff(auth.uid())
    or exists (select 1 from public.patients p where p.id = patient_id and p.profile_id = auth.uid())
    or exists (select 1 from public.doctors d where d.id = doctor_id and d.user_id = auth.uid()));
drop policy "appointments delete staff" on public.appointments;
create policy "appointments delete staff" on public.appointments for delete to authenticated
  using (private.is_staff(auth.uid()));

drop policy "payments read" on public.payments;
create policy "payments read" on public.payments for select to authenticated
  using (private.is_staff(auth.uid())
    or exists (select 1 from public.appointments a join public.patients p on p.id = a.patient_id
               where a.id = appointment_id and p.profile_id = auth.uid()));
drop policy "payments write staff" on public.payments;
create policy "payments write staff" on public.payments for all to authenticated
  using (private.is_staff(auth.uid())) with check (private.is_staff(auth.uid()));

drop policy "notifications read own" on public.notifications;
create policy "notifications read own" on public.notifications for select to authenticated
  using (user_id = auth.uid() or private.is_staff(auth.uid()));
drop policy "notifications write staff" on public.notifications;
create policy "notifications write staff" on public.notifications for insert to authenticated
  with check (private.is_staff(auth.uid()) or user_id = auth.uid());

drop policy "documents read" on public.documents;
create policy "documents read" on public.documents for select to authenticated
  using (private.is_staff(auth.uid())
    or exists (select 1 from public.patients p where p.id = patient_id and p.profile_id = auth.uid())
    or exists (select 1 from public.doctors d where d.id = doctor_id and d.user_id = auth.uid()));
drop policy "documents write clinical" on public.documents;
create policy "documents write clinical" on public.documents for all to authenticated
  using (private.is_staff(auth.uid()) or exists (select 1 from public.doctors d where d.id = doctor_id and d.user_id = auth.uid()))
  with check (private.is_staff(auth.uid()) or exists (select 1 from public.doctors d where d.id = doctor_id and d.user_id = auth.uid()));

-- booking functions now use the private helpers
create or replace function public.cancel_appointment(_appointment_id uuid, _reason text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _appt public.appointments;
begin
  select * into _appt from public.appointments where id = _appointment_id;
  if _appt is null then raise exception 'NOT_FOUND'; end if;
  if not (private.is_staff(_uid)
    or exists (select 1 from public.patients p where p.id = _appt.patient_id and p.profile_id = _uid)
    or exists (select 1 from public.doctors d where d.id = _appt.doctor_id and d.user_id = _uid)) then
    raise exception 'FORBIDDEN';
  end if;
  if _appt.status in ('cancelled','completed') then raise exception 'NOT_CANCELLABLE'; end if;
  update public.appointments set status = 'cancelled' where id = _appointment_id;
  update public.payments set status = case when status = 'paid' then 'refunded' else status end
    where appointment_id = _appointment_id;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.reschedule_appointment(_appointment_id uuid, _date date, _start time)
returns jsonb language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _appt public.appointments; _slot_min int;
begin
  select * into _appt from public.appointments where id = _appointment_id;
  if _appt is null then raise exception 'NOT_FOUND'; end if;
  if not (private.is_staff(_uid)
    or exists (select 1 from public.patients p where p.id = _appt.patient_id and p.profile_id = _uid)) then
    raise exception 'FORBIDDEN';
  end if;
  update public.appointments set status = 'cancelled' where id = _appointment_id;
  if not exists (select 1 from public.get_doctor_slots(_appt.doctor_id, _date) s
                 where s.slot_time = _start and s.is_available) then
    update public.appointments set status = _appt.status where id = _appointment_id;
    raise exception 'SLOT_UNAVAILABLE';
  end if;
  select coalesce(min(slot_minutes),30) into _slot_min from public.doctor_schedules
    where doctor_id = _appt.doctor_id and weekday = extract(isodow from _date)::int;
  insert into public.appointments (doctor_id, patient_id, clinic_id, department_id, appointment_date,
    start_time, end_time, appointment_type, status, reason, fee, tax, discount, total, created_by)
  values (_appt.doctor_id, _appt.patient_id, _appt.clinic_id, _appt.department_id, _date, _start,
    (_start + make_interval(mins => _slot_min))::time, _appt.appointment_type, 'confirmed', _appt.reason,
    _appt.fee, _appt.tax, _appt.discount, _appt.total, _uid);
  return jsonb_build_object('ok', true);
end $$;

drop function if exists public.has_role(uuid, public.app_role);
drop function if exists public.is_staff(uuid);
revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.touch_updated_at() from anon, authenticated, public;
revoke execute on function public.get_doctor_slots(uuid, date) from public;
revoke execute on function public.next_available_slot(uuid) from public;
revoke execute on function public.book_appointment(uuid, date, time, text, jsonb, text, text) from public, anon;
revoke execute on function public.cancel_appointment(uuid, text) from public, anon;
revoke execute on function public.reschedule_appointment(uuid, date, time) from public, anon;
grant execute on function public.get_doctor_slots(uuid, date) to anon, authenticated, service_role;
grant execute on function public.next_available_slot(uuid) to anon, authenticated, service_role;
grant execute on function public.book_appointment(uuid, date, time, text, jsonb, text, text) to authenticated, service_role;
grant execute on function public.cancel_appointment(uuid, text) to authenticated, service_role;
grant execute on function public.reschedule_appointment(uuid, date, time) to authenticated, service_role;

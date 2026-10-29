
-- ============ ROLES ============
create type public.app_role as enum ('patient','doctor','manager','admin','staff');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  date_of_birth date,
  gender text,
  address text,
  city text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','manager','staff'))
$$;

create policy "own profile read" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_staff(auth.uid()));
create policy "own profile insert" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid());

create policy "read own roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), new.email)
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'patient')
  on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

-- ============ CLINIC STRUCTURE ============
create table public.clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  address text not null,
  city text not null,
  phone text,
  email text,
  opens_at time not null default '08:00',
  closes_at time not null default '20:00',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.doctors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  slug text not null unique,
  qualification text not null,
  specialty text not null,
  department_id uuid references public.departments(id) on delete set null,
  clinic_id uuid references public.clinics(id) on delete set null,
  experience_years int not null default 0,
  gender text not null default 'male',
  languages text[] not null default '{}',
  registration_no text,
  about text,
  expertise text[] not null default '{}',
  consultation_fee numeric(10,2) not null default 500,
  supports_online boolean not null default true,
  supports_clinic boolean not null default true,
  rating numeric(2,1) not null default 4.5,
  review_count int not null default 0,
  photo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.doctor_schedules (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  weekday int not null check (weekday between 1 and 7),
  start_time time not null,
  end_time time not null,
  slot_minutes int not null default 30,
  max_appointments int,
  is_active boolean not null default true
);

create table public.doctor_breaks (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  weekday int not null check (weekday between 1 and 7),
  start_time time not null,
  end_time time not null,
  label text
);

create table public.doctor_leave (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  reason text,
  created_at timestamptz not null default now()
);

create table public.clinic_holidays (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references public.clinics(id) on delete cascade,
  holiday_date date not null,
  name text not null
);

create table public.patients (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text,
  phone text not null,
  date_of_birth date,
  gender text,
  address text,
  city text,
  blood_group text,
  allergies text,
  created_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  booking_ref text not null unique default 'APT-' || upper(substr(md5(random()::text),1,8)),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  clinic_id uuid references public.clinics(id) on delete set null,
  department_id uuid references public.departments(id) on delete set null,
  appointment_date date not null,
  start_time time not null,
  end_time time not null,
  appointment_type text not null default 'clinic',
  status text not null default 'pending',
  reason text,
  consultation_notes text,
  fee numeric(10,2) not null default 0,
  tax numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index appointments_slot_unique on public.appointments (doctor_id, appointment_date, start_time)
  where status in ('pending','confirmed','completed');
create index appointments_patient_idx on public.appointments (patient_id);
create index appointments_doctor_date_idx on public.appointments (doctor_id, appointment_date);
create trigger appointments_touch before update on public.appointments
  for each row execute function public.touch_updated_at();

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  amount numeric(10,2) not null,
  method text not null default 'clinic',
  status text not null default 'unpaid',
  reference text,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  patient_id uuid references public.patients(id) on delete cascade,
  title text not null,
  body text,
  kind text not null default 'info',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  patient_name text not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  doctor_id uuid references public.doctors(id) on delete set null,
  title text not null,
  kind text not null default 'prescription',
  content text,
  file_url text,
  created_at timestamptz not null default now()
);

create table public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ============ GRANTS ============
grant select on public.clinics, public.departments, public.doctors, public.doctor_schedules,
  public.doctor_breaks, public.doctor_leave, public.clinic_holidays, public.reviews, public.app_settings to anon;
grant select, insert, update, delete on public.clinics, public.departments, public.doctors,
  public.doctor_schedules, public.doctor_breaks, public.doctor_leave, public.clinic_holidays,
  public.patients, public.appointments, public.payments, public.notifications, public.reviews,
  public.documents, public.app_settings to authenticated;
grant all on public.clinics, public.departments, public.doctors, public.doctor_schedules,
  public.doctor_breaks, public.doctor_leave, public.clinic_holidays, public.patients,
  public.appointments, public.payments, public.notifications, public.reviews, public.documents,
  public.app_settings to service_role;

-- ============ RLS ============
alter table public.clinics enable row level security;
alter table public.departments enable row level security;
alter table public.doctors enable row level security;
alter table public.doctor_schedules enable row level security;
alter table public.doctor_breaks enable row level security;
alter table public.doctor_leave enable row level security;
alter table public.clinic_holidays enable row level security;
alter table public.patients enable row level security;
alter table public.appointments enable row level security;
alter table public.payments enable row level security;
alter table public.notifications enable row level security;
alter table public.reviews enable row level security;
alter table public.documents enable row level security;
alter table public.app_settings enable row level security;

create policy "public read clinics" on public.clinics for select using (true);
create policy "staff write clinics" on public.clinics for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create policy "public read departments" on public.departments for select using (true);
create policy "staff write departments" on public.departments for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create policy "public read doctors" on public.doctors for select using (true);
create policy "staff write doctors" on public.doctors for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create policy "public read schedules" on public.doctor_schedules for select using (true);
create policy "manage own schedule" on public.doctor_schedules for all to authenticated
  using (public.is_staff(auth.uid()) or exists (select 1 from public.doctors d where d.id = doctor_id and d.user_id = auth.uid()))
  with check (public.is_staff(auth.uid()) or exists (select 1 from public.doctors d where d.id = doctor_id and d.user_id = auth.uid()));

create policy "public read breaks" on public.doctor_breaks for select using (true);
create policy "manage own breaks" on public.doctor_breaks for all to authenticated
  using (public.is_staff(auth.uid()) or exists (select 1 from public.doctors d where d.id = doctor_id and d.user_id = auth.uid()))
  with check (public.is_staff(auth.uid()) or exists (select 1 from public.doctors d where d.id = doctor_id and d.user_id = auth.uid()));

create policy "public read leave" on public.doctor_leave for select using (true);
create policy "manage own leave" on public.doctor_leave for all to authenticated
  using (public.is_staff(auth.uid()) or exists (select 1 from public.doctors d where d.id = doctor_id and d.user_id = auth.uid()))
  with check (public.is_staff(auth.uid()) or exists (select 1 from public.doctors d where d.id = doctor_id and d.user_id = auth.uid()));

create policy "public read holidays" on public.clinic_holidays for select using (true);
create policy "staff write holidays" on public.clinic_holidays for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create policy "public read reviews" on public.reviews for select using (true);
create policy "staff write reviews" on public.reviews for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create policy "public read settings" on public.app_settings for select using (true);
create policy "admin write settings" on public.app_settings for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "patients read own" on public.patients for select to authenticated
  using (profile_id = auth.uid() or public.is_staff(auth.uid())
    or exists (select 1 from public.appointments a join public.doctors d on d.id = a.doctor_id
               where a.patient_id = patients.id and d.user_id = auth.uid()));
create policy "patients insert own" on public.patients for insert to authenticated
  with check (profile_id = auth.uid() or public.is_staff(auth.uid()));
create policy "patients update own" on public.patients for update to authenticated
  using (profile_id = auth.uid() or public.is_staff(auth.uid()));
create policy "patients delete staff" on public.patients for delete to authenticated
  using (public.is_staff(auth.uid()));

create policy "appointments read" on public.appointments for select to authenticated
  using (public.is_staff(auth.uid())
    or exists (select 1 from public.patients p where p.id = patient_id and p.profile_id = auth.uid())
    or exists (select 1 from public.doctors d where d.id = doctor_id and d.user_id = auth.uid()));
create policy "appointments insert" on public.appointments for insert to authenticated
  with check (public.is_staff(auth.uid())
    or exists (select 1 from public.patients p where p.id = patient_id and p.profile_id = auth.uid()));
create policy "appointments update" on public.appointments for update to authenticated
  using (public.is_staff(auth.uid())
    or exists (select 1 from public.patients p where p.id = patient_id and p.profile_id = auth.uid())
    or exists (select 1 from public.doctors d where d.id = doctor_id and d.user_id = auth.uid()));
create policy "appointments delete staff" on public.appointments for delete to authenticated
  using (public.is_staff(auth.uid()));

create policy "payments read" on public.payments for select to authenticated
  using (public.is_staff(auth.uid())
    or exists (select 1 from public.appointments a join public.patients p on p.id = a.patient_id
               where a.id = appointment_id and p.profile_id = auth.uid()));
create policy "payments write staff" on public.payments for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create policy "notifications read own" on public.notifications for select to authenticated
  using (user_id = auth.uid() or public.is_staff(auth.uid()));
create policy "notifications update own" on public.notifications for update to authenticated
  using (user_id = auth.uid());
create policy "notifications write staff" on public.notifications for insert to authenticated
  with check (public.is_staff(auth.uid()) or user_id = auth.uid());

create policy "documents read" on public.documents for select to authenticated
  using (public.is_staff(auth.uid())
    or exists (select 1 from public.patients p where p.id = patient_id and p.profile_id = auth.uid())
    or exists (select 1 from public.doctors d where d.id = doctor_id and d.user_id = auth.uid()));
create policy "documents write clinical" on public.documents for all to authenticated
  using (public.is_staff(auth.uid()) or exists (select 1 from public.doctors d where d.id = doctor_id and d.user_id = auth.uid()))
  with check (public.is_staff(auth.uid()) or exists (select 1 from public.doctors d where d.id = doctor_id and d.user_id = auth.uid()));

-- ============ AVAILABILITY ENGINE ============
create or replace function public.get_doctor_slots(_doctor_id uuid, _date date)
returns table (slot_time time, is_available boolean, reason text)
language plpgsql stable security definer set search_path = public as $$
declare _dow int; _min_notice int;
begin
  _dow := extract(isodow from _date)::int;
  select coalesce((value->>'min_advance_minutes')::int, 60) into _min_notice from public.app_settings where key = 'booking_rules';
  _min_notice := coalesce(_min_notice, 60);
  return query
  with sched as (
    select s.start_time, s.end_time, s.slot_minutes
    from public.doctor_schedules s
    where s.doctor_id = _doctor_id and s.weekday = _dow and s.is_active
  ),
  gen as (
    select generate_series(
      (_date + sched.start_time)::timestamp,
      (_date + sched.end_time)::timestamp - make_interval(mins => sched.slot_minutes),
      make_interval(mins => sched.slot_minutes)
    ) as ts
    from sched
  )
  select g.ts::time as slot_time,
    case
      when exists (select 1 from public.doctor_breaks b where b.doctor_id = _doctor_id and b.weekday = _dow
                   and g.ts::time >= b.start_time and g.ts::time < b.end_time) then false
      when exists (select 1 from public.doctor_leave l where l.doctor_id = _doctor_id
                   and _date between l.start_date and l.end_date) then false
      when exists (select 1 from public.clinic_holidays h join public.doctors d on d.clinic_id = h.clinic_id
                   where d.id = _doctor_id and h.holiday_date = _date) then false
      when exists (select 1 from public.appointments a where a.doctor_id = _doctor_id
                   and a.appointment_date = _date and a.start_time = g.ts::time
                   and a.status in ('pending','confirmed','completed')) then false
      when g.ts < now() + make_interval(mins => _min_notice) then false
      else true
    end as is_available,
    case
      when exists (select 1 from public.doctor_breaks b where b.doctor_id = _doctor_id and b.weekday = _dow
                   and g.ts::time >= b.start_time and g.ts::time < b.end_time) then 'break'
      when exists (select 1 from public.doctor_leave l where l.doctor_id = _doctor_id
                   and _date between l.start_date and l.end_date) then 'leave'
      when exists (select 1 from public.clinic_holidays h join public.doctors d on d.clinic_id = h.clinic_id
                   where d.id = _doctor_id and h.holiday_date = _date) then 'holiday'
      when exists (select 1 from public.appointments a where a.doctor_id = _doctor_id
                   and a.appointment_date = _date and a.start_time = g.ts::time
                   and a.status in ('pending','confirmed','completed')) then 'booked'
      when g.ts < now() + make_interval(mins => _min_notice) then 'past'
      else 'open'
    end as reason
  from gen g order by 1;
end $$;
grant execute on function public.get_doctor_slots(uuid, date) to anon, authenticated, service_role;

create or replace function public.next_available_slot(_doctor_id uuid)
returns table (slot_date date, slot_time time)
language plpgsql stable security definer set search_path = public as $$
declare d date;
begin
  for i in 0..13 loop
    d := (now()::date + i);
    return query select d, s.slot_time from public.get_doctor_slots(_doctor_id, d) s
      where s.is_available limit 1;
    if found then return; end if;
  end loop;
end $$;
grant execute on function public.next_available_slot(uuid) to anon, authenticated, service_role;

-- ============ BOOKING (transactional) ============
create or replace function public.book_appointment(
  _doctor_id uuid, _date date, _start time, _appointment_type text,
  _patient jsonb, _reason text, _payment_method text
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid();
  _doc record; _slot_min int; _patient_id uuid; _appt public.appointments;
  _tax numeric(10,2); _total numeric(10,2); _tax_rate numeric := 0.18;
  _min_notice int := 60; _pay_status text;
begin
  select * into _doc from public.doctors where id = _doctor_id and is_active;
  if _doc is null then raise exception 'DOCTOR_UNAVAILABLE'; end if;

  select coalesce((value->>'tax_rate')::numeric, 0.18), coalesce((value->>'min_advance_minutes')::int, 60)
    into _tax_rate, _min_notice from public.app_settings where key = 'booking_rules';
  _tax_rate := coalesce(_tax_rate, 0.18); _min_notice := coalesce(_min_notice, 60);

  if (_date + _start)::timestamp < now() + make_interval(mins => _min_notice) then
    raise exception 'SLOT_TOO_SOON';
  end if;

  if not exists (select 1 from public.get_doctor_slots(_doctor_id, _date) s
                 where s.slot_time = _start and s.is_available) then
    raise exception 'SLOT_UNAVAILABLE';
  end if;

  select coalesce(min(slot_minutes),30) into _slot_min from public.doctor_schedules
    where doctor_id = _doctor_id and weekday = extract(isodow from _date)::int;

  if _uid is not null then
    select id into _patient_id from public.patients where profile_id = _uid limit 1;
  end if;

  if _patient_id is null then
    insert into public.patients (profile_id, full_name, email, phone, date_of_birth, gender, address, city)
    values (_uid, _patient->>'full_name', _patient->>'email', coalesce(_patient->>'phone',''),
            nullif(_patient->>'date_of_birth','')::date, _patient->>'gender', _patient->>'address', _patient->>'city')
    returning id into _patient_id;
  else
    update public.patients set
      full_name = coalesce(nullif(_patient->>'full_name',''), full_name),
      phone = coalesce(nullif(_patient->>'phone',''), phone),
      email = coalesce(nullif(_patient->>'email',''), email),
      date_of_birth = coalesce(nullif(_patient->>'date_of_birth','')::date, date_of_birth),
      gender = coalesce(nullif(_patient->>'gender',''), gender),
      address = coalesce(nullif(_patient->>'address',''), address)
    where id = _patient_id;
  end if;

  _tax := round(_doc.consultation_fee * _tax_rate, 2);
  _total := _doc.consultation_fee + _tax;
  _pay_status := case when _payment_method = 'online' then 'paid' else 'unpaid' end;

  insert into public.appointments (doctor_id, patient_id, clinic_id, department_id, appointment_date,
    start_time, end_time, appointment_type, status, reason, fee, tax, total, created_by)
  values (_doctor_id, _patient_id, _doc.clinic_id, _doc.department_id, _date, _start,
    (_start + make_interval(mins => _slot_min))::time, coalesce(_appointment_type,'clinic'),
    case when _payment_method = 'online' then 'confirmed' else 'pending' end,
    _reason, _doc.consultation_fee, _tax, _total, _uid)
  returning * into _appt;

  insert into public.payments (appointment_id, amount, method, status, reference)
  values (_appt.id, _total, coalesce(_payment_method,'clinic'), _pay_status,
    case when _payment_method = 'online' then 'PAY-' || upper(substr(md5(random()::text),1,10)) else null end);

  if _uid is not null then
    insert into public.notifications (user_id, patient_id, title, body, kind)
    values (_uid, _patient_id, 'Appointment ' || initcap(_appt.status),
      'Your appointment with ' || _doc.full_name || ' on ' || to_char(_date,'DD Mon YYYY') || ' at ' || to_char(_start,'HH12:MI AM') || ' is ' || _appt.status || '.',
      'appointment');
  end if;

  return jsonb_build_object('id', _appt.id, 'booking_ref', _appt.booking_ref, 'status', _appt.status,
    'total', _appt.total, 'payment_status', _pay_status);
exception when unique_violation then
  raise exception 'SLOT_UNAVAILABLE';
end $$;
grant execute on function public.book_appointment(uuid, date, time, text, jsonb, text, text) to authenticated, service_role;

create or replace function public.cancel_appointment(_appointment_id uuid, _reason text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _appt public.appointments;
begin
  select * into _appt from public.appointments where id = _appointment_id;
  if _appt is null then raise exception 'NOT_FOUND'; end if;
  if not (public.is_staff(_uid)
    or exists (select 1 from public.patients p where p.id = _appt.patient_id and p.profile_id = _uid)
    or exists (select 1 from public.doctors d where d.id = _appt.doctor_id and d.user_id = _uid)) then
    raise exception 'FORBIDDEN';
  end if;
  if _appt.status in ('cancelled','completed') then raise exception 'NOT_CANCELLABLE'; end if;
  update public.appointments set status = 'cancelled',
    consultation_notes = coalesce(consultation_notes,'') where id = _appointment_id;
  update public.payments set status = case when status = 'paid' then 'refunded' else status end
    where appointment_id = _appointment_id;
  return jsonb_build_object('ok', true);
end $$;
grant execute on function public.cancel_appointment(uuid, text) to authenticated, service_role;

create or replace function public.reschedule_appointment(_appointment_id uuid, _date date, _start time)
returns jsonb language plpgsql security definer set search_path = public as $$
declare _uid uuid := auth.uid(); _appt public.appointments; _slot_min int;
begin
  select * into _appt from public.appointments where id = _appointment_id;
  if _appt is null then raise exception 'NOT_FOUND'; end if;
  if not (public.is_staff(_uid)
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
grant execute on function public.reschedule_appointment(uuid, date, time) to authenticated, service_role;

-- ============ SETTINGS ============
insert into public.app_settings (key, value) values
('clinic_info', '{"name":"Aarogya Care","tagline":"Expert healthcare, when you need it","phone":"+91 33 4000 1200","email":"care@aarogyacare.in","currency":"INR","timezone":"Asia/Kolkata"}'),
('booking_rules', '{"slot_minutes":30,"min_advance_minutes":60,"cancellation_window_hours":6,"tax_rate":0.18,"max_days_ahead":30}');

-- ============ DEMO DATA ============
insert into public.clinics (name, slug, address, city, phone, email) values
('Aarogya Care — Salt Lake', 'salt-lake', 'DC Block, Sector 1, Salt Lake', 'Kolkata', '+91 33 4000 1201', 'saltlake@aarogyacare.in'),
('Aarogya Care — Ballygunge', 'ballygunge', '12 Ballygunge Circular Road', 'Kolkata', '+91 33 4000 1202', 'ballygunge@aarogyacare.in'),
('Aarogya Care — Howrah', 'howrah', '5 Netaji Subhas Road, Shibpur', 'Howrah', '+91 33 4000 1203', 'howrah@aarogyacare.in');

insert into public.departments (name, slug, description, icon) values
('Cardiology','cardiology','Heart and vascular care, from screening to advanced diagnostics.','heart-pulse'),
('Orthopaedics','orthopaedics','Bone, joint and sports injury care with physiotherapy support.','bone'),
('Paediatrics','paediatrics','Newborn, child and adolescent health and vaccinations.','baby'),
('Dermatology','dermatology','Skin, hair and nail treatment including cosmetic dermatology.','sparkles'),
('General Medicine','general-medicine','Everyday illnesses, health checks and chronic disease management.','stethoscope');

insert into public.doctors (full_name, slug, qualification, specialty, department_id, clinic_id, experience_years, gender, languages, registration_no, about, expertise, consultation_fee, supports_online, supports_clinic, rating, review_count)
select v.full_name, v.slug, v.qualification, v.specialty,
  (select id from public.departments where slug = v.dept),
  (select id from public.clinics where slug = v.clinic),
  v.exp, v.gender, v.langs, v.reg, v.about, v.expertise, v.fee, v.online, true, v.rating, v.reviews
from (values
('Dr. Rahul Sen','dr-rahul-sen','MBBS, MD, DM (Cardiology)','Interventional Cardiologist','cardiology','salt-lake',18,'male',array['English','Hindi','Bengali'],'WBMC-41022','Dr. Sen leads the interventional cardiology unit and has performed over 4,000 angioplasties.',array['Angioplasty','Heart failure','Preventive cardiology'],1200,true,4.8,214),
('Dr. Ananya Ghosh','dr-ananya-ghosh','MBBS, MD (Medicine), DNB (Cardiology)','Cardiologist','cardiology','ballygunge',11,'female',array['English','Bengali'],'WBMC-52310','Focused on non-invasive cardiology, echocardiography and lifestyle-led heart care.',array['Echocardiography','Hypertension','Lipid disorders'],1000,true,4.7,158),
('Dr. Vikram Iyer','dr-vikram-iyer','MBBS, MS (Orthopaedics)','Joint Replacement Surgeon','orthopaedics','salt-lake',15,'male',array['English','Hindi','Tamil'],'WBMC-38771','Specialises in knee and hip replacement and arthroscopic sports surgery.',array['Knee replacement','Arthroscopy','Sports injury'],900,false,4.6,187),
('Dr. Meera Banerjee','dr-meera-banerjee','MBBS, DNB (Orthopaedics)','Orthopaedic Surgeon','orthopaedics','howrah',9,'female',array['English','Bengali','Hindi'],'WBMC-60114','Treats spine pain, fractures and osteoporosis with a conservative-first approach.',array['Spine care','Trauma','Osteoporosis'],750,true,4.5,96),
('Dr. Arjun Mehta','dr-arjun-mehta','MBBS, MD (Paediatrics)','Paediatrician & Neonatologist','paediatrics','salt-lake',13,'male',array['English','Hindi'],'WBMC-44508','Newborn intensive care, growth monitoring and childhood vaccination schedules.',array['Neonatal care','Vaccination','Child nutrition'],700,true,4.9,302),
('Dr. Sneha Kapoor','dr-sneha-kapoor','MBBS, DCH, DNB (Paediatrics)','Paediatrician','paediatrics','ballygunge',7,'female',array['English','Hindi','Bengali'],'WBMC-63920','Gentle care for common childhood illnesses, allergies and developmental concerns.',array['Childhood asthma','Allergies','Development'],650,true,4.7,141),
('Dr. Nikhil Dutta','dr-nikhil-dutta','MBBS, MD (Dermatology)','Dermatologist','dermatology','ballygunge',12,'male',array['English','Bengali'],'WBMC-47203','Medical and procedural dermatology including acne, pigmentation and hair loss.',array['Acne','Hair loss','Pigmentation'],800,true,4.6,176),
('Dr. Priya Nair','dr-priya-nair','MBBS, DDVL','Dermatologist & Cosmetologist','dermatology','howrah',8,'female',array['English','Hindi','Malayalam'],'WBMC-61845','Combines clinical dermatology with evidence-based aesthetic treatments.',array['Laser therapy','Eczema','Cosmetic dermatology'],850,true,4.8,129),
('Dr. Sandeep Roy','dr-sandeep-roy','MBBS, MD (General Medicine)','Consultant Physician','general-medicine','salt-lake',20,'male',array['English','Bengali','Hindi'],'WBMC-31090','Diabetes, thyroid and blood pressure management with long-term follow-up.',array['Diabetes','Thyroid','Infectious disease'],600,true,4.7,268),
('Dr. Kavya Sharma','dr-kavya-sharma','MBBS, MD (Internal Medicine)','Internal Medicine Specialist','general-medicine','howrah',6,'female',array['English','Hindi'],'WBMC-66401','Preventive health checks, adult immunisation and everyday medical care.',array['Preventive health','Adult vaccination','Anaemia'],550,true,4.5,88)
) as v(full_name,slug,qualification,specialty,dept,clinic,exp,gender,langs,reg,about,expertise,fee,online,rating,reviews);

-- schedules: Mon-Sat morning + evening blocks
insert into public.doctor_schedules (doctor_id, weekday, start_time, end_time, slot_minutes)
select d.id, w.weekday, '09:00'::time, '13:00'::time, 30
from public.doctors d cross join (select generate_series(1,6) as weekday) w;
insert into public.doctor_schedules (doctor_id, weekday, start_time, end_time, slot_minutes)
select d.id, w.weekday, '17:00'::time, '20:00'::time, 20
from public.doctors d cross join (select generate_series(1,5) as weekday) w
where d.supports_online;

insert into public.doctor_breaks (doctor_id, weekday, start_time, end_time, label)
select d.id, w.weekday, '11:00'::time, '11:30'::time, 'Ward round'
from public.doctors d cross join (select generate_series(1,6) as weekday) w;

insert into public.doctor_leave (doctor_id, start_date, end_date, reason)
select d.id, (now()::date + 9), (now()::date + 11), 'Conference'
from public.doctors d where d.slug in ('dr-vikram-iyer','dr-priya-nair');

insert into public.clinic_holidays (clinic_id, holiday_date, name)
select c.id, (now()::date + 14), 'Founder''s Day' from public.clinics c;

insert into public.patients (full_name, email, phone, date_of_birth, gender, address, city, blood_group)
select v.n, lower(replace(v.n,' ','.')) || '@example.in', '+9198300' || lpad(v.i::text,5,'0'),
  (now()::date - (v.i * 400 + 6000)), v.g, v.i || ' Lake View Road', v.city, v.bg
from (values
(1,'Amit Chatterjee','male','Kolkata','B+'),(2,'Ritu Das','female','Kolkata','O+'),
(3,'Sourav Mondal','male','Howrah','A+'),(4,'Pooja Agarwal','female','Kolkata','AB+'),
(5,'Debashish Bose','male','Kolkata','O-'),(6,'Nandini Sen','female','Howrah','B+'),
(7,'Imran Khan','male','Kolkata','A-'),(8,'Sharmila Paul','female','Kolkata','O+'),
(9,'Rohit Verma','male','Howrah','B-'),(10,'Ananya Dutta','female','Kolkata','A+'),
(11,'Kunal Saha','male','Kolkata','O+'),(12,'Moumita Roy','female','Howrah','AB-'),
(13,'Tarun Gupta','male','Kolkata','B+'),(14,'Ishita Bhattacharya','female','Kolkata','A+'),
(15,'Sameer Jain','male','Howrah','O+'),(16,'Lopamudra Ghosh','female','Kolkata','B+'),
(17,'Arindam Nag','male','Kolkata','A-'),(18,'Swati Mishra','female','Howrah','O+'),
(19,'Farhan Ali','male','Kolkata','AB+'),(20,'Trisha Pal','female','Kolkata','B+'),
(21,'Bikram Singh','male','Howrah','O-'),(22,'Rupa Majumdar','female','Kolkata','A+'),
(23,'Joydeep Kar','male','Kolkata','B+'),(24,'Sanjana Rao','female','Howrah','O+'),
(25,'Prasenjit Dey','male','Kolkata','A+'),(26,'Megha Trivedi','female','Kolkata','AB+'),
(27,'Abhijit Basu','male','Howrah','B-'),(28,'Shreya Kundu','female','Kolkata','O+'),
(29,'Naveen Pillai','male','Kolkata','A+'),(30,'Payel Sarkar','female','Howrah','B+')
) as v(i,n,g,city,bg);

-- ~100 appointments across statuses
insert into public.appointments (doctor_id, patient_id, clinic_id, department_id, appointment_date,
  start_time, end_time, appointment_type, status, reason, fee, tax, total, consultation_notes)
select d.id, p.id, d.clinic_id, d.department_id,
  (now()::date + ((s.n % 21) - 12)),
  ('09:00'::time + make_interval(mins => 30 * (s.n % 7))),
  ('09:30'::time + make_interval(mins => 30 * (s.n % 7))),
  case when s.n % 4 = 0 then 'online' else 'clinic' end,
  case
    when (now()::date + ((s.n % 21) - 12)) < now()::date then
      case when s.n % 9 = 0 then 'no_show' when s.n % 7 = 0 then 'cancelled' else 'completed' end
    else case when s.n % 5 = 0 then 'pending' when s.n % 11 = 0 then 'cancelled' else 'confirmed' end
  end,
  (array['Chest discomfort','Routine follow-up','Fever and cough','Knee pain','Skin rash','Annual health check','Child vaccination','Headache'])[1 + (s.n % 8)],
  d.consultation_fee, round(d.consultation_fee * 0.18, 2), round(d.consultation_fee * 1.18, 2),
  case when (now()::date + ((s.n % 21) - 12)) < now()::date and s.n % 9 <> 0 and s.n % 7 <> 0
       then 'Vitals stable. Advised review in four weeks.' else null end
from (select generate_series(1,100) as n) s
join lateral (select id, clinic_id, department_id, consultation_fee from public.doctors order by md5(s.n::text || 'd') limit 1) d on true
join lateral (select id from public.patients order by md5(s.n::text || 'p') limit 1) p on true
on conflict do nothing;

insert into public.payments (appointment_id, amount, method, status, reference)
select a.id, a.total,
  case when a.appointment_type = 'online' then 'online' else 'clinic' end,
  case when a.status = 'cancelled' then 'refunded'
       when a.status in ('completed') then 'paid'
       when a.appointment_type = 'online' then 'paid' else 'unpaid' end,
  'PAY-' || upper(substr(md5(a.id::text),1,10))
from public.appointments a;

insert into public.reviews (doctor_id, patient_name, rating, comment)
select d.id, v.n, v.r, v.c
from public.doctors d cross join (values
('Amit C.',5,'Explained everything clearly and never rushed the consultation.'),
('Ritu D.',5,'Very little waiting time and the staff were helpful throughout.'),
('Sourav M.',4,'Thorough examination and sensible advice without extra tests.')
) as v(n,r,c);

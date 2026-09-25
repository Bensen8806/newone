DELETE FROM public.venues;

INSERT INTO public.venues (id, name, department_id, capacity, features, svg_element_id) VALUES
  (gen_random_uuid(), 'Auditorium', (SELECT id FROM public.departments WHERE code = 'ADM'), 800, '{"pa_system": true, "projector": true, "stage": true}'::jsonb, 'venue-auditorium'),
  (gen_random_uuid(), 'PTIB Hall', (SELECT id FROM public.departments WHERE code = 'ADM'), 100, '{"projector": true, "ac": true}'::jsonb, 'venue-ptib'),
  (gen_random_uuid(), 'Seminar Hall', (SELECT id FROM public.departments WHERE code = 'ADM'), 100, '{"multimedia": true, "smartboard": true, "podium": true}'::jsonb, 'venue-seminar-adm'),
  (gen_random_uuid(), 'E-One Hall', (SELECT id FROM public.departments WHERE code = 'ADM'), 120, '{"multimedia": true, "ac": true}'::jsonb, 'venue-e-one'),
  (gen_random_uuid(), 'CNC Lab', (SELECT id FROM public.departments WHERE code = 'ADM'), 60, '{"multimedia": true, "industry_tools": true}'::jsonb, 'venue-cnc'),
  (gen_random_uuid(), 'Skill Dev. Center', (SELECT id FROM public.departments WHERE code = 'ADM'), 60, '{"computers": true, "projector": true, "ac": true, "industry_tools": true}'::jsonb, 'venue-skill'),

  (gen_random_uuid(), 'CSE Seminar Hall', (SELECT id FROM public.departments WHERE code = 'CS'), 100, '{"multimedia": true, "smartboard": true}'::jsonb, 'venue-cse-seminar'),
  (gen_random_uuid(), 'CSE Programming Lab', (SELECT id FROM public.departments WHERE code = 'CS'), 60, '{"computers": true, "ac": true}'::jsonb, 'venue-cse-lab'),

  (gen_random_uuid(), 'ECE Seminar Hall', (SELECT id FROM public.departments WHERE code = 'EC'), 100, '{"ac": true, "multimedia": true, "smartboard": true}'::jsonb, 'venue-ece-seminar'),
  (gen_random_uuid(), 'ECE Analog Lab', (SELECT id FROM public.departments WHERE code = 'EC'), 60, '{"equipment": true}'::jsonb, 'venue-ece-analog'),
  (gen_random_uuid(), 'ECE Circuits Lab', (SELECT id FROM public.departments WHERE code = 'EC'), 60, '{"equipment": true}'::jsonb, 'venue-ece-circuits'),
  (gen_random_uuid(), 'ECE PG Lab', (SELECT id FROM public.departments WHERE code = 'EC'), 40, '{"computers": true, "ac": true}'::jsonb, 'venue-ece-pg'),

  (gen_random_uuid(), 'EEE Seminar Hall', (SELECT id FROM public.departments WHERE code = 'EE'), 100, '{"multimedia": true}'::jsonb, 'venue-eee-seminar'),
  (gen_random_uuid(), 'EEE Analog Lab', (SELECT id FROM public.departments WHERE code = 'EE'), 60, '{"equipment": true}'::jsonb, 'venue-eee-analog'),
  (gen_random_uuid(), 'EEE Power Sys Lab', (SELECT id FROM public.departments WHERE code = 'EE'), 60, '{"equipment": true}'::jsonb, 'venue-eee-power'),

  (gen_random_uuid(), 'Mechanical Seminar Hall', (SELECT id FROM public.departments WHERE code = 'ME'), 100, '{"multimedia": true}'::jsonb, 'venue-me-seminar'),
  (gen_random_uuid(), 'Mechanical CAD Lab', (SELECT id FROM public.departments WHERE code = 'ME'), 60, '{"computers": true, "ac": true}'::jsonb, 'venue-me-cad'),

  (gen_random_uuid(), 'ICE Seminar Hall', (SELECT id FROM public.departments WHERE code = 'IC'), 100, '{"multimedia": true}'::jsonb, 'venue-ice-seminar'),
  (gen_random_uuid(), 'ICE Computer Lab', (SELECT id FROM public.departments WHERE code = 'IC'), 60, '{"computers": true, "ac": true}'::jsonb, 'venue-ice-lab'),

  (gen_random_uuid(), 'Civil VM Hall', (SELECT id FROM public.departments WHERE code = 'CE'), 100, '{"multimedia": true}'::jsonb, 'venue-ce-vm'),
  (gen_random_uuid(), 'Civil Drafting Lab', (SELECT id FROM public.departments WHERE code = 'CE'), 60, '{"drafting_tables": true}'::jsonb, 'venue-ce-drafting'),
  (gen_random_uuid(), 'Mat. Testing Lab', (SELECT id FROM public.departments WHERE code = 'CE'), 60, '{"equipment": true}'::jsonb, 'venue-ce-mat'),
  (gen_random_uuid(), 'Civil Survey Lab', (SELECT id FROM public.departments WHERE code = 'CE'), 60, '{"equipment": true}'::jsonb, 'venue-ce-survey')
ON CONFLICT (name) DO NOTHING;

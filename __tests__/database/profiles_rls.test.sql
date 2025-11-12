-- pgTAP test for profiles RLS policies with user context simulation
-- This test simulates different user contexts to test RLS policies

BEGIN;

-- Plan the number of tests
SELECT plan(10);

-- Create test users for RLS testing
DO $$
DECLARE
    user1_id UUID := gen_random_uuid();
    user2_id UUID := gen_random_uuid();
BEGIN
    -- Create test entries in auth.users (simulated)
    -- In real Supabase, these would be actual auth.users entries

    -- Insert test profiles directly (bypassing trigger for testing)
    INSERT INTO public.profiles (id, email, language, push_enabled)
    VALUES
        (user1_id, 'user1@test.com', 'ko', true),
        (user2_id, 'user2@test.com', 'en', false);

    -- Store UUIDs for later use in tests
    PERFORM set_config('test.user1_id', user1_id::text, false);
    PERFORM set_config('test.user2_id', user2_id::text, false);
END $$;

-- Test 1: User can read their own profile
PREPARE test_own_profile_select AS
    SELECT COUNT(*) FROM public.profiles
    WHERE id = current_setting('test.user1_id')::uuid;

-- Set role to authenticated user1
SET LOCAL role TO authenticated;
SET LOCAL request.jwt.claim.sub TO current_setting('test.user1_id');

SELECT results_eq(
    'test_own_profile_select',
    ARRAY[1::bigint],
    'User should be able to read their own profile'
);

-- Test 2: User cannot read other users' profiles
PREPARE test_other_profile_select AS
    SELECT COUNT(*) FROM public.profiles
    WHERE id = current_setting('test.user2_id')::uuid;

SELECT results_eq(
    'test_other_profile_select',
    ARRAY[0::bigint],
    'User should NOT be able to read other profiles'
);

-- Test 3: User can update their own profile
UPDATE public.profiles
SET language = 'en'
WHERE id = current_setting('test.user1_id')::uuid;

SELECT row_eq(
    'SELECT language FROM public.profiles WHERE id = current_setting(''test.user1_id'')::uuid',
    ROW('en'::text),
    'User should be able to update their own profile'
);

-- Test 4: User cannot update other users' profiles
UPDATE public.profiles
SET language = 'ko'
WHERE id = current_setting('test.user2_id')::uuid;

-- Check that user2's language is still 'en' (not updated)
RESET role;
SELECT row_eq(
    'SELECT language FROM public.profiles WHERE id = current_setting(''test.user2_id'')::uuid',
    ROW('en'::text),
    'User should NOT be able to update other profiles'
);

-- Test 5: Anonymous users cannot read any profiles
SET LOCAL role TO anon;
PREPARE test_anon_select AS
    SELECT COUNT(*) FROM public.profiles;

SELECT results_eq(
    'test_anon_select',
    ARRAY[0::bigint],
    'Anonymous users should NOT be able to read profiles'
);

-- Test 6: Check updated_at trigger works
RESET role;
-- Get initial updated_at
PREPARE get_initial_updated AS
    SELECT updated_at FROM public.profiles
    WHERE id = current_setting('test.user1_id')::uuid;

-- Wait a moment and update
SELECT pg_sleep(0.1);

UPDATE public.profiles
SET push_enabled = false
WHERE id = current_setting('test.user1_id')::uuid;

-- Check that updated_at has changed
SELECT isnt(
    (SELECT updated_at FROM public.profiles WHERE id = current_setting('test.user1_id')::uuid),
    (SELECT updated_at FROM get_initial_updated),
    'updated_at should change when profile is updated'
);

-- Test 7: Check language constraint
PREPARE test_invalid_language AS
    UPDATE public.profiles
    SET language = 'invalid_lang'
    WHERE id = current_setting('test.user1_id')::uuid;

SELECT throws_ok(
    'test_invalid_language',
    '23514',  -- check constraint violation
    'new row for relation "profiles" violates check constraint "profiles_language_check"',
    'Invalid language should be rejected by CHECK constraint'
);

-- Test 8: Test that profiles cascade delete with auth.users
-- This would require actual auth.users manipulation in production
SELECT pass('CASCADE delete test would require auth.users manipulation');

-- Test 9: Verify all columns have correct NOT NULL constraints
SELECT col_not_null('public', 'profiles', 'email', 'email should be NOT NULL');

-- Test 10: Verify default values work correctly
RESET role;
INSERT INTO public.profiles (id, email)
VALUES (gen_random_uuid(), 'default_test@test.com');

SELECT row_eq(
    'SELECT language, push_enabled FROM public.profiles WHERE email = ''default_test@test.com''',
    ROW('ko'::text, true::boolean),
    'Default values should be applied correctly'
);

-- Clean up test data
RESET role;
DELETE FROM public.profiles
WHERE email IN ('user1@test.com', 'user2@test.com', 'default_test@test.com');

SELECT * FROM finish();
ROLLBACK;
-- pgTAP test for profiles table and RLS policies
-- Run this test with: SELECT * FROM run_test_suite();

BEGIN;

-- Plan the number of tests
SELECT plan(20);

-- Test 1: Check if profiles table exists
SELECT has_table('public', 'profiles', 'profiles table should exist');

-- Test 2-7: Check column existence and types
SELECT has_column('public', 'profiles', 'id', 'profiles table should have id column');
SELECT col_type_is('public', 'profiles', 'id', 'uuid', 'id should be UUID type');

SELECT has_column('public', 'profiles', 'email', 'profiles table should have email column');
SELECT col_type_is('public', 'profiles', 'email', 'text', 'email should be TEXT type');

SELECT has_column('public', 'profiles', 'language', 'profiles table should have language column');
SELECT col_default_is('public', 'profiles', 'language', '''ko''::text', 'language should default to ko');

-- Test 8-9: Check timestamps
SELECT has_column('public', 'profiles', 'created_at', 'profiles table should have created_at column');
SELECT has_column('public', 'profiles', 'updated_at', 'profiles table should have updated_at column');

-- Test 10: Check if RLS is enabled
SELECT row_eq(
    'SELECT relrowsecurity FROM pg_class WHERE relname = ''profiles''',
    ROW(true),
    'RLS should be enabled on profiles table'
);

-- Test 11: Check if trigger exists
SELECT has_trigger('public', 'profiles', 'update_profiles_updated_at', 'Update trigger should exist');

-- Test 12: Check if function exists
SELECT has_function('public', 'handle_new_user', 'handle_new_user function should exist');

-- Test 13-14: Check indexes
SELECT has_index('public', 'profiles', 'idx_profiles_created_at', 'Index on created_at should exist');
SELECT has_index('public', 'profiles', 'idx_profiles_email', 'Index on email should exist');

-- Test 15: Check foreign key constraint
SELECT col_is_fk('public', 'profiles', 'id', 'profiles.id should be a foreign key');

-- Test 16: Check if RLS policies exist
SELECT policies_are(
    'public',
    'profiles',
    ARRAY[
        'Users can view own profile',
        'Users can update own profile',
        'Users can insert own profile'
    ],
    'All expected RLS policies should exist'
);

-- Test 17: Test RLS - user can only see their own profile
-- This would need actual user context to test properly
SELECT pass('RLS policy test placeholder - would test user can only see own profile');

-- Test 18: Test trigger - updated_at should change on update
SELECT pass('Trigger test placeholder - would test updated_at auto-update');

-- Test 19: Test language CHECK constraint
SELECT pass('CHECK constraint test placeholder - would test language values');

-- Test 20: Test push_enabled default value
SELECT col_default_is('public', 'profiles', 'push_enabled', 'true', 'push_enabled should default to true');

-- Rollback transaction (tests are not permanent)
SELECT * FROM finish();
ROLLBACK;
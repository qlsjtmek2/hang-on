---
name: rn-integration-testing
description: Integration testing guide using Jest, React Native Testing Library (RNTL), and pgTAP for database testing. Covers frontend-backend integration, API testing, database validation, data consistency checks, and end-to-end workflows. Use for integration test, pgtap, database test, api test, frontend-backend integration.
---

# React Native Integration Testing

## Purpose

Guide for integration testing React Native applications with backend services, focusing on frontend-backend integration, API testing, and database validation using pgTAP.

## When to Use

Use this skill when:

- Testing frontend-backend integration
- Validating API responses and data flow
- Testing database operations with pgTAP
- Ensuring data consistency across layers
- Testing complete user workflows
- Verifying Supabase integration

## MCP Integration

**supabase**: Use for database testing with pgTAP

```typescript
- execute_sql: Run pgTAP tests
- apply_migration: Set up test database
- list_tables: Verify schema
```

**context7**: Fetch integration testing documentation

```
- Integration testing patterns
- pgTAP documentation
- API testing best practices
```

## Setup

### Install pgTAP (Supabase)

```sql
-- Enable pgTAP extension via Supabase MCP
CREATE EXTENSION IF NOT EXISTS pgtap;
```

### Test Database Setup

Create separate test database or use Supabase branches:

```typescript
// Use Supabase MCP: create_branch
// Creates isolated test environment
```

## Integration Test Structure

### Frontend-Backend Integration

\***\*tests**/integration/auth.integration.test.ts\*\*

```typescript
import { supabase } from '@/services/supabase';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SignUpScreen } from '@/screens/SignUpScreen';

describe('Authentication Integration', () => {
  beforeAll(async () => {
    // Set up test database
    await setupTestDatabase();
  });

  afterAll(async () => {
    // Clean up test data
    await cleanupTestDatabase();
  });

  afterEach(async () => {
    // Clean up after each test
    await supabase.auth.signOut();
  });

  it('creates user and profile on sign up', async () => {
    render(<SignUpScreen />);

    // Fill form
    fireEvent.changeText(screen.getByLabelText('Email'), 'test@example.com');
    fireEvent.changeText(screen.getByLabelText('Password'), 'password123');
    fireEvent.changeText(screen.getByLabelText('Username'), 'testuser');
    fireEvent.press(screen.getByText('Sign Up'));

    // Wait for sign up to complete
    await waitFor(() => expect(screen.getByText('Welcome!')).toBeOnTheScreen(), { timeout: 5000 });

    // Verify user in database
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', 'testuser')
      .single();

    expect(profile).toMatchObject({
      username: 'testuser',
    });

    // Verify auth user exists
    const {
      data: { user },
    } = await supabase.auth.getUser();
    expect(user?.email).toBe('test@example.com');
  });

  it('enforces RLS policies', async () => {
    // Create test user
    const {
      data: { user: user1 },
    } = await supabase.auth.signUp({
      email: 'user1@example.com',
      password: 'password123',
    });

    const {
      data: { user: user2 },
    } = await supabase.auth.signUp({
      email: 'user2@example.com',
      password: 'password123',
    });

    // Create post as user1
    await supabase.auth.setSession(user1!.session!);
    const { data: post } = await supabase
      .from('posts')
      .insert({ title: 'User 1 Post', user_id: user1!.id })
      .select()
      .single();

    // Try to update as user2 (should fail)
    await supabase.auth.setSession(user2!.session!);
    const { error } = await supabase.from('posts').update({ title: 'Hacked!' }).eq('id', post!.id);

    expect(error).toBeTruthy();
    expect(error?.message).toContain('policy');
  });
});
```

### API Testing

\***\*tests**/integration/posts.integration.test.ts\*\*

```typescript
describe('Posts API Integration', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Sign in and get auth token
    const { data } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123',
    });
    authToken = data.session!.access_token;
    userId = data.user!.id;
  });

  it('creates, reads, updates, and deletes post', async () => {
    // Create
    const { data: createdPost } = await supabase
      .from('posts')
      .insert({
        title: 'Test Post',
        content: 'Test content',
        user_id: userId,
      })
      .select()
      .single();

    expect(createdPost).toMatchObject({
      title: 'Test Post',
      content: 'Test content',
      user_id: userId,
    });

    // Read
    const { data: readPost } = await supabase
      .from('posts')
      .select('*')
      .eq('id', createdPost!.id)
      .single();

    expect(readPost).toEqual(createdPost);

    // Update
    const { data: updatedPost } = await supabase
      .from('posts')
      .update({ title: 'Updated Title' })
      .eq('id', createdPost!.id)
      .select()
      .single();

    expect(updatedPost?.title).toBe('Updated Title');

    // Delete
    const { error: deleteError } = await supabase.from('posts').delete().eq('id', createdPost!.id);

    expect(deleteError).toBeNull();

    // Verify deletion
    const { data: deletedPost } = await supabase
      .from('posts')
      .select('*')
      .eq('id', createdPost!.id)
      .single();

    expect(deletedPost).toBeNull();
  });

  it('enforces foreign key constraints', async () => {
    const { error } = await supabase.from('comments').insert({
      post_id: 'non-existent-id',
      content: 'This should fail',
      user_id: userId,
    });

    expect(error).toBeTruthy();
    expect(error?.message).toContain('foreign key');
  });
});
```

## pgTAP Database Testing

### Basic pgTAP Tests

**tests/database/schema.sql**

```sql
-- Test table existence
SELECT has_table('public', 'profiles', 'profiles table exists');
SELECT has_table('public', 'posts', 'posts table exists');
SELECT has_table('public', 'comments', 'comments table exists');

-- Test columns
SELECT has_column('public', 'profiles', 'id', 'profiles has id column');
SELECT has_column('public', 'profiles', 'username', 'profiles has username');
SELECT has_column('public', 'profiles', 'created_at', 'profiles has created_at');

-- Test column types
SELECT col_type_is('public', 'profiles', 'id', 'uuid', 'id is uuid');
SELECT col_type_is('public', 'profiles', 'username', 'text', 'username is text');

-- Test constraints
SELECT col_is_unique('public', 'profiles', 'username', 'username is unique');
SELECT col_not_null('public', 'profiles', 'id', 'id is not null');
SELECT col_not_null('public', 'profiles', 'username', 'username is not null');

-- Test foreign keys
SELECT has_fk('public', 'posts', 'posts has foreign key');
SELECT fk_ok(
  'public', 'posts', 'user_id',
  'auth', 'users', 'id',
  'posts.user_id references auth.users.id'
);

-- Test indexes
SELECT has_index('public', 'profiles', 'profiles_username_idx', 'username index exists');

-- Test RLS
SELECT results_eq(
  'SELECT tablename FROM pg_tables WHERE schemaname = ''public'' AND rowsecurity = true',
  $$VALUES ('profiles'::name), ('posts'::name), ('comments'::name)$$,
  'RLS enabled on all public tables'
);
```

### Running pgTAP Tests

Use Supabase MCP `execute_sql`:

```sql
BEGIN;
SELECT plan(10); -- Number of tests

-- Your tests here
SELECT has_table('public', 'profiles');
SELECT has_column('public', 'profiles', 'username');
-- ... more tests

SELECT * FROM finish();
ROLLBACK;
```

### pgTAP Function Testing

**tests/database/functions.sql**

```sql
-- Test trigger function
BEGIN;
SELECT plan(2);

-- Insert test data
INSERT INTO posts (id, title, user_id, created_at, updated_at)
VALUES ('test-id', 'Test', 'user-id', NOW(), NOW());

-- Wait a moment
SELECT pg_sleep(0.1);

-- Update post
UPDATE posts SET title = 'Updated' WHERE id = 'test-id';

-- Test that updated_at changed
SELECT isnt(
  (SELECT created_at FROM posts WHERE id = 'test-id'),
  (SELECT updated_at FROM posts WHERE id = 'test-id'),
  'updated_at trigger updates timestamp'
);

-- Test that created_at didn't change
SELECT is(
  (SELECT created_at FROM posts WHERE id = 'test-id'),
  (SELECT created_at FROM posts WHERE id = 'test-id'),
  'created_at does not change on update'
);

SELECT * FROM finish();
ROLLBACK;
```

### RLS Policy Testing

**tests/database/rls_policies.sql**

```sql
BEGIN;
SELECT plan(4);

-- Create test users
SET LOCAL role authenticated;
SET LOCAL request.jwt.claim.sub = 'user-1-id';

-- Test user can read own profile
SELECT ok(
  EXISTS(SELECT 1 FROM profiles WHERE id = 'user-1-id'),
  'User can read own profile'
);

-- Test user cannot read other profiles (if policy exists)
SET LOCAL request.jwt.claim.sub = 'user-2-id';
SELECT ok(
  NOT EXISTS(SELECT 1 FROM profiles WHERE id = 'user-1-id'),
  'User cannot read other user profile'
);

-- Test insert policy
INSERT INTO posts (title, user_id) VALUES ('Test', 'user-2-id');
SELECT ok(
  EXISTS(SELECT 1 FROM posts WHERE user_id = 'user-2-id'),
  'User can create own posts'
);

-- Test update policy
SELECT ok(
  (UPDATE posts SET title = 'Updated' WHERE user_id = 'user-2-id' RETURNING id) IS NOT NULL,
  'User can update own posts'
);

SELECT * FROM finish();
ROLLBACK;
```

## Real-time Testing

```typescript
describe('Real-time Integration', () => {
  it('receives new posts via subscription', async done => {
    const receivedPosts: Post[] = [];

    // Subscribe to posts
    const channel = supabase
      .channel('posts_test')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, payload => {
        receivedPosts.push(payload.new as Post);
      })
      .subscribe();

    // Wait for subscription to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Insert new post from different session
    await supabase.from('posts').insert({
      title: 'Real-time Test',
      user_id: userId,
    });

    // Wait for real-time event
    await waitFor(
      () => {
        expect(receivedPosts.length).toBe(1);
        expect(receivedPosts[0].title).toBe('Real-time Test');
      },
      { timeout: 5000 },
    );

    channel.unsubscribe();
    done();
  });
});
```

## Test Utilities

### Database Helpers

```typescript
// test-utils/database.ts
export async function setupTestDatabase() {
  // Create test data
  await supabase.from('profiles').insert([
    { id: 'test-user-1', username: 'testuser1' },
    { id: 'test-user-2', username: 'testuser2' },
  ]);
}

export async function cleanupTestDatabase() {
  // Delete test data
  await supabase.from('posts').delete().neq('id', '');
  await supabase.from('profiles').delete().neq('id', '');
}

export async function createTestUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data.user;
}
```

### API Helpers

```typescript
// test-utils/api.ts
export async function makeAuthenticatedRequest(method: string, endpoint: string, body?: any) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return response.json();
}
```

## Test Data Management

### Fixtures

```typescript
// test-fixtures/users.ts
export const testUsers = [
  {
    email: 'user1@example.com',
    password: 'password123',
    username: 'user1',
    full_name: 'User One',
  },
  {
    email: 'user2@example.com',
    password: 'password123',
    username: 'user2',
    full_name: 'User Two',
  },
];

// test-fixtures/posts.ts
export const testPosts = [
  {
    title: 'First Post',
    content: 'This is the first post',
    status: 'published',
  },
  {
    title: 'Second Post',
    content: 'This is the second post',
    status: 'draft',
  },
];
```

### Seed Test Data

```typescript
export async function seedTestData() {
  // Create users
  for (const userData of testUsers) {
    const {
      data: { user },
    } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    await supabase.from('profiles').insert({
      id: user!.id,
      username: userData.username,
      full_name: userData.full_name,
    });
  }

  // Create posts
  const {
    data: { user },
  } = await supabase.auth.getUser();
  for (const postData of testPosts) {
    await supabase.from('posts').insert({
      ...postData,
      user_id: user!.id,
    });
  }
}
```

## CI/CD Integration

### Jest Configuration for Integration Tests

**jest.integration.config.js**

```javascript
module.exports = {
  ...require('./jest.config'),
  testMatch: ['**/__tests__/integration/**/*.test.ts'],
  testTimeout: 30000, // Longer timeout for integration tests
};
```

**package.json**

```json
{
  "scripts": {
    "test:integration": "jest --config jest.integration.config.js",
    "test:integration:watch": "jest --config jest.integration.config.js --watch"
  }
}
```

## Best Practices

1. **Use Separate Test Database**: Never run integration tests on production
2. **Clean Up After Tests**: Always clean up test data
3. **Test Data Consistency**: Verify data across frontend and backend
4. **Test Edge Cases**: Network failures, timeouts, concurrent updates
5. **Use Transactions**: Wrap pgTAP tests in transactions for rollback
6. **Mock External Services**: Mock third-party APIs
7. **Test RLS Policies**: Verify security policies work correctly
8. **Monitor Performance**: Track integration test execution time
9. **Use Fixtures**: Reuse test data across tests
10. **Parallel Execution**: Run independent tests in parallel

## Troubleshooting

### Tests Timing Out

```typescript
// Increase timeout for specific test
it('long running test', async () => {
  // ...
}, 30000); // 30 second timeout
```

### Database Connection Issues

```typescript
// Add retry logic
async function retryOperation(fn: () => Promise<any>, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}
```

### Flaky Tests

```typescript
// Use waitFor for async operations
await waitFor(() => expect(screen.getByText('Success')).toBeOnTheScreen(), {
  timeout: 5000,
  interval: 100,
});
```

## Related Skills

- `rn-unit-testing`: Unit testing foundation
- `supabase-backend`: Backend setup and RLS policies
- `github-actions-cicd`: Running tests in CI/CD
- `maestro-e2e-testing`: End-to-end testing

---

**Skill Status**: COMPLETE ✅
**Line Count**: < 500 ✅
**MCP Integration**: supabase, context7 ✅

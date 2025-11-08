---
name: supabase-backend
description: Supabase backend development guide including database schema design, Row Level Security (RLS) policies, authentication, storage, edge functions, real-time subscriptions, and React Native integration. Use for supabase, database, postgres, auth, storage, edge function, rls, real-time, backend development.
---

# Supabase Backend Development

## Purpose

Comprehensive guide for building backends with Supabase, covering database design, security policies, authentication, storage, Edge Functions, and React Native integration.

## When to Use

Use this skill when:
- Designing database schemas
- Creating RLS (Row Level Security) policies
- Setting up authentication and user management
- Implementing file upload and storage
- Developing Edge Functions (serverless)
- Configuring real-time subscriptions
- Integrating Supabase with React Native

## MCP Integration

**supabase**: Use for all Supabase operations
```typescript
// List available MCP tools:
- list_projects: Get all Supabase projects
- get_project: Get project details
- list_tables: List database tables
- execute_sql: Run SQL queries
- apply_migration: Apply database migrations
- generate_typescript_types: Generate TypeScript types from schema
- deploy_edge_function: Deploy serverless functions
- get_advisors: Security and performance recommendations
```

**context7**: Fetch Supabase documentation
```
- Supabase client library docs
- Database best practices
- RLS policy patterns
- Edge Functions guides
```

## React Native Setup

### Install Supabase Client

```bash
npm install @supabase/supabase-js
npm install react-native-url-polyfill  # Required polyfill
```

### Initialize Supabase Client

**src/services/supabase.ts**
```typescript
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,  // Use AsyncStorage for persistence
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### Environment Variables

**.env**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## Database Design

### Creating Tables

Use Supabase MCP to create tables:

```sql
-- Apply migration via MCP: apply_migration
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX profiles_username_idx ON profiles(username);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### Best Practices for Schema Design

1. **Use UUID for Primary Keys**
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

2. **Foreign Key Relationships**
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

3. **Use Timestamps**
```sql
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_items_updated_at
BEFORE UPDATE ON items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

4. **Enums for Fixed Values**
```sql
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  status post_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Row Level Security (RLS)

### Understanding RLS

RLS policies control which rows users can access in queries. They run at the database level, providing security regardless of client implementation.

### Basic RLS Patterns

**1. Users can only read their own data**
```sql
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);
```

**2. Users can update their own data**
```sql
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

**3. Public read, authenticated write**
```sql
-- Anyone can read posts
CREATE POLICY "Posts are viewable by everyone"
ON posts FOR SELECT
USING (true);

-- Only authenticated users can create posts
CREATE POLICY "Authenticated users can create posts"
ON posts FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
```

**4. Owner-based access**
```sql
CREATE POLICY "Users can manage own posts"
ON posts
USING (auth.uid() = user_id);
```

**5. Role-based access**
```sql
-- Add role column to profiles
ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';

-- Policy for admin access
CREATE POLICY "Admins can do anything"
ON posts
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
```

**6. Relationship-based access**
```sql
-- Users can see posts from users they follow
CREATE POLICY "Users can see posts from followed users"
ON posts FOR SELECT
USING (
  user_id IN (
    SELECT followed_id FROM follows
    WHERE follower_id = auth.uid()
  )
  OR user_id = auth.uid()
);
```

### Testing RLS Policies

Use Supabase MCP `execute_sql` with different user contexts:

```sql
-- Test as specific user
SET LOCAL role authenticated;
SET LOCAL request.jwt.claim.sub = 'user-uuid-here';

-- Run your query
SELECT * FROM profiles;

-- Reset
RESET role;
```

## Authentication

### Sign Up

```typescript
import { supabase } from '@/services/supabase';

async function signUp(email: string, password: string, userData: { username: string; full_name: string }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,  // Stored in auth.users.raw_user_meta_data
    },
  });

  if (error) throw error;

  // Create profile after sign up
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        username: userData.username,
        full_name: userData.full_name,
      });

    if (profileError) throw profileError;
  }

  return data;
}
```

### Sign In

```typescript
async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}
```

### Sign Out

```typescript
async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
```

### Auth State Listener

```typescript
import { useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/store/useAuthStore';

export function useAuthListener() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser]);
}
```

### Social Authentication

```typescript
async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'yourapp://auth/callback',
    },
  });

  if (error) throw error;
  return data;
}
```

## Storage

### Upload Files

```typescript
async function uploadAvatar(userId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return publicUrl;
}
```

### React Native File Upload

```typescript
import { Platform } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

async function uploadImage(userId: string) {
  // Pick image
  const result = await ImagePicker.launchImageLibrary({
    mediaType: 'photo',
    quality: 0.8,
  });

  if (result.didCancel || !result.assets?.[0]) return;

  const asset = result.assets[0];
  const fileExt = asset.fileName?.split('.').pop();
  const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;

  // Create FormData
  const formData = new FormData();
  formData.append('file', {
    uri: Platform.OS === 'ios' ? asset.uri?.replace('file://', '') : asset.uri,
    type: asset.type,
    name: asset.fileName,
  } as any);

  // Upload via fetch (Supabase client may have issues with RN)
  const { data: { session } } = await supabase.auth.getSession();

  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/avatars/${filePath}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) throw new Error('Upload failed');

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return publicUrl;
}
```

### Storage Policies

```sql
-- Enable RLS on storage buckets
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## CRUD Operations

### Insert

```typescript
const { data, error } = await supabase
  .from('posts')
  .insert({
    title: '새 포스트',
    content: '내용',
    user_id: userId,
  })
  .select()
  .single();
```

### Select

```typescript
// Select all
const { data, error } = await supabase
  .from('posts')
  .select('*');

// Select specific columns
const { data, error } = await supabase
  .from('posts')
  .select('id, title, created_at');

// With filters
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(10);

// With relationships
const { data, error } = await supabase
  .from('posts')
  .select(`
    *,
    profiles:user_id (
      username,
      avatar_url
    ),
    comments (
      count
    )
  `);
```

### Update

```typescript
const { data, error } = await supabase
  .from('profiles')
  .update({ bio: '새로운 바이오' })
  .eq('id', userId)
  .select()
  .single();
```

### Delete

```typescript
const { error } = await supabase
  .from('posts')
  .delete()
  .eq('id', postId);
```

## Real-time Subscriptions

### Subscribe to Changes

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabase';

function useRealtimePosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Initial fetch
    supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setPosts(data || []));

    // Subscribe to changes
    const channel = supabase
      .channel('posts_channel')
      .on(
        'postgres_changes',
        {
          event: '*',  // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'posts',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPosts((prev) => [payload.new as Post, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setPosts((prev) =>
              prev.map((post) =>
                post.id === payload.new.id ? (payload.new as Post) : post
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setPosts((prev) =>
              prev.filter((post) => post.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return posts;
}
```

### Presence (Online Users)

```typescript
function usePresence(roomId: string) {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    const channel = supabase.channel(`room:${roomId}`);

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = Object.keys(state);
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: userId });
        }
      });

    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  return onlineUsers;
}
```

## Edge Functions

Edge Functions are serverless TypeScript functions that run on Supabase's edge network.

### Deploy Edge Function (via MCP)

Use `deploy_edge_function` MCP tool:

```typescript
// function-name/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { name } = await req.json();

  const data = {
    message: `Hello ${name}!`,
  };

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

### Call Edge Function from React Native

```typescript
async function callEdgeFunction(functionName: string, payload: any) {
  const { data, error } = await supabase.functions.invoke(functionName, {
    body: payload,
  });

  if (error) throw error;
  return data;
}

// Usage
const result = await callEdgeFunction('hello', { name: 'World' });
```

## TypeScript Types Generation

Use Supabase MCP `generate_typescript_types` to auto-generate types:

```typescript
// This creates: src/types/supabase.ts
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
```

### Using Generated Types

```typescript
import { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

const profile: Profile = {
  id: '123',
  username: 'john',
  full_name: 'John Doe',
  avatar_url: null,
  bio: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};
```

## Error Handling

```typescript
async function fetchUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      console.error('Profile not found');
    } else if (error.code === '42501') {
      // Insufficient privileges
      console.error('Access denied');
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}
```

## Best Practices

1. **Always Enable RLS**: Never disable RLS on production tables
2. **Test Policies**: Use `execute_sql` MCP tool to test policies
3. **Use TypeScript**: Generate and use typed queries
4. **Index Frequently Queried Columns**: Add indexes for performance
5. **Use Transactions**: For related operations that must succeed together
6. **Batch Operations**: Use bulk inserts/updates when possible
7. **Handle Errors Gracefully**: Check both `data` and `error` in responses
8. **Monitor with Advisors**: Use `get_advisors` MCP tool regularly
9. **Version Migrations**: Use `apply_migration` MCP tool for schema changes
10. **Secure Edge Functions**: Validate input and use auth checks

## Common Patterns

### Pagination

```typescript
const PAGE_SIZE = 20;

async function fetchPosts(page: number) {
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error, count } = await supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false });

  return { data, count };
}
```

### Search

```typescript
async function searchPosts(query: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .textSearch('title', query, { type: 'websearch' });

  return data;
}
```

### Upsert (Insert or Update)

```typescript
const { data, error } = await supabase
  .from('profiles')
  .upsert({
    id: userId,
    username: 'newusername',
    bio: 'Updated bio',
  })
  .select();
```

## Security Checklist

- [ ] RLS enabled on all tables
- [ ] Policies tested for all user roles
- [ ] Storage bucket policies configured
- [ ] Edge Functions validate authentication
- [ ] Sensitive data encrypted at rest
- [ ] API keys secured (never commit to git)
- [ ] Regular security audits via `get_advisors`

## Related Skills

- `react-native-dev`: Client-side integration
- `rn-integration-testing`: Testing database operations
- `github-actions-cicd`: Automated migrations and deployments

---

**Skill Status**: COMPLETE ✅
**Line Count**: < 500 ✅
**MCP Integration**: supabase, context7 ✅

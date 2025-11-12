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

- list_projects: Get all Supabase projects
- get_project: Get project details
- list_tables: List database tables
- execute_sql: Run SQL queries
- apply_migration: Apply database migrations
- generate_typescript_types: Generate TypeScript types from schema
- deploy_edge_function: Deploy serverless functions
- get_advisors: Security and performance recommendations

**context7**: Fetch Supabase documentation

- Supabase client library docs
- Database best practices
- RLS policy patterns
- Edge Functions guides

## React Native Setup

### Install Supabase Client

Required packages:

- @supabase/supabase-js: Main Supabase client
- react-native-url-polyfill: Required polyfill for React Native

### Initialize Supabase Client

Create client in src/services/supabase.ts:

- Import react-native-url-polyfill/auto
- Create client with URL and anon key from environment variables
- Configure auth with AsyncStorage for persistence
- Enable auto refresh and session persistence
- Disable URL session detection for React Native

### Environment Variables

Create .env file with:

- SUPABASE_URL: Your project URL
- SUPABASE_ANON_KEY: Your anonymous key

## Database Design

### Creating Tables

Use Supabase MCP apply_migration to create tables:

- Use UUID for primary keys with gen_random_uuid()
- Add foreign key relationships with ON DELETE CASCADE
- Include created_at and updated_at timestamps
- Enable Row Level Security on all tables
- Create indexes for frequently queried columns

### Best Practices for Schema Design

1. **Use UUID for Primary Keys**: Default to gen_random_uuid() for auto-generation
2. **Foreign Key Relationships**: Always specify ON DELETE behavior (CASCADE, SET NULL, etc.)
3. **Use Timestamps**: created_at and updated_at for all tables
4. **Auto-update Triggers**: Create trigger function to auto-update updated_at column
5. **Enums for Fixed Values**: Use PostgreSQL ENUM types for status fields

## Row Level Security (RLS)

### Understanding RLS

RLS policies control which rows users can access in queries. They run at the database level, providing security regardless of client implementation.

### Basic RLS Patterns

**1. Users can only read their own data**

- Policy: FOR SELECT USING (auth.uid() = id)

**2. Users can update their own data**

- Policy: FOR UPDATE USING (auth.uid() = id)

**3. Public read, authenticated write**

- SELECT policy: USING (true)
- INSERT policy: WITH CHECK (auth.role() = 'authenticated')

**4. Owner-based access**

- Policy: USING (auth.uid() = user_id)

**5. Role-based access**

- Add role column to profiles table
- Policy: Check user role from profiles table

**6. Relationship-based access**

- Use subquery to check relationships (followers, team members, etc.)
- Example: User can see posts from users they follow

### Testing RLS Policies

Use Supabase MCP execute_sql with role switching:

- SET LOCAL role authenticated
- SET LOCAL request.jwt.claim.sub to test user UUID
- Run query to test policy
- RESET role when done

## Authentication

### Sign Up

Use supabase.auth.signUp with:

- Email and password
- Optional user metadata in options.data
- Create profile record after successful signup

### Sign In

Use supabase.auth.signInWithPassword with email and password

### Sign Out

Use supabase.auth.signOut

### Auth State Listener

Create custom hook to listen for auth changes:

- Get initial session with getSession()
- Subscribe to auth state changes with onAuthStateChange()
- Update app state when session changes
- Unsubscribe on cleanup

### Social Authentication

Use supabase.auth.signInWithOAuth:

- Specify provider (google, github, etc.)
- Set redirectTo URL for mobile deep linking

## Storage

### Upload Files

Use supabase.storage.from(bucket).upload:

- Generate unique file path with user ID and timestamp
- Set cache control headers
- Get public URL after upload

### React Native File Upload

Use image picker library:

- Pick image with launchImageLibrary
- Create FormData with file data
- Upload via fetch to Supabase storage endpoint
- Include Authorization header with session token
- Get public URL after successful upload

### Storage Policies

Create RLS policies on storage.objects:

- INSERT policy: Users can upload to their own folder
- SELECT policy: Public read access for avatars
- UPDATE policy: Users can update their own files
- DELETE policy: Users can delete their own files

## CRUD Operations

### Insert

- Use .from(table).insert(data).select().single()
- Return inserted row with select()

### Select

- Basic: .from(table).select('\*')
- Specific columns: .select('id, title, created_at')
- With filters: .eq(), .gte(), .lt(), etc.
- With ordering: .order('created_at', { ascending: false })
- With limit: .limit(10)
- With relationships: Join syntax in select string

### Update

- Use .from(table).update(data).eq(id, value).select().single()
- Return updated row with select()

### Delete

- Use .from(table).delete().eq(id, value)
- Consider soft delete with deleted_at column instead

## Real-time Subscriptions

### Subscribe to Changes

Create channel and subscribe to postgres_changes:

- Initial data fetch
- Subscribe to INSERT, UPDATE, DELETE events
- Update local state based on event type
- Cleanup: Remove channel on unmount

### Presence (Online Users)

Use channel presence for tracking online users:

- Create channel for room
- Subscribe to presence sync event
- Track user presence with channel.track()
- Untrack on cleanup

## Edge Functions

### Deploy Edge Function (via MCP)

Use deploy_edge_function MCP tool to deploy serverless TypeScript functions.

Edge Function structure:

- Written in TypeScript for Deno runtime
- Use Deno serve handler
- Parse request with req.json()
- Return Response with JSON data

### Call Edge Function from React Native

Use supabase.functions.invoke:

- Pass function name and payload body
- Handle response data and errors
- Process returned data

## TypeScript Types Generation

Use Supabase MCP generate_typescript_types to auto-generate types from database schema.

Generated types include:

- Database interface with all tables
- Row types for SELECT queries
- Insert types for INSERT operations
- Update types for UPDATE operations

Usage:

- Import Database type from generated file
- Extract table types: Database['public']['Tables']['table_name']['Row']
- Apply types to queries and state

## Error Handling

Always check both data and error in responses:

- Supabase returns { data, error } structure
- Check if error exists before using data
- Handle specific error codes (PGRST116: no rows, 42501: access denied)
- Use try-catch for async operations

## Best Practices

1. **Always Enable RLS**: Never disable RLS on production tables
2. **Test Policies**: Use execute_sql MCP tool to test policies with different user contexts
3. **Use TypeScript**: Generate and use typed queries for safety
4. **Index Frequently Queried Columns**: Add indexes for performance
5. **Use Transactions**: For related operations that must succeed together
6. **Batch Operations**: Use bulk inserts/updates when possible
7. **Handle Errors Gracefully**: Check both data and error in all responses
8. **Monitor with Advisors**: Use get_advisors MCP tool regularly for security and performance
9. **Version Migrations**: Use apply_migration MCP tool for all schema changes
10. **Secure Edge Functions**: Validate input and use auth checks

## Common Patterns

### Pagination

Use range() for pagination:

- Calculate from/to based on page and page size
- Use count: 'exact' to get total count
- Order results consistently

### Search

Use textSearch() for full-text search:

- Requires tsvector column or GIN index
- Supports websearch type for natural language queries

### Upsert (Insert or Update)

Use upsert() for atomic insert-or-update:

- Requires unique constraint or primary key
- Updates existing row or inserts new one

## Security Checklist

- [ ] RLS enabled on all tables
- [ ] Policies tested for all user roles
- [ ] Storage bucket policies configured
- [ ] Edge Functions validate authentication
- [ ] Sensitive data encrypted at rest
- [ ] API keys secured (never commit to git)
- [ ] Regular security audits via get_advisors

## Related Skills

- react-native-dev: Client-side integration
- rn-integration-testing: Testing database operations
- github-actions-cicd: Automated migrations and deployments

---

**Skill Status**: COMPLETE ✅
**Line Count**: < 500 ✅
**MCP Integration**: supabase, context7 ✅

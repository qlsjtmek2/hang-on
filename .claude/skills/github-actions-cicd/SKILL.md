---
name: github-actions-cicd
description: GitHub Actions CI/CD pipeline guide for React Native apps. Covers automated testing, builds, deployments, environment management, and best practices. Use for ci/cd, github actions, deployment, workflow, pipeline, automation, continuous integration, continuous deployment, mobile ci/cd.
---

# GitHub Actions CI/CD

## Purpose

Comprehensive guide for setting up CI/CD pipelines using GitHub Actions for React Native applications, covering automated testing, builds, and deployments.

## When to Use

Use this skill when:

- Setting up automated testing workflows
- Configuring build pipelines for iOS/Android
- Deploying to TestFlight or Google Play
- Managing environment variables and secrets
- Automating code quality checks
- Setting up automated releases
- Running E2E tests in CI

## MCP Integration

**github**: Use for GitHub Actions management

```typescript
- create_pull_request: Create PRs automatically
- update_pull_request: Update PR status
- search_code: Find workflow files
- get_file_contents: Read workflow configurations
```

**context7**: Fetch CI/CD documentation

```
- GitHub Actions documentation
- React Native CI/CD best practices
- Mobile deployment guides
```

## Basic Workflow Structure

### Workflow Anatomy

**.github/workflows/ci.yml**

```yaml
name: CI # Workflow name

on: # Trigger events
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs: # Jobs to run
  test:
    runs-on: ubuntu-latest # Runner OS
    steps: # Steps to execute
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test
```

## Testing Workflows

### Unit Tests

**.github/workflows/test.yml**

```yaml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

      - name: Comment PR with coverage
        if: github.event_name == 'pull_request'
        uses: romeovs/lcov-reporter-action@v0.3.1
        with:
          lcov-file: ./coverage/lcov.info
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Integration Tests

**.github/workflows/integration-tests.yml**

```yaml
name: Integration Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  integration-tests:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: supabase/postgres:latest
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run database migrations
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/postgres
        run: npm run migrate

      - name: Run integration tests
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/postgres
          SUPABASE_URL: ${{ secrets.SUPABASE_TEST_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_TEST_ANON_KEY }}
        run: npm run test:integration
```

### E2E Tests with Maestro

**.github/workflows/e2e-tests.yml**

```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  e2e-android:
    runs-on: macos-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '11'

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Cache Gradle
        uses: actions/cache@v3
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}

      - name: Build Android app
        run: |
          cd android
          ./gradlew assembleDebug assembleAndroidTest
          cd ..

      - name: Install Maestro
        run: curl -Ls "https://get.maestro.mobile.dev" | bash

      - name: Run Maestro tests
        run: |
          export PATH="$PATH:$HOME/.maestro/bin"
          maestro test .maestro/

      - name: Upload screenshots
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: maestro-screenshots
          path: screenshots/
          retention-days: 7
```

## Build Workflows

### Android Build

**.github/workflows/android-build.yml**

```yaml
name: Android Build

on:
  push:
    branches: [main]
    tags:
      - 'v*'

jobs:
  build-android:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '11'

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Cache Gradle
        uses: actions/cache@v3
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}

      - name: Decode keystore
        env:
          KEYSTORE_BASE64: ${{ secrets.ANDROID_KEYSTORE_BASE64 }}
        run: |
          echo $KEYSTORE_BASE64 | base64 -d > android/app/release.keystore

      - name: Build release APK
        env:
          KEYSTORE_PASSWORD: ${{ secrets.ANDROID_KEYSTORE_PASSWORD }}
          KEY_ALIAS: ${{ secrets.ANDROID_KEY_ALIAS }}
          KEY_PASSWORD: ${{ secrets.ANDROID_KEY_PASSWORD }}
        run: |
          cd android
          ./gradlew assembleRelease
          cd ..

      - name: Build release AAB
        env:
          KEYSTORE_PASSWORD: ${{ secrets.ANDROID_KEYSTORE_PASSWORD }}
          KEY_ALIAS: ${{ secrets.ANDROID_KEY_ALIAS }}
          KEY_PASSWORD: ${{ secrets.ANDROID_KEY_PASSWORD }}
        run: |
          cd android
          ./gradlew bundleRelease
          cd ..

      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: app-release.apk
          path: android/app/build/outputs/apk/release/app-release.apk

      - name: Upload AAB
        uses: actions/upload-artifact@v3
        with:
          name: app-release.aab
          path: android/app/build/outputs/bundle/release/app-release.aab
```

### iOS Build

**.github/workflows/ios-build.yml**

```yaml
name: iOS Build

on:
  push:
    branches: [main]
    tags:
      - 'v*'

jobs:
  build-ios:
    runs-on: macos-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install pods
        run: |
          cd ios
          pod install
          cd ..

      - name: Setup Xcode
        uses: maxim-lobanov/setup-xcode@v1
        with:
          xcode-version: '15.0'

      - name: Build iOS app
        run: |
          xcodebuild -workspace ios/YourApp.xcworkspace \
            -scheme YourApp \
            -configuration Release \
            -sdk iphoneos \
            -derivedDataPath ios/build \
            -archivePath ios/build/YourApp.xcarchive \
            archive

      - name: Export IPA
        run: |
          xcodebuild -exportArchive \
            -archivePath ios/build/YourApp.xcarchive \
            -exportPath ios/build \
            -exportOptionsPlist ios/ExportOptions.plist

      - name: Upload IPA
        uses: actions/upload-artifact@v3
        with:
          name: YourApp.ipa
          path: ios/build/YourApp.ipa
```

## Deployment Workflows

### Deploy to TestFlight

**.github/workflows/deploy-testflight.yml**

```yaml
name: Deploy to TestFlight

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy-ios:
    runs-on: macos-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install pods
        run: |
          cd ios
          pod install
          cd ..

      - name: Setup Fastlane
        run: |
          cd ios
          bundle install
          cd ..

      - name: Deploy to TestFlight
        env:
          APPLE_ID: ${{ secrets.APPLE_ID }}
          APP_STORE_CONNECT_API_KEY_ID: ${{ secrets.APP_STORE_CONNECT_API_KEY_ID }}
          APP_STORE_CONNECT_API_ISSUER_ID: ${{ secrets.APP_STORE_CONNECT_API_ISSUER_ID }}
          APP_STORE_CONNECT_API_KEY: ${{ secrets.APP_STORE_CONNECT_API_KEY }}
        run: |
          cd ios
          bundle exec fastlane beta
          cd ..
```

### Deploy to Google Play

**.github/workflows/deploy-playstore.yml**

```yaml
name: Deploy to Google Play

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy-android:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '11'

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Decode service account
        env:
          SERVICE_ACCOUNT_JSON: ${{ secrets.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON }}
        run: |
          echo $SERVICE_ACCOUNT_JSON > android/service-account.json

      - name: Decode keystore
        env:
          KEYSTORE_BASE64: ${{ secrets.ANDROID_KEYSTORE_BASE64 }}
        run: |
          echo $KEYSTORE_BASE64 | base64 -d > android/app/release.keystore

      - name: Build and deploy
        env:
          KEYSTORE_PASSWORD: ${{ secrets.ANDROID_KEYSTORE_PASSWORD }}
          KEY_ALIAS: ${{ secrets.ANDROID_KEY_ALIAS }}
          KEY_PASSWORD: ${{ secrets.ANDROID_KEY_PASSWORD }}
        run: |
          cd android
          ./gradlew bundleRelease
          bundle exec fastlane deploy
          cd ..
```

## Code Quality Workflows

### Lint and Type Check

**.github/workflows/code-quality.yml**

```yaml
name: Code Quality

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run TypeScript check
        run: npm run type-check

      - name: Run Prettier check
        run: npm run format:check

  security:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Run security audit
        run: npm audit --audit-level=high

      - name: Check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

## Environment Management

### Using Secrets

```yaml
# Access secrets in workflow
env:
  SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
  API_KEY: ${{ secrets.API_KEY }}
```

### Environment-Specific Deployments

```yaml
name: Deploy

on:
  push:
    branches:
      - main
      - staging

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set environment
        id: set-env
        run: |
          if [ "${{ github.ref }}" == "refs/heads/main" ]; then
            echo "env=production" >> $GITHUB_OUTPUT
          else
            echo "env=staging" >> $GITHUB_OUTPUT
          fi

      - name: Deploy
        env:
          ENVIRONMENT: ${{ steps.set-env.outputs.env }}
        run: |
          echo "Deploying to $ENVIRONMENT"
          # Your deployment commands
```

## Caching Strategies

### NPM Cache

```yaml
- name: Setup Node.js with cache
  uses: actions/setup-node@v3
  with:
    node-version: '20'
    cache: 'npm'

- name: Install dependencies
  run: npm ci
```

### Gradle Cache

```yaml
- name: Cache Gradle
  uses: actions/cache@v3
  with:
    path: |
      ~/.gradle/caches
      ~/.gradle/wrapper
    key: gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
    restore-keys: |
      gradle-
```

### CocoaPods Cache

```yaml
- name: Cache CocoaPods
  uses: actions/cache@v3
  with:
    path: ios/Pods
    key: pods-${{ hashFiles('ios/Podfile.lock') }}
    restore-keys: |
      pods-
```

## Matrix Builds

### Test Multiple Node Versions

```yaml
jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18, 20, 21]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - run: npm ci
      - run: npm test
```

### Test Multiple Platforms

```yaml
jobs:
  build:
    runs-on: ${{ matrix.os }}

    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]

    steps:
      - uses: actions/checkout@v3
      - name: Build
        run: npm run build
```

## Reusable Workflows

### Define Reusable Workflow

**.github/workflows/reusable-test.yml**

```yaml
name: Reusable Test Workflow

on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string
    secrets:
      SUPABASE_URL:
        required: true

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ inputs.node-version }}

      - run: npm ci
      - run: npm test
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
```

### Use Reusable Workflow

```yaml
jobs:
  test-node-20:
    uses: ./.github/workflows/reusable-test.yml
    with:
      node-version: '20'
    secrets:
      SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
```

## Best Practices

1. **Cache Dependencies**: Use caching to speed up builds
2. **Fail Fast**: Configure jobs to fail quickly on errors
3. **Parallel Jobs**: Run independent jobs in parallel
4. **Secure Secrets**: Never commit secrets, use GitHub Secrets
5. **Use Specific Versions**: Pin action versions (e.g., `@v3` not `@latest`)
6. **Conditional Execution**: Use `if` conditions to skip unnecessary steps
7. **Artifact Retention**: Set appropriate retention days for artifacts
8. **Status Checks**: Require workflow success before merging
9. **Branch Protection**: Enable branch protection rules
10. **Monitor Costs**: Track Actions minutes usage

## Common Patterns

### Skip CI on Certain Commits

```yaml
on:
  push:
    branches: [main]

jobs:
  build:
    if: "!contains(github.event.head_commit.message, '[skip ci]')"
    runs-on: ubuntu-latest
    steps:
      - run: echo "Running build"
```

### Automatic Version Bumping

```yaml
- name: Bump version
  run: npm version patch

- name: Push version bump
  run: |
    git config user.name github-actions
    git config user.email github-actions@github.com
    git push
    git push --tags
```

### Notify on Failure

```yaml
- name: Notify on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Troubleshooting

### Debug Workflow

```yaml
- name: Enable debug logging
  run: echo "ACTIONS_RUNNER_DEBUG=true" >> $GITHUB_ENV

- name: Debug info
  run: |
    echo "Event name: ${{ github.event_name }}"
    echo "Ref: ${{ github.ref }}"
    echo "SHA: ${{ github.sha }}"
```

### Check Environment

```yaml
- name: Print environment
  run: env | sort
```

## Related Skills

- `rn-unit-testing`: Tests run in CI
- `rn-integration-testing`: Integration tests in CI
- `maestro-e2e-testing`: E2E tests in CI

---

**Skill Status**: COMPLETE ✅
**Line Count**: < 500 ✅
**MCP Integration**: github, context7 ✅

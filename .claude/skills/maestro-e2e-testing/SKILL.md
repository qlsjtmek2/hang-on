---
name: maestro-e2e-testing
description: Maestro end-to-end testing guide for React Native apps. Covers flow creation, UI automation, device interactions, assertions, screenshots, and CI/CD integration. Use for e2e test, maestro, end-to-end testing, ui test, flow, automation, mobile testing.
---

# Maestro E2E Testing

## Purpose

Comprehensive guide for end-to-end testing React Native applications using Maestro, covering flow creation, UI automation, device interactions, and CI/CD integration.

## When to Use

Use this skill when:
- Creating E2E test flows
- Testing complete user journeys
- Automating UI interactions
- Testing on real devices or emulators
- Validating multi-screen workflows
- Testing navigation flows
- Capturing screenshots and videos
- Running E2E tests in CI/CD

## MCP Integration

**context7**: Fetch Maestro documentation
```
- Maestro CLI documentation
- Flow syntax and commands
- Best practices for mobile E2E testing
```

## Installation

### Install Maestro

```bash
# macOS/Linux
curl -Ls "https://get.maestro.mobile.dev" | bash

# Verify installation
maestro --version
```

### Install Maestro Studio (Optional)

```bash
# macOS
brew install maestro-studio
```

## Basic Flow Structure

### Simple Flow

**.maestro/login.yaml**
```yaml
appId: com.yourapp
---
- launchApp
- tapOn: "Email"
- inputText: "test@example.com"
- tapOn: "Password"
- inputText: "password123"
- tapOn: "Sign In"
- assertVisible: "Welcome"
```

### Flow with Assertions

**.maestro/signup.yaml**
```yaml
appId: com.yourapp
---
- launchApp
- tapOn: "Sign Up"

# Fill form
- tapOn: "Email"
- inputText: "newuser@example.com"
- tapOn: "Password"
- inputText: "securepass123"
- tapOn: "Confirm Password"
- inputText: "securepass123"
- tapOn: "Username"
- inputText: "newuser"

# Submit
- tapOn: "Create Account"

# Wait for navigation
- assertVisible: "Welcome, newuser!"
- assertNotVisible: "Sign Up"
```

## Maestro Commands

### Navigation

```yaml
- launchApp
- launchApp:
    appId: com.yourapp
    clearState: true  # Clear app data before launch

- back  # Press back button (Android)
- swipe:
    direction: UP  # UP, DOWN, LEFT, RIGHT
    duration: 500  # Optional duration in ms
```

### Tapping

```yaml
# Tap by text
- tapOn: "Button Text"

# Tap by ID (testID)
- tapOn:
    id: "login-button"

# Tap at coordinates
- tapOn:
    point: "50%,80%"  # x%, y%

# Long press
- longPressOn: "Item"
- longPressOn:
    duration: 2000  # 2 seconds
```

### Text Input

```yaml
# Input text
- inputText: "Hello World"

# Input into specific field
- tapOn: "Email"
- inputText: "test@example.com"

# Clear text
- eraseText

# Input with keyboard type
- tapOn: "Phone"
- inputText: "1234567890"
```

### Scrolling

```yaml
# Scroll to element
- scrollUntilVisible:
    element:
      text: "Item at Bottom"
    direction: DOWN  # UP, DOWN, LEFT, RIGHT

# Scroll with timeout
- scrollUntilVisible:
    element:
      id: "product-123"
    timeout: 10000  # 10 seconds
    direction: DOWN
```

### Assertions

```yaml
# Assert visible
- assertVisible: "Success Message"
- assertVisible:
    id: "success-icon"

# Assert not visible
- assertNotVisible: "Error"

# Assert text
- assertVisible:
    text: "Welcome"
    enabled: true

# Assert multiple conditions
- assertVisible:
    id: "submit-button"
    enabled: true
- assertNotVisible:
    text: "Loading"
```

### Waiting

```yaml
# Wait for element
- waitForVisible: "Loading Complete"
- waitForVisible:
    id: "data-loaded"
    timeout: 5000  # 5 seconds

# Wait fixed time
- wait: 2000  # 2 seconds (use sparingly)
```

### Conditional Logic

```yaml
# Run if visible
- runFlow:
    when:
      visible: "Login Required"
    flow: login.yaml

# Run if not visible
- runFlow:
    when:
      notVisible: "Already Logged In"
    flow: login.yaml
```

## Advanced Flows

### Multi-Screen Flow

**.maestro/create_post.yaml**
```yaml
appId: com.yourapp
---
# Ensure logged in
- runFlow: login.yaml

# Navigate to create post
- tapOn: "New Post"
- assertVisible: "Create Post"

# Fill content
- tapOn: "Title"
- inputText: "My Amazing Post"
- tapOn: "Content"
- inputText: "This is the content of my post"

# Add image (optional)
- tapOn: "Add Image"
- assertVisible: "Choose Photo"
- tapOn: "Camera Roll"
- tapOn:
    index: 0  # First image
- assertVisible: "My Amazing Post"

# Publish
- tapOn: "Publish"
- assertVisible: "Post published successfully"

# Verify on feed
- back
- assertVisible: "My Amazing Post"
```

### Testing Forms

**.maestro/form_validation.yaml**
```yaml
appId: com.yourapp
---
- launchApp
- tapOn: "Sign Up"

# Test empty form
- tapOn: "Create Account"
- assertVisible: "Email is required"
- assertVisible: "Password is required"

# Test invalid email
- tapOn: "Email"
- inputText: "invalid-email"
- tapOn: "Password"
- inputText: "password123"
- tapOn: "Create Account"
- assertVisible: "Invalid email format"

# Test password mismatch
- tapOn: "Email"
- eraseText
- inputText: "test@example.com"
- tapOn: "Password"
- eraseText
- inputText: "password123"
- tapOn: "Confirm Password"
- inputText: "different"
- tapOn: "Create Account"
- assertVisible: "Passwords do not match"

# Test successful submission
- tapOn: "Confirm Password"
- eraseText
- inputText: "password123"
- tapOn: "Create Account"
- assertNotVisible: "Email is required"
- assertVisible: "Welcome"
```

### Testing Lists

**.maestro/scroll_and_select.yaml**
```yaml
appId: com.yourapp
---
- launchApp
- tapOn: "Products"

# Scroll to specific item
- scrollUntilVisible:
    element:
      text: "Product 50"
    direction: DOWN
    timeout: 10000

# Tap on item
- tapOn: "Product 50"
- assertVisible: "Product Details"
- assertVisible: "Product 50"

# Go back and scroll up
- back
- scrollUntilVisible:
    element:
      text: "Product 1"
    direction: UP
```

### Taking Screenshots

```yaml
appId: com.yourapp
---
- launchApp
- takeScreenshot: screenshots/home_screen.png

- tapOn: "Profile"
- takeScreenshot: screenshots/profile.png

- tapOn: "Settings"
- takeScreenshot: screenshots/settings.png
```

## Environment Variables

**.maestro/login_env.yaml**
```yaml
appId: com.yourapp
env:
  EMAIL: test@example.com
  PASSWORD: password123
---
- launchApp
- tapOn: "Email"
- inputText: ${EMAIL}
- tapOn: "Password"
- inputText: ${PASSWORD}
- tapOn: "Sign In"
- assertVisible: "Welcome"
```

**Run with custom environment:**
```bash
maestro test --env EMAIL=custom@example.com --env PASSWORD=custom123 login_env.yaml
```

## Running Tests

### Single Flow

```bash
# Run specific flow
maestro test .maestro/login.yaml

# With specific device
maestro test --device emulator-5554 .maestro/login.yaml

# With app path (iOS)
maestro test --app /path/to/YourApp.app .maestro/login.yaml

# With app path (Android)
maestro test --app /path/to/app-debug.apk .maestro/login.yaml
```

### Multiple Flows

```bash
# Run all flows in directory
maestro test .maestro/

# Run with pattern
maestro test .maestro/*_smoke.yaml
```

### Interactive Mode (Maestro Studio)

```bash
maestro studio
```

## Test Organization

### Directory Structure

```
.maestro/
├── flows/
│   ├── auth/
│   │   ├── login.yaml
│   │   ├── signup.yaml
│   │   └── logout.yaml
│   ├── posts/
│   │   ├── create_post.yaml
│   │   ├── edit_post.yaml
│   │   └── delete_post.yaml
│   └── profile/
│       ├── edit_profile.yaml
│       └── view_profile.yaml
├── helpers/
│   ├── login_helper.yaml
│   └── navigation_helper.yaml
└── smoke/
    └── critical_paths.yaml
```

### Reusable Sub-Flows

**helpers/login_helper.yaml**
```yaml
appId: com.yourapp
---
- launchApp
- tapOn: "Email"
- inputText: ${EMAIL}
- tapOn: "Password"
- inputText: ${PASSWORD}
- tapOn: "Sign In"
- waitForVisible: "Welcome"
```

**Use in other flows:**
```yaml
appId: com.yourapp
env:
  EMAIL: test@example.com
  PASSWORD: password123
---
- runFlow: helpers/login_helper.yaml

# Continue with authenticated flow
- tapOn: "Profile"
- assertVisible: "My Profile"
```

## CI/CD Integration

### GitHub Actions

**.github/workflows/e2e-tests.yml**
```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  maestro-test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Java
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '11'

      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Install Maestro
        run: curl -Ls "https://get.maestro.mobile.dev" | bash

      - name: Build Android app
        run: |
          cd android
          ./gradlew assembleDebug assembleAndroidTest
          cd ..

      - name: Run Maestro Tests
        run: |
          export PATH="$PATH:$HOME/.maestro/bin"
          maestro test --device emulator-5554 .maestro/

      - name: Upload Screenshots
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: maestro-screenshots
          path: screenshots/
```

### Running on Maestro Cloud

```bash
# Upload and run on cloud
maestro cloud .maestro/ \
  --app /path/to/app.apk \
  --apiKey $MAESTRO_CLOUD_API_KEY
```

## Best Practices

1. **Use testID for Stability**: Add `testID` to components for reliable element selection
2. **Avoid Fixed Waits**: Use `waitForVisible` instead of `wait`
3. **Create Reusable Flows**: Extract common flows (login, navigation) into helpers
4. **Test Real User Journeys**: Focus on critical paths users actually take
5. **Use Environment Variables**: Don't hardcode credentials
6. **Take Screenshots**: Capture evidence of test execution
7. **Keep Flows Focused**: One flow per user journey
8. **Handle Loading States**: Wait for loading indicators to disappear
9. **Test on Real Devices**: Run on physical devices when possible
10. **Version Control Flows**: Commit `.maestro/` directory to git

## Debugging

### Verbose Logging

```bash
maestro test --debug .maestro/login.yaml
```

### Step-by-Step Execution

```bash
# Run in interactive mode
maestro studio

# Then select flow and execute step-by-step
```

### Screenshot Debugging

```yaml
- tapOn: "Button"
- takeScreenshot: debug/before_assertion.png
- assertVisible: "Expected Text"
- takeScreenshot: debug/after_assertion.png
```

## Common Patterns

### Login Once, Test Multiple Scenarios

```yaml
# setup.yaml
appId: com.yourapp
---
- launchApp
- runFlow: helpers/login_helper.yaml

# test_profile.yaml
appId: com.yourapp
---
- runFlow: setup.yaml
- tapOn: "Profile"
- assertVisible: "My Profile"

# test_settings.yaml
appId: com.yourapp
---
- runFlow: setup.yaml
- tapOn: "Settings"
- assertVisible: "App Settings"
```

### Testing Deep Links

```yaml
appId: com.yourapp
---
- launchApp:
    url: "yourapp://profile/123"
- assertVisible: "Profile Details"
- assertVisible: "User 123"
```

### Testing Permissions

```yaml
appId: com.yourapp
---
- launchApp
- tapOn: "Enable Notifications"
- tapOn: "Allow"  # System permission dialog
- assertVisible: "Notifications Enabled"
```

## Troubleshooting

### Element Not Found

```yaml
# Add explicit wait
- waitForVisible:
    id: "element-id"
    timeout: 5000
- tapOn:
    id: "element-id"
```

### Flaky Tests

```yaml
# Add retry logic via runFlow
- runFlow:
    when:
      visible: "Retry Button"
    flow: retry_logic.yaml
```

### Slow Test Execution

```yaml
# Reduce unnecessary waits
# Use specific selectors (id over text)
# Clear app state between runs
- launchApp:
    clearState: true
```

## Related Skills

- `react-native-components`: Components being tested
- `rn-integration-testing`: Integration testing foundation
- `github-actions-cicd`: Running E2E tests in CI/CD

---

**Skill Status**: COMPLETE ✅
**Line Count**: < 500 ✅
**MCP Integration**: context7 ✅

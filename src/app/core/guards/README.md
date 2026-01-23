# Authentication Guards Implementation

## Overview

This document describes the authentication guard system implemented for the ThreeDOS application.

## Guards Implemented

### 1. AuthGuard (`auth.guard.ts`)

- **Purpose**: Ensures user is authenticated before accessing protected routes
- **Behavior**: Redirects to login page if not authenticated
- **Usage**: Can be applied to any route that requires authentication

### 2. AdminGuard (`admin.guard.ts`)

- **Purpose**: Restricts access to admin-only routes
- **Roles Allowed**: 'Head', 'Instructor', 'VicePresident'
- **Behavior**:
  - Redirects to login if not authenticated
  - Redirects to delegates dashboard if authenticated but not admin
- **Usage**: Applied to `/Admin` routes

### 3. DelegateGuard (`delegate.guard.ts`)

- **Purpose**: Restricts access to delegate-only routes
- **Roles Allowed**: Any role except 'Head', 'Instructor', 'VicePresident'
- **Behavior**:
  - Redirects to login if not authenticated
  - Redirects to admin dashboard if authenticated but is admin
- **Usage**: Applied to `/Delegates` routes

### 4. LoginGuard (`login.guard.ts`)

- **Purpose**: Prevents authenticated users from accessing login page
- **Behavior**: Redirects authenticated users to appropriate dashboard
- **Usage**: Applied to `/Login` route

## Enhanced AuthService Features

### User Management

- Maintains current user state with BehaviorSubject
- Stores user data in localStorage
- Provides helper methods for role checking

### Key Methods

- `isAuthenticated()`: Check if user has valid token
- `isAdmin()`: Check if user has admin role
- `isDelegate()`: Check if user has delegate role
- `getCurrentUser()`: Get current user object
- `getUserRole()`: Get current user role

### Automatic Data Management

- Automatically loads user data from localStorage on service initialization
- Clears user data on logout
- Updates user state on login

## Route Protection

### Admin Routes

```typescript
{
  path: 'Admin',
  component: AdminComponent,
  canActivate: [AdminGuard],
  children: [...]
}
```

### Delegate Routes

```typescript
{
  path: 'Delegates',
  component: DelegatesComponent,
  canActivate: [DelegateGuard],
  children: [...]
}
```

### Login Route

```typescript
{
  path: 'Login',
  component: LoginComponent,
  canActivate: [LoginGuard]
}
```

## Usage Examples

### Checking Authentication in Components

```typescript
constructor(private authService: AuthService) {}

ngOnInit() {
  if (this.authService.isAuthenticated()) {
    // User is logged in
  }

  if (this.authService.isAdmin()) {
    // User has admin privileges
  }
}
```

### Getting Current User

```typescript
const currentUser = this.authService.getCurrentUser();
const userRole = this.authService.getUserRole();
```

## Security Features

1. **Token Validation**: Guards check for valid authentication token
2. **Role-Based Access**: Different routes for different user roles
3. **Automatic Redirects**: Users are redirected to appropriate dashboards
4. **State Management**: User state is maintained across page refreshes
5. **Logout Handling**: Proper cleanup of user data on logout

## Data Storage

### localStorage Keys

- `userToken`: JWT authentication token
- `UserName`: User's display name
- `UserRole`: User's role (Head, Instructor, VicePresident, or delegate role)

## Error Handling

- Guards handle cases where localStorage is not available
- Fallback mechanisms for role checking
- Graceful handling of authentication failures

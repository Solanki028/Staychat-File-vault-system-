# 1. Authentication Module

## 1.1 User Registration

### Description

Allows a new Business Owner to create an account.

### Inputs

- Full Name
- Email
- Password
- Confirm Password

### Validation

- Email must be unique.
- Password minimum 8 characters.
- Password must contain uppercase, lowercase, number, and special character.
- Confirm Password must match.

### Success Flow

1. Validate input.
2. Create user.
3. Hash password.
4. Save user.
5. Generate JWT.
6. Redirect to Dashboard.

### Failure Cases

- Email already exists.
- Invalid email.
- Weak password.
- Database error.

---

## 1.2 Login

### Inputs

- Email
- Password

### Success

- Verify credentials.
- Generate access token.
- Redirect Dashboard.

### Failure

- Invalid credentials.
- User not found.
- Account disabled.

---

## 1.3 Logout

### Behaviour

- Remove token.
- Clear local storage.
- Redirect Login.

# 3. Company Management

---

## Create Company

### Required Fields

- Company Name
- Registration Number
- Email
- Phone
- Country
- Address

### Optional Fields

- Website
- Tax Number
- Logo

---

### Workflow

Click `Add Company`

↓

Open Modal

↓

Fill Form

↓

Validate

↓

Save

↓

Redirect Company Workspace

---

### Success Message

```
Company created successfully.
```

---

### Error Cases

- Duplicate Registration Number
- Duplicate Email
- Missing Required Fields

---

## Edit Company

### Editable Fields

- Logo
- Address
- Contact
- Website
- Email
- Phone

### Cannot Edit

- Company ID

---

## Delete Company

### Confirmation

Before deletion, display confirmation:

```
Are you sure?

This action cannot be undone.
```

---

### Business Rule

Deleting company removes:

- Documents
- Employees
- Vehicles
- Partners

*(or soft delete depending on architecture)*

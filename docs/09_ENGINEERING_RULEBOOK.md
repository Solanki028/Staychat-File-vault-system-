# ENGINEERING RULEBOOK

**Project:** Company Workspace & Secure Document Management Platform

**Version:** 1.0

**Status:** Mandatory

---

# Purpose

This document defines the engineering standards for the project.

Every developer and AI coding assistant must follow these rules.

These rules override personal coding preferences.

The goal is to maintain a scalable, maintainable, production-grade codebase throughout the lifetime of the project.

---

# Engineering Philosophy

We build software for long-term maintainability, not short-term completion.

Every feature should:

- Be modular
- Be reusable
- Be testable
- Be scalable
- Be secure
- Be easy to understand

Never trade architecture for convenience.

---

# Core Engineering Principles

## Single Responsibility Principle

Every file should have one responsibility.

Good

```
UserService

AuthenticationService

CompanyRepository
```

Bad

```
UserService

Authentication

Upload

Notification

Invoice

Everything inside one file
```

---

## DRY

Never duplicate code.

If logic appears twice,

Extract it.

---

## KISS

Always choose the simplest solution that satisfies the requirements.

Avoid unnecessary abstraction.

---

## YAGNI

Do not build features that are not currently required.

Future-proof architecture.

Do not future-proof implementation.

---

# Backend Rules

## Folder Responsibilities

controllers/

Receive request

↓

Validate

↓

Call Service

↓

Return response

Nothing else.

---

services/

Business Logic

Only business logic belongs here.

---

repositories/

MongoDB queries only.

No business logic.

---

routes/

Only endpoint definitions.

---

middlewares/

Authentication

Authorization

Validation

Logging

Error Handling

---

validators/

Input validation only.

---

utils/

Reusable helper functions.

---

config/

Environment

Database

Security

Application Config

---

# Frontend Rules

## Pages

Pages compose the UI.

Pages should not contain business logic.

---

## Components

Reusable.

Small.

Independent.

Maximum responsibility:

One component = One purpose.

---

## Hooks

Custom hooks contain reusable logic.

Never duplicate state logic.

---

## Redux

Store only global state.

Examples

✓ Auth

✓ User

✓ Company

✓ Notifications

Do NOT store local modal state.

---

## API Layer

Never call axios directly inside components.

Always use

services/

---

# Naming Conventions

## Components

PascalCase

CompanyCard

DocumentUploader

EmployeeTable

---

## Hooks

useCompany

useUpload

useSearch

---

## Services

companyService

documentService

invoiceService

---

## Repositories

CompanyRepository

EmployeeRepository

---

## Variables

camelCase

companyName

employeeId

invoiceNumber

---

## Constants

UPPER_SNAKE_CASE

MAX_FILE_SIZE

DEFAULT_PAGE_SIZE

---

# React Rules

Never create giant components.

Maximum recommended size

300 lines.

If larger,

Split it.

---

Always

Memoize expensive calculations.

Lazy load large pages.

Reuse layouts.

Prefer composition.

Avoid prop drilling.

---

# Express Rules

One route file

↓

One controller

↓

One service

↓

One repository

Never skip layers.

---

# MongoDB Rules

Every business entity references

companyId

Never duplicate company information.

Use timestamps.

Use indexes.

Never store unnecessary data.

---

# Security Rules

Always

JWT Authentication

Helmet

CORS

Input Validation

Ownership Validation

Rate Limiting

Secure File Upload

Never expose stack traces.

Never expose Mongo IDs unnecessarily.

Never trust frontend validation.

---

# File Upload Rules

Allowed

PDF

Images

Office Documents

ZIP

Maximum Size

25MB

Validate

Extension

Mime Type

Size

Company Ownership

Reject

Executable Files

Scripts

Unknown MIME Types

---

# Error Handling Rules

Every API must return

```
success

message

data

```

Never return raw database errors.

Never expose internal implementation.

Always provide user-friendly messages.

---

# UI Rules

The UI should feel

Modern

Minimal

Enterprise

Professional

Responsive

Consistent

Animations

Subtle

Fast

Meaningful

---

# Performance Rules

Always

Pagination

Lazy Loading

Memoization

Debounced Search

Database Indexes

Compression

Code Splitting

Never fetch unnecessary data.

---

# Database Rules

Soft Delete

Future-ready

Audit Fields

ObjectId References

Indexes

Timestamps

No duplicated information

---

# Git Rules

One feature

↓

One branch

↓

One Pull Request

Commit Messages

Good

```
feat: add company workspace

fix: upload validation

refactor: optimize dashboard cards
```

Bad

```
update

fix

done

changes
```

---

# Documentation Rules

Every major feature requires

Updated documentation

Architecture changes

API changes

Database changes

Roadmap update

---

# Code Review Checklist

Before merging verify

✓ No console.log

✓ No commented code

✓ No duplicated logic

✓ Responsive

✓ Validation

✓ Loading State

✓ Error State

✓ Empty State

✓ Secure APIs

✓ Proper Naming

✓ Reusable Components

✓ Modular Architecture

---

# AI Rules

Before generating code

Read existing implementation.

Understand architecture.

Reuse components.

Reuse hooks.

Reuse services.

Never rewrite unrelated code.

Never introduce breaking changes.

Always explain architectural decisions.

If uncertain,

Ask questions.

Never guess.

---

# Definition of Done

A feature is complete only if

✓ UI Complete

✓ Backend Complete

✓ API Integrated

✓ Database Updated

✓ Validation Added

✓ Error Handling Added

✓ Loading State Added

✓ Empty State Added

✓ Responsive

✓ Security Verified

✓ Documentation Updated

✓ Code Reviewed

---

# Project Values

Architecture over shortcuts.

Quality over speed.

Security over convenience.

Consistency over personal preference.

Reuse over duplication.

Maintainability over cleverness.

Scalability from day one.

---

END OF DOCUMENT
# AI Development Guide

Project Name:
Company Workspace & Secure Document Management Platform

Purpose

This document provides development rules and project context for AI coding assistants such as Claude, Cursor, GitHub Copilot, Gemini, and ChatGPT.

The AI must follow these instructions throughout development.

---

# 1. Project Overview

This project is a production-level SaaS platform for securely managing companies and their confidential business information.

The platform allows Business Owners to create companies and manage company-related records such as:

• Documents
• Employees
• Partners
• Vehicles
• Banking Details
• Invoice Settings
• Company Information

Every feature belongs to a Company Workspace.

---

# 2. Architecture Principles

Always follow these principles.

✓ Company is the root entity.

✓ Every module references companyId.

✓ Never create business logic inside React components.

✓ Keep controllers thin.

✓ Business logic belongs in Services.

✓ Database logic belongs in Repository Layer.

✓ Validation occurs before Controllers.

✓ APIs remain RESTful.

✓ Every module is independent.

✓ Components should be reusable.

✓ Never duplicate logic.

✓ Prefer composition over duplication.

---

# 3. Technology Stack

Frontend

React
Vite
Tailwind CSS
Redux Toolkit
React Router
Axios

Backend

Node.js
Express.js
MongoDB
Mongoose
JWT
Multer

Deployment

Frontend → Vercel

Backend → Render

Database → MongoDB Atlas

---

# 4. Folder Structure

Backend

controllers/

routes/

middlewares/

services/

repositories/

models/

validators/

utils/

config/

Frontend

components/

pages/

layouts/

hooks/

redux/

services/

api/

utils/

constants/

---

# 5. Coding Rules

Always

✓ Use async/await

✓ Handle errors

✓ Validate requests

✓ Use proper HTTP status codes

✓ Keep functions small

✓ Write reusable code

✓ Use descriptive names

✓ Follow Single Responsibility Principle

Never

✗ Write duplicated code

✗ Put business logic inside UI

✗ Hardcode values

✗ Ignore loading states

✗ Ignore error handling

---

# 6. UI Guidelines

The UI should feel modern and premium.

Design Language

Minimal

Professional

Glassmorphism

Responsive

Fast

Simple

Animations should remain subtle.

---

# 7. Components

Always make reusable components.

Examples

Button

Input

Modal

Card

Search

Table

Pagination

Breadcrumb

FileUploader

PreviewDialog

DeleteDialog

SkeletonLoader

Never create duplicate components.

---

# 8. API Rules

Every API must

Validate input

Return standard response

Handle errors

Use JWT authentication

Check ownership

Support pagination where necessary

---

# 9. Database Rules

Company is always parent.

Everything references companyId.

Never duplicate company information.

Use ObjectId references.

Enable timestamps.

Use indexes.

---

# 10. Security

Always

JWT

Helmet

CORS

Input Validation

Ownership Validation

File Validation

Rate Limiting

Never expose sensitive errors.

---

# 11. Development Rules

Every feature must include

✓ Loading State

✓ Empty State

✓ Error State

✓ Success State

✓ Responsive Design

✓ Validation

✓ Permission Check

---

# 12. Git Rules

Small commits

Meaningful commit messages

One feature per commit

Never mix unrelated changes

---

# 13. Code Review Checklist

Before completing any feature verify

✓ No console logs

✓ No unused imports

✓ No duplicate logic

✓ Responsive

✓ Error handling

✓ Validation

✓ API integrated

✓ Loading state

✓ Empty state

✓ Security check

---

# 14. AI Instructions

Before generating code

Understand existing architecture.

Reuse existing components.

Do not rewrite working code.

Modify only required modules.

Avoid unnecessary dependencies.

Maintain consistency.

Always explain architectural decisions.

Never make assumptions without checking existing code.

---

END OF DOCUMENT
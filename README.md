# 📘 University Learning Management System (LMS)
### SDLC Model & Requirement Specification

> Internal, single-university platform — **no public registration**. All accounts are created by Admin/Super Admin.

---

## 📑 Table of Contents

1. [Project Overview](#1-project-overview)
2. [SDLC Model Selection](#2-sdlc-model-selection)
3. [Project Selection](#3-project-selection)
4. [System Actors](#4-system-actors)
5. [Academic Structure](#5-academic-structure)
6. [Requirement Analysis](#6-requirement-analysis)
   - [6.1 Super Admin](#61-super-admin)
   - [6.2 Admin](#62-admin)
   - [6.3 Teacher](#63-teacher)
   - [6.4 Employee](#64-employee)
   - [6.5 Student](#65-student)
7. [Authentication & Password Policy](#7-authentication--password-policy)
8. [Request-Approval Workflow](#8-request-approval-workflow)
9. [Classroom Module](#9-classroom-module)
10. [Business Rules Summary](#10-business-rules-summary)
11. [Non-Functional Requirements](#11-non-functional-requirements)
12. [Data Model (Core Entities)](#12-data-model-core-entities)
13. [Implementation Plan (Increments)](#13-implementation-plan-increments)
14. [Testing Strategy](#14-testing-strategy)
15. [Deployment & Maintenance](#15-deployment--maintenance)

---

## 1. Project Overview

A web-based **Learning Management System** built exclusively for one university. It automates department administration, course/classroom management, and semester-based student enrollment through a strict role hierarchy and a generic request-approval workflow. There is **no self-registration** — every account is created internally.

---

## 2. SDLC Model Selection

### ✅ Model Chosen: **Incremental Model**

Requirements (especially Admin-eligibility and approval rules) evolved through multiple rounds of clarification during analysis. The Incremental Model absorbs such change between increments without forcing a full restart.

| Increment | Modules Covered | Key Deliverable |
|---|---|---|
| 1 | User & Role Management | Login system; account creation by Admin/Super Admin |
| 2 | Department, Batch & Admin Assignment | Department/Batch CRUD, Admin direct-assign & self-request |
| 3 | Request-Approval Workflow Engine | Generic `Request` module for all approval-based actions |
| 4 | Course Management | Course creation/approval, semester mapping (1–8) |
| 5 | Classroom Module | Classroom creation, auto-join, block/unblock |
| 6 | Core LMS Features | Course content, materials, grading, notices |
| 7 | Testing, Integration & Deployment | System-wide QA, UAT, university server rollout |

---

## 3. Project Selection

| Item | Detail |
|---|---|
| **Title** | Learning Management System (LMS) for [University Name] — Internal Use Only |
| **Objective** | Centralize course allocation, department administration, and user management under a controlled digital workflow |
| **Scope** | Single university only; no public registration; covers RBAC, request-approval engine, and semester-based auto-enrollment |

### Feasibility Study

| Type | Assessment |
|---|---|
| **Technical** | Feasible with a standard web stack (Laravel/Django/Node.js + MySQL/PostgreSQL); RBAC and approval-workflow patterns are well established |
| **Economic** | Low cost — no payment gateway or OTP/email-verification-based registration needed at signup |
| **Operational** | High — role hierarchy mirrors real university administration |
| **Schedule** | Feasible; Incremental Model allows partial delivery even if later increments slip |

---

## 4. System Actors

| Actor | Real-World Role | Count |
|---|---|---|
| **Super Admin** | Vice Chancellor (VC), Treasurer, Registrar | Multiple (top officials) |
| **Admin** | Department Chairman | Exactly one per department |
| **Teacher** | University faculty member | Multiple |
| **Employee** | Non-teaching administrative staff | Multiple |
| **Student** | Enrolled student | Multiple |

---

## 5. Academic Structure

```
Department
 ├── Courses           (each course has a fixed semester_no: 1–8)
 └── Batches            (each batch has 8 total semesters)

Classroom = Department + Batch + Course   (ONE classroom, ONE teacher — no Section layer)
```

> **Note:** The "Section" concept was considered and explicitly **removed**. A single Batch + Course combination maps to exactly **one** Classroom with exactly **one** Teacher.

---

## 6. Requirement Analysis

### 6.1 Super Admin

**Functional Requirements**
- Create, edit, deactivate **Departments** and **Batches**
- Add new **Teachers, Employees, Students** (base account creation)
- Directly assign any **Teacher or Employee** as **Admin** of a department — no precondition required
- Approve/reject a **Teacher's self-request** to become Admin (only allowed when the department currently has no Admin)
- Approve/reject all Admin-submitted requests: teacher addition, student addition, course creation, page creation, batch/section creation, classroom creation
- Suspend or remove any account (override authority)
- View system-wide reports and full request logs

**Constraints**
- A **Student can never become Admin** — no exception, no pathway
- Admin can only be assigned from the **Teacher or Employee** pool
- At most **one Admin per department**

---

### 6.2 Admin (Department Chairman)

**Functional Requirements**
- Submit request to create a new **Course** *(needs Super Admin approval)*
- Submit request to add a new **Teacher**, including external-university teachers *(needs Super Admin approval)*
- Submit request to add a new **Student** *(needs Super Admin approval)*
- Submit request to create a new **page** *(needs Super Admin approval)*
- Submit request to create a new **batch** *(needs Super Admin approval)*
- Set/assign the **semester_no** for a course
- Approve/reject **Classroom creation requests** from Teachers *(Admin OR Super Admin — either can approve)*
- Track status of all self-submitted requests

**Constraints**
- Course, teacher, student, page, and batch creation all require Super Admin approval
- Cannot create or promote other Admins
- Exactly one Admin exists per department

---

### 6.3 Teacher

**Functional Requirements**
- View available/assigned courses
- Submit a **Classroom creation request** (Department + Batch + Course) to Admin **or** Super Admin
- If home department currently has **no Admin**, submit a self-request to Super Admin to become Admin
- Manage classroom content, students, and grading
- **Block/unblock** a student within a specific classroom

**Constraints**
- Cannot self-register
- Classroom becomes active only after Admin/Super Admin approval
- Self-request-for-Admin option available only when the department has no existing Admin

---

### 6.4 Employee

**Functional Requirements**
- Access limited administrative/support features (scope finalized during Increment 6)
- Eligible to be **directly assigned as Admin** by Super Admin

**Constraints**
- Cannot self-register
- **No self-request** option to become Admin — only Super Admin's direct assignment applies

---

### 6.5 Student

**Functional Requirements**
- Automatically join a **Classroom** the moment it's approved for their Batch — and automatically join **any time later** if they're added/transferred into that batch (continuous auto-join, not a one-time snapshot)
- View course materials, schedules, grades
- View own profile, department, and batch information

**Constraints**
- Cannot self-register
- No manual course/classroom selection — fully automatic based on batch
- Can **never** become an Admin
- Can be **blocked** from a specific classroom by its Teacher if needed

---

## 7. Authentication & Password Policy

| Rule | Detail |
|---|---|
| **Login identifier** | Registration ID **or** Email — either can be used |
| **Authentication** | Password-based |
| **Account creation** | Admin/Super Admin sets initial Registration ID + temporary Password when creating the account |
| **First login password change** | Allowed directly, no verification needed (already authenticated session) |
| **Subsequent password change / forgot password** | Requires **Email Verification** (OTP or verification link) before a new password can be set |
| **Email field** | Mandatory for every user (required for password-change verification) |

**Password Change Flow**
```
IF is_first_login == true:
    Allow password change directly (no verification)
    SET is_first_login = false
ELSE:
    Send OTP / verification link to registered email
    IF verified: allow new password to be set
    ELSE: reject
```

---

## 8. Request-Approval Workflow

A single generic **Request** module handles all approval-based actions.

| Request Type | Submitted By | Approved By | Precondition |
|---|---|---|---|
| Add Teacher | Admin | Super Admin | None |
| Add Student | Admin | Super Admin | None |
| Add Batch | Admin | Super Admin | None |
| Create Course | Admin | Super Admin | None |
| Create Page | Admin | Super Admin | None |
| Become Admin (self-request) | Teacher only | Super Admin | Department has no current Admin |
| Create Classroom | Teacher | **Admin or Super Admin** | None |

---

## 9. Classroom Module

**Definition:** A Classroom = a unique `(Batch, Course)` pair, taught by exactly one Teacher.

**Creation Flow**
1. Teacher submits a Classroom-creation request for a specific Department + Batch + Course
2. Admin **or** Super Admin approves/rejects
3. On approval, all current students of that Batch auto-join the Classroom
4. Any student added to that Batch **afterward** (transfer, late admission) is **also auto-joined**, continuously — not just at approval time
5. Teacher can **block** a student from the Classroom at any time if issues arise (and unblock later)

**Constraints**
- `(batch_id, course_id)` is unique — only **one** approved Classroom can exist per Batch+Course
- Only one Teacher per Classroom

---

## 10. Business Rules Summary

| # | Rule |
|---|---|
| 1 | No public registration; all accounts created by Admin or Super Admin |
| 2 | Only Teacher or Employee can become Admin — Student never can |
| 3 | Max one Admin per department |
| 4 | Super Admin can directly assign Admin with no precondition |
| 5 | Only Teachers may self-request Admin, and only if the department has no Admin |
| 6 | Admin's course/teacher/student/page/batch creation all require Super Admin approval |
| 7 | Classroom creation requests can be approved by **either** Admin or Super Admin |
| 8 | Students auto-join classrooms based on Batch — continuously, not just once |
| 9 | Section concept is **not** used; Batch + Course uniquely defines a Classroom |
| 10 | Login via Registration ID or Email + Password; password changes after first login require email verification |

---

## 11. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Security** | RBAC, session management, full audit log of approvals |
| **Usability** | Role-specific dashboards; clear Pending/Approved/Rejected indicators |
| **Reliability** | Semester/batch-based auto-join logic must be error-free |
| **Scalability** | Must support growth across departments, courses, batches, years |
| **Data Integrity** | Strict validation on manual data entry (no self-registration to self-correct) |
| **Availability** | Minimal downtime during enrollment/registration periods |

---

## 12. Data Model (Core Entities)

```
User (user_id, registration_id UNIQUE, email UNIQUE NOT NULL, password_hash,
      name, base_role: Teacher/Employee/Student, department_id, is_first_login)

Role (role_id, user_id, role_type: Admin/SuperAdmin, department_id, assigned_by, assigned_at)

Department (department_id, name)

Batch (batch_id, department_id, batch_name/year)

Course (course_id, department_id, course_name, semester_no [1–8])

Classroom (classroom_id, department_id, batch_id, course_id, teacher_id,
           status: Pending/Approved/Rejected, approved_by, created_at)
           UNIQUE (batch_id, course_id)

ClassroomEnrollment (enrollment_id, classroom_id, student_id,
                      status: Active/Blocked, joined_at)

Request (request_id, request_type, requested_by, department_id,
         payload JSON, status: Pending/Approved/Rejected, approved_by,
         created_at, updated_at)
```

**Continuous Auto-Join Trigger**
```
ON new Student added to a Batch (or batch changed):
    FOR EACH Classroom WHERE classroom.batch_id == student.batch_id
                          AND classroom.status == "Approved":
        IF student NOT already enrolled:
            INSERT ClassroomEnrollment (classroom_id, student_id, status="Active")
```

---

## 13. Implementation Plan (Increments)

1. **Increment 1** — Authentication (Registration ID/Email login), User & Role Management
2. **Increment 2** — Department & Batch CRUD, Admin direct-assign & self-request logic
3. **Increment 3** — Generic Request-Approval Engine
4. **Increment 4** — Course Management (semester mapping)
5. **Increment 5** — Classroom Module (creation, continuous auto-join, block/unblock)
6. **Increment 6** — Core LMS Features (materials, grading, notices)
7. **Increment 7** — System-wide Testing, UAT, Deployment

---

## 14. Testing Strategy

| Test Type | Focus |
|---|---|
| Unit Testing | Admin-eligibility checks, semester/batch mapping, auto-join trigger |
| Integration Testing | Request-approval flow: Admin ↔ Super Admin, Teacher ↔ Admin/Super Admin |
| Role-Based Access Testing | Each actor restricted to permitted actions only |
| Regression Testing | Re-verify business rules after each increment |
| UAT | Validation with real Chairman, faculty, and student users before rollout |

---

## 15. Deployment & Maintenance

**Deployment**
- Host on university-managed server / private cloud (campus network or VPN-restricted if required)
- Bulk-import initial departments, teachers, employees, students
- Optional parallel run alongside any existing manual process for one semester

**Maintenance**
- **Corrective** — fix defects (e.g., auto-join edge cases)
- **Adaptive** — update business rules as policy changes (rules already evolved several times during analysis — keep the Request module configurable)
- **Perfective** — add features (assignments, quizzes, attendance) in future increments
- **Preventive** — periodic security audits and semester-wise backups

---

*Document maintained as part of the SDLC requirement baseline. Update this file whenever a business rule changes before starting a new increment.*
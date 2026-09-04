# AGENTS.md

## Project Overview

This project is a local-first integrated business management and decision-support system.

The system connects:

* Sales
* Operations
* Finance
* Management
* Alerts
* Business event history

The most important feature is **live impact analysis**: every relevant field change must be analyzable before saving, without mutating real data.

The system must also recalculate dependent business results immediately after a real mutation.

---

## Tech Stack

* TypeScript
* Next.js App Router
* Bun
* Drizzle ORM
* SQLite
* Zod

Frontend technologies:

* shadcn/ui
* Zustand
* React Hook Form

Do not introduce another framework or database unless explicitly requested.

---

## Core Architecture

Keep the following layers separated:

```text
API Route
   ↓
Validation
   ↓
Service
   ↓
Domain / Business Logic
   ↓
Repository
   ↓
Drizzle / SQLite
```

### Rules

* API routes must stay thin.
* Do not put business logic inside route handlers.
* Business calculations must be reusable from both API endpoints and frontend-facing preview endpoints.
* Database access should go through repositories where practical.
* Domain calculations should be pure whenever possible.
* Validation must happen at API boundaries.
* Do not duplicate business calculations.
* Prefer simple architecture over unnecessary abstraction.

---

## Database

SQLite is the primary database.

Drizzle ORM is the database access layer.

Core entities include:

* Product
* Customer
* Sales Opportunity
* Order
* Inventory
* Installation Capacity
* Financial Transaction
* Management Settings
* Business Alert
* Organizational Event

Use proper foreign keys and relationships.

Historical organizational events must be append-only.

---

## Dynamic Business Rules

Business-impacting values MUST NOT be hardcoded in business logic.

The following must come from database settings or entities:

* Product price
* Unit cost
* Safety stock
* Installation time
* Target profit margin
* Minimum operational cash
* Fixed shipping cost
* Shipping cost per unit
* Installation capacity
* Capacity thresholds
* Alert enable/disable states

Seed values are allowed in the seed script.

Seed values must never become assumptions inside domain logic.

### Anti-hardcoding rule

Bad:

```text
if margin < 20
```

Good:

```text
if margin < settings.targetProfitMargin
```

---

## Business Calculations

Centralize all business calculations.

Required calculations:

```text
Revenue
Product Cost
Shipping Cost
Installation Hours
Operating Profit
Profit Margin
Available Inventory
Remaining Capacity
Capacity Utilization
Cash Balance
Projected Cash Balance
Minimum Projected Cash
Feasibility
Alerts
```

Formulas:

```text
Revenue = quantity × unit price

Product Cost = quantity × unit cost

Shipping Cost =
  fixed shipping cost +
  (shipping cost per unit × quantity)

Installation Hours =
  quantity × installation minutes per unit ÷ 60

Operating Profit =
  revenue − product cost − shipping cost

Profit Margin =
  operating profit ÷ revenue × 100
```

Do not implement these formulas separately in multiple places.

---

## Live Impact / Simulation

Live impact is a first-class backend capability.

The system must support hypothetical states.

Example:

```text
Current quantity: 30
Hypothetical quantity: 40
```

The backend should calculate the consequences of `40` without changing the stored value of `30`.

The response should be able to contain:

* Revenue
* Cost
* Profit
* Profit margin
* Remaining inventory
* Installation hours
* Remaining capacity
* Capacity utilization
* Feasibility
* Alerts
* Affected entities where applicable

The same calculation engine must be used after persistence.

Never create a separate calculation implementation for preview mode.

---

## Feasibility

Every sales opportunity can have one of:

* `feasible`
* `conditional`
* `infeasible`

Warnings must NOT prevent saving.

Only structurally invalid data may block persistence.

Examples of invalid data:

* Missing required fields
* Invalid dates
* Invalid numeric values
* Forbidden negative values

A critical business warning is still a warning, not a validation error.

---

## Alert System

Alert severities:

* `info`
* `risk`
* `critical`

The alert engine should support at least:

* Inventory shortage
* Safety stock violation
* Installation capacity pressure
* Installation capacity shortage
* Profit margin below target
* Cash below minimum operational cash

Alert rules must use dynamic management settings.

Alerts should contain enough information to explain:

* Title
* Severity
* Cause
* Impact
* Suggested correction

---

## Event / Audit System

Every real mutation should be able to generate an organizational event.

Events should contain:

* Timestamp
* Event type
* Entity type
* Entity ID
* Before state/value
* After state/value
* Reason
* Generated alerts

Events are historical records.

Never overwrite or delete previous event history as part of normal updates.

---

## Confirmed Sales

When an opportunity becomes confirmed, it becomes an organizational commitment.

Confirmed sales must affect subsequent:

* Inventory calculations
* Reserved inventory
* Capacity calculations
* Business analysis
* Alerts
* Management KPIs

This must happen through real domain logic, not frontend-only state.

---

## API Design

Use Next.js App Router API routes.

Keep endpoint handlers thin:

```text
Request
→ Zod validation
→ Service
→ Domain logic
→ Repository
→ Response
```

Expected API areas:

```text
/api/products
/api/customers
/api/opportunities
/api/orders
/api/inventory
/api/capacity
/api/finance
/api/settings
/api/alerts
/api/events
/api/analysis
```

Exact endpoint naming may be adjusted if the existing architecture has a better consistent convention.

---

## Validation

Use Zod for request validation.

Separate:

* Structural validation
* Business analysis

Do not use business warnings as schema validation errors.

For example:

```text
negative quantity
→ validation error

low profit margin
→ valid request + business warning
```

---

## Seed Data

Create a deterministic seed script for the challenge dataset.

The seed should include:

* 3 products
* 5 customers
* 5 opportunities
* 3 confirmed orders
* Inventory
* Installation capacity
* Cash
* Receivables
* Payments
* Expenses
* Management settings

The exact initial values belong in the seed/data layer.

The application must remain fully dynamic after seeding.

---

## Local-First Requirement

The final application must work locally without:

* External APIs
* Cloud databases
* Paid services
* API keys
* External AI services
* Mandatory internet access

SQLite is the local persistence layer.

---

## Testing

Prioritize tests for domain calculations.

At minimum test:

* Revenue
* Product cost
* Shipping
* Operating profit
* Profit margin
* Inventory impact
* Capacity impact
* Cash impact
* Feasibility
* Alert severity
* Hypothetical/live-impact calculations

Tests must not depend on the initial seed data unless specifically testing the seed itself.

---

## Development Commands

The project uses Bun.

Prefer:

```text
bun install
bun dev
bun run build
bun run lint
```

For Drizzle, configure scripts for:

```text
db:generate
db:migrate
db:seed
```

Use the existing project configuration where possible instead of unnecessarily replacing it.

---

## Code Quality

Priorities:

1. Correct business behavior
2. Dynamic configuration
3. Reusable domain logic
4. Clear architecture
5. Type safety
6. Testability
7. Simplicity

Avoid:

* Premature abstractions
* Duplicate business logic
* Hardcoded business rules
* Frontend-only business calculations
* Database logic inside UI components
* API handlers containing complex calculations

---

## Important Product Rule

The system is an analysis and warning system.

**Warnings must never normally block business operations.**

Even a critical inventory, capacity, margin, or cash warning should still allow the user to save valid data.

The system should explain the risk instead of preventing the operation.

---

## Before Finishing Any Backend Task

Always verify:

1. TypeScript has no errors.
2. Lint passes.
3. Relevant tests pass.
4. Database schema is consistent.
5. Migrations are valid.
6. Business logic does not contain hardcoded business parameters.
7. Live simulation does not mutate persisted data.
8. Real mutations can trigger recalculation.
9. Audit events preserve historical state.
10. Existing functionality has not been unnecessarily broken.

---

## Current Development Phase

The current phase is:

**Backend skeleton + database + domain/business logic + API foundation.**

Do not spend time building UI unless explicitly requested.

The frontend will consume the backend APIs and the shared business-analysis engine later.


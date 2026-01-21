# Requirements Analysis

## Introduction
This document outlines the mental framework used to approach the Minders feedback widget assignment. The solution was designed with a SaaS (Software as a Service) platform in mind, where multiple clients manage feedback for their projects via a centralized system.

## SaaS Context
- **Client Accounts**: Each client has a dedicated account with authentication and billing.
- **Dashboard**: Clients use a web dashboard to create/manage projects, view feedback analytics, and configure API keys.
- **Project Management**: Projects are created in the dashboard, generating unique IDs and API keys for integration.

## In-Scope vs. Out-of-Scope
- **In-Scope**: SDK widget, backend API, feedback collection/storage, auth via API keys.
- **Out-of-Scope (Non-Functional)**: User accounts, dashboard UI, project CRUD APIs, analytics. These are assumed to exist but not implemented.
- **Why Persist Projects**: Projects are seeded (not created runtime) to simulate real SaaS data, ensuring feedback links correctly.

## SDK Integration
- **Connection Model**: SDK initializes with `projectId` and `apiKey` (generated in dashboard).
- **Assumption**: Projects are created via dashboard, providing credentials for SDK embedding.
- **Security**: API keys validate requests; project ID ensures feedback isolation.

## Backend Assumptions
- **Validation & Updates**: Incoming SDK connections validated; CORS allows cross-origin requests from client sites.
- **Live Updates**: In production, use AWS services (e.g., API Gateway, Lambda) for real-time validation/updates.
- **Data Flow**: SDK → API → DB; feedback stored per project for multi-tenancy.

## Conclusion
This SaaS mindset ensured a scalable, secure solution focused on feedback collection while assuming broader platform features. It guided decisions like API key auth and project seeding.

# ADR: My Technology and Architecture Choices for the Minders Feedback Widget Solution

## Status
Accepted

## Context
As the developer, I built a full-stack feedback collection system: a browser SDK widget and a Node.js API. The challenge required end-to-end functionality, developer experience, security, maintainability, and hexagonal architecture. I prioritized simplicity, type safety, and ease of testing while ensuring reliable data flow from widget to backend.

## Decision
I chose **TypeScript** for both the SDK and backend to enforce type safety, improve developer productivity with autocompletion, and catch errors early. For the backend, I used **Node.js with Express** for its lightweight API development, paired with **hexagonal architecture** (ports and adapters) to separate business logic from infrastructure, making it testable and adaptable (e.g., swapping in-memory storage for a database like Prisma later). I selected **Vitest** for testing due to its speed, native TypeScript support, and Vite ecosystem, enabling unified testing for the SDK (with jsdom for browser mocks) and backend (Node environment).

For validation, I used **Zod** in the backend for its mature ecosystem and Express middleware compatibility, and **Valibot** in the SDK for its small bundle size and performance in browsers. The backend uses in-memory storage by default for simplicity, with an optional Prisma (SQLite) implementation for persistent storage, allowing runtime switching to showcase adapter modularity. The SDK widget uses **Shadow DOM** for style isolation and a custom HTML template for theming, relying on the **Fetch API** with exponential backoff for submissions. Authentication is handled via API keys for lightweight security.

## Rationale
- **Type Safety & DX**: I selected TypeScript over plain JavaScript to reduce runtime errors and enhance maintainability; it's essential for a scalable codebase.
- **Backend Stack**: Express is minimal and suitable for APIs; hexagonal architecture ensures clean separation, as required, allowing easy future changes like adding Prisma without affecting core logic. I avoided heavier frameworks like NestJS to keep it simple.
- **Validation Libraries**: Zod fits the backend's need for robust middleware; Valibot optimizes the SDK's bundle size. I considered using one library but prioritized performance for the client-side.
- **Testing**: Vitest's integration with Vite provided fast, reliable tests; Jest was considered but Vitest's TypeScript handling was superior.
- **SDK Design**: Shadow DOM prevents style conflicts; Fetch with retries ensures reliability. I rejected React for the widget to avoid unnecessary dependencies.
- **Storage Modularity**: Prisma integration enables easy DB swap, reinforcing hexagonal architecture without affecting core logic.
- **Trade-offs**: In-memory storage is temporary for development; Prisma adds persistence but required downgrading to 5.x for compatibility. API key auth is simple and secure enough for this scope.
- **Security & Reliability**: Validation and auth prevent bad data; error handling is logged appropriately.

## Consequences
- Positive: Type-safe, testable, and easy to extend (e.g., with Prisma).
- Negative: In-memory data is volatile; Prisma addresses this, but setup adds initial complexity.
- Risks: Valibot's newer ecosystem; mitigated by similar Zod API.
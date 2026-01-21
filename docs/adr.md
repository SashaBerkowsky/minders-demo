# Architecture Decision Record

## Context
As the developer, I built a full-stack feedback collection system: a browser SDK widget and a Node.js API. The challenge required end-to-end functionality, developer experience, security, maintainability, and hexagonal architecture. I prioritized simplicity, type safety, and ease of testing while ensuring reliable data flow from widget to backend.

## Decision
I chose **TypeScript** for both the SDK and backend to enforce type safety, improve developer productivity with autocompletion, and catch errors early. For the backend, I used **Node.js with Express** for its lightweight API development, paired with **hexagonal architecture** (ports and adapters) to separate business logic from infrastructure, making it testable and adaptable. I selected **Vite** for its simplicity for developers, ability to create small builds using tree shaking, and integrated testing suite with UI capabilities. The backend uses Prisma (SQLite) for persistent storage, which includes UI visualization data tools for database management.

For validation, I used **Zod** in the backend for its mature ecosystem and Express middleware compatibility, and **Valibot** in the SDK for its small bundle size and performance in browsers. The backend uses Prisma (SQLite) for persistent storage of projects and feedback, ensuring data reliability. The SDK widget uses **Shadow DOM** for style isolation and a custom HTML template for theming, relying on the **Fetch API** with exponential backoff for submissions. Authentication is handled via API keys for lightweight security.

## Rationale
- **Type Safety & DX**: I selected TypeScript over plain JavaScript to reduce runtime errors and enhance maintainability; it's essential for a scalable codebase.
- **Backend Stack**: Express is minimal and suitable for APIs; hexagonal architecture ensures clean separation, as required, allowing easy future changes. I avoided heavier frameworks like NestJS to keep it simple.
- **Validation Libraries**: Zod fits the backend's need for robust middleware; Valibot optimizes the SDK's bundle size. I considered using one library but prioritized performance for the client-side.
- **Testing**: Vitest's integration with Vite provided fast, reliable tests; Jest was considered but Vitest's TypeScript handling was superior.
- **Build Tool Simplicity**: Vite's fast dev server and tree shaking ensure small, optimized bundles, while its testing suite with UI improves developer productivity.
- **Database Tooling**: Prisma includes UI tools for data visualization, making database management intuitive and reducing setup complexity.
- **SDK Design**: Shadow DOM prevents style conflicts; Fetch with retries ensures reliability. I rejected React for the widget to avoid unnecessary dependencies.
- **Storage Modularity**: Prisma integration enables easy DB swap, reinforcing hexagonal architecture without affecting core logic.
- **Trade-offs**: API key auth is simple and secure enough for this scope.
- **Security & Reliability**: Validation and auth prevent bad data; error handling is logged appropriately.

## Consequences
- Positive: Type-safe, testable, and easy to extend with persistent data via Prisma and optimized builds via Vite.
- Negative: Prisma setup adds complexity, but ensures data persistence.
- Risks: Valibot's newer ecosystem; mitigated by similar Zod API.

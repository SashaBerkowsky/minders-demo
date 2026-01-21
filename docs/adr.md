# Architecture Decision Record

## Context
A full-stack feedback collection system was built: a browser SDK widget and a Node.js API. The challenge required end-to-end functionality, developer experience, security, maintainability, and hexagonal architecture. Simplicity, type safety, and ease of testing were prioritized while ensuring reliable data flow from widget to backend.

## Decision
**TypeScript** was chosen for both the SDK and backend to enforce type safety, improve developer productivity with autocompletion, and catch errors early. For the backend, **Node.js with Express** was used for its lightweight API development, paired with **hexagonal architecture** (ports and adapters) to separate business logic from infrastructure, making it testable and adaptable. **Vite** was selected for its simplicity for developers, ability to create small builds using tree shaking, and integrated testing suite with UI capabilities. The backend uses Prisma (SQLite) for persistent storage, which includes UI visualization data tools for database management. Linting was used to ensure consistent code styling and type checking across the project.

For validation, **Zod** was used in the backend for its mature ecosystem and Express middleware compatibility, and **Valibot** in the SDK for its small bundle size and performance in browsers. The backend uses persistent storage of projects and feedback, ensuring data reliability. The SDK widget uses **Shadow DOM** for style isolation and a custom HTML template for theming, relying on the **Fetch API** instead of **Axios** to keep dependencies at minimum. Authentication is handled via API keys for lightweight security.

## Rationale
- **Type Safety & DX**: TypeScript was selected over plain JavaScript to reduce runtime errors and enhance maintainability; it's essential for a scalable codebase.
- **Code Quality**: Linting was used to ensure consistent code styling and type checking across the project.
- **Backend Stack**: Express is minimal and suitable for APIs; hexagonal architecture ensures clean separation, allowing easy future changes. Heavier frameworks like NestJS were avoided to keep it simple yet lightweight and scalable.
- **Validation Libraries**: Zod fits the backend's need for robust middleware; Valibot optimizes the SDK's bundle size. Using one library was considered but performance for the client-side was prioritized.
- **Testing**: Vitest's integration with Vite provided fast, reliable tests, including UI features for an interactive test runner and visualization; Jest was considered but Vitest's use in the SDK was prioritized in order to unify test libraries in both projects.
- **Build Tool Simplicity**: Vite's fast dev server and tree shaking ensure small, optimized bundles, while its testing suite with UI improves developer productivity.
- **Database Tooling**: Prisma includes UI tools for data visualization, making database management intuitive and reducing setup complexity. It also counts with clear data scheming in its own format.
- **SDK Minimalism**: A vanilla approach was adopted with minimal dependencies to reduce SDK bundle size and keep it framework agnostic.
- **SDK Design**: Shadow DOM prevents style conflicts; Fetch with retries ensures reliability.
- **Security & Reliability**: Validation and auth prevent bad data; error handling is logged appropriately in its own middleware.

## Consequences
- Positive: Type-safe, testable, and easy to extend with persistent data via Prisma and optimized builds via Vite.
- Negative: Prisma setup adds complexity, but once set up adds ease of use during development.
- Risks: Valibot's newer ecosystem; mitigated by similar Zod API.

# Macro Economics Constitution

## Core Principles

### I. Code Quality First
- **TypeScript Strictness**: All code must be fully typed with no `any` types unless explicitly justified
- **Component Modularity**: Components must be small, focused, and follow single-responsibility principle
- **Clean Code Standards**: Meaningful naming, DRY principles, and clear separation of concerns
- **Consistent Styling**: Use established patterns with Tailwind CSS and Radix UI primitives
- **Code Review Gate**: All changes require review for architecture consistency and best practices

### II. Testing Standards
- **Unit Testing Required**: All utility functions and hooks must have corresponding unit tests
- **Component Testing**: Critical UI components must have integration tests covering key user flows
- **Database Testing**: Server functions and database operations must be tested with proper mocking
- **Test Coverage Goals**: Maintain minimum 70% coverage for business-critical code paths
- **Pre-commit Validation**: All tests must pass before commits are accepted

### III. User Experience Consistency
- **Design System Adherence**: Follow established component patterns from `src/components/ui`
- **Responsive Design**: All features must work seamlessly on mobile, tablet, and desktop
- **Accessibility First**: WCAG 2.1 AA compliance required for all interactive elements
- **Loading States**: All async operations must display appropriate loading indicators
- **Error Handling**: User-friendly error messages with actionable recovery options
- **Animation Standards**: Use subtle, consistent animations that enhance rather than distract

### IV. Performance Requirements
- **Initial Load**: First Contentful Paint (FCP) under 1.5 seconds on 3G connection
- **Bundle Size**: Monitor and minimize JavaScript bundle size, lazy-load non-critical routes
- **Database Queries**: All queries must be optimized with proper indexing and pagination
- **Image Optimization**: All images must be properly sized, compressed, and lazy-loaded
- **Caching Strategy**: Implement appropriate caching for static assets and API responses
- **Memory Management**: Prevent memory leaks in React components, proper cleanup on unmount

## Development Standards

### Code Organization
- **File Structure**: Follow established patterns in `src/routes`, `src/components`, `src/server`
- **Import Order**: External packages → Internal modules → Relative imports → Types
- **Naming Conventions**: PascalCase for components, camelCase for functions/variables, kebab-case for files
- **Documentation**: Complex functions require JSDoc comments explaining purpose and parameters

### Database Standards
- **Schema Changes**: All migrations must be reversible and well-documented
- **Query Safety**: Use Drizzle ORM prepared statements; never interpolate user input
- **Data Validation**: Use Zod schemas for all API inputs and database operations
- **Audit Trail**: Critical data changes must be logged for debugging and compliance

## Quality Gates

### Before Merge
1. TypeScript compilation with no errors
2. All tests passing
3. No console warnings or errors
4. Responsive design verified
5. Accessibility audit passed

### Before Deploy
1. Performance metrics within targets
2. Security scan completed
3. Database migration tested in staging
4. User acceptance criteria verified

## Governance

- This constitution supersedes all ad-hoc development practices
- Amendments require documentation, team review, and migration plan for existing code
- Use `.specify/guidance.md` for runtime development guidance and patterns
- Complexity must be justified; prefer simple solutions over clever ones

**Version**: 1.0.0 | **Ratified**: 2026-01-08 | **Last Amended**: 2026-01-08

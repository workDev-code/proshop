## Always-on rules
- Use MVC structure
- Keep business logic in services
- Validate all request inputs
- Use async/await
- Return consistent error responses
- Do not install new libraries without checking existing stack

## Auth rules
- Follow patterns in src/modules/auth
- Hash passwords with bcrypt
- JWT verification must happen in middleware
- Never expose password field in responses

##
- Use pagination for list endpoints
- Avoid N+1 queries
- Keep query logic in repository/service layer
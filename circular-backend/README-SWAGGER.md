# Swagger/OpenAPI removed (moved)

This file was moved to `README-SWAGGER.md.deleted` as part of the cleanup that removes runtime Swagger/OpenAPI integration from the project.

If you need API documentation for frontend integration, either:

- Re-enable Springdoc by adding the dependency back to `build.gradle` and restoring `OpenApiConfig`, or
- Ask for a generated API README (I can create a hand-written OpenAPI/summary file or minimal API documentation in Markdown).

Available endpoints (brief):

- Profiles: POST /api/v1/profiles
- Articles: GET /api/v1/articles, GET /api/v1/articles/{id}, GET /api/v1/articles/search?type=...&q=...
- Messages: POST /api/v1/messages, GET /api/v1/messages/inbox/{recipientId}
- Trade requests: POST /api/trade-requests, GET /api/trade-requests/{id}, GET /api/trade-requests/receiver/{id}, GET /api/trade-requests/requester/{id}, PATCH /api/trade-requests/{id}/status, DELETE /api/trade-requests/{id}
- Admin profiles: DELETE /api/v1/admin/profiles/{id} (requires header X-ADMIN=true), POST /api/v1/admin/profiles/{id}/ban (requires X-ADMIN=true)

If you want a full machine-readable OpenAPI JSON, I can generate one manually from the controllers and DTOs.

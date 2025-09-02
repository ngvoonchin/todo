# QueryOptions Usage

The `findAll` endpoint now supports advanced querying through URL parameters.

## Pagination

- `page`: Page number (starts from 1)
- `limit`: Number of items per page (max 100)

Example: `GET /tasks?page=2&limit=10`

## Sorting

- `sortBy`: Field to sort by (title, createdAt, updatedAt, completed)
- `sortOrder`: Sort direction (asc, desc)

Example: `GET /tasks?sortBy=createdAt&sortOrder=desc`

## Filtering

### Simple filters:

- `title`: Filter by title (contains)
- `completed`: Filter by completion status (true/false)
- `description`: Filter by description (contains)

Example: `GET /tasks?completed=false&title=urgent`

### Advanced filters:

Use the format: `filter[field][operator]=value`

Supported operators:

- `eq` or `equals`: Exact match
- `ne` or `not_equals`: Not equal
- `like` or `contains`: Contains text
- `gt` or `greater_than`: Greater than
- `gte` or `greater_than_equals`: Greater than or equal
- `lt` or `less_than`: Less than
- `lte` or `less_than_equals`: Less than or equal

Example: `GET /tasks?filter[title][like]=project&filter[completed][eq]=false`

## Combined Usage

Example: `GET /tasks?page=1&limit=5&sortBy=createdAt&sortOrder=desc&completed=false&title=urgent`

This will return the first 5 incomplete tasks with "urgent" in the title, sorted by creation date (newest first).

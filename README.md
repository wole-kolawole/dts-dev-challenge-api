# DTS Developer Challenge Backend

This backend is an Express API for Case Worker tasks and uses SQL Server as the database

## Run locally

1. Create a `.env` file and copy the contents of `.env.example` to it.
2. Update the connection values in `.env` if necessary.
   - For trusted Windows auth, set `DB_DRIVER=msnodesqlv8` and `DB_TRUSTED_CONNECTION=true`.
   - For SQL auth, set `DB_DRIVER=tedious`, `DB_TRUSTED_CONNECTION=false`, `DB_USER`, and `DB_PASSWORD`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create the database and table with the SQL scripts in `sql/`. You can use `-U <username>` and `-P <password>` in place of `-E` if your SQL instance uses SQL Server Authentication.
   ```bash
   sqlcmd -S localhost -E -i sql/createTable.sql
   sqlcmd -S localhost -E -i sql/sampleData.sql
   ```
5. If using SQL authentication, create an application login and user for the API to use:
   ```bash
   sqlcmd -S localhost -E -Q "CREATE LOGIN TaskManagerApp WITH PASSWORD = 'DtsDevChallenge0526!';"
   sqlcmd -S localhost -E -Q "USE TaskManager; CREATE USER TaskManagerAppUser FOR LOGIN TaskManagerApp; ALTER ROLE db_owner ADD MEMBER TaskManagerAppUser;"
   ```
6. Start the API in development mode:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/tasks`
  - Creates a task.
  - Body: `{ title, description?, status, dueDate }`
- `GET /api/tasks`
  - Returns all tasks.
- `GET /api/tasks/:id`
  - Returns a single task by ID.
- `PATCH /api/tasks/:id/status`
  - Updates only the status of a task.
  - Body: `{ status }`
- `DELETE /api/tasks/:id`
  - Deletes a task.

## Database scripts

- `sql/createTable.sql` creates the `tasks` table.
- `sql/sampleData.sql` inserts a sample task.

## Tests

Run:
```bash
npm test
```

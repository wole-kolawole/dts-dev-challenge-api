# Caseworker Backend

This backend is an Express API for Case Worker tasks and uses MongoDB as the database

## Run locally

### Prerequisites
- Node.js 16+ installed
- MongoDB installed and running locally, OR a MongoDB Atlas account

### Setup Steps

1. Create a `.env` file and copy the contents of `.env.example` to it.
   ```bash
   cp .env.example .env
   ```

2. Update the `MONGODB_URI` in `.env`:
   - **Local MongoDB**: `mongodb://localhost:27017/TaskManager` (default)
   - **MongoDB Atlas (Cloud)**: `mongodb+srv://username:password@cluster.mongodb.net/TaskManager?retryWrites=true&w=majority`

3. Install dependencies:
   ```bash
   npm install
   ```

4. Seed the database with sample data:
   ```bash
   npm run seed
   ```
   This will create the `tasks` collection and insert sample tasks.

5. Start the API in development mode:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:4000`

## API Endpoints

- `POST /api/tasks`
  - Creates a task.
  - Body: `{ title, description?, status, dueDate }`
- `GET /api/tasks`
  - Returns all tasks.
- `GET /api/tasks/:id`
  - Returns a single task by ID (MongoDB ObjectId).
- `PATCH /api/tasks/:id/status`
  - Updates only the status of a task.
  - Body: `{ status }`
- `DELETE /api/tasks/:id`
  - Deletes a task.

## Database

- Uses MongoDB with Mongoose ODM
- Collections are auto-created by Mongoose
- Seed script is in `sql/seedMongoDB.js` (use `npm run seed`)

## Tests

Run:
```bash
npm test
```

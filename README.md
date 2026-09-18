# Simple Appointment Record System

Stack: **Java (Spring Boot) backend + MySQL database + HTML/CSS/JS frontend**, matching the SRS.

## Project structure
```
appointment-app/
├── backend/          Spring Boot REST API (Java 17, Maven)
├── database/         schema.sql - creates the MySQL database & table
└── frontend/         Static HTML/CSS/JS (index.html = Add page, list.html = List page)
```

## 1. Database setup (MySQL)
1. Make sure MySQL is running locally.
2. Run the script to create the database and table:
   ```
   mysql -u root -p < database/schema.sql
   ```
   (This also inserts two sample rows from the SRS example.)

## 2. Backend setup (Spring Boot)
1. Open `backend/src/main/resources/application.properties` and set your MySQL
   username/password (defaults are `root` / `your_mysql_password`).
2. Build and run:
   ```
   cd backend
   mvn spring-boot:run
   ```
   The API starts at `http://localhost:8080`.

   `spring.jpa.hibernate.ddl-auto=update` will also auto-create/update the
   `appointments` table from the entity if you skip step 1, so running the
   schema.sql manually is optional but recommended for full control.

### REST API
| Action        | Method | Endpoint                          |
|---------------|--------|------------------------------------|
| Create        | POST   | `/api/appointments`                |
| Get all       | GET    | `/api/appointments`                |
| Get one       | GET    | `/api/appointments/{id}`           |
| Edit          | PUT    | `/api/appointments/{id}`           |
| Delete        | DELETE | `/api/appointments/{id}`           |
| Change status | PATCH  | `/api/appointments/{id}/status`    |

Request body for create/edit:
```json
{
  "name": "Arun",
  "email": "arun@mail.com",
  "phone": "9876543210",
  "appointmentDate": "2026-09-20",
  "reason": "Checkup"
}
```
Request body for status change: `{ "status": "CONFIRMED" }` (or `"PENDING"`).

Validation errors return `400` with a `fieldErrors` map; a missing id returns `404`.

## 3. Frontend setup
The frontend is plain static HTML/CSS/JS — no build step needed.

- Simplest: open `frontend/index.html` directly in a browser.
- Or serve it (recommended, avoids some `file://` quirks):
  ```
  cd frontend
  python3 -m http.server 5500
  ```
  then visit `http://localhost:5500`.

The frontend calls the API at `http://localhost:8080/api/appointments`
(set in `frontend/js/api.js` — change `API_BASE` if you deploy the backend
somewhere else). CORS is already enabled on the backend for all origins.

## Pages
- **index.html** — Add Appointment form (Name, Email, Phone, Date, Reason).
  Validates required fields client-side, saves via `POST`, backend sets
  status to `PENDING`, then redirects to `list.html`.
- **list.html** — Table of all appointments with:
  - **Edit** → modal form → `PUT` to update
  - **Delete** → confirm modal → `DELETE`
  - **Status button** → toggles `PENDING ⇄ CONFIRMED` via `PATCH`

## Notes
- Switch to PostgreSQL by swapping the `mysql-connector-j` dependency in
  `pom.xml` for `org.postgresql:postgresql`, updating the JDBC URL/driver in
  `application.properties`, and adjusting the `ENUM` type in `schema.sql`
  (Postgres doesn't have MySQL-style `ENUM`; use `VARCHAR` + a `CHECK` constraint).

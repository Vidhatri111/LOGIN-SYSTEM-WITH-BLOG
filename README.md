# WriteSphere

WriteSphere is a responsive blogging platform built with React, Vite, Bootstrap 5, Express, MongoDB and Mongoose. It includes cookie-based authentication, author-owned blog CRUD, likes, bookmarks, comments, profile editing and administrator tools.

## Project structure

```text
writesphere/
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── styles.css
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
└── server/
    ├── .env.example
    ├── package.json
    └── src/
        ├── app.js
        ├── server.js
        ├── config/
        ├── controllers/
        ├── middleware/
        ├── models/
        ├── routes/
        ├── scripts/
        └── utils/
```

## Requirements and installation

Use Node.js 18 or newer and a running MongoDB instance (local MongoDB or MongoDB Atlas).

From the project root in PowerShell:

```powershell
npm install
npm install --prefix server
npm install --prefix client
Copy-Item server\.env.example server\.env
```

Edit `server/.env`. Use a long, unique `JWT_SECRET` (at least 32 characters) and set `MONGODB_URI` to your MongoDB connection string. For a local database, the example URI is `mongodb://127.0.0.1:27017/writesphere`. `CLIENT_URL` should match the frontend origin.

Start the client and API together:

```powershell
npm run dev
```

Open the Vite URL (normally `http://localhost:5173`). The API is at `http://localhost:5000`; `GET /api/health` is its health check. For production, build the frontend with `npm run build`; deploy the generated `client/dist` separately from the API and use HTTPS so secure cookies work.

## Sample content

Register a normal account in the app first. Set `SEED_AUTHOR_EMAIL` to its email in `server/.env`, then run:

```powershell
npm run seed
```

This creates five useful categories and three realistic sample stories attributed to that account. It is safe to run again; existing categories and sample stories are not duplicated.

## First administrator

Never set an admin role through registration or a client request. To bootstrap the first admin:

1. Register the account that should administer the platform.
2. Set `ADMIN_EMAIL` to that account's email and `ADMIN_PASSWORD` to a unique password of at least 12 characters in `server/.env`. The script requires both values as an intentional setup check; it does not replace the registered account's password.
3. Run `npm run admin:create` from the root. The command refuses to proceed if an admin already exists.
4. Remove the bootstrap values from `server/.env` after the role has been granted.

Admin access is verified on every request by backend middleware, not just hidden in the interface.

## Main frontend routes

- `/` and `/blogs` — featured story, search, categories and published stories.
- `/categories` and `/about` — category discovery and platform information.
- `/login` and `/register` — account access.
- `/blogs/:id` — story, likes, bookmarks, comments and related writing.
- `/blogs/new` and `/blogs/:id/edit` — create, draft, publish and edit stories.
- `/dashboard` — writer overview; `/dashboard/blogs`, `/dashboard/bookmarks`, `/dashboard/profile`.
- `/admin` — administrator statistics, user/blog search and pagination, content status actions, and category management.

## API overview

All API routes are prefixed with `/api`. Authentication uses an `HttpOnly` JWT cookie and browser requests include credentials.

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Create a user account |
| POST | `/auth/login` | Public | Sign in (`remember` controls cookie lifetime) |
| POST | `/auth/logout` | Public | Clear the session cookie |
| GET / PUT | `/auth/me` | Signed in | Read/update name, bio and avatar URL |
| GET | `/blogs` | Public | Search/filter published stories (`search`, `category`, `page`, `limit`, `sort`) |
| GET | `/blogs/my-blogs` | Signed in | List the signed-in author's stories |
| GET | `/blogs/:id` | Public/owner | Read a published story or an owned draft |
| POST | `/blogs` | Signed in | Create a draft or published story |
| PUT / DELETE | `/blogs/:id` | Owner/admin | Update or delete a story |
| POST | `/blogs/:id/like` | Signed in | Toggle a like |
| POST | `/blogs/:id/bookmark` | Signed in | Toggle a bookmark |
| GET | `/blogs/bookmarks` | Signed in | List saved stories |
| GET | `/blogs/:id/comments` | Public | List story comments |
| POST | `/blogs/:id/comments` | Signed in | Add a comment |
| GET | `/categories` | Public | List categories |
| GET | `/admin/stats`, `/admin/users`, `/admin/blogs` | Admin | Statistics and paginated management lists |
| POST / DELETE | `/admin/categories[/:id]` | Admin | Create or delete an unused category |
| PUT | `/admin/blogs/:id/status` | Admin | Publish or move a story to draft |
| DELETE | `/admin/users/:id`, `/admin/blogs/:id` | Admin | Remove users or stories |

Validation errors return HTTP 400 with a message and field list. Unauthorized and forbidden requests return HTTP 401 and 403. Duplicate email/category values return HTTP 409. Passwords are hashed with bcrypt; password hashes and JWT secrets are never returned by API responses.

## Manual verification checklist

After MongoDB is available and the app is running:

1. Register a user; confirm the success message appears on the Login page, then sign in and confirm the dashboard opens. Attempt registration with the same email and confirm the API rejects the duplicate.
2. Log out and log in with the account. Test incorrect credentials, password visibility, and both remember-me choices.
3. Create a draft, edit it, publish it, and verify it appears in search and the public story page. Check that another regular account cannot edit or delete it.
4. On a published story, test like/unlike, bookmark/unbookmark and bookmark listing. Add a comment while signed in; verify signed-out visitors cannot post.
5. Promote a separately registered account using the first-admin process. Verify `/admin` is inaccessible to a regular account and that the administrator can search/paginate users and blogs, change publication status, add categories, and delete records.
6. Delete a category in use and verify the API refuses it; delete it after its stories are moved or removed.

## Notes

- CORS allows origins listed in `CLIENT_URL`. In development, it also allows the local Vite origins `localhost` and `127.0.0.1` on ports 5173 and 5174, so Vite's fallback port works. Production accepts only configured `CLIENT_URL` origins. Cookies are `HttpOnly`, `SameSite=Lax` in development and secure in production; deploy frontend/API behind HTTPS and set the production client URL exactly.
- The application has no default admin credentials or implicit sample account.
- The original starter `public` todo UI is not served by this Vite application.

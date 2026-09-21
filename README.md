# This ReadMe is 90% AI generated 

# Gym Nutrition Calculator

A React and Express application for calculating gym and nutrition information. The Express API connects to our shared MongoDB Atlas database.

## Requirements

- Node.js 20 or newer
- A MongoDB Atlas account with access to the team project
- Git

## First-time setup

1. Clone the repository and open its folder:

   ```powershell
   git clone <repository-url>
   cd Gym-Nutrition-Calculator
   ```

2. Install the dependencies:

   ```powershell
   npm install
   ```

3. Create a file named `.env` in the project root, next to `package.json`:

   ```env
   MONGODB_URI=mongodb+srv://DATABASE_USERNAME:DATABASE_PASSWORD@cluster0.acyegno.mongodb.net/gymNutrition?retryWrites=true&w=majority&appName=Cluster0
   MONGODB_DB=gymNutrition
   ```

   Replace the username and password with the application database user's credentials. Do not include angle brackets.
   (For exmaple 
      MONGODB_URI=mongodb+srv://ebenezeroajisafe_db_user:TestPassword@cluster0.acyegno.mongodb.net/gymNutrition?retryWrites=true&w=majority&appName=Cluster0)

      - Everyone DB password is Likeboss12. so replace the password section with that.
      - Malik username and pass: abdulmalikanimashaun5_db_user:Likeboss12
      - dpais username and pass: dpais1_db_user:Likeboss12

5. In MongoDB Atlas, add your current IP address under **Network Access**. You also need access to the team's project and database user.

## Running locally

Start the Vite frontend and Express API together:

```powershell
npm run dev
```

The frontend runs at [http://localhost:5173](http://localhost:5173). The API runs at [http://localhost:3000](http://localhost:3000).

To check the API and MongoDB connection, open [http://localhost:3000/api/health](http://localhost:3000/api/health). A successful response is:

```json
{"status":"ok"}
```

You can start only the API with:

```powershell
npm run server
```

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the frontend and API for development |
| `npm run server` | Start only the Express API |
| `npm run build` | Create a production frontend build |
| `npm run preview` | Preview the production frontend build |
| `npm run lint` | Check the code with Oxlint |

## MongoDB and security

- Use the same database name, `gymNutrition`, so everyone works with the same data.
- Each teammate should create their own local `.env` file.
- `.env` is ignored by Git and must never be committed.
- Never put `MONGODB_URI` in React frontend code or in a variable beginning with `VITE_`.

The application uses this flow:

```text
React frontend -> Express API -> MongoDB Atlas
```

## Troubleshooting

### `ERR_CONNECTION_REFUSED` on port 3000

The API is not running. Start it with `npm run server` and check the terminal for startup errors.

### MongoDB connection or authentication errors

Check that:

- The `.env` file is in the project root.
- The variable names are exactly `MONGODB_URI` and `MONGODB_DB`.
- The database username and password are correct.
- Your IP address is allowed in Atlas **Network Access**.
- Special characters in the password are URL-encoded in the URI.

Restart the API after changing `.env`.

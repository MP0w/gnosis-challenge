# Gnosis Challenge
---

## How to run the project locally

### Backend

The easiest way to run the backend service locally is to use Docker.

```bash
docker compose up
```

The backend service will be available at [http://localhost:4000](http://localhost:4000) once the containers are running.  

Postgres by default will be exposed on port 5433.
Coonnection string: `postgresql://vitalik:wagmi@127.0.0.1:5433/gnosis`

To run tests:

```bash
npm run test
```

### Frontend

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

To run tests:

```bash
npm run test
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.  

## Design choices

### Backend

The backend is a NodeJS app using express and postgres as database.  
While the endpoints are very simple and mostly just CRUD operations, I wanted to add some separation of concerns:

- routers: responsible for setting up the express routes, handling and validating the request 
- services: responsible for handling business logic
- repositories: responsible for handling the data access logic

Other than the core libraries, two very popular third party libraries are used:
- zod: for input validation
- knex: for database access, migrations and queries

### Frontend

The frontend is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).  
While Next.js is overkill for such a small app that could just be a single page react app, it made it easy to deploy it using vercel and to quickly boostrap a small app using react and tailwind.  
React and tailwind make it easy to build web apps using declarative and composable components and I think are worth to be used.  


## To be improved

### Backend

- session stored in memory, when the BE restarts the session is lost, for example configure express-session to use Redis
- add more tests (e.g. repositories integration tests)
- right now the PUT /profile API both creates and updates the profile. It seems like a better UX to me as the profile info are optional so I made a single endpoint.
- more separation of concerns in routers (controllers, validation, etc), as these endpoints are very simple and mostly just CRUD operations I didn't want to over engineer. For more complex endpoints it could make sense.
- better errors for invalid requests (e.g. username regex)

### Frontend

- only works with browser wallet, not wallet connect
- add more tests (just added test for one of the hooks to demonstrate how I would add tests)
- proper error / loading states
- nicer UI :D

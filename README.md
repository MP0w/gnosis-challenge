# Gnosis Challenge
---

## How to run the project locally

### Backend

The easiest way to run the backend service locally is to use Docker.

```bash
docker compose up
```

The backend service will be available at [http://localhost:4000](http://localhost:4000) once the containers are running.

### Frontend

The frontend is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Design choices

### Backend

### Frontend


## To be improved

### Backend

- session stored in memory, when the BE restarts the session is lost, for example store express-session in Redis
- add more tests (e.g. repositories integration tests)
- right now the profile API creates or updates the profile, while is not restful it seems like a better UX to me as the profile info are optional.
- more separation of concerns in routers (controllers, validation, etc)
- better errors for invalid requests (e.g. username regex)

### Frontend

- only works with browser wallet, not wallet connect
- add more tests (just added test for one of the hooks to demonstrate how I would add tests)
- proper error / loading states
- nicer UI :D

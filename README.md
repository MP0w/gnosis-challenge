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
yarn install
```

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Design choices

### Backend

### Frontend


## To be improved

### Backend

- add tests
- right now the profile API creates or updates the profile, while is not restful it seems like a better UX to me as the profile info are optional.
- more separation of concerns in routers (controllers, validation, etc)

### Frontend

- only works with browser wallet, not wallet connect
- persist state in localStorage, right now refresh requires re-signing in. Once the state is persisted it should also handle cookie expiration, logout when receiving unauthorized response from the backend.
- add tests (just added test for one of the hooks to demonstrate how I would add tests)
- proper error / loading states

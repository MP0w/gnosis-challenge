Gnosis Challenge
---

# How to run the project locally

## Backend

The easiest way to run the backend service locally is to use Docker.

```bash
docker compose up
```

The backend service will be available at [http://localhost:4000](http://localhost:4000) once the containers are running.

## Frontend

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

# Utils Bot

## Just a simple bot with some utility commands that I particularly use.

(This bot works best as a user application rather than on a server)

## How to start

Clone the repository

```bash
git clone https://github.com/ct02k/utils-bot
```

Install dependencies

```bash
npm i
```

Add a `.env` file with the following environment variables:

```
DATABASE_URL="file:./dev.db"
DISCORD_TOKEN=
CLIENT_ID=
```

Run Prisma migrations and generate the client:

```bash
npx prisma migrate dev
npx prisma generate
```

Run the project

```bash
npm run dev
# or
npm run build && npm start
```

# EasyPanel Deployment Guide

EasyPanel is a modern server management panel based on Docker. This guide explains how to deploy the WebSocket Server using EasyPanel.

## Prerequisites

- A server with [EasyPanel installed](https://easypanel.io/docs/get-started).
- This project pushed to a Git repository (GitHub/GitLab).

## Step 1: Create a Project

1. Open your EasyPanel dashboard.
2. Create a new **Project** (e.g., `Chat App`).

## Step 2: Deploy PostgreSQL Database

1. Inside the project, click **+ Service**.
2. Select **Postgres**.
3. Name it `postgres` (or `db`).
4. Click **Create**.
5. Go to the service **Environment** or **Connection** tab to view the credentials (Password, Internal URL).
   - You will need the **Internal Connection URL** (e.g., `postgresql://postgres:password@postgres:5432/postgres`).

## Step 3: Deploy the WebSocket Server

1. Click **+ Service** -> **App**.
2. Name it `websocket-server`.
3. Under **Source**, select **Git Repository**.
   - Enter your Repository URL (e.g., `https://github.com/username/nchat-server`).
   - Specify the branch (e.g., `main`).
4. **Build Method**: Select **Dockerfile** (since we have one in the repo root).
   - _Alternative_: If you don't use the Dockerfile, select **Nixpacks** (EasyPanel will auto-detect Node.js).

## Step 4: Configure Environment Variables

1. Go to the **Environment** tab of the `websocket-server` service.
2. Add the following variables:
   - `PORT`: `3000`
   - `DATABASE_URL`: Paste the Internal Connection URL from Step 2.
     - **Important**: Ensure the database name in the URL matches what you want (e.g., `.../nchat?schema=public`).
     - Example: `postgresql://postgres:randompassword@postgres:5432/nchat?schema=public`

## Step 5: Network & Domain

1. Go to the **Domains** tab.
2. Add your domain (e.g., `ws.yourdomain.com`).
3. EasyPanel will automatically provision an SSL certificate (HTTPS/WSS).
4. Ensure the **Container Port** matches your `PORT` env var `3000`.

## Step 6: Deploy & Verify

1. Click **Deploy**.
2. Go to the **Logs** tab to watch the build process.
3. Once running, you should see `Server is running on port 3000`.

## Troubleshooting

- **Database Connection Error**:
  - Ensure the `DATABASE_URL` is correct.
  - Verify the `postgres` service is running.
  - Check if Prisma migrations were applied. You may need to add a "Deploy Command" in EasyPanel settings:
    - `npx prisma migrate deploy`
- **Migration Strategy**:
  - Since this is a production env, you should use `prisma migrate deploy` instead of `prisma migrate dev`.
  - In `package.json`, add a script `"migrate": "prisma migrate deploy"`.
  - Configure EasyPanel to run this command on start or post-deploy.

## Updates

When you push code to Git, you can manually trigger a deploy or set up a Webhook in the **Settings** tab for auto-deployment.

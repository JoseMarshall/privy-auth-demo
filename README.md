# Privy Login Demo

A modern authentication demo application built with Bun, React, and Privy. This app showcases how to integrate Privy's authentication system with support for email, wallet, and social logins.

## Features

- Multiple login methods (email, wallet, Google, Twitter)
- Embedded wallet creation
- Clean and modern UI
- Built with Bun for blazing fast performance
- Hot module reloading in development

## Setup

1. Install dependencies:

```bash
bun install
```

2. Get your Privy App ID:
   - Visit [https://dashboard.privy.io](https://dashboard.privy.io)
   - Create a new app or use an existing one
   - Copy your App ID

3. Configure environment variables:
   - Open `.env` file
   - Replace `your-privy-app-id-here` with your actual Privy App ID:
   ```
   PRIVY_APP_ID=your-actual-app-id
   ```

4. Start the development server:

```bash
bun dev
```

The app will be available at `http://localhost:3000`

## Production

To run for production:

```bash
bun start
```

## Tech Stack

- [Bun](https://bun.com) - Fast all-in-one JavaScript runtime
- [React 19](https://react.dev) - UI library
- [Privy](https://privy.io) - Authentication and wallet management
- TypeScript - Type safety
# privy-auth-demo

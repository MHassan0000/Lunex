# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

## Required Variables

```env
# Database Configuration
# Get your Neon database URL from: https://neon.tech
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# Better Auth Configuration
# Generate a random secret: openssl rand -base64 32
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

## Optional Variables

```env
# Social Auth Providers (if you want to enable Google/Apple login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
APPLE_CLIENT_ID=your-apple-client-id
APPLE_CLIENT_SECRET=your-apple-client-secret

# Email Service (for email verification if enabled)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
```

## Setup Instructions

1. Copy the required variables above into a new `.env.local` file
2. Replace the placeholder values with your actual credentials
3. For DATABASE_URL: Sign up at https://neon.tech and create a database
4. For BETTER_AUTH_SECRET: Generate using `openssl rand -base64 32` or any random string generator
5. Run `npm run db:push` to sync the database schema
6. Run `npm run db:seed` to populate with sample data
7. Start the dev server with `npm run dev`

## Security Notes

- Never commit `.env.local` to version control
- Keep your DATABASE_URL and secrets private
- Use different secrets for development and production

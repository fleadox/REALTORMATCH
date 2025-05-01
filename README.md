# Real Estate Agent Matching Platform

A modern real estate agent matching platform built with React and TypeScript.

## Features

- Modern, responsive UI with dark mode support
- Authentication system with email/password and social login
- User profiles and property listings
- Admin dashboard for user management
- Internationalization support
- TypeScript for type safety

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- React Hot Toast
- i18next

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your environment variables:
   ```
   VITE_API_URL=your_api_url
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── context/       # React context providers
  ├── hooks/         # Custom React hooks
  ├── pages/         # Page components
  ├── types/         # TypeScript type definitions
  ├── utils/         # Utility functions
  └── i18n/          # Internationalization
```

## Authentication

The application uses a provider-agnostic authentication system that can be implemented with any auth provider. The current implementation includes:

- Email/password authentication
- Password reset functionality
- Protected routes
- Admin role support

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 
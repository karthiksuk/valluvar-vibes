# Thirukkural Explorer

A modern web application that brings Thiruvalluvar's timeless wisdom to life through an interactive, immersive experience. This project aims to make the ancient Tamil wisdom of Thirukkural more accessible and engaging for contemporary audiences.

## Features

- 📱 Responsive, mobile-first design
- 🔄 Smooth, infinite-scroll experience
- 🎯 Quick navigation to specific Kurals
- 🔍 "Go to Kural" search functionality
- 💾 Local storage for last viewed Kural
- 🤖 AI-powered modern interpretations
- 🖼️ Dynamic background imagery
- 📍 URL-based navigation

## Tech Stack

- **Frontend**: React + TypeScript
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS + shadcn/ui
- **Data**: JSON-based (no database required)
- **AI**: OpenAI GPT-4o for modern interpretations

## Getting Started

1. Clone the repository

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```env
OPENAI_API_KEY=your_openai_api_key  # Required for AI interpretations
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
├── client/           # Frontend React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/      # Page components
│   │   └── lib/        # Utility functions
├── server/           # Backend Express server
│   └── routes.ts     # API routes
└── shared/           # Shared types and data
    ├── schema.ts     # TypeScript types
    └── detail.json   # Thirukkural dataset
```

## Features in Detail

### Modern Interpretations
Each Kural is accompanied by an AI-generated modern interpretation that makes the ancient wisdom more relatable to contemporary life situations.

### Dynamic Navigation
- Smooth scroll navigation
- URL-based routing for direct access to specific Kurals
- "Go to Kural" feature for quick jumps
- Keyboard navigation support (Arrow Up/Down)

### Responsive Design
The application is fully responsive and provides an optimal viewing experience across all devices, from mobile phones to desktop computers.

## Data Attribution

The Thirukkural dataset used in this project is sourced from [tk120404/thirukkural](https://github.com/tk120404/thirukkural). We extend our gratitude to the contributors who made this comprehensive dataset available.

## Developer

Developed by [@karthikeyansuku](https://twitter.com/karthikeyansuku)

## License

This project is open source and available under the MIT License.

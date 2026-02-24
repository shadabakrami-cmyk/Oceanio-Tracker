# Oceanio Tracker

Shipment tracking app powered by the [Oceanio API](https://api.oceanio.com). Track by Bill of Lading, Booking Number, or Container Number.

## Setup

```bash
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
npm run dev
```

Opens **frontend** on `http://localhost:3000` and **backend proxy** on `http://localhost:4000`.

## Usage

1. Enter your Oceanio **Client ID**, **Client Secret**, and **API Key** → Click **Connect**
2. Select reference type, enter the number → Click **Track Shipment**
3. View parsed DCSA timeline (left) and raw JSON (right)

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS v4
- **Backend:** Node.js, Express
- **API:** Oceanio DCSA tracking API

# Flow - Call Me Reminder

A reminder application that automatically calls users at scheduled times and speaks their reminder message using Vapi voice AI.

## Tech Stack

- **Frontend**: Next.js 16+ (App Router), TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python), SQLite
- **Orchestration**: Docker, Docker Compose
- **External APIs**: Vapi (voice calls), Twilio (phone numbers)

## Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)
- Python 3.12+ (for local development)

## Quick Start

### Using Docker (Recommended)

1. Clone the repository
2. Copy the example environment file:
   ```bash
   cp backend/.env.example backend/.env
   ```
3. Update the `.env` file with your API keys
4. Start the services:
   ```bash
   docker compose up
   ```
5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Local Development

#### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Update .env with your API keys
uvicorn app.main:app --reload
```

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `backend/.env` file with the following variables:

```env
DATABASE_URL=sqlite:///./flow.db
VAPI_API_KEY=your_vapi_api_key_here
VAPI_API_URL=https://api.vapi.ai
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
```

## Project Structure

```
flow/
├── frontend/          # Next.js application
│   ├── src/
│   │   └── app/      # App Router pages
│   └── public/       # Static assets
├── backend/          # FastAPI application
│   └── app/
│       ├── api/      # API routes
│       ├── core/     # Core configuration
│       ├── models/   # Database models
│       └── services/ # Business logic
└── docker-compose.yml
```

## Development Workflow

This project follows strict development standards:
- SOLID and DRY principles
- Semantic atomic commits
- Feature branches with PR workflow
- Comprehensive testing

See `CLAUDE.md` and `CLAUDE.local.md` for detailed guidelines.

## My Approach

1. I'll spend the first 30 minutes searching accross behance, ui8 and dribble for UI inspirations to give me solid ideas of clean simple UIs which i can then try to recreate and adapt
2. I'll spend the next 1hour prompting AI to get a list of todos and create a couple of small descriptive tickets
3. I'll then deploy the code, and setup PR reviews
4. Use claude to implement multiple features in parallel while focussing on testing. the objective is to get as much of the intended features in over a 4-6hour time. So i'll be just about 8hours in to the challenge.
5. Spend the final hours testing, polishing and cleaning up.

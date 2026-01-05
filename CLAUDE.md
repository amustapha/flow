# CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CRITICAL: Mandatory Instructions

**IMPORTANT**: The `CLAUDE.local.md` file in the project root contains MANDATORY instructions that MUST be obeyed at all times. These instructions take precedence over any other guidance in this file or default behavior. Read and follow `CLAUDE.local.md` before proceeding with any work.

## Project Overview
a reminder application that automatically calls users at scheduled times and speaks their reminder message using Vapi voice AI.

## Tech Stack
- **Frontend**: Next.js 16+ (App Router), TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python), SQLite, Celery for task scheduling, Redis as message broker
- **Orchestration**: Docker, Docker Compose
- **External APIs**: Vapi (voice calls), Twilio (phone numbers)
- **State Management**: React Query + Context/Zustand
- **Styling**: Tailwind with custom design system



## Key Patterns
- Always use barrel exports for components, hooks, utils, types, etc.
- Boolean variables and properties should always be in the form of a question: `isDeleted`, `shouldDelete`, etc.
- Frontend code lives in the `frontend/` directory, backend code in `backend/`.
- Prioritize use of existing components, hooks, and utilities before creating new ones.
- Use standard coding practices, most importantly stick to SOLID and DRY principles.
- Write code that is easy to read and maintain. Favor clarity over cleverness.
- Write unit tests for all new functionality.
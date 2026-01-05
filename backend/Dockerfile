FROM python:3.12-slim AS base

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Development stage
FROM base AS dev

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies including dev dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variables for better reload behavior
ENV PYTHONUNBUFFERED=1

# Expose port
EXPOSE 8000

# Run the application with file watcher for hot-reloading
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload", "--reload-dir", "/app/app"]

# Production stage
FROM base AS prod

# Copy requirements first for better caching
COPY requirements.txt .

# Install only production dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Expose port
EXPOSE 8000

# Run the application without reload for production
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]

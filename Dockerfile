# Frontend Dockerfile - Development build
FROM node:20-alpine

# Install pnpm globally
RUN npm install -g pnpm@9.15.4

# Set working directory
WORKDIR /app

# Copy all package files first
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/ ./apps/
COPY packages/ ./packages/

# Copy source code
COPY . .

# Install dependencies
RUN pnpm install 

# Build the application and keep it running for volume mount
CMD ["sh", "-c", "pnpm build && tail -f /dev/null"]
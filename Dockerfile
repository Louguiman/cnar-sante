FROM node:lts-alpine

# Set NODE_ENV to development or production based on your needs
ENV NODE_ENV=development

WORKDIR /usr/src/app

# Copy package files first to install dependencies independently of source code changes
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

# Install dependencies
RUN npm install --silent

# Copy the application source code
COPY . .

# Ensure app files belong to the node user
RUN chown -R node /usr/src/app

# Use non-root user
USER node

# Expose application port
EXPOSE 3000

# Run the application
CMD ["npm", "run", "start:dev"]

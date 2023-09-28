# Use an official Node.js runtime as a parent image
FROM node:20-alpine AS client-build

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the application
RUN npm run build

# Expose port 3300 for the application
EXPOSE 8080

RUN chmod u+x init.sh

# Start the application
CMD ["/bin/sh", "init.sh"]



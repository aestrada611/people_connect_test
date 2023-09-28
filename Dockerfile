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

#I know it is not ideal to want to start the application with a script but I could not get the application to start without having to do a signficant amout of work
#I will be happy to discuss this further in the interview and explain my reasoning and the lessons I learned about how important the structure is when using docker

RUN chmod u+x start.sh
# Start the application
CMD ["/bin/sh", "start.sh"]



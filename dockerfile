# Use an official Node.js image as the base image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Set environment variable for React app
ARG REACT_APP_OPENAI_API_KEY
ENV REACT_APP_OPENAI_API_KEY $REACT_APP_OPENAI_API_KEY

# Build the React application
RUN npm run build

# Set up a simple web server to serve the built React files
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80

# Command to start the web server
CMD ["nginx", "-g", "daemon off;"]

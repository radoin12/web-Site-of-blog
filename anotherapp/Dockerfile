# Stage one of building the Docker Angular image
FROM node:18-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire Angular app source code to the container
COPY . .

# Build the Angular app
RUN npm run build --prod

# Final stage
FROM nginx:alpine

# Copy the built Angular app from the builder stage to the Nginx web root directory
COPY --from=build /app/dist/anotherapp /usr/share/nginx/html

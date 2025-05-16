FROM node:22.11.0-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./

# Install dependencies using npm ci for better consistency and faster builds
RUN npm ci --only=production

# Copy the rest of your application code to the container
COPY . .

# Expose the port that your app will run on
EXPOSE 3000 

# Start the application
CMD ["npm", "run", "dev"] 

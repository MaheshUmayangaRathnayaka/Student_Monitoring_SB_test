#!/bin/bash

# Deployment script to pull latest images and restart containers

echo "Pulling latest images..."
docker pull maheshur/student-performance-server:latest
docker pull maheshur/student-performance-client:latest

echo "Stopping existing containers..."
docker compose down

echo "Starting with latest images..."
docker compose up -d

echo "Deployment complete!"
docker compose ps
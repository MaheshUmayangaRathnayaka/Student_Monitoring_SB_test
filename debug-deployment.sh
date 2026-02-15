#!/bin/bash

echo "===================="
echo "DEPLOYMENT DEBUGGING"
echo "===================="

echo -e "\n1. Checking Docker Installation:"
docker --version

echo -e "\n2. Checking Docker Compose Installation:"
docker compose version

echo -e "\n3. Current Working Directory:"
pwd
ls -la

echo -e "\n4. Docker Images:"
docker images | grep maheshur

echo -e "\n5. Running Containers:"
docker ps

echo -e "\n6. Container Logs (Last 50 lines):"
echo "--- SERVER LOGS ---"
docker compose logs --tail=50 server
echo -e "\n--- CLIENT LOGS ---"
docker compose logs --tail=50 client

echo -e "\n7. Network Status:"
docker network ls
docker network inspect student-performance-system_app-network 2>/dev/null || echo "Network not found"

echo -e "\n8. Port Status:"
sudo netstat -tulpn | grep ":3000\|:5000" | head -10

echo -e "\n9. Environment Variables:"
env | grep -E "MONGODB|JWT|NODE_ENV" || echo "No relevant env vars found"

echo -e "\n10. Docker Compose File Content:"
cat docker-compose.yml

echo -e "\n===================="
echo "DEBUGGING COMPLETE"
echo "===================="
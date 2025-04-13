#!/bin/bash

echo "Building Docker image..."
docker build -t inigomontoya722/custom-app .
# docker push inigomontoya722/custom-app

echo "Deploying to Kubernetes..."
kubectl apply -f configmap.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f daemonset.yaml
kubectl apply -f cronjob.yaml

echo "Waiting for deployment to be ready..."
kubectl rollout status deployment/custom-app-deployment --timeout=90s

echo "Verifying components..."
kubectl get pods
kubectl get svc
kubectl get daemonset
kubectl get cronjob

echo "Deployment complete!"
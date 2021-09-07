echo "Setting Up OpenG2P service configuration..."

echo "Starting openg2perpsql..."
kubectl apply -f openg2perpsql-deployment.yml

echo "Starting OpenG2P ERP server..."
kubectl apply -f openg2p-erp-deployment.yml

openg2p_erp_pod=""

echo "OpenG2P ERP is up and running"
## Installation of OPENG2P on a Kubernetes Cluster

### Installation
- Clone git repository for helm chart: https://github.com/OpenG2P/openg2p-erp-docker
(All commands are executed on path: openg2p-erp-docker/helm/)
- Connect to cluster using :
    ```
    kubectl config use-context cluster_name
    ```
- Create namespace openg2p using :
    ```
    kubectl create ns <NS>
    ```
- Then add bitnami helm repo and install the chart. 
    ```
    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm repo update bitnami
    helm upgrade --install openg2p-erp bitnami/odoo --version 21.4.5 -f helm/values.yaml --create-namespace --namespace openg2p
    ```
- Once the installation finishes (initial installation will take sometime), Login in to ERP at the specified hostname. Required Modules should already be installed.

### Notes

- If persistence is off, every pod restart will pull in latest code and reinitialize database.
  - It is not suggested to switch off persistence, as this could cause other app failures.
- If persistence is on:
  - To apply any config changes in helm values.yaml, run the following (This will NOT update/reinitialize the database with the latest changes).
    ```
    helm upgrade openg2p-erp -n <NS> --version 21.4.5 -f updated-values.yaml
    ```
  - To pull in latest code of the current branch from github, run the following on the erp pods (This will NOT update/reinitialize the database with the latest changes).
    - ```
        kubectl exec -it <erp-deployment-pod-name> -n <NS> -- rm /bitnami/odoo/.user_scripts_initialized
        ```
    - then delete the pod to restart it.
  - To upgrade/reinitialize any particular module in database; Login as admin. Navigate to Apps menu. Remove the "Apps" filter, and upgrade the module.

## Steps to install ODK Central and Collect

[https://docs.getodk.org/central-install/](https://docs.getodk.org/central-install/)

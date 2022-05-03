## Steps to Deploy ERP into K8s Cluster

1. Clone git repository for helm chart: https://github.com/OpenG2P/openg2p-erp-docker
(All commands are executed on base path: openg2p-erp-docker/)
2. Connect to cluster using :
    ```
    kubectl config use-context cluster_name
    ```
3. Deploy odoo and postgresql pod using :
    ```
    helm install openg2p .
    ```
4. Run to give openg2p user superuser access:
    ```
    kubectl exec -it openg2p-postgresql-0 -- bash -c 'PGPASSWORD=$POSTGRES_POSTGRES_PASSWORD psql -U postgres -d openg2p -c "alter role openg2p superuser;"; PGPASSWORD=$POSTGRES_POSTGRES_PASSWORD psql -U postgres -d openg2p -c "create extension pg_trgm;"'
    ```
5. Access odoo by port forwarding to localhost:8069.
(Port forward openg2p-odoo pod using `Shift+F` then enter the port. Access it in your browser with localhost:8069 which is the default port)
6. Activate developer mode which is in the settings menu and update App list(top left corner) by going to apps menu and refresh page.
7. Search for openg2p modules in apps menu.
8. Install all openg2p addons from the apps menu.
    - ODK Connector
    - Openg2p Packaging

## Steps to install ODK Central and Collect

[https://docs.getodk.org/central-install/](https://docs.getodk.org/central-install/)
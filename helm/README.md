## Steps to Deploy ERP into K8s Cluster

1. Clone git repository for helm chart: https://github.com/OpenG2P/openg2p-erp-docker

(All commands are executed on base path: openg2p-erp-docker/)

2. Connect to cluster using :
`kubectl config use-context cluster_name`

3. Create persistent volume claim in cloud using :
`kubectl apply -f pvc.yaml`


4. Deploy odoo and postgresql pod using :
 `helm install openg2p -f values.yaml bitnami/odoo`


5. Using k9s enter into openg2p-postgresql by using `s` key to enter shell.


6. Find the root user password by listing all environment variables in the postgresql pod. (env)
("POSTGRES_POSTGRES_PASSWORD")

7. Login to postgres user using:

`psql -h localhost -d openg2p -U postgres -p 5432`

8. After logging in to postgres-pod,grant superuser access to openg2p user using:

`ALTER ROLE openg2p SUPERUSER;`

9. Log in to openg2p database(User : openg2p,Password : openg2p) :

`psql -h localhost -d openg2p -U openg2p -p 5432`
`CREATE EXTENSION pg_trgm;`

10. Access odoo by port forwarding to localhost:8069.
(Port forward openg2p-odoo pod using `Shift+F` then enter the port. Access it in your browser with localhost:8069 which is the default port)

11. Activate developer mode which is in the settings menu and update App list(top left corner) by going to apps menu and refresh page.

12. Search for openg2p modules in apps menu.

13. Install all openg2p addons from the apps menu.

## Steps to install ODK Central and Collect

[https://docs.getodk.org/central-install/](https://docs.getodk.org/central-install/)
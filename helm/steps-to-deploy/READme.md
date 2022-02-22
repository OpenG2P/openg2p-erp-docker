## Steps to Deploy ERP into K8s Cluster

1. Clone git repository for helm chart: https://github.com/truthfool/openg2p-erp-docker.git


2. Create persistent volume claim in cloud using :
`kubectl apply -f pvc.yaml`


3. Deploy odoo and postgresql pod using :
 `helm install openg2p -f values.yaml bitnami/odoo`


4. Using k9s enter into openg2p-postgresql pod and grant superuser access to openg2p role.

5. Login to postgres user using:

`psql -h localhost -d openg2p -U postgres -p 5432`


6. Find the password by listing all environment variables. (env)

7. After logging in to postgres role grant superuser access to openg2p using:

`ALTER ROLE openg2p SUPERUSER;`

8. Log in to openg2p database(Password : openg2p) :

`psql -h localhost -d openg2p -U openg2p -p 5432`
`CREATE EXTENSION pg_trgm;`


9. Access odoo by port forwarding to localhost:8069.
10. Update App list by activating developer mode and refresh.
11. Install openg2p addons from the apps menu.

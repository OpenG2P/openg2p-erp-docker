
FROM odoo:12

# ENV ODOO_MAJOR=12
# ENV ODOO_MINOR=12.0
# ENV INITIAL_LANG=en_US
# ENV ODOO_IMAGE=openg2p/crm
# ENV ODOO_PROXY_MODE=true

EXPOSE 8069
    
# ENV POSTGRES_DB=odoodb
# ENV POSTGRES_PASSWORD=Chintu@98
# ENV POSTGRES_USER=openg2p

# Database
ENV DB_VERSION=12
ENV DB_USER=openg2p
ENV ADMIN_PASSWORD=Chintu@98
ENV PGPASSWORD=Chintu@98
ENV POSTGRES_PASSWORD=Chintu@98
ENV DB_FILTER=.*


USER odoo 

ENTRYPOINT [ "./entrypoint.sh" ]

# CMD ["python","odoo-bin","-r","odoo","-w","odoo","-d","odoodb"]
FROM bitnami/odoo:12.0.20210915-debian-10-r40

ARG BRANCH_NAME=new-requirements

RUN install_packages wget unzip
RUN . /opt/bitnami/odoo/venv/bin/activate && \
    python3 -m pip install -r https://raw.githubusercontent.com/truthfool/openg2p-erp/$BRANCH_NAME/requirements.txt && \
    deactivate
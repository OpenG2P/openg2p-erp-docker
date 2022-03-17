FROM docker.io/bitnami/minideb:buster
LABEL maintainer "Bitnami <containers@bitnami.com>"

ENV HOME="/" \
    OS_ARCH="amd64" \
    OS_FLAVOUR="debian-10" \
    OS_NAME="linux"

COPY prebuildfs /
# Install required system packages and dependencies
RUN install_packages acl ca-certificates curl fontconfig gzip libbsd0 libbz2-1.0 libc6 libcap2-bin libcom-err2 libedit2 libffi6 libfreetype6 libgcc1 libgcrypt20 libgmp10 libgnutls30 libgpg-error0 libgssapi-krb5-2 libhogweed4 libicu63 libidn2-0 libjpeg62-turbo libk5crypto3 libkeyutils1 libkrb5-3 libkrb5support0 libldap-2.4-2 liblzma5 libncursesw6 libnettle6 libp11-kit0 libpng16-16 libpq5 libreadline7 libsasl2-2 libsqlite3-0 libssl1.1 libstdc++6 libtasn1-6 libtinfo6 libunistring2 libuuid1 libx11-6 libxcb1 libxext6 libxml2 libxrender1 libxslt1.1 procps tar xfonts-75dpi xfonts-base zlib1g
RUN . /opt/bitnami/scripts/libcomponent.sh && component_unpack "python" "3.8.12-3" --checksum 8f7859ab9651065b2fcf37dfa4edcf5af0cd70614bb06b4ca782295a0a4435d2
RUN . /opt/bitnami/scripts/libcomponent.sh && component_unpack "render-template" "1.0.0-3" --checksum 8179ad1371c9a7d897fe3b1bf53bbe763f94edafef19acad2498dd48b3674efe
RUN . /opt/bitnami/scripts/libcomponent.sh && component_unpack "postgresql-client" "13.4.0-0" --checksum 6c426cd27401d66914b19e8d647a5d1bda1f8cd632836aa2b8ce705c2d643e99
RUN . /opt/bitnami/scripts/libcomponent.sh && component_unpack "node" "14.18.1-0" --checksum 53575c1af09f423b9a2553b8b9880462f192961f4ada8fafa70a0238b106f26a
RUN . /opt/bitnami/scripts/libcomponent.sh && component_unpack "odoo" "12.0.20210915-1" --checksum 1be0fb4a14aca12b1b2921637e5efeab631bf96527bd2158806fe9cfc58b896e
RUN . /opt/bitnami/scripts/libcomponent.sh && component_unpack "gosu" "1.14.0-0" --checksum 3e6fc37ca073b10a73a804d39c2f0c028947a1a596382a4f8ebe43dfbaa3a25e
RUN chmod g+rwX /opt/bitnami
RUN curl -sLO https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.5/wkhtmltox_0.12.5-1.buster_amd64.deb && \
    echo "dfab5506104447eef2530d1adb9840ee3a67f30caaad5e9bcb8743ef2f9421bd  wkhtmltox_0.12.5-1.buster_amd64.deb" | sha256sum -c - && \
    dpkg -i wkhtmltox_0.12.5-1.buster_amd64.deb && \
    rm wkhtmltox_0.12.5-1.buster_amd64.deb

COPY rootfs /
RUN /opt/bitnami/scripts/odoo/postunpack.sh
RUN apt-get update && apt-get install -y \
    python3-pip \
    build-essential \
    zlib1g-dev \
    libbz2-dev \
    liblzma-dev \
    autoconf \
    wget \
    unzip
RUN apt install --fix-broken
RUN apt-get install build-essential libssl-dev libffi-dev python3-dev -y
RUN pip3 install cachetools==4.2.2 boto3==1.17.84 cerberus==1.3.4 pyquerystring==1.1 parse-accept-language==0.1.2 phonenumbers==8.12.28 zxcvbn==4.4.28 pyotp==2.6.0 cryptography==3.4.7 pandas==1.3.2 python-dotenv==0.19.0 numpy==1.21.2 kafka-python==2.0.2 dicttoxml==1.7.4
# RUN wget --no-check-certificate -O openg2p-erp-community-addon-master.zip https://github.com/OpenG2P/openg2p-erp-community-addon/archive/master.zip && wget --no-check-certificate -O openg2p-erp-master.zip https://github.com/OpenG2P/openg2p-erp/archive/refs/heads/master.zip && unzip openg2p-erp-community-addon-master.zip -d ./odoo-addons && unzip openg2p-erp-master.zip -d ./odoo-addons && mv -f ./odoo-addons/*/* /opt/bitnami/odoo/addons 
# RUN cp -r /opt/bitnami/python/lib/python3.8/site-packages/* /opt/bitnami/python/lib/python3.8
COPY ./openg2p-erp /opt/bitnami/odoo/addons
COPY ./openg2p-erp-community-addon /opt/bitnami/odoo/addons

ENV BITNAMI_APP_NAME="odoo" \
    BITNAMI_IMAGE_VERSION="12.0.20210915-debian-10-r40" \
    PATH="/opt/bitnami/python/bin:/opt/bitnami/common/bin:/opt/bitnami/postgresql/bin:/opt/bitnami/node/bin:/opt/bitnami/odoo/bin:$PATH" \
    POSTGRESQL_CLIENT_CREATE_DATABASE_NAME="" \
    POSTGRESQL_CLIENT_CREATE_DATABASE_PASSWORD="" \
    POSTGRESQL_CLIENT_CREATE_DATABASE_USERNAME="" \
    POSTGRESQL_HOST="postgresql" \
    POSTGRESQL_PORT_NUMBER="5432" \
    POSTGRESQL_ROOT_PASSWORD="" \
    POSTGRESQL_ROOT_USER="postgres"

EXPOSE 8069

USER root
ENTRYPOINT [ "/opt/bitnami/scripts/odoo/entrypoint.sh" ]
CMD [ "/opt/bitnami/scripts/odoo/run.sh" ]

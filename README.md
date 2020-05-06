[![Doodba deployment](https://img.shields.io/badge/deployment-doodba-informational)](https://github.com/Tecnativa/doodba)
[![Last template update](https://img.shields.io/badge/last%20template%20update-v1.5.3-informational)](https://github.com/Tecnativa/doodba-copier-template/tree/v1.5.3)
[![Odoo](https://img.shields.io/badge/odoo-v12.0-a3478a)](https://github.com/odoo/odoo/tree/12.0)
[![AGPL-3.0-or-later license](https://img.shields.io/badge/license-AGPL--3.0--or--later-success})](LICENSE)
[![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commit&logoColor=white)](https://pre-commit.com/)

# Open G2P Docker

This repo dockerize OpenG2P.

“OpenG2P” is a set of digital building blocks opensourced to support large scale cash
transfer programs digitize key cogs in their delivery chain: 1) beneficiary targeting
and enrollment, 2) beneficiary list management, 3) payment digitization, and 4)
recourse.

## Installation

### Prerequiste

## Install the dependencies

This project itself is just the template, but you need to install these tools to use it:

- [copier][] v3.0.6 or newer
- [git](https://git-scm.com/) 2.24 or newer
- [invoke](https://www.pyinvoke.org/) installed in Python 3.6+ (and the binary must be
  called `invoke` — beware if your distro installs it as `invoke3` or similar).
- [pre-commit](https://pre-commit.com/)
- [python](https://www.python.org/) 3.6+

Install non-python apps with your distro's recommended package manager. The recommended
way to install Python CLI apps is [pipx](https://pipxproject.github.io/pipx/):

```bash
python3 -m pip install --user pipx
pipx install copier
pipx install invoke
pipx install pre-commit
pipx ensurepath
```

### Getting Starting

Clone or Download the repository to your target machine

```bash
git clone git@github.com:OpenG2P/openg2p-crm-docker.git
```

Get the OpenG2P code with:

```bash
invoke git-aggregate
invoke img-build --pull
```

Get the OpenG2P code with:

```bash
docker-compose run --rm odoo odoo --stop-after-init -i openg2p
```

Above will by default use `devel.yaml` if installing for production please use
`prod.yaml`

Start OpenG2P with:

```bash
invoke start
```

List other tasks shipped with this project:

```bash
invoke --list
```

Clean out project if we invoked git-aggregate or used setup-devel.yaml. Run this before
git add

```bash
git clean -ffd
```

To browse OpenG2P go to `http://localhost:12069`.

### Updating

```bash
git pull
invoke git-aggregate
invoke img-build --pull
docker-compose build --pull  # we don't really need this after the first
docker-compose run --rm odoo odoo --stop-after-init -u base  # Updates addons with new image
docker-compose -f up -d
```

#### MailHog

We use [MailHog](https://github.com/mailhog/MailHog) to provide a fake SMTP server that
intercepts all mail sent by OpenG2P and displays a simple interface that lets you see
and debug all that mail comfortably, including headers sent, attachments, etc.

- For [development][], it's in http://localhost:8025
- For [testing][], it's in http://$DOMAIN_TEST/smtpfake/
- For [production][], it's not used.

All environments are configured by default to use the bundled SMTP relay. They are
configured by these environment variables:

- `SMTP_SERVER`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_SSL`
- `EMAIL_FROM`

For them to be useful, you need to remove any `ir.mail_server` records in your database.

#### Network isolation

The Docker network is in `--internal` mode, which means that it has no access to the
Internet. This feature protects you in cases where a [production][] database is restored
and OpenG2P tries to connect to SMTP/IMAP/POP3 servers to send or receive emails. Also
when you are using [connectors](https://github.com/OCA/connector),
[mail trackers](https://www.odoo.com/apps/modules/browse?search=mail_tracking) or any
API sync/calls.

If you still need to have public access, set `internal: false` in the environment file,
detach all containers from that network, remove the network, reatach all containers to
it, and possibly restart them. You can also just do:

```bash
docker-compose down
invoke start
```

Usually a better option is
[whitelisting](faq.md#how-can-i-whitelist-a-service-and-allow-external-access-to-it).

#### wdb

[`wdb`](https://github.com/Kozea/wdb/) is one of the greatest Python debugger available,
and even more for Docker-based development, so here you have it preinstalled.

To use it, write this in any Python script:

```python
import wdb
wdb.set_trace()
```

It's available by default on the [development][] environment, where you can browse
http://localhost:1984 to use it.

**⚠️ DO NOT USE IT IN PRODUCTION ENVIRONMENTS ⚠️** (I had to say it).

### Production

It includes pluggable `smtp` and `backup` services, that will be or not generated
depending on your answers when copying the template.

#### Adding secrets

To boot this environment, these files must be present:

- `./.docker/odoo.env` must define `ADMIN_PASSWORD`.
- `./.docker/db-access.env` must define `PGPASSWORD`.
- `./.docker/db-creation.env` must define `POSTGRES_PASSWORD` (must be equal to
  `PGPASSWORD` above).
- `./.docker/smtp.env` must define `RELAY_PASSWORD` (password to access the real SMTP
  relay).
- `./.docker/backup.env` must define `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
  (obtained from S3 provider) and `PASSPHRASE` (to encrypt backup archives).

Copier creates them for you when copying the template, but since they are all
git-ignored (for obvious reasons), you might need to copy them manually when deploying
to production.

#### Booting production

Once secrets are in place and you started the
[global inverse proxy](faq.md#how-to-bootstrap-the-global-inverse-proxy), run the
production environment with:

```bash
docker-compose -f prod.yaml up -d
```

#### Backups

Backups are only available in the production environment. They are provided by
[tecnativa/duplicity:postgres-s3](https://github.com/Tecnativa/docker-duplicity). The
structure of the backed up folder:

```
├── prod.sql
└── odoo/
    ├── addons/
    └── filestore/
        └── prod/
            ├── ...
            └── ...
```

To make backup immediatly execute following command:

```sh
# Executes all jobs scheduled for daily run.
# With default configuration it's equal to making full backup
docker-compose exec backup /etc/periodic/daily/jobrunner
```

To restore backup:

```sh
# stop odoo if it's running
docker-compose stop odoo

# start backup and db
docker-compose up -d backup

# switch to some version
docker-compose exec backup restore --time TIME_IN_BACKUP_NAME --force

# ⚠️ DELETE PRODUCTION database
#docker-compose backup dropdb

# create new empty database
docker-compose exec backup createdb

# restore database
docker-compose exec backup sh -c 'psql -f $SRC/$PGDATABASE.sql'

# start odoo
docker-compose up -d
```

### Updating

```bash
git pull
docker-compose -f prod.yaml build --pull  # Updates your image
docker-compose -f prod.yaml run --rm odoo odoo --stop-after-init -u base  # Updates addons with new image
docker-compose -f prod.yaml up -d
```

#### Global whitelist

Since the testing environment is [network-isolated](#network-isolation), this can change
some deadlocks or big timeouts in code chunks that are not ready for such situation.
OpenG2P happens to have some of them.

The [development][] environment includes the default recommended whitelist proxies, but
for [testing][], it is recommended to have a separate docker compose project running
along in the same server that provides a `globalwhitelist_default` network where all
whitelist proxies exist. This is a better practice for a testing environment where many
services might coexist, because it will let you save lots of processing power and IP
addresses.

<details>
<summary>Recommended globalwhitelist/docker-compose.yaml file</summary>

```yaml
version: "2.1"

networks:
  public:
    driver_opts:
      encrypted: 1
  shared:
    internal: true
    driver_opts:
      encrypted: 1

services:
  cdnjs_cloudflare_com:
    image: tecnativa/whitelist
    restart: unless-stopped
    networks:
      public:
      shared:
        aliases:
          - "cdnjs.cloudflare.com"
    environment:
      TARGET: "cdnjs.cloudflare.com"
      PRE_RESOLVE: 1

  fonts_googleapis_com:
    image: tecnativa/whitelist
    restart: unless-stopped
    networks:
      public:
      shared:
        aliases:
          - "fonts.googleapis.com"
    environment:
      TARGET: "fonts.googleapis.com"
      PRE_RESOLVE: 1

  fonts_gstatic_com:
    image: tecnativa/whitelist
    restart: unless-stopped
    networks:
      public:
      shared:
        aliases:
          - "fonts.gstatic.com"
    environment:
      TARGET: "fonts.gstatic.com"
      PRE_RESOLVE: 1

  www_google_com:
    image: tecnativa/whitelist
    restart: unless-stopped
    networks:
      public:
      shared:
        aliases:
          - "www.google.com"
    environment:
      TARGET: "www.google.com"
      PRE_RESOLVE: 1

  www_gravatar_com:
    image: tecnativa/whitelist
    restart: unless-stopped
    networks:
      public:
      shared:
        aliases:
          - "www.gravatar.com"
    environment:
      TARGET: "www.gravatar.com"
      PRE_RESOLVE: 1
```

</details>

## Development

#### Testing

A good rule of thumb is test in testing before uploading to production, so this
environment tries to imitate the [production][] one in everything, but _removing
possible pollution points_:

- It has [a fake `smtp` service based on MailHog](#mailhog), just like development.

- It has no `backup` service.

- It is [isolated](#network-isolation).

To use it, you need to [add secrets files just like for production](#adding-secrets),
although secrets for smtp and backup containers are not needed because those don't exist
here. Also, start
[the global inverse proxy](faq.md#how-to-bootstrap-the-global-inverse-proxy) before
running the test environment.

Test it in your machine with:

```bash
docker-compose -f test.yaml up -d
```

#### Reseting

At times we find ourselves having to blow away docker and start from scratch. Only use
the command below if you know what you are doing as it blows away all the volumes and
images on your engine.

```bash
docker system prune
```

## Other usage scenarios

In examples below I will skip the `-f <environment>.yaml` part and assume you know which
environment you want to use.

Also, we recommend to use `run` subcommand to create a new container with same settings
and volumes. Sometimes you may prefer to use `exec` instead, to execute an arbitrary
command in a running container.

### Inspect the database

```bash
docker-compose run --rm odoo psql
```

### Restart OpenG2P

You will need to restart it whenever any Python code changes, so to do that:

```bash
docker-compose restart odoo
```

In development mode odoo restarts by itself thanks to `--dev=reload` option.

### Run unit tests for some addon

```bash
modules=addon1,addon2
# Install their dependencies first
docker-compose run --rm odoo addons init --dependencies $modules
# Test them at install
docker-compose run --rm odoo addons init --test $modules
# Test them again at update
docker-compose run --rm odoo addons update --test $modules
```

\* Note: This replaces the old deprecated `unittest` script.

### Reading the logs

For all services in the environment:

```bash
docker-compose logs -f --tail 10
```

Only OpenG2P's:

```bash
docker-compose cc
```

### Install some addon without stopping current running process

```bash
docker-compose run --rm odoo odoo -i addon1,addon2 --stop-after-init
```

### Update some addon without stopping current running process

```bash
docker-compose run --rm odoo odoo -u addon1,addon2 --stop-after-init
```

### Update changed addons only

Just run:

```bash
docker-compose run --rm odoo click-odoo-update --watcher-max-seconds 30
```

This script is part of [`click-odoo-contrib`][]; check it for more details.

\* Note: `--watcher-max-seconds` is available because we ship a
[patched](https://github.com/acsone/click-odoo-contrib/pull/38) version. Check that PR
for docs.

\* Note: This replaces the old deprecated `autoupdate` script.

### Export some addon's translations to stdout

```bash
docker-compose run --rm odoo pot addon1[,addon2]
```

Now copy the relevant parts to your `addon1.pot` file.

### Open an odoo shell

```bash
docker-compose run --rm odoo odoo shell
```

### Open another UI instance linked to same filestore and database

```bash
docker-compose run --rm -p 127.0.0.1:$SomeFreePort:8069 odoo
```

Then open `http://localhost:$SomeFreePort`.

## Links

This project is a Doodba scaffolding. Check upstream docs on the matter:

- [Production Access](faq.md#how-to-bootstrap-the-global-inverse-proxy) before
- [General Doodba docs](https://github.com/Tecnativa/doodba).
- [Doodba copier template docs](https://github.com/Tecnativa/doodba-copier-template)
- [Doodba QA docs](https://github.com/Tecnativa/doodba-qa)

## Credits

Doodba scaffolding is maintained by:

[![Tecnativa](https://www.tecnativa.com/r/H3p)](https://www.tecnativa.com/r/bb4)

Also, special thanks to
[our dear community contributors](https://github.com/Tecnativa/doodba-copier-template/graphs/contributors).

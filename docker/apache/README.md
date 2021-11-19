# This is a basic CS Apache web server container with central logging set up.

This image is suitable for hosting basic static html, javascript (Angular), or perl based sites.

## Image Indentifier
* docker.cs.vt.edu/carnold/docker/apache:latest

## Additional Tags
* 1.0

## Includes:
* Perl module
* CAS Auth module 

## Notes:
* Set the environment variable `SERVER_NAME` to the site's hostname for proper configuration.  Example: `hosting.cs.vt.edu`
* Data is served out of `/var/www/html`  Either add your data into this directory with docker or mount a persistent volume here.
* Additional Apache configs served out of `/var/www/vhosts`  You can add your own configs into this directory with docker or mount a configmap/presistent volume here.
* Optional environment variable `SITE_PATH` helps CAS auth in certain situations when the path is obscured by the proxy

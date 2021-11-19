#!/bin/bash

if [[ -z "${SERVER_NAME}" ]]; then
  echo "WARNING: The environment variable SERVER_NAME is not defined, you should set this variable to the name of the site being hosted for proper logging, example: hosting.cs.vt.edu" 1>&2
  echo "Setting SERVER_NAME = ${HOSTNAME}"
  export SERVER_NAME=${HOSTNAME}
fi 

if [[ -z "${SITE_PATH}" ]]; then
  export SITE_PATH=''
fi

cd /var/www/html
/usr/sbin/httpd -DFOREGROUND

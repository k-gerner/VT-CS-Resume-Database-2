FROM centos:centos7

RUN yum -y install bash vim curl httpd mod_ldap epel-release
COPY epel.repo /etc/yum.repos.d/epel.repo
RUN yum -y install mod_auth_cas perl mod_perl perl-CGI perl-DBD-MySQL perl-Mail-Sendmail perl-LDAP perl-Frontier-RPC perl-JSON perl-DBI perl-XML-Simple
RUN mkdir -p /var/www/vhosts

COPY localtime /etc/localtime
COPY local.conf /etc/httpd/conf.d/local.conf

COPY start.sh /start.sh
COPY index.html /var/www/html/
COPY .htaccess /var/www/html/
WORKDIR /var/www/html
ENTRYPOINT ["/start.sh"]

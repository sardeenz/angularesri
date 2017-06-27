#!/bin/sh
read -p "Enter the root path for your app on localhost. i.e. http://<some ip>/<root app path>/: "  localpath
ng build --prod --bh /$rootpath/
echo "$localpath directory created"
mv dist ~/Downloads/$localpath
scp -i ~/code/sysadmin/bc-prod.pem -r ~/Downloads/$localpath ubuntu@54.148.0.119:~/
#~/code/sysadmin/ubuntuCoR_EC2.sh
#
#ssh user@machine "remote command to run" 
ssh -i ~/code/sysadmin/bc-prod.pem ubuntu@54.148.0.119 "echo Enter the root path for your app on server. i.e. http://someip/rootpath/:; read serverpath; sudo cp -R $serverpath/ /var/www/html/"

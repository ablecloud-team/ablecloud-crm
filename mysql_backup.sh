#/bin/bash

DB_USER="user"
DB_PASS="Ablecloud1!"
DB_NAME="licenses"
BACKUP_DIR="/root/mysql_backup"
DATE=$(date +"%Y-%m-%d")

mkdir -p $BACKUP_DIR

mysqldump --user=$DB_USER --password=$DB_PASS $DB_NAME > $BACKUP_DIR/$DB_NAME-$DATE.sql
gzip $BACKUP_DIR/$DB_NAME-$DATE.sql

find $BACKUP_DIR -type f -name "*.gz" -mtime +2 -delete



# crontab(매일 1시마다 백업. backup_script.sh 파일권한 확인)
# crontab -e
# 0 1 * * * /root/ablecloud-crm/backup_script.sh >> /root/ablecloud-crm/backup_script.sh.log 2>&1
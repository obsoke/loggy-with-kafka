## KAFKA (& ZOOKEEPER)
# install kafka dependencies
sudo apt-get update
sudo apt-get -q -y install openjdk-7-jdk
sudo apt-get -q -y install zookeeperd
# set up user for kafka, download, install & run kafka as user
sudo useradd kafka -m
sudo adduser kafka sudo
sudo su kafka <<EOF
mkdir -p ~/Downloads
echo "Installing Kafka"
wget "http://mirror.cc.columbia.edu/pub/software/apache/kafka/0.8.2.1/kafka_2.11-0.8.2.1.tgz" -O ~/Downloads/kafka.tgz
mkdir -p ~/kafka && cd ~/kafka
tar -xvzf ~/Downloads/kafka.tgz --strip 1
nohup ~/kafka/bin/kafka-server-start.sh ~/kafka/config/server.properties > ~/kafka/kafka.log 2>&1 &
echo "TOPIC_TOUCH" | ~/kafka/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic logs > /dev/null
EOF

## POSTGRES
# install postgres
sudo apt-get -q -y install postgresql postgresql-contrib
# setup a db for pumpup
sudo su postgres <<EOF
psql -c "CREATE DATABASE pumpup_db;"
psql -c "CREATE USER pumpup WITH PASSWORD 'pumpup';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE pumpup_db to pumpup;"
EOF

touch ../app.log
chmod +w ../app.log

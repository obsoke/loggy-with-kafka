# start kafka if not running
kafka_running=$(sudo su kafka -c jps | grep Kafka)
if [ $? -eq 1 ]
then
    sudo su kafka <<EOF
nohup ~/kafka/bin/kafka-server-start.sh ~/kafka/config/server.properties > ~/kafka/kafka.log 2>&1 &
echo "TOPIC_TOUCH" | ~/kafka/bin/kafka-console-producer.sh --broker-list localhost:9092 --topic TutorialTopic > /dev/null
EOF
fi

# postgres is already running automatically, care of ubuntu

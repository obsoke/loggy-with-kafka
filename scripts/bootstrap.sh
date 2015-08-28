# install postgres
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# set up postgres
sudo -i -u postgres
createuser pumpup

#! /bin/sh

export node_options=--openssl-legacy-provider

cd frontend && npm install && npx browserslist@latest --update-db && npm run build
cd ..

cd fs4webapp && npm install && npm run build
cd ..

# cleaning
sudo update-rc.d -f monoapp remove
sudo rm -f /etc/init.d/monoapp
sudo rm -f -R /opt/monoapp

# program
sudo mkdir /opt/monoapp
sudo cp -R fs4webapp/public /opt/monoapp
sudo cp -R fs4webapp/node_modules /opt/monoapp
sudo cp fs4webapp/build/index.js /opt/monoapp
sudo cp scripts/start.sh /opt/monoapp
sudo chmod +x /opt/monoapp/start.sh

# daemon
sudo cp scripts/monoapp /etc/init.d
sudo chmod +x /etc/init.d/monoapp
sudo update-rc.d monoapp defaults

# data
sudo sudo mkdir /var/monoapp
sudo chmod -R 777 /var/monoapp

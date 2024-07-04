#!/bin/bash
#line one is called a shebang or hashbang
#it's a common thing in shell scripts that allows for easier use
#see readme file for more information

#rlly only here for debugging
echo 0

#navigate to git repository on raspberry pi
cd /home/clocc/Mod-Clock

#get the latest update from
git pull

#update any libraries in package.json
npm install


#wait two seconds before going on to the next step
sleep 2

#tells node that this is a production environment
export NODE_ENV=production

#this line executes the main.js file and starts the server
#the '&' at the end executes the task as background process, without this, the next line wouldn't execute until the server closes and the script terminates
/home/clocc/.nvm/versions/node/v20.15.0/bin/node main.js &


#this line opens up the webpage in an instance of chromium browser, starting in fullscreen in kiosk mode (kiosk basically locks the page)
/usr/bin/chromium-browser --kiosk http://localhost:3000/ --start-fullscreen

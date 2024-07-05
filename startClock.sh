#!/bin/bash
# this first line is called a shebang or hashbang, and it must occur on the first line of the shell script
# see readme file for more information

# This file is called a shell script, read about unix shell and shell scripts in the readme file


# for debugging
echo 0

# navigate to local git repository on raspberry pi
# shellcheck disable=SC2164 #(this is to stop my code editor from yelling at me)
cd /home/clocc/Mod-Clock

# git is an open source version control system (VCS) and one of the most used programming tools out there
# see readme for more information about git

# save local changes (this is to maintain content in json files)
git stash
# pull latest version from git
git pull
# apply the saved data from earlier (this is to ensure that data inside of files like userdata.json is not lost)
git stash apply


# node package manager (npm) is another super helpful tool for managing and installing node packages, read more in readme.md
# update any libraries listed in package.json
npm install


# wait two seconds before going on to the next step
sleep 2

# tells node that this is a production environment
export NODE_ENV=production

# this line executes the main.js file and starts the server
# the '&' at the end executes the task as background process, without this, the next line wouldn't execute until the server closes and the script terminates
/home/clocc/.nvm/versions/node/v20.15.0/bin/node main.js &


# this line opens up the webpage in an instance of chromium browser, starting in fullscreen in kiosk mode (kiosk basically locks the page)
/usr/bin/chromium-browser --kiosk http://localhost:3000/ --start-fullscreen

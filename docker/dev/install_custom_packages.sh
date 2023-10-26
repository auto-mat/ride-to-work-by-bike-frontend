#!/usr/bin/env sh
#
# Install custom packages
#
# Node.js  major 20.x version
# Yarn JS package manager
# Last Mozilla Firefox web browser version
# Last Google Chrome web browser version
# Last Microsoft Edge web browser version


# Add Node.js major version 20.x repository
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
    | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
sh -c '''
echo \
"deb [signed-by=/etc/apt/keyrings/nodesource.gpg] \
https://deb.nodesource.com/node_$NODEJS_MAJOR_VERSION.x nodistro main" \
| tee /etc/apt/sources.list.d/nodesource.list
'''

# Add yarn repository
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg \
    | gpg --dearmor -o /usr/share/keyrings/yarn-archive-keyring.gpg
sh -c '''
echo \
"deb [signed-by=/usr/share/keyrings/yarn-archive-keyring.gpg] \
https://dl.yarnpkg.com/debian/ stable main" \
| tee /etc/apt/sources.list.d/yarn.list
'''

# Add Google Chrome browser repository
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub \
    | gpg --dearmour -o /usr/share/keyrings/google_linux_signing_key.gpg
sh -c '''
echo \
"deb [arch=amd64 signed-by=/usr/share/keyrings/google_linux_signing_key.gpg] \
http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list
'''

# Add MS Edge browser repository
wget -q -O - https://packages.microsoft.com/keys/microsoft.asc \
    | gpg --dearmour -o /usr/share/keyrings/microsoft_linux_signing_key.gpg
sh -c '''
echo \
"deb [arch=amd64 signed-by=/usr/share/keyrings/microsoft_linux_signing_key.gpg] \
https://packages.microsoft.com/repos/edge stable main" > /etc/apt/sources.list.d/microsoft-edge.list
'''

# Add Mozilla Firefox repository
add-apt-repository ppa:mozillateam/ppa
sh -c '''
echo \
"Package: firefox*
Pin: release o=LP-PPA-mozillateam
Pin-Priority: 501" > /etc/apt/preferences.d/mozillateamppa
'''

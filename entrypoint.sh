#!/bin/sh

# Start OpenVPN in the background
openvpn --config /etc/openvpn/CloudCerist-UDP4-1196-zbekhaled.ovpn &

# Wait for OpenVPN to establish a connection
sleep 10

# Start the Node.js application
npm start

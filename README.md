# garageCutsBackEnd

Problem

- Information

  - Express.js server deployed on Amazon EC2 and uses HTTP.
  - Next.js deployed on Vercel and uses HTTPS.
  - Socket.io is in same directory as the backend which is in its own repository.

- What happened?

  - I attempted to connect the HTTPS front end with the HTTP backend and I got an error that stated "Mixed Content" and what this meant was that the webpage (HTTPS) securly loaded via HTTPS and it will block request to insecure HTTP to protect users from potential security vulnerabilities.

  - I did research on HTTPS and HTTP and realized what the error meant and decided to create an HTTPS backend.

- Video

  - HOW TO MAKE YOUR APPLICATION LIVE

    - go to amazon ec2 create an instance with ubuntu, configure storage and ssh and then once done, run ssh root@ip_address_given_to_you
    - log into instance and install...
      - sudo apt update
      - install latest version of node: curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
      - sudo apt install nodejs (this will install node and npm, TEST IT with npm or node --v)
    - mkdir app and cd into it and git clone your project, cd into it and npm install so you install the package.json (similar to if you were to install locally)
    - run your script tag to start app or you can run node (app file name)
    - YOUR APPLICATION SHOULD WORK NOW!

  - HOW TO RUN YOUR APPLICAITON IN THE BACKGROUND PROCESS (run your application while your ubuntu terminal is closed)
  - install pm2 globally: npm install -g pm2
  - HOW TO USE PM2

    - pm2 start filename
    - pm2 status (checks out the status of all apps that are running)
    - pm2 restart filename (restart the file)
    - pm2 stop filename (stops running the file)
    - pm2 logs (shows the console.log)
    - pm2 flush (clear our logs)
    - ctrl c to stop pm2
    - Pm2 startup ubuntu (reboot the server even if it restarts!)

  - ENABLING THE FIREWALL FOR YOUR INSTANCE (BEFORE GETTING INTO NGINX)

    - ufw status: check status of the firewall
    - ufw enable: enable the firewall and press yes
    - ufw allow ssh: allows ssh
    - ufw status: should now say allow for port 22!! which is where our ssh is running
    - ufw allow http: ALLOW port 80: this is where nginx will be running on by default
    - ufw allow https: ALLOW PORT 443: THIS IS what we will eventually switch too

  - HOW TO SETUP NGINX

    - WHAT WE WANT TO DO: run the ip address w/o port and have it redirect to our server by request

      - npm install nginx
        - If you reload now, it will be the landing page of your ip address
      - sudo nano /etc/nginx/sites-available/default

        - scroll down to server block and go to location area

          - delete whatever is inside and notice that its the 'root directory' with the slash!!
          - DOMAIN is the one that you will eventually create and route to the IP address..

          - WHAT THIS WILL DO: domain we created will redirect to ip address. IP address by default is now reconfigured with nginx reverse proxy.
            We reconfigured below that nginx root will pass it to localhost:5000 but it is refering to the localhost of the ubuntu server! (This is where your app is running)

            - ADD THIS

              server_name yourdomain.com www.yourdomain.com;

              location / {
              proxy_pass http://localhost:5000; #whatever port your app runs on
              proxy_http_version 1.1;
              proxy_set_header Upgrade $http_upgrade;
              proxy_set_header Connection 'upgrade';
              proxy_set_header Host $host;
              proxy_cache_bypass $http_upgrade;
              }

              location /socket.io { # Proxy for Socket.io running on port 8900
              proxy_pass http://localhost:8900; # Port where Socket.io is running
              proxy_http_version 1.1;
              proxy_set_header Upgrade $http_upgrade;
              proxy_set_header Connection "upgrade";
              proxy_set_header Host $host;
              proxy_cache_bypass $http_upgrade;
              }

              # FOR SOCKET.IO IN YOUR FRONT END. CONNECT TO IT VIA..

                   socket.current = io("wss://garagecutserver.com", {
                      path: "/socket.io",
                      transports: ["websocket"], // You can specify the transport type if needed
                    });

          - SAVE: ctrl x
          - STATUS: sudo nginx -t
          - restart status: SUDO service nginx restart:
          - now, when we run our ip address it will redirect to our server!!!!!!

  - HOW TO CREATE DOMAIN

    - GO to namecheap and create a domain
    - add a DNS (IP ADDRESS) (THIS MIGHT TAKE A WHILE.. couple minutes to couple hours)

  - ADD AN SSL W/ LETSENCRYPT

    - sudo add-apt-repository ppa:certbot/certbot
    - sudo apt-get update
    - sudo apt-get install python-certbot-nginx
    - sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
      - This will then ask you for email, to agree, then dont share email, and now wait. then SAY REDIRECT TO HTTPS! (will always be https)
    - NOW YOU ARE OFFICIALLY HTTPS!

    These certificates will expire in 90 days automatically

# Only valid for 90 days, test the renewal process with

# This will automatically renew after 90 days but this will do and test that.

- RUN this and read. It should renew automatically after 90 days

certbot renew --dry-run

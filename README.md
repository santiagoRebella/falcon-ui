Falcon-ui
=========

Web UI to manage feeds, clusters and processes with the falcon REST API

Development
===========

The server.js file is an express server serving two static folders:

 - **/dev in port 3000**   
 - **/prod in port 3100**

You can launch the server with the command 

    grunt 

(the grunt default task)  
This default task also watches for changes in less files to compile, and in js, html to hint and refresh with livereload. 

Deploy
======
The command 
  
    grunt copy 

will copy the necessary files from /dev folder to /prod folder. [1]

Using the hortonworks-sandbox deploy to => **/var/lib/falcon/webapp/falcon** 

    scp -r -P 2222 prod/** root@127.0.0.1:/var/lib/falcon/webapp/falcon

  
Navigate to **localhost:15000**

[1]This is done mainly to leave out the .less sources, leaving just one main.css, in the future the idea is to minify and concatenate the js files also. The exact files and folders are located in the Gruntfile.

Web UI Stack
===========
 - AngularJS
 - Bootstrap-UI
 - UI-Router
 - D3JS
 - jQuery (no final decition yet)
 - X2JS
 - LESS*
 - Express*
 - Node*

* *for development*












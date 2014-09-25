Falcon-ui
=========

Web UI to manage feeds, clusters and processes with the falcon REST API

Development
===========

Run **/npm install** from the root folder

The server.js file is an express server serving a static folder:

 - **/app in port 3000**

You can launch the server with the command 

    grunt 

(the grunt default task)  
This default task also watches for changes in less files to compile, and in js, html to hint and refresh with livereload. 

Deploy
======


Using the hortonworks-sandbox deploy to => **/var/lib/falcon/webapp/falcon** 

    scp -r -P 2222 dist/** root@127.0.0.1:/var/lib/falcon/webapp/falcon

If you use Grunt, The task deploy 
  
    grunt deploy 

will copy the necessary files from /app folder to /dist folder. [1] and copy with scp from dist to hortonworks sandbox location, the access are set as the default 'root' 'hadoop', easily changeable in the Gruntfile

  
Navigate to **localhost:15000**

Web UI Stack
===========
 - AngularJS
 - Bootstrap-UI
 - UI-Router
 - D3JS
 - jQuery (no final decition yet)
 - X2JS
 - LESS*
 - Node*
 - Grunt*
 - Express*

 *for development

[1]This is done mainly to leave out the .less sources, leaving just one main.css, in the future the idea is to minify and concatenate the js files also. The exact files and folders are located in the Gruntfile.










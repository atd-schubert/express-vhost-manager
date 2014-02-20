With this module you can easyly setup vhosts with a JSON configuration.

## How to install

Simply install with npm package manager.

```

npm install express-vhost-manager

```

## How to run

Simply require and run with your configuration.


```

var vhostManager = require("express-vhost-manager");

var config = {
  port: 80, // listen port
  "vhosts": { // vhost only to other express applications (this is a local path!)
    "example.com": "./vhost/example.com"
  },
  "redirects": { // a simple way to make redirects
    "www.example.com":"http://example.com"
  },
  "proxies": { // a simple way to request an other server and send back the result from this server
    "beta.example.com": "http://example.com/beta",
    "beta2.example.com": "http://localhost:3000"
  }  
};

vhostManager(config);

```

## Different kinds of vhosts

### vhosts
With a vhost you can just define another express app. The above defined vhost in the config JSON, is the shorten way for:

```

var express = require("express");
var app = express();

app.use(express.vhost("example.com", require("./vhost/example.com")));

app.listen(80);

```

### Redirects

Redirects are simple 301 redirects to the new URL.

### Proxies
With proxies you can define a connection to every other running server, locally or remotely. For users requesting a resource on it, it seems like the vhost-manager is the server.

## Todos

This script is not tested on SSL/HTTPS connections and have to improove for that.
# Project Name

> Pithy project description

## Team

  - __Product Owner__: Andrew Switlyk
  - __Scrum Master__: Wil Andrade
  - __Development Team Members__: Wil Andrade, Keenan L-P, Andrew Switlyk

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> Some usage instructions

## Requirements

- Node 0.10.x
- Express
- Mongo 
- Mongoose
- Backbone or Angular
- 

## Development

### Installing Dependencies

From within the root directory:

```sh
First Install Node js
Ionic and Cordova command line tools required
	npm install -g cordova ionic
sudo npm install -g bower
The client and server modules are separated into two subfolders of the root.
Each subfolder has their own package.json files and the client has it's own bower.json file.
change directory to client
npm install
bower install
change directory to server
npm install 
```

###Run the app in your browser

We have added support for a mongo database, which will be useful in the future.
Start mongo with: `mongod` (specify a path if necessary)
*if you don't have mongo installed, comment out line 14 in server.js*
Run the server using `nodemon ./server/server.js`
Fillmeup utilizes the ionic yoeoman generator which includes a fully build grunt file. To run the app in your browser, from your terminal:

```grunt serve```

This will initialize a server and open a browser window with the app.


### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

[![Build Status](https://travis-ci.org/nccharles/Pro-Lite-API.svg?branch=develop)](https://travis-ci.org/nccharles/Pro-Lite-API)
[![Maintainability](https://api.codeclimate.com/v1/badges/5daa11aac53bf04a7ffa/maintainability)](https://codeclimate.com/github/nccharles/Pro-Lite-API/maintainability)
[![Coverage Status](https://coveralls.io/repos/github/nccharles/Pro-Lite-API/badge.png?branch=develop)](https://coveralls.io/github/nccharles/Pro-Lite-API?branch=develop)
# Forum / Chat System For Developers
Microservice that allows developers to post questions about issues they are facing. Other developers can respond to the questions in real time

#### Technologies
This Project was created with:
- HTML - A markup language
- Cascading Stylesheet(CSS)
- JavaScript - Development Language
- NodeJS - A javascript server-side engine
- Express Library - A library built on Node JS
- Travis CI - A continuous integration and testing platform
- Coveralls - A continuous integration and testing platform
- Code Climate - A continuous integration and testing platform

#### Tools and Modules
The tools and modules employed in this project are:
- Git
- yarn
- A test suite e.g Mocha and Chai
- express

#### Development Setup
To start this project, install the required modules and dependencies locally using yarn:
##### Usage Example
##### git Clone this [Repository](https://github.com/nccharles/Pro-Lite-API.git)
```
yarn
yarn run db:create
yarn run db:migrate
yarn run start-dev
```
#### How to get a local copy and Use
**Clone repository**
- copy the link to the project from github website
- create a folder on local machine
- cd in to the folder and call a git init
- git clone repository
- yarn to install development dependencies



#### Running Tests
Tests are run by calling 
```
yarn
yarn run test:db:migrate
yarn run test
```
 after installing and setting up testing suites:
- Mocha
- Chai
- Chai HTTP
##### Usage Example
```
 Testing welcome endpoints
    ✔ should accept status 200
    ✔ it should insert user data to the database (408ms)
    ✔ it should insert chat data to the database
    ✔ it should get all data from database
    ✔ It should truncate users table (159ms)
    ✔ It should truncate chats table
```
#### Contributor(s)
- Charles NDAYISABA

#### Author(s)
- Charles NDAYISABA

## Manual

You need installed [MongoDB](https://www.mongodb.com).

## Running project

### Install packages

```sh
# in project's folder
npm install
```

### Run server

```sh
node index.js
```

## Make Requests

API status:

```sh
http GET http://localhost:3001/api/
```

Get all users:

```sh
http GET http://localhost:3001/api/users/all
```

Get user by id:

```sh
http GET http://localhost:3001/api/users
id = 1
```

Inset your new user:

```sh
http POST http://localhost:3001/api/users  
id = 1 name = "Cat" username = "FatCat"
```

Delete user by _id

```sh
http DELETE http://localhost:3001/api/users  
_id = "5a9ec9bdc3f0ce526026513d"
```

Update your user data:

```sh
http PUT http://localhost:3001/api/users  
_id = "5a9ec9bdc3f0ce526026513d" name = "Pavel" username = "FatCat"
```


# Sequelize with Passport (local-strategy) Demo

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)

_This project demonstrates only the basics for getting started with [Passport](http://www.passportjs.org/) and [Sequelize](https://sequelize.org/); it should not be used, as is, in production._

Initialize the project:

```bash
npm init
```

Run the server with the following:

```bash
npm run dev
```

Use a REST client (e.g. [POSTMAN](https://www.postman.com/), [Advanced REST Client](https://chrome.google.com/webstore/detail/advanced-rest-client/hgmloofddffdnphfgcellkdfbfbjeloo), etc.) to send test requests.

All routes (except the logout route) will respond with a JSON object that includes at a minimum:

- The route path
- The route method
- The user object, if logged in

Additional route-specific data may also be included.

## 1. INDEX ROUTE

Send a GET request to http://localhost:8080/ and receive a response similar to the following:

```json
{
    "route": "index",
    "method": "get"
}
```

## 2. REGISTER USER

Send a POST request to http://localhost:8080/register with the following payload:

```json
{
    "email": "jdoe@example.com",
    "password": "password"
}
```

If successful, you should receive a response similar to the following:

```json
{
    "route": "register",
    "method": "post",
    "user": {
        "id": "6341954a-e46b-46fa-b008-672df1107978",
        "email": "jdoe@example.com",
        "passwordHash": "$2a$10$96CeH7Ccx3H1SpmgCxjzLuWmDV1XrKL0swS3SQV5cFPeEkRADNHRu",
        "updatedAt": "2020-03-20T21:40:15.510Z",
        "createdAt": "2020-03-20T21:40:15.510Z"
    },
    "auth": false
}
```

## 3. LOGIN USER

Send a POST request to http://localhost:8080/login with the following payload:

```json
{
    "email": "jdoe@example.com",
    "password": "password"
}
```

If successful, you should receive a response similar to the following:

```json
{
    "route": "login",
    "method": "post",
    "user": {
        "id": "bc808133-e59a-46df-97b1-99c9d90ccb69",
        "firstName": null,
        "lastName": null,
        "email": "jdoe@example.com",
        "passwordHash": "$2a$10$uM3Ts0eWbUuHsNb5qQXIIuwP8AYibkzH4yIJk9zVgzR0qylENA16O",
        "createdAt": "2020-03-20T21:32:08.419Z",
        "updatedAt": "2020-03-20T21:32:08.419Z"
    },
    "auth": true
}
```

## 4. PROFILE ROUTE

You should be successfully logged in and should see the user in the response.

Send a GET request to http://localhost:8080/me and receive a response similar to the following:

```json
{
    "route": "me",
    "method": "get",
    "user": {
        "id": "6341954a-e46b-46fa-b008-672df1107978",
        "firstName": null,
        "lastName": null,
        "email": "jdoe@example.com",
        "passwordHash": "$2a$10$96CeH7Ccx3H1SpmgCxjzLuWmDV1XrKL0swS3SQV5cFPeEkRADNHRu",
        "createdAt": "2020-03-20T21:40:15.510Z",
        "updatedAt": "2020-03-20T21:40:15.510Z"
    },
    "auth": true
}
```

## 5. LOGOUT ROUTE

You should be successfully logged out and redirect to the index route.

Send a DELETE request to http://localhost:8080/logout and be redirected to the index route.

## License

This repository is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
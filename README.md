This is a Node.js Project

## Getting Started

First, run the development server:

```bash
$ npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Node.js Development .

It's a Node js Development Project with proper user Authentication and Authorization. With User and Admin Roles.Authentication is done using JWT token. Profile image uploded on Cloudinary App, and image url is provided after registeration.

## User Routes

#### POST : /user/register - To register a user using email, phone number, name, profile image, password.
#### POST : /user/login - To login a user using email and password.
#### PUT : /user/update - To update only name and profile image. After doing login. It is based on Authentication using jwt token.
#### DELETE: /user/delete - To delete user own account.After doing login. It is based on Authentication using jwt token.

## Admin Routes

#### POST : /admin/create-admin - To register a Admin using email, phone number, name, profile image, password.
#### POST : /admin/login - To login a admin using email and password.
#### PUT : /admin/update-admin - To update their all details. After doing login. It is based on Authentication using jwt token.
#### DELETE: /admin/delete-admin - To delete user own account.After doing login.
#### GET: /admin/get-all-users - To get all users.
#### PUT : /admin/update-user/:id - To update all details of user, after doing login as admin . User Id should be passed in params whose details has to be updated.
#### DELETE: /admin/delete-user/:id - To delete user, after doing login as admin . User Id should be passed in params whose details has to be deleted.



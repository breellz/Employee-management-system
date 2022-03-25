# Employee-management-system

STACK

NODEJS, EXPRESS, MONGODB

Please refer to this guide to set up mongoDB on your local machine.
[MongoDB installation guide](https://www.mongodb.com/docs/guides/server/install/)

1. clone the repo on your local machine

2. Navigate to this folder on your terminal

3. Run  ```npm install``` to install all dependencies

4. Run ```npm run dev``` to start the local server

Documentation can be found here:
https://documenter.getpostman.com/view/11784799/UVyn1JLx

Deployed here:

Local Server url:
localhost:5000

Features

Employees can:
- Login
- Update details
- Fetch their details
- Logout

Admin can:
- create employee account
- Login
- Fetch all employees
- Update employee details
- Delete Employee account
- Pay single employee salary
- Pay multiple employee salaries
- Logout

Feature breakdown:


To use Admin priviledges, create an admin account and use the provided token. Also, to use user features,create account as a user and use the provided token

Every employee has a createdby property which contains the Id of the admin that created the employee

Only administrators can create accounts for employees

Admins can delete employee accounts(all their payment history are deleted also)

Each employee has roles

Each time salaries are paid, a transaction is created which contains the Id of the administrator that made the payment, which employee it was made to, the amount and the time, also if no user is found for a multiple payment, it is skipped and other transactions completed

Only admin can change Employee roles and wallet balance but employees can change other details


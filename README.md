# Employee-management-system

STACK

NODEJS, EXPRESS, MONGODB


1. clone the repo on your local machine

2. Navigate to this folder on your terminal

3. Run  ```npm install``` to install all dependencies

4. Run ```npm run dev``` to start the local server

Documentation can be found here:
https://documenter.getpostman.com/view/11784799/UVyn1JLx


Local Server url:
localhost:5000

Database has been prepopulated with 2 administrator and 3 employees accounts. Here are their details

Administrators

fullName : Bassit Owolabi\
email : barseetbrown@gmail.com\
password: qwertyuiop

FullName: Habeeb Badmus\
email: habeeb@gmail.com\
password: qwertyuiop

Employees

fullName: Eric Chan\
email: ericchan@gmail.com\
password: qwertyuiop\
role: Software Engineer

fullName: Bruce Wayne\
email: bwayne@gmail.com\
password: qwertyuiop\
role: Software Engineer

fullName: Tyler Kincaid\
email: tcaid@gmail.com\
password: qwertyuiop\
role: Software Engineer

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


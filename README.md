# CRM Backend
### live link: http://crm.amsisecurity.co.uk/
login credentials: email: admin@gmail.com, password: admin
This is the backend for a Customer Relationship Management (CRM) system. It provides the necessary API endpoints for managing users, authentication, and customer-related data.

## Features
- User authentication with **JWT**
- Secure password hashing using **bcrypt**
- API security with **CORS**
- Email notifications with **Nodemailer**
- Database management with **MongoDB & Mongoose**
- Session and cookie handling with **Cookie-Parser**
- Data encryption using **Crypto-JS**
- Environment variable management with **dotenv**
- Logging and debugging with **colors**
- Timestamp handling with **Moment.js**

## Tech Stack
- **Backend Framework:** Node.js with Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt

## Installation
To set up and run this project locally:

### Clone the repository
git clone <repo-link>
cd crm-backend

### Install dependencies
npm install

### Run the development server
npm run dev

## .env setup 
create a .env file at root and add those credentials : 

DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_HOST=smtp.example.com
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
JWT_EXPIRY_TIME=give a time here



## Contact
For inquiries or support, please reach out to asadm2258@gmail.com






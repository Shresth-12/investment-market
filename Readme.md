# 💼 Investment Market

A full-stack web application where users can list, negotiate, and chat in real-time for various investment deals. Includes real-time chat, deal management, authentication, and an admin dashboard.

## 🚀 Features

- 🔐 **Authentication & Authorization**
  - JWT-based login/signup
  - Role-based access (User/Admin)

- 📬 **Real-Time Chat**
  - Socket.IO integration
  - Send messages, price offers, and files
  - Typing indicators

- 📃 **Deals Management**
  - Create, update, and view investment deals
  - Track deal status: `Pending`, `In Progress`, `Completed`, `Cancelled`

- 📁 **File Upload**
  - Upload images or documents in chat

- 🧑‍💻 **Admin Dashboard**
  - View and filter all deals by status

## 🛠 Tech Stack

**Frontend:**
- React.js
- Tailwind CSS
- Axios
- React Router
- Lucide React (icons)

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.IO
- Multer (file upload)
- Cloudinary (file upload)

### Installation
```sh
# Clone the repository
git clone https://github.com/Shresth-12/investment-market.git
cd investment-market

# Navigate to the backend directory
cd backend

# Add a .env
DB_URL=
PORT="3000"
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# How to Get Cloudinary Credentials

Go to https://cloudinary.com and sign up or log in.

Once logged in, go to your Cloudinary Dashboard.

Under Account Details, you’ll find the following:

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

Copy and paste these values into your .env file.

# Install dependencies
npm install  # or yarn install
```

### Running the Backend
```sh
node index.js  # or yarn start
```
The backend will run on `http://localhost:3000`.

### Running the Frontend
```sh
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install  # or yarn install

# Start the frontend
npm run dev  # or yarn start
```
The frontend will run on `http://localhost:5173`.


## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/user/signup` | POST | Register a new user |
| `/api/v1/user/signin` | POST | Login an existing user |
| `/api/v1/user/details` | GET | Get logged-in user details |
| `/api/v1/deal/deal` | POST | Create a new investment deal |
| `/api/v1/deal/deals` | GET | Retrieve all deals |
| `/api/v1/deal/deal/:id` | GET | Get a specific deal by ID and message of that deal id |
| `/api/v1/deal/message` | POST | Send a chat message |


## Contributing
Feel free to submit pull requests or open issues to improve the project! 🚀

## License
MIT License © 2025 Shresth


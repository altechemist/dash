# E-Commerce Clothing Store Full-Stack Application

Welcome to the E-Commerce Clothing Store Full-Stack Application! This project provides a complete solution for managing an online clothing store, encompassing both front-end and back-end components. Below is the documentation for the application, including setup instructions, usage, and API endpoints.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [User Routes](#user-routes)
  - [Product Routes](#product-routes)
  - [Order Routes](#order-routes)
  - [Cart Routes](#cart-routes)
- [License](#license)

## Technologies Used

### Front-End

- **React**: A JavaScript library for building user interfaces.
- **Redux**: A state management tool for managing application state.
- **Axios**: A promise-based HTTP client for making requests to the back-end API.

### Back-End

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express**: Web framework for Node.js to build APIs.
- **Multer**: Middleware for handling multipart/form-data, used for file uploads.
- **Firebase**: Authentication and database management.
- **CORS**: Middleware for enabling Cross-Origin Resource Sharing.

## Installation

### Back-End

1. Navigate to the back-end directory:

   ```bash
   cd backend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Firebase configuration.

4. Start the server:
   ```bash
   npm start
   ```

The back-end server will run on `http://localhost:3001`.

### Front-End

1. Navigate to the front-end directory:

   ```bash
   cd frontend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the front-end application:
   ```bash
   npm run dev
   ```

The front-end application will run on `http://localhost:5173`.

### Concurrently

1. Navigate to the main directory:

   ```bash
   cd dash
   ```

2. Run with the following command:
   ```bash
   npm start
   ```

The application will run on `http://localhost:5173`.

## Usage

Use the application to browse clothing items, add products to your cart, place orders, and manage user accounts. The front-end provides a user-friendly interface, while the back-end handles API requests.

## API Endpoints

### User Routes

- **Login**

  - `POST /api/login`
  - Request body: `{ "email": "user@example.com", "password": "yourpassword" }`

- **Register**

  - `POST /api/register`
  - Request body: `{ "email": "user@example.com", "password": "yourpassword" }`

- **Reset Password**
  - `POST /api/resetPassword`
  - Request body: `{ "email": "user@example.com" }`

### Product Routes

- **Get All Products**

  - `GET /api/products`

- **Add a Product**

  - `POST /api/products`
  - Request body: `{ "name": "Product Name", "price": 100, "imageFile": <file> }`

- **Get Product by ID**

  - `GET /api/products/:id`

- **Update a Product**

  - `PUT /api/products/:id`
  - Request body: `{ "name": "Updated Product Name", "price": 150, "imageFile": <file> }`

- **Delete a Product**
  - `DELETE /api/products/:id`

### Order Routes

- **Create an Order**

  - `POST /api/orders`
  - Request body: `{ "userId": "user123", "items": [{ "productId": "product123", "quantity": 2 }] }`

- **Get Order by ID**

  - `GET /api/orders/:id`

- **Get All Orders**

  - `GET /api/orders`

- **Update Order Status**

  - `PUT /api/orders/:id/status`
  - Request body: `{ "status": "Shipped" }`

- **Cancel an Order**
  - `DELETE /api/orders/:id`

### Cart Routes

- **Get Cart**

  - `GET /api/cart`

- **Add to Cart**

  - `POST /api/cart`
  - Request body: `{ "productId": "product123", "quantity": 1 }`

- **Remove from Cart**

  - `DELETE /api/cart/:itemId`

- **Update Cart Item Quantity**
  - `PUT /api/cart/:itemId/quantity`
  - Request body: `{ "quantity": 3 }`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to reach out if you have any questions or need further assistance!

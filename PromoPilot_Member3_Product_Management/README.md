# PromoPilot — Member 3: Product Management

This folder contains the Product Management module:
- Add, view, update and delete products
- Import products from CSV

## Requirements
- Node.js and npm
- MongoDB running locally
- A React app (Vite is fine)

## Run the backend
Open a terminal inside `backend`:

```bash
npm install
npm start
```

The API runs at `http://localhost:5000`. MongoDB uses the local database `promopilot`.

## Add the frontend
Copy `frontend/src/App.jsx` and `frontend/src/App.css` into the `src` folder of your team's React app. Make sure the app imports `App`.

For a new React app, use Vite:

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm run dev
```

Then replace `src/App.jsx` and `src/App.css` with the files in this module.

## CSV format
Use these column names in the first row:

```csv
name,description,price,category,image,stock
T-Shirt,Cotton shirt,550,Clothing,https://example.com/shirt.jpg,true
```

`name`, `price` and `category` are required. `image` and `description` can be blank. Use `true` or `false` for `stock`.

## Notes
- The image field currently accepts an image URL, not an image file upload.
- If the team uses MongoDB Atlas, change the connection string in `backend/server.js`.
- Integrate this module with the team's existing project before merging.

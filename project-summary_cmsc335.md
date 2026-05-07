# Project Summary: Animal Drawing App

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Frontend:** HTML, CSS, JavaScript (Canvas API)
- **Image Storage:** Cloudinary (with Base64 fallback)

---

## What the App Does
A drawing app where users are given a random animal prompt fetched from an external animal API. The user then draws that animal on an HTML canvas and submits their drawing. Drawings are saved and can be viewed later.

---

## Core Requirements Coverage
1. **Node.js/Express.js/MongoDB** — core stack
2. **Express Router** — routes will be organized using `express.Router()` for endpoints like `/api/drawings`, `/api/prompt`, etc.
3. **Mongoose** — used to interact with MongoDB, defining schemas for saved drawings
4. **Store and retrieve from MongoDB** — drawing metadata (animal prompt, title, image URL or base64, date) saved and retrieved from MongoDB
5. **At least one form** — user fills out a form when submitting their drawing (e.g., their name, a title for the drawing, or a description)
6. **CSS file** — custom CSS using `background-color`, `color`, `font-size`, and at least one Google Font
7. **External API** — a random animal generator API is called to fetch the animal prompt the user draws

---

## Image Storage Plan
- **Primary:** Cloudinary — the canvas drawing is uploaded to Cloudinary, which returns a URL that gets saved in MongoDB
- **Fallback:** If Cloudinary doesn't work as expected, the canvas will be converted to a **Base64 string** and saved directly in MongoDB instead. Base64 is acceptable here since drawings won't be highly detailed and shouldn't hit MongoDB's 16MB document limit

---

## MongoDB Schema (rough idea)
A drawing document will store:
- The animal prompt (string)
- The title of the drawing (string) — captured via form
- The artist's name (string) — captured via form
- A message from the artist (string) — captured via form
- The image URL from Cloudinary OR a Base64 string as fallback
- A timestamp (date created)

---

## Gallery Page
A dedicated gallery page retrieves all drawings from MongoDB and displays them in a grid or card layout. Each card will show:
- The drawing (image)
- The title of the drawing
- The artist's name
- The date it was created
- The animal prompt they were given
- A message from the artist

---

## App Flow
1. User lands on the page and clicks a button to get a random animal prompt
2. The app calls the animal API (through the Express backend) and displays the animal name
3. User draws the animal on an HTML canvas
4. User fills out a short form (name/title) and submits
5. Drawing is uploaded to Cloudinary, URL is returned and saved to MongoDB along with form data and the prompt
6. A gallery page shows all saved drawings retrieved from MongoDB, displaying each drawing's image, title, artist name, date created, animal prompt, and the artist's message

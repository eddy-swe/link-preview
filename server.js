import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const PORT = 3000;

// Get the current file's location
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

// Serve frontend files from the public folder
app.use(express.static(path.join(__dirname, "public")));


// -------------------------
// TEST API ROUTE
// -------------------------

app.post("/api/preview", (req, res) => {
  const { url } = req.body;

  console.log("URL received from frontend:", url);

  // Temporary response.
  // Later, OpenGraph.io will go here.
  res.json({
    success: true,
    message: "Backend received the URL successfully.",
    data: {
      title: "Example Website",
      description: "This is temporary preview data.",
      image: "https://placehold.co/1200x630",
      url: url,
      domain: "example.com"
    }
  });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
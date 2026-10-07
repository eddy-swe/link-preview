import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// -------------------------
// MIDDLEWARE
// -------------------------

app.use(express.json());

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);

// -------------------------
// API ROUTE
// -------------------------

app.post("/api/preview", async (req, res) => {

  const { url } = req.body;

  console.log("URL received:", url);

  // Make sure the user actually provided a URL

  if (!url) {
    return res.status(400).json({
      success: false,
      error: "Please provide a URL."
    });
  }

  // Make sure our API key exists

  if (!process.env.OPENGRAPH_APP_ID) {
    console.error(
      "OPENGRAPH_APP_ID is missing."
    );

    return res.status(500).json({
      success: false,
      error: "OpenGraph.io App ID is not configured."
    });
  }

  try {
    // Build the OpenGraph.io URL
    const apiUrl =
      new URL(
        "https://opengraph.io/api/1.1/site/"
      );

    // Add the URL we want OpenGraph.io
    // to inspect
    apiUrl.searchParams.set(
      "url",
      url
    );

    // Add our secret App ID

    apiUrl.searchParams.set(
      "app_id",
      process.env.OPENGRAPH_APP_ID
    );

    console.log(
      "Calling OpenGraph.io..."
    );

    // Make the actual API request

    const response = await fetch(
      apiUrl
    );

    // Check whether OpenGraph.io
    // responded successfully

    if (!response.ok) {
      console.error(
        "OpenGraph.io returned:",
        response.status
      );

      return res.status(502).json({
        success: false,
        error:
          "OpenGraph.io could not retrieve that URL."
      });
    }

    // Convert API response into JavaScript

    const result = await response.json();

    console.log("OpenGraph.io response received.");

    // OpenGraph.io places the useful
    // metadata inside hybridGraph

    const graph =result.hybridGraph || {};

    // Send only the information
    // our frontend actually needs

    res.json({
      success: true,
      data: {
        title: graph.title || "Untitled page",
        description: graph.description || "No description available.",
        image: graph.image || "",
        url: graph.url || url,
        domain: new URL(url).hostname.replace(/^www\./, "")
      }
    });

  } catch (error) {
    console.error(
      "API request failed:",
      error
    );

    res.status(500).json({
      success: false,
      error: "Something went wrong while generating the preview."
    });
  }
});

// -------------------------
// START SERVER
// -------------------------

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  }
);
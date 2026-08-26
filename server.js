const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// ===============================
// BANK NAME ENQUIRY
// ===============================
app.post("/bank-name-enquiry", async (req, res) => {
  const { account_number, bank_code } = req.body;

  if (!account_number || !bank_code) {
    return res.status(400).json({
      status: false,
      message: "account_number and bank_code are required"
    });
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    res.status(error.response?.status || 500).json(
      error.response?.data || {
        status: false,
        message: "Server error"
      }
    );
  }
});


// ===============================
// GET ALL NIGERIAN BANKS
// ===============================
app.get("/banks", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.paystack.co/bank",
      {
        params: {
          country: "nigeria",
          perPage: 100
        },
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error(
      "BANK LIST ERROR:",
      error.response?.data || error.message
    );

    res.status(error.response?.status || 500).json(
      error.response?.data || {
        status: false,
        message: "Failed to fetch Nigerian banks"
      }
    );
  }
});


// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
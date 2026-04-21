const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// @route   GET /api/contacts
// @desc    Get all contacts
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/contacts
// @desc    Create a new contact
router.post("/", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Validate required fields
    const errors = [];
    if (!name || name.trim() === "") errors.push("Name is required");
    if (!email || email.trim() === "") errors.push("Email is required");
    if (!phone || phone.trim() === "") errors.push("Phone is required");

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: errors.join(", ") });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a valid email address" });
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });

    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/contacts/:id
// @desc    Update a contact
router.put("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found" });
    }

    // Validate email format if email is being updated
    if (req.body.email) {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(req.body.email)) {
        return res
          .status(400)
          .json({ success: false, message: "Please provide a valid email address" });
      }
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({ success: true, data: updatedContact });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid contact ID" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/contacts/:id
// @desc    Delete a contact
router.delete("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found" });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid contact ID" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

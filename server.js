require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files and set view engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Background route for "Send Message"
app.post('/send-message', async (req, res) => {
  const { name, phone, email, service, message } = req.body;

  // Print form submission to your terminal console
  console.log('--- New Client Inquiry ---');
  console.log(`Name: ${name}`);
  console.log(`Phone: ${phone}`);
  console.log(`Email: ${email}`);
  console.log(`Service: ${service}`);
  console.log(`Message: ${message}`);
  console.log('--------------------------');

  // If email credentials exist in .env, attempt sending email
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
        subject: `New Client Inquiry: ${service}`,
        html: `
          <h2>New Website Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Service Requested:</strong> ${service}</p>
          <br>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      });
    } catch (emailError) {
      console.error('Email sending failed, but submission logged locally:', emailError.message);
    }
  }

  // Always respond with success so the green banner displays on the site
  return res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
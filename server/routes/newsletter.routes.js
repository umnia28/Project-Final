import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NEWSLETTER_SENDER_EMAIL,
        pass: process.env.NEWSLETTER_APP_PASSWORD,
      },
    });

    // 1) Send confirmation to customer
    await transporter.sendMail({
      from: `"Charis Atelier" <${process.env.NEWSLETTER_SENDER_EMAIL}>`,
      to: cleanEmail,
      subject: "Welcome to The Charis Journal ✨",
      html: `
        <div style="font-family: Georgia, serif; max-width: 620px; margin: 0 auto; padding: 32px; background: linear-gradient(135deg, #fff7fb 0%, #faf5ff 50%, #fff7ed 100%); border-radius: 24px; color: #334155; border: 1px solid rgba(255,255,255,0.8);">
          <div style="text-align: center; margin-bottom: 28px;">
            <div style="font-size: 34px; font-weight: 700; line-height: 1;">
              <span style="color: #ea580c;">Charis</span>
              <span style="color: #be185d; font-size: 24px;">Atelier</span>
            </div>
            <p style="margin-top: 14px; letter-spacing: 0.35em; font-size: 11px; text-transform: uppercase; color: #64748b;">
              The Charis Journal
            </p>
          </div>

          <h2 style="text-align:center; font-size: 28px; margin-bottom: 12px; color:#7c3aed;">
            Welcome to our atelier letters ✨
          </h2>

          <p style="font-size: 16px; line-height: 1.8; text-align: center; margin-bottom: 20px;">
            Thank you for subscribing to <strong>The Charis Journal</strong>.
            You’ll receive refined inspirations, new arrivals, and special atelier updates.
          </p>

          <div style="background: rgba(255,255,255,0.75); border-radius: 18px; padding: 18px 20px; margin-top: 22px; text-align: center;">
            <p style="margin: 0; font-size: 15px; color: #475569;">
              We’re delighted to have you with us.
            </p>
          </div>

          <p style="margin-top: 28px; text-align:center; font-size: 14px; color:#64748b;">
            With warmth,<br/>
            <strong>Charis Atelier</strong>
          </p>
        </div>
      `,
    });

    // 2) Send copy to your inbox
    await transporter.sendMail({
      from: `"Charis Atelier Newsletter" <${process.env.NEWSLETTER_SENDER_EMAIL}>`,
      to: process.env.NEWSLETTER_RECEIVER_EMAIL,
      subject: "New newsletter subscriber",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="margin-bottom: 16px;">New Newsletter Subscription</h2>
          <p><strong>Email:</strong> ${cleanEmail}</p>
          <p>This customer subscribed to The Charis Journal.</p>
        </div>
      `,
    });

    return res.json({
      message: "A confirmation email has been sent to you ✨",
    });
  } catch (error) {
    console.error("NEWSLETTER SUBSCRIBE ERROR:", error);
    return res.status(500).json({ message: "Failed to send subscription email" });
  }
});

export default router;
/*const express = require("express");
const authController = require("../controller/authcontroller.js");

const router = express.Router();
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = Math.random().toString(36).slice(-8);
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your_email@gmail.com",
        pass: "your_email_password",
      },
    });

    const message = {
      from: "your_email@gmail.com",
      to: user.email,
      subject: "Password Reset Request",
      text: `You are receiving this email because you (or someone else) has requested a password reset for your account.\n\nPlease use the following token to reset your password: ${token}\n\nIf you did not request a password reset, please ignore this email`,
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        res.status(500).json({ message: "Something went wrong, Try again!" });
      } else {
        res.status(200).json({ message: "Password reset email sent" });
      }
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  await user.save();

  res.json({ message: "Password reset successful" });
});

/*router.post("/forgot-password", authController.forgotPassword);

router.get("/reset/:token", authController.renderResetForm);
router.post("/reset/:token", authController.resetPassword);*/

const express = require("express");
const router = express.Router();
const authcontroller = require("../controller/authcontroller.js");

router.post("/register", authcontroller.registerUser);
router.post("/forgot-password", authcontroller.forgotPassword);
router.post("/reset-password", authcontroller.resetPassword);

module.exports = router;

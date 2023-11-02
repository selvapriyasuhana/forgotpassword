const User = require("../model/usermodel.js");
const emailservice = require("../service/emailservice.js");

function generateRandomToken() {
  return Math.random().toString(36).substr(2, 10); // Generate a random token
}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const resetToken = generateRandomToken();

    user.resetToken = resetToken;
    await user.save();

    await emailservice.sendEmail(
      email,
      "Password Reset Request",
      `Use this link to reset your password: http://localhost:7000/auth/reset-password?token=${resetToken}`
    );

    res.status(200).send("Password reset link sent to your email");
  } catch (error) {
    res.status(500).send("Error in processing request");
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({ resetToken: token });

    if (!user) {
      console.error("No user found with the provided token:", token);
      return res.status(404).send("Invalid or expired token");
    }

    user.password = newPassword;
    user.resetToken = null;
    await user.save();

    res.status(200).send("Password reset successful");
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).send("Error in processing request");
  }
};

exports.registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({
      email,
      password, // Note: In practice, you should hash the password before saving it to the database
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
};

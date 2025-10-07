const User = require("../models/users");
const passwords_helper = require("../helper/passwords");
const jsonWebToken = require("../helper/json_web_token");
const mailer = require("../services/mailer")
const { v4: uuidv4 } = require("uuid");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.query;

    const user = await User.findOne({ Email: email });
    if (!user) return res.status(404).json({ error_message: "User not found" });

    const isPasswordCorrect = await passwords_helper.verify_password(password, user.Password);
    if (!isPasswordCorrect) return res.status(401).json({ error_message: "Password is incorrect" });

    const token = jsonWebToken.generate_token({
      id: user.ID,
      name: user.Name,
      email: user.Email
    });

    return res.status(200).json({ data: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error_message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const studentId = req.body.student_id;
    const enrollmentYear = parseInt(studentId.toString().substring(0, 4), 10);
    const currentYear = new Date().getFullYear();
    const otp = generateOTP();

    if (currentYear - enrollmentYear > 7) {
      return res.status(400).json({ error_message: "Student ID is older than 7 years" });
    }

    const existingUserByEmail = await User.findOne({ Email: req.body.email });
    if (existingUserByEmail) {
      return res.status(409).json({ 
        error_message: "Email already exists. Please use a different email address or try logging in." 
      });
    }

    const existingUserByStudentID = await User.findOne({ StudentID: studentId });
    if (existingUserByStudentID) {
      return res.status(409).json({ 
        error_message: "Student ID already exists. Please use a different student ID or contact support if this is an error." 
      });
    }

    const newUser = new User({
      ID: uuidv4(),
      Name: req.body.name,
      Email: req.body.email,
      Password: await passwords_helper.hash_password(req.body.password),
      StudentID: studentId,
      Photo: req.body.photo,
      Bio: req.body.bio,
      PhoneNumber: req.body.phone_number || "0000",
      CreatedAt: new Date()
    });

    const savedUser = await newUser.save();

    // mailer.sendEmail(req.body.email, "OTP", "Your OTP");

    res.status(201).json({ data: savedUser });

  } catch (err) {
    console.error(err);
    
    if (err.code === 11000 && err.keyPattern) {
      if (err.keyPattern.Email) {
        return res.status(409).json({ 
          error_message: "Email already exists. Please use a different email address or try logging in." 
        });
      } else if (err.keyPattern.StudentID) {
        return res.status(409).json({ 
          error_message: "Student ID already exists. Please use a different student ID or contact support if this is an error." 
        });
      } else if (err.keyPattern.ID) {
        return res.status(500).json({ 
          error_message: "A system error occurred. Please try again." 
        });
      }
    }
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        error_message: "Validation failed", 
        details: errors 
      });
    }
    
    res.status(500).json({ error_message: "Failed to create User" });
  }
};

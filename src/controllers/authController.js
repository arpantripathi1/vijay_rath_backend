//new code
const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendResetEmail } = require('../utils/email');

const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword  = await bcrypt.hash(password, salt);
    console.log("Hashed password during signup: ", hashedPassword);

    user = new User({ name, email, password: hashedPassword});

    await user.save();

    jwt.sign({ id: user.id , email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({ token });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("backend login cred rec.  ", email, " ", password);

    let user = await User.findOne({ email });
    console.log(" backend login user is ", user);

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password); // Compare plain password with hashed password
    console.log("backend login password match status is ", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Password' });
    }

    const payload = {
      user: {
        id: user.id,
        email: user.email,
        
      },
    };

     jwt.sign(payload, process.env.JWT_SECRET , { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      console.log("backend token sent is ", token);
      res.json({ token, user: payload.user });
    });

    // jwt.sign({ id: user.id , email: user.email }, process.env.JWT_SECRET , { expiresIn: '1h' }, (err, token) => {
    //   if (err) throw err;
    //   console.log("backend token sent is ", token);
    //   res.json({ token });
    // });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log("forgot user found is",user);
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }
    const token = jwt.sign({ id: user.id , email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
   
   
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.EMAIL,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });
    // console.log("Nodemailer transporter created");
    // const mailOptions = {
    //   from: process.env.EMAIL,
    //   to: email,
    //   subject: 'Password reset link',
    //   text: `Click on the link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
    // };
    // await transporter.sendMail(mailOptions);
    // console.log("Password reset email sent to:", email);

    await sendResetEmail(email, token);    // above commented code is written in util.email.js,this single line covers all above code 
    
    res.status(200).json({ msg: 'Email sent' });
  } catch (error) {
    console.error("Error during forgot password process:", error);
    if (error.response && error.response.includes('535')) {
      res.status(500).json({ error: 'Invalid email or password for SMTP. Check your environment variables.' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid token' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ msg: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// const resetPassword = async (req, res) => {
//   try {
//     const { token, newPassword } = req.body;
//     const user = await User.findOne({
//       resetPasswordToken: token,
//       resetPasswordExpires: { $gt: Date.now() },
//     });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid or expired token' });
//     }

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();

//     const payload = {
//       user: {
//         id: user.id,
//       },
//     };

//     jwt.sign(payload, secret, { expiresIn: '1h' }, (err, token) => {
//       if (err) throw err;
//       res.json({ token });
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

module.exports = { signUp, login, forgotPassword, resetPassword };

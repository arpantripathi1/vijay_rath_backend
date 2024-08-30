// const nodemailer = require('nodemailer');

// const sendResetEmail = async (email, token) => {
//   const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: process.env.EMAIL,
//     to: email,
//     subject: 'Password Reset',
//     text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
//            Please click on the following link, or paste this into your browser to complete the process:\n\n
//            ${process.env.CLIENT_URL}/reset-password/${token}\n\n
//            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendResetEmail;


// new code 
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  const message = `You are receiving this email because you (or someone else) have requested the reset of a password.\n\n
  Please click on the following link, or paste this into your browser to complete the process:\n\n
  ${resetUrl}\n\n
  If you did not request this, please ignore this email and your password will remain unchanged.\n`;

  await transporter.sendMail({
    to: email,
    from: process.env.EMAIL,
    subject: 'Password reset',
    text: message,
  });
};

const nodemailer = require("nodemailer");

// Email configuration using Gmail App Password
const EMAIL_USER = process.env.EMAIL_USER || "your-email@gmail.com";
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD || "ldyp dkve ozjs csgk";
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "LOM Support";

// Track if email is configured properly
let emailEnabled = false;

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_APP_PASSWORD.replace(/\s/g, ""), // Remove spaces from app password
  },
});

// Verify connection
transporter.verify((error) => {
  if (error) {
    console.error("Email transporter error:", error.message);
    console.log("Email sending is disabled. Set valid EMAIL_USER and EMAIL_APP_PASSWORD in .env");
    emailEnabled = false;
  } else {
    console.log("Email transporter ready");
    emailEnabled = true;
  }
});

/**
 * Send verification email
 */
async function sendVerificationEmail(to, name, token) {
  if (!emailEnabled) {
    console.log(`[EMAIL DISABLED] Verification email for ${to}, token: ${token}`);
    return { messageId: "disabled", accepted: [to] };
  }
  
  const verifyUrl = `${process.env.USER_APP_URL || "http://localhost:8081"}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"${EMAIL_FROM_NAME}" <${EMAIL_USER}>`,
    to,
    subject: "Xác thực tài khoản - LOM",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; margin: 0;">LOM</h1>
          <p style="color: #666; margin-top: 5px;">Hệ thống hỗ trợ game</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; color: white;">
          <h2 style="margin-top: 0;">Xin chào ${name}!</h2>
          <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng nhấn nút bên dưới để xác thực email của bạn:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background: white; color: #7c3aed; padding: 15px 30px; border-radius: 25px; text-decoration: none; font-weight: bold; display: inline-block;">
              Xác thực tài khoản
            </a>
          </div>
          
          <p style="font-size: 14px; opacity: 0.9;">Link xác thực sẽ hết hạn sau 24 giờ.</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px; font-size: 12px; color: #666;">
          <p style="margin: 0;">Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
          <p style="margin: 10px 0 0 0;">Nếu nút không hoạt động, copy link sau vào trình duyệt:</p>
          <p style="margin: 5px 0 0 0; word-break: break-all; color: #7c3aed;">${verifyUrl}</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Send password reset email
 */
async function sendResetPasswordEmail(to, name, token) {
  if (!emailEnabled) {
    console.log(`[EMAIL DISABLED] Reset password email for ${to}, token: ${token}`);
    return { messageId: "disabled", accepted: [to] };
  }
  
  const resetUrl = `${process.env.USER_APP_URL || "http://localhost:8081"}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"${EMAIL_FROM_NAME}" <${EMAIL_USER}>`,
    to,
    subject: "Đặt lại mật khẩu - LOM",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; margin: 0;">LOM</h1>
          <p style="color: #666; margin-top: 5px;">Hệ thống hỗ trợ game</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 10px; color: white;">
          <h2 style="margin-top: 0;">Xin chào ${name}!</h2>
          <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn nút bên dưới để tạo mật khẩu mới:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: white; color: #f5576c; padding: 15px 30px; border-radius: 25px; text-decoration: none; font-weight: bold; display: inline-block;">
              Đặt lại mật khẩu
            </a>
          </div>
          
          <p style="font-size: 14px; opacity: 0.9;">Link đặt lại mật khẩu sẽ hết hạn sau 1 giờ.</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px; font-size: 12px; color: #666;">
          <p style="margin: 0;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
          <p style="margin: 10px 0 0 0;">Nếu nút không hoạt động, copy link sau vào trình duyệt:</p>
          <p style="margin: 5px 0 0 0; word-break: break-all; color: #f5576c;">${resetUrl}</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Send contact confirmation email to user
 */
async function sendContactConfirmationEmail(to, name, subject) {
  if (!emailEnabled) {
    console.log(`[EMAIL DISABLED] Contact confirmation email for ${to}, subject: ${subject}`);
    return { messageId: "disabled", accepted: [to] };
  }
  
  const mailOptions = {
    from: `"${EMAIL_FROM_NAME}" <${EMAIL_USER}>`,
    to,
    subject: "Đã nhận yêu cầu hỗ trợ - LOM",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; margin: 0;">LOM</h1>
          <p style="color: #666; margin-top: 5px;">Hệ thống hỗ trợ game</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; border-radius: 10px; color: white;">
          <h2 style="margin-top: 0;">Xin chào ${name}!</h2>
          <p>Chúng tôi đã nhận được yêu cầu hỗ trợ của bạn:</p>
          
          <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; margin: 20px 0;">
            <strong>Tiêu đề:</strong> ${subject}
          </div>
          
          <p>Đội ngũ hỗ trợ sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px; font-size: 12px; color: #666;">
          <p style="margin: 0;">Bạn cũng có thể liên hệ trực tiếp qua Telegram: <a href="https://t.me/kacode357" style="color: #7c3aed;">@kacode357</a></p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendContactConfirmationEmail,
  isEmailEnabled: () => emailEnabled,
};

import nodemailer from "nodemailer";

// Set up Nodemailer transporter with your email service provider's SMTP settings
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Replace with your SMTP server
  port: 587, // Use 465 for secure connections, 587 for TLS
  secure: false, // Set to true if using port 465
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// /**
//  * Sends an email using Nodemailer
//  * @param {Object} data - Email data
//  * @param {string} data.name - Sender's name
//  * @param {string} data.email - Sender's email
//  * @param {string} data.phoneNumber - Sender's phone number
//  * @param {string} data.fromLocation - Starting location
//  * @param {string} data.toLocation - Destination location
//  * @param {Date} data.departureTime - Departure time
//  * @param {string} data.tripType - Type of trip
//  * @param {string} [data.toEmail] - Recipient email (default: company email)
//  * @returns {Promise<{success: boolean, message: string}>}
//  */
export const sendMailToAdmin = async (data) => {
  try {
    // if (!data || !data.email || !data.name || !data.departureTime) {
    //   throw new Error("Missing required fields");
    // }

    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email
      to: "asadullahmd242@gmail.com", // Default recipient email
      subject:data?.subject || "Booking Confirmation",
      text: `
      Hello,
 ${data?.text} :

  name: ${data?.name}
      email: ${data?.email}
      phone: ${data?.phone}
      Address: ${data?.address}


      Booking from:
      customer id: ${data?.customer_id}
      product Name: ${data?.productName}
      type: ${data?.type}
      note: ${data?.note}
      startDate: ${data?.startDate}
      status: ${data?.status}


      Thank you!
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: error.message };
  }
};


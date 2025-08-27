const axios = require("axios");
const userModel = require("../models/indexModel");
// const { pool } = require("../db");

class authApiController {
  // /**
  //  * @method: Index
  //  * @description: To render Index Page
  //  */
  // async index(req, res) {
  //   try {
  //     res.status(200).json({ status: "Welcome to Babusa Api Portal" });
  //   } catch (err) {
  //     console.error("Something went Wrong:", err);
  //     return res.status(500).json({ message: "Server error" });
  //   }
  // }

  /**
   * @method: signup
   * @description: To Save Sign UP Data and send OTP..
   */
  async signup(req, res) {
    try {
      const { gender, full_name, city, mobile, latitude, longitude, terms } =
        req.body;

      // Validate required fields
      if (
        !gender ||
        !full_name ||
        !city ||
        !mobile ||
        latitude === undefined ||
        longitude === undefined
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Validate terms
      if (terms !== true && terms !== "true") {
        return res
          .status(400)
          .json({ message: "Please accept terms & conditions" });
      }

      // Generate OTP
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      console.log(`🔢 Generated OTP: ${otp}`);

      // Save user or update OTP if user already exists
      await userModel.createOrUpdateUser({
        gender,
        full_name,
        city,
        mobile,
        latitude,
        longitude,
        otp_code: otp,
        otp_expiry: expiry,
      });

      // Send OTP via SMS API
      // const smsUrl = `https://bhashsms.com/api/sendmsg.php?user=success&pass=sms@1234&sender=BHAINF&phone=${mobile}&text=Dear%20User,%20Your%20OTP%20is%20${otp}`;

      const url = `https://bhashsms.com/api/sendmsg.php`;
      const params = {
        user: "success",
        pass: "sms@1234",
        sender: "BHAINF",
        phone: mobile,
        text: `Dear Customer, OTP is ${otp}, Thank you for using our service.- BhashSMS`,
        priority: "ndnd",
        stype: "normal",
        OTP: otp,
      };

      const response = await axios.get(url, { params });

      // await axios.get(smsUrl);
      // console.log("📨 SMS API URL:", response);
      res.status(200).json({ message: "OTP sent successfully", mobile });
    } catch (err) {
      console.error("Error in signup:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
  /**
   * @method: verifyOtp
   * @description: To verify OTP
   */

  async verifyOtp(req, res) {
    try {
      const { mobile, otp } = req.body;
      const user = await userModel.getUserByMobile(mobile);

      if (!user) return res.status(404).json({ message: "User not found" });

      console.log("User from DB:", user); // Debugging line

      if (user.otp_code.toString() !== otp.toString()) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      if (new Date() > new Date(user.otp_expiry)) {
        return res.status(400).json({ message: "OTP expired" });
      }

      await userModel.verifyUser(mobile);
      res.status(200).json({ message: "OTP verified successfully" });
    } catch (err) {
      console.error("Error in verifyOtp:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
}
module.exports = new authApiController();

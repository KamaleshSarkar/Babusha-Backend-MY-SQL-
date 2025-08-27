const { pool } = require("../db");

class UserModel {
  // Create or update OTP + location
  async createOrUpdateUser({
    gender,
    full_name,
    city,
    mobile,
    latitude,
    longitude,
    otp_code,
    otp_expiry,
  }) {
    return pool.query(
      `INSERT INTO sensegeofence_Babusa.babusa_users 
      (gender, full_name, city, mobile, latitude, longitude, is_verified, otp_code, otp_expiry)
       VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)
       ON DUPLICATE KEY UPDATE 
       latitude = VALUES(latitude),
       longitude = VALUES(longitude),
       otp_code = VALUES(otp_code),
       otp_expiry = VALUES(otp_expiry),
       is_verified = 0`,
      [
        gender,
        full_name,
        city,
        mobile,
        latitude,
        longitude,
        otp_code,
        otp_expiry,
      ]
    );
  }

  async getUserByMobile(mobile) {
    const [rows] = await pool.query(
      `SELECT * FROM sensegeofence_Babusa.babusa_users WHERE mobile = ?`,
      [mobile]
    );
    return rows[0];
  }

  async verifyUser(mobile) {
    return pool.query(
      `UPDATE sensegeofence_Babusa.babusa_users 
       SET is_verified = 1, otp_code = NULL, otp_expiry = NULL
       WHERE mobile = ?`,
      [mobile]
    );
  }
}

module.exports = new UserModel();

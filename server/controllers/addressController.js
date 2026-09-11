

import Address from "../models/address.js";

// Add Address : /api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address, userId } = req.body;

    // Ensure all required fields are present
    if (!address || !userId) {
      return res.json({ success: false, message: 'Missing address or userId' });
    }

    // Optional: Validate fields manually if needed

    // Save address with associated user
    await Address.create({ ...address, userId });

    res.json({ success: true, message: 'Address added successfully' });
  } catch (error) {
    console.log('Address error:', error.message);
    res.json({ success: false, message: error.message });
  }
};



//get address : /api/address/get
export const getAddress = async (req, res) => {
  try {
    const userId = req.userId;  // from middleware
    const addresses = await Address.find({ userId });

    res.json({ success: true, addresses });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

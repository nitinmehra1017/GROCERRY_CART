import User from "../models/user.js";

//update user cartData : /api/cart/update




export const updateCart = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;

    // Validate input
    if (!userId || !cartItems) {
      return res.json({ success: false, message: "Missing userId or cartItems" });
    }

    // Attempt update
    const user = await User.findByIdAndUpdate(userId, { cartItems }, { new: true });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

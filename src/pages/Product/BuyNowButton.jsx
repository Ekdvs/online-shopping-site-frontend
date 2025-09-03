import { useNavigate } from "react-router-dom";

// inside component
const navigate = useNavigate();

const handleBuyNow = async () => {
  if (!token) return toast.error("Login first to buy");
  try {
    // fetch delivery address
    const addressRes = await Axios.get("/api/address/get", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const deliveryAddress = Array.isArray(addressRes.data.data)
      ? addressRes.data.data[addressRes.data.data.length - 1]
      : addressRes.data.data;

    if (!deliveryAddress || !deliveryAddress.address_line) {
      return toast.error("Please add delivery address");
    }

    // Build order payload
    const orderPayload = {
      orderId: `ORD-${Date.now()}`,
      product_details: [{ productId: product._id, quantity, price: product.price, name: product.name, image: product.image[0] }],
      payment_id: "COD-0001",
      payment_status: "Pending",
      delivery_address: deliveryAddress,
      subTotalAmt: product.price * quantity,
      totalAmt: product.price * quantity + 280, // add delivery fee here
      invoice_receipt: null,
    };

    // Navigate to checkout page with state
    navigate("/checkout", { state: { orderData: { items: orderPayload.product_details, deliveryFee: 280, total: orderPayload.totalAmt, shippingAddress: { ...deliveryAddress, name: "E.K.D.Gayan Kanushka" } } } });
  } catch (error) {
    toast.error(error.response?.data?.message || "Server error");
  }
};

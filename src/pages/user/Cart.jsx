import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../../utils/Axios";
import SummaryApi from "../../common/SummaryApi";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await Axios({
        method: SummaryApi.getCart.method,
        url: SummaryApi.getCart.url,
      });
      if (data.success) setCartItems(data.data || []);
      else if (data.message === "cart item is empty") setCartItems([]);
      else toast.error(data.message || "Failed to fetch cart");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error fetching cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQty) => {
    if (newQty <= 0) return;
    try {
      const { data } = await Axios({
        method: SummaryApi.updateCart.method,
        url: `${SummaryApi.updateCart.url}/${cartItemId}`,
        data: { quantity: newQty },
      });
      if (data.success) {
        setCartItems((prev) =>
          prev.map((item) =>
            item._id === cartItemId ? { ...item, quantity: newQty } : item
          )
        );
        toast.success("Quantity updated");
      } else toast.error(data.message || "Failed to update");
    } catch {
      toast.error("Error updating quantity");
    }
  };

  const deleteItem = async (cartItemId) => {
    try {
      const { data } = await Axios({
        method: SummaryApi.deleteCart.method,
        url: `${SummaryApi.deleteCart.url}/${cartItemId}`,
      });
      if (data.success) {
        setCartItems((prev) => prev.filter((item) => item._id !== cartItemId));
        toast.success("Item removed");
      } else toast.error(data.message || "Failed to delete");
    } catch {
      toast.error("Error deleting item");
    }
  };

  const handleCheckout = () => {
    const validItems = cartItems.filter(c => c.productId);
    if (!validItems.length) return toast.error("Your cart is empty!");

    const orderData = {
      items: validItems.map(c => ({
        _id: c._id,
        name: c.productId.name,
        image: c.productId.image?.[0] || "/placeholder.png",
        price: c.productId.price,
        quantity: c.quantity,
      })),
      deliveryFee: 10,
      shippingAddress: {
        name: "Your Name",
        mobile: "1234567890",
        address_line: "Your Address",
        city: "City",
        state: "State",
        pincode: "000000",
        country: "Country",
      },
      deliveryOption: { name: "Standard" },
    };

    navigate("/checkout", { state: { orderData } });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">🛒 Your cart is empty</p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item._id} className="flex items-center bg-white shadow p-4 rounded-lg">
                {item.productId ? (
                  <>
                    <img
                      src={item.productId.image?.[0] || "/placeholder.png"}
                      alt={item.productId.name || "Product"}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1 ml-4">
                      <h3 className="font-semibold">{item.productId.name}</h3>
                      <p className="text-gray-500">
                        Rs: {item.productId.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                    </div>
                    <button onClick={() => deleteItem(item._id)} className="ml-4 text-red-500 hover:text-red-700">🗑</button>
                  </>
                ) : (
                  <p className="text-red-500">Product no longer available</p>
                )}
              </div>
            ))}
          </div>
          <div className="bg-white shadow p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Summary</h3>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs: {cartItems
                .filter(i => i.productId)
                .reduce((sum, i) => sum + i.productId.price * i.quantity, 0)
                .toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Rs: 10</span>
            </div>
            <hr className="my-2"/>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>Rs: {(cartItems
                .filter(i => i.productId)
                .reduce((sum, i) => sum + i.productId.price * i.quantity, 0) + 10).toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} 
              className="w-full py-3 rounded-lg bg-gradient-to-r from-green-300 to-green-600 text-white font-semibold shadow-md hover:from-green-600 hover:to-green-1000 hover:font-bold active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2">
              {loading ? "Loading..." : "Checkout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

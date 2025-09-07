import React from "react";

const ShippingReturns = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Shipping & Returns</h1>
      <section className="space-y-4">
        <div>
          <h2 className="font-semibold">Shipping Information</h2>
          <p className="text-gray-600">
            We deliver across Sri Lanka within 3-7 business days. Delivery
            charges depend on your location and will be displayed at checkout.
          </p>
        </div>

        <div>
          <h2 className="font-semibold">Return Policy</h2>
          <p className="text-gray-600">
            Items can be returned within 14 days of delivery if unused and in
            original packaging. Refunds will be processed to your original
            payment method.
          </p>
        </div>

        <div>
          <h2 className="font-semibold">Exchanges</h2>
          <p className="text-gray-600">
            Exchanges are possible for defective or incorrect items. Please
            contact our support team with your order details.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ShippingReturns;

import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Privacy Policy</h1>
      <div className="space-y-4 text-gray-600">
        <p>
          Your privacy is important to us. We collect only necessary personal
          information to process your orders and improve your shopping
          experience.
        </p>
        <p>
          We never sell or share your information with third parties, except as
          required to fulfill your orders or by law.
        </p>
        <p>
          Payment details are encrypted and processed securely via trusted
          payment gateways (e.g., PayHere, Stripe).
        </p>
        <p>
          By using our services, you agree to the collection and use of
          information as outlined in this policy.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

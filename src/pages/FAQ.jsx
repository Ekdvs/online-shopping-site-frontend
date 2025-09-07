import React from "react";

const FAQ = () => {
  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Browse products, add items to your cart, and proceed to checkout. You’ll receive an email confirmation once your order is placed.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept credit/debit cards, Cash on Delivery (COD), and online payment gateways such as PayHere.",
    },
    {
      question: "How can I track my order?",
      answer:
        "After placing an order, you will receive a tracking link via email or SMS.",
    },
    {
      question: "Can I cancel or modify my order?",
      answer:
        "Yes, orders can be modified or canceled before they are shipped. Contact our support team for assistance.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((item, idx) => (
          <div key={idx} className="border rounded-lg p-4 shadow-sm bg-white">
            <h2 className="font-semibold text-lg">{item.question}</h2>
            <p className="text-gray-600 mt-2">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;

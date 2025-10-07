import { useState } from 'react';
import FAQsData from '../Data/FAQs';

export default function FAQs() {
  const [openFaq, setOpenFaq] = useState(null);
  const [faqs, setFaqs] = useState(FAQsData);

  const toggleFAQ = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(faq.id)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
            >
              <span className="font-medium text-gray-800">
                {faq.question}
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  openFaq === faq.id ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openFaq === faq.id && (
              <div className="px-6 pb-4">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

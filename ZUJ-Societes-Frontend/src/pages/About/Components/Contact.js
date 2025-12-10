export default function Contact() {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get In Touch</h2>
      <p className="text-gray-600 mb-6">
        Have questions about Campusly or need help getting started? Our support team is here to help! 
        Whether you're a student looking to join societies, a society administrator needing assistance, or 
        have suggestions for platform improvements, we'd love to hear from you.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">For Students</h3>
          <p className="text-sm text-gray-600 mb-3">Need help joining societies or using platform features?</p>
          <a href="/support" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Visit Support Center →
          </a>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">For Society Admins</h3>
          <p className="text-sm text-gray-600 mb-3">Need help managing your society or organizing events?</p>
          <a href="/support" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Get Admin Support →
          </a>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="/support"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          Contact Support
        </a>
        <a
          href="mailto:support@campusly.edu"
          className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors text-center"
        >
          Email Support
        </a>
      </div>
    </div>
  );
} 
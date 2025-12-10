import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600">Campusly Platform</p>
          <p className="text-sm text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-8 py-12">
            <div className="prose prose-lg max-w-none">
              
              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Welcome to Campusly, the official student society management platform of the Universities in Jordan. 
                  These Terms of Service ("Terms") govern your use of our platform and services. By accessing or using Campusly, 
                  you agree to be bound by these Terms.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  If you do not agree to these Terms, please do not use our platform. We reserve the right to modify these Terms 
                  at any time, and your continued use of the platform constitutes acceptance of any changes.
                </p>
              </section>

              {/* Acceptance of Terms */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  By creating an account, accessing, or using Campusly, you acknowledge that you have read, understood, 
                  and agree to be bound by these Terms and our Privacy Policy.
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>You must be a current student, faculty member, or staff member of the University of Jordan</li>
                  <li>You must provide accurate and complete information during registration</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You must notify us immediately of any unauthorized use of your account</li>
                </ul>
              </section>

              {/* Platform Description */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Platform Description</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Campusly is a digital platform designed to facilitate student society management, event organization, 
                  and community engagement within the University of Jordan. Our services include:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Society creation and management tools</li>
                  <li>Event planning and promotion</li>
                  <li>Member management and communication</li>
                  <li>Content sharing and discussion forums</li>
                  <li>Analytics and reporting features</li>
                </ul>
              </section>

              {/* User Responsibilities */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Responsibilities</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  As a user of Campusly, you agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Use the platform in accordance with University of Jordan policies and regulations</li>
                  <li>Respect other users and maintain a professional, inclusive environment</li>
                  <li>Not post content that is illegal, harmful, threatening, abusive, or discriminatory</li>
                  <li>Not engage in spam, harassment, or any form of inappropriate behavior</li>
                  <li>Not attempt to gain unauthorized access to the platform or other users' accounts</li>
                  <li>Not use the platform for commercial purposes without prior authorization</li>
                  <li>Report any violations of these Terms to the platform administrators</li>
                </ul>
              </section>

              {/* Content Guidelines */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Content Guidelines</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  All content posted on Campusly must comply with the following guidelines:
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Prohibited Content:</h3>
                  <ul className="list-disc pl-6 text-blue-700 space-y-1">
                    <li>Hate speech, discrimination, or harassment</li>
                    <li>Violence, threats, or intimidation</li>
                    <li>Sexually explicit or inappropriate material</li>
                    <li>Copyrighted material without permission</li>
                    <li>Spam, advertising, or promotional content</li>
                    <li>False or misleading information</li>
                  </ul>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to remove any content that violates these guidelines and may suspend or terminate 
                  accounts that repeatedly violate these terms.
                </p>
              </section>

              {/* Privacy and Data Protection */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Privacy and Data Protection</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your privacy is important to us. Our collection, use, and protection of your personal information 
                  is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By using Campusly, you consent to the collection and use of your information as described in our Privacy Policy.
                </p>
              </section>

              {/* Intellectual Property */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The Campusly platform, including its design, functionality, and content, is owned by the University of Jordan 
                  and protected by intellectual property laws.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You retain ownership of content you post on the platform, but by posting content, you grant Campusly 
                  a non-exclusive, royalty-free license to use, display, and distribute your content in connection with the platform.
                </p>
              </section>

              {/* Account Termination */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Account Termination</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may suspend or terminate your account at any time for violations of these Terms or for any other reason 
                  at our sole discretion.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  You may terminate your account at any time by contacting our support team. Upon termination, your access 
                  to the platform will be revoked, and your content may be deleted.
                </p>
              </section>

              {/* Disclaimers */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disclaimers</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Campusly is provided "as is" without warranties of any kind. We do not guarantee that the platform 
                  will be uninterrupted, error-free, or secure.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We are not responsible for the content posted by users or for any damages resulting from the use of the platform.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  To the maximum extent permitted by law, the University of Jordan and Campusly shall not be liable for 
                  any indirect, incidental, special, or consequential damages arising from your use of the platform.
                </p>
              </section>

              {/* Governing Law */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms are governed by the laws of the Hashemite Kingdom of Jordan. Any disputes arising from these 
                  Terms or your use of the platform shall be resolved in the courts of Jordan.
                </p>
              </section>

              {/* Contact Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about these Terms, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-2"><strong>Email:</strong> legal@campusly.edu</p>
                  <p className="text-gray-700 mb-2"><strong>Phone:</strong> +962 6 535 5000</p>
                  <p className="text-gray-700 mb-2"><strong>Address:</strong> University of Jordan, Amman, Jordan</p>
                  <p className="text-gray-700"><strong>Office Hours:</strong> Sunday - Thursday, 8:00 AM - 4:00 PM (Jordan Time)</p>
                </div>
              </section>

              {/* Changes to Terms */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will notify users of significant changes 
                  through the platform or via email. Your continued use of the platform after such modifications 
                  constitutes acceptance of the updated Terms.
                </p>
              </section>

            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/privacy"
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Privacy Policy
            </Link>
            <Link
              to="/support"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

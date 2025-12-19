import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
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
                  The University who utilize the platform is committed to protecting your privacy and personal information.
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the Campusly
                  platform ("Platform" or "Service").
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By using our Platform, you consent to the data practices described in this Privacy Policy. If you do not agree with
                  the terms of this Privacy Policy, please do not use our Platform.
                </p>
              </section>

              {/* Information We Collect */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                  <li>Create an account (name, email, student ID, profile photo)</li>
                  <li>Join or create societies</li>
                  <li>Participate in events or activities</li>
                  <li>Post content, comments, or messages</li>
                  <li>Contact us for support</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Automatically Collected Information</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We automatically collect certain information when you use our Platform:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, time spent, features used)</li>
                  <li>Log data (access times, error logs, performance data)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 Third-Party Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may receive information about you from third parties, such as other users who invite you to join societies
                  or events, or from University systems for verification purposes.
                </p>
              </section>

              {/* How We Use Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                  <li>Provide and maintain the Platform services</li>
                  <li>Verify your identity and University affiliation</li>
                  <li>Enable society management and event organization</li>
                  <li>Facilitate communication between users</li>
                  <li>Send important updates and notifications</li>
                  <li>Improve and personalize your experience</li>
                  <li>Ensure platform security and prevent abuse</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Legal Basis for Processing</h4>
                  <p className="text-blue-700 text-sm">
                    We process your personal information based on your consent, our legitimate interests in providing
                    educational services, and compliance with University policies and legal requirements.
                  </p>
                </div>
              </section>

              {/* Information Sharing */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information
                  in the following circumstances:
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Within the Platform</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>With other members of societies you join</li>
                  <li>With event organizers when you register for events</li>
                  <li>In public forums and discussions (as you choose to participate)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 University Administration</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>With University officials for administrative purposes</li>
                  <li>For compliance with University policies and regulations</li>
                  <li>For academic and disciplinary matters when required</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3 Legal Requirements</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>When required by law or legal process</li>
                  <li>To protect our rights and the safety of our users</li>
                  <li>In case of emergency or safety concerns</li>
                </ul>
              </section>

              {/* Data Security */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information against
                  unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication systems</li>
                  <li>Secure data centers and infrastructure</li>
                  <li>Staff training on data protection practices</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  However, no method of transmission over the internet or electronic storage is 100% secure. While we strive
                  to protect your information, we cannot guarantee absolute security.
                </p>
              </section>

              {/* Data Retention */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy,
                  unless a longer retention period is required or permitted by law.
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Account information: Until account deletion or graduation + 2 years</li>
                  <li>Society membership data: Until membership ends + 1 year</li>
                  <li>Event participation: Until event completion + 1 year</li>
                  <li>Content posts: Until account deletion or content removal</li>
                  <li>Log data: Up to 2 years for security and analytics purposes</li>
                </ul>
              </section>

              {/* Your Rights */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You have certain rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li><strong>Access:</strong> Request a copy of your personal information</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Receive your data in a structured format</li>
                  <li><strong>Restriction:</strong> Limit how we process your information</li>
                  <li><strong>Objection:</strong> Object to certain processing activities</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  To exercise these rights, please contact us using the information provided in the Contact section below.
                </p>
              </section>

              {/* Cookies and Tracking */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies and Tracking Technologies</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to enhance your experience on our Platform:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how you use the platform</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong>Security Cookies:</strong> Protect against fraud and unauthorized access</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  You can control cookie settings through your browser preferences, but disabling certain cookies may
                  affect platform functionality.
                </p>
              </section>

              {/* Third-Party Services */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Third-Party Services</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our Platform may integrate with third-party services for enhanced functionality. These services have
                  their own privacy policies, and we encourage you to review them:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Email services for notifications</li>
                  <li>Cloud storage for file uploads</li>
                  <li>Analytics services for platform improvement</li>
                  <li>Security services for fraud prevention</li>
                </ul>
              </section>

              {/* International Transfers */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Data Transfers</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your personal information is primarily processed within Jordan. If we need to transfer your information
                  internationally, we will ensure appropriate safeguards are in place to protect your privacy and comply
                  with applicable data protection laws.
                </p>
              </section>

              {/* Children's Privacy */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our Platform is designed for University of Jordan students, faculty, and staff. We do not knowingly
                  collect personal information from children under 16. If we become aware that we have collected such
                  information, we will take steps to delete it promptly.
                </p>
              </section>

              {/* Changes to Privacy Policy */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by
                  posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you
                  to review this Privacy Policy periodically for any changes.
                </p>
              </section>

              {/* Contact Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-2"><strong>Data Protection Officer:</strong> privacy@campusly.edu</p>
                  <p className="text-gray-700 mb-2"><strong>General Inquiries:</strong> support@campusly.edu</p>
                  <p className="text-gray-700 mb-2"><strong>Phone:</strong> +962 6 535 5000</p>
                  <p className="text-gray-700 mb-2"><strong>Address:</strong> University of Jordan, Amman, Jordan</p>
                  <p className="text-gray-700"><strong>Office Hours:</strong> Sunday - Thursday, 8:00 AM - 4:00 PM (Jordan Time)</p>
                </div>
              </section>

              {/* Compliance */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Compliance</h2>
                <p className="text-gray-700 leading-relaxed">
                  This Privacy Policy complies with applicable data protection laws, including the Jordanian Personal Data
                  Protection Law and international best practices for educational institutions.
                </p>
              </section>

            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/terms"
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Terms of Service
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

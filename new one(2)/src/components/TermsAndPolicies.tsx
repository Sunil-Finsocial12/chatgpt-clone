

import type React from "react"
import { useState } from "react"
import { useNavigate } from 'react-router-dom';

const TermsAndPolicies: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setIsDarkMode((prev: boolean) => !prev);
    document.documentElement.classList.toggle('dark', !isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(!isDarkMode));
  };

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-b from-gray-900 to-gray-950' 
        : 'bg-gradient-to-b from-blue-50 to-white'
    }`}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Navigation and Theme Toggle */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate('/')}
            className={`flex items-center ${
              isDarkMode ? 'text-blue-300' : 'text-blue-600'
            } hover:opacity-80 transition-colors`}
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Main Page
          </button>

          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
                : 'bg-blue-100 text-gray-700 hover:bg-blue-200'
            }`}
            aria-label="Toggle theme"
          >
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
        </div>

        <div className={`${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-xl shadow-lg p-8 mb-8`}>
          <div className="text-center mb-10">
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${
              isDarkMode ? 'text-blue-300' : 'text-blue-700'
            }`}>
              HindAI Terms and Policies
            </h1>
            <div className="w-20 h-1 bg-blue-500 mx-auto my-4"></div>
            <p className={`max-w-2xl mx-auto ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Please read these terms and policies carefully before using the HindAI platform.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className={`flex justify-center mb-8 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              onClick={() => setActiveTab("terms")}
              className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
                activeTab === "terms"
                  ? "border-b-2 border-blue-500 text-blue-300 dark:text-blue-300 light:text-blue-600"
                  : "text-gray-400 dark:text-gray-400 light:text-gray-500 hover:text-blue-300"
              }`}
            >
              Terms of Service
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
                activeTab === "privacy"
                  ? "border-b-2 border-blue-500 text-blue-300 dark:text-blue-300 light:text-blue-600"
                  : "text-gray-400 dark:text-gray-400 light:text-gray-500 hover:text-blue-300"
              }`}
            >
              Privacy Policy
            </button>
          </div>

          {/* Content sections - updating text colors for dark mode */}
          <div className="max-w-none">
            {activeTab === "terms" ? (
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">1. Introduction</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Welcome to HindAI. By accessing or using our platform, you agree to be bound by these Terms of
                    Service. If you disagree with any part of the terms, you may not access our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">2. Use of Service</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    HindAI provides an artificial intelligence platform that allows users to interact with AI models
                    similar to ChatGPT. Our services are provided "as is" and "as available" without warranties of any
                    kind.
                  </p>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    You are responsible for your use of the service and any content you provide, including compliance
                    with applicable laws, rules, and regulations.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">3. User Accounts</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    You may need to create an account to use certain features of our service. You are responsible for
                    safeguarding your account and for all activities that occur under your account.
                  </p>
                  <ul className="list-disc pl-6 mt-2 text-gray-700 dark:text-gray-300">
                    <li>You must provide accurate and complete information when creating your account</li>
                    <li>You must notify us immediately of any security breach or unauthorized use of your account</li>
                    <li>You may not use another user's account without permission</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">4. Intellectual Property</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    The service and its original content, features, and functionality are owned by HindAI and are
                    protected by international copyright, trademark, patent, trade secret, and other intellectual
                    property laws.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">
                    5. User-Generated Content
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    You retain ownership of any intellectual property rights that you hold in the content you submit to
                    HindAI. By submitting content to our platform, you grant us a worldwide, royalty-free license to
                    use, reproduce, modify, and distribute your content in connection with the service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">
                    6. Limitation of Liability
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    In no event shall HindAI, its directors, employees, partners, agents, suppliers, or affiliates be
                    liable for any indirect, incidental, special, consequential, or punitive damages, including without
                    limitation, loss of profits, data, use, goodwill, or other intangible losses.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">7. Changes to Terms</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    We reserve the right to modify or replace these terms at any time. If a revision is material, we
                    will provide at least 30 days' notice prior to any new terms taking effect.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">8. Governing Law</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    These terms shall be governed and construed in accordance with the laws applicable in your
                    jurisdiction, without regard to its conflict of law provisions.
                  </p>
                </section>
              </div>
            ) : (
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">
                    1. Information We Collect
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    We collect information you provide directly to us when you use our services, including:
                  </p>
                  <ul className="list-disc pl-6 mt-2 text-gray-700 dark:text-gray-300">
                    <li>Account information: username, email address, and password</li>
                    <li>Profile information: name, bio, and profile picture</li>
                    <li>Content you submit: prompts, queries, and feedback</li>
                    <li>Communications: messages you send to us</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">
                    2. How We Use Your Information
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">We use the information we collect to:</p>
                  <ul className="list-disc pl-6 mt-2 text-gray-700 dark:text-gray-300">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Develop new products and features</li>
                    <li>Personalize your experience</li>
                    <li>Send you technical notices, updates, and administrative messages</li>
                    <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
                    <li>Detect, prevent, and address technical issues</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">3. Data Retention</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    We retain your personal information only for as long as necessary to fulfill the purposes for which
                    we collected it, including for the purposes of satisfying any legal, accounting, or reporting
                    requirements.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">4. Data Security</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    We have implemented appropriate security measures to prevent your personal information from being
                    accidentally lost, used, or accessed in an unauthorized way. We limit access to your personal
                    information to those employees, agents, contractors, and other third parties who have a business
                    need to know.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">5. Your Rights</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Depending on your location, you may have certain rights regarding your personal information,
                    including:
                  </p>
                  <ul className="list-disc pl-6 mt-2 text-gray-700 dark:text-gray-300">
                    <li>The right to access your personal information</li>
                    <li>The right to rectify inaccurate personal information</li>
                    <li>The right to request deletion of your personal information</li>
                    <li>The right to restrict processing of your personal information</li>
                    <li>The right to data portability</li>
                    <li>The right to object to processing of your personal information</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">
                    6. Cookies and Tracking Technologies
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    We use cookies and similar tracking technologies to track activity on our service and hold certain
                    information. You can instruct your browser to refuse all cookies or to indicate when a cookie is
                    being sent.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">
                    7. Changes to Privacy Policy
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the
                    new Privacy Policy on this page and updating the "Last Updated" date.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">8. Contact Us</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    If you have any questions about this Privacy Policy, please contact us at:
                  </p>
                  <p className="mt-2 font-medium text-blue-600 dark:text-blue-300">privacy@hindai.com</p>
                </section>
              </div>
            )}
          </div>

          {/* Last Updated */}
          <div className="mt-12 text-center text-sm text-gray-400 dark:text-gray-400 light:text-gray-500 border-t border-gray-700 dark:border-gray-700 light:border-gray-200 pt-6">
            <p>Last Updated: March 10, 2025</p>
            <p className="mt-2 text-blue-300 dark:text-blue-300 light:text-blue-500">HindAI © 2025. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsAndPolicies


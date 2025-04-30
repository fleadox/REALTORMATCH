import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-b from-primary-900 to-background-dark">
      <div className="container-custom">
        <div className="glass-panel p-8">
          <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
          <p className="text-gray-300 mb-4">Last Updated: April 1, 2025</p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-xl font-bold text-white mb-4">1. Introduction</h2>
              <p>
                REALTOR MATCH ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">2. Information We Collect</h2>
              <h3 className="text-lg font-semibold text-white mb-2">2.1 Personal Information</h3>
              <p className="mb-4">We may collect personal information that you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name and contact information</li>
                <li>Professional credentials and experience</li>
                <li>Profile information and photographs</li>
                <li>Communication preferences</li>
                <li>Account login credentials</li>
              </ul>

              <h3 className="text-lg font-semibold text-white mt-4 mb-2">2.2 Usage Information</h3>
              <p>We automatically collect certain information about your device and how you interact with our services, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>IP address and device identifiers</li>
                <li>Browser type and settings</li>
                <li>Usage patterns and preferences</li>
                <li>Location information (with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">3. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and improve our services</li>
                <li>Personalize your experience</li>
                <li>Process your transactions</li>
                <li>Communicate with you</li>
                <li>Ensure platform security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">4. Information Sharing</h2>
              <p className="mb-4">We may share your information with:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Service providers and business partners</li>
                <li>Other users (as part of your public profile)</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">5. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>Object to certain data processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">6. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:{' '}
                <a href="mailto:info@realtormatch.pro" className="text-accent-300 hover:text-accent-400">
                  info@realtormatch.pro
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
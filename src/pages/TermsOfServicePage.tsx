import React from 'react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-b from-primary-900 to-background-dark">
      <div className="container-custom">
        <div className="glass-panel p-8">
          <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
          <p className="text-gray-300 mb-4">Last Updated: April 1, 2025</p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-xl font-bold text-white mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing or using REALTOR MATCH, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">2. Use License</h2>
              <p className="mb-4">Permission is granted to temporarily access the materials on REALTOR MATCH's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software</li>
                <li>Remove any copyright or other proprietary notations</li>
                <li>Transfer the materials to another person</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">3. User Accounts</h2>
              <p className="mb-4">When creating an account, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Not share your account credentials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">4. Professional Conduct</h2>
              <p className="mb-4">Real estate professionals using our platform must:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Maintain current licenses and certifications</li>
                <li>Provide accurate listing information</li>
                <li>Respond to inquiries promptly</li>
                <li>Comply with all applicable real estate laws</li>
                <li>Maintain professional conduct in all interactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">5. Disclaimer</h2>
              <p>
                The materials on REALTOR MATCH's website are provided on an 'as is' basis. REALTOR MATCH makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">6. Limitations</h2>
              <p>
                In no event shall REALTOR MATCH or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on REALTOR MATCH's website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">7. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of Georgia and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">8. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:{' '}
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

export default TermsOfServicePage;
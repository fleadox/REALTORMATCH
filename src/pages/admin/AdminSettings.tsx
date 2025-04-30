import React, { useState } from 'react';
import { Save, AlertCircle, Info } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  return (
    <div>
      <h2 className="text-2xl mb-6">Admin Settings</h2>
      
      <div className="border-b border-gray-200 mb-6">
        <div className="flex flex-wrap -mb-px">
          <button
            className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-primary-700 text-primary-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'approval'
                ? 'border-primary-700 text-primary-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('approval')}
          >
            Approval Process
          </button>
          <button
            className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'email'
                ? 'border-primary-700 text-primary-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('email')}
          >
            Email Templates
          </button>
        </div>
      </div>
      
      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="animate-fade-in">
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Platform Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  id="siteName"
                  className="input"
                  defaultValue="GeorgiaRealty.Pro"
                />
              </div>
              
              <div>
                <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Site Description
                </label>
                <textarea
                  id="siteDescription"
                  rows={3}
                  className="input"
                  defaultValue="Georgia's premier real estate agent directory, connecting clients with qualified professionals across the state."
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  className="input"
                  defaultValue="info@georgiarealty.pro"
                />
              </div>
              
              <div>
                <label htmlFor="supportPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Support Phone
                </label>
                <input
                  type="tel"
                  id="supportPhone"
                  className="input"
                  defaultValue="(404) 555-1212"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Search Settings</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Prioritize Featured Agents</h4>
                  <p className="text-sm text-gray-600">Display featured agents at the top of search results</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Only Show Verified Agents</h4>
                  <p className="text-sm text-gray-600">Hide unverified agents from search results</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div>
                <label htmlFor="resultsPerPage" className="block text-sm font-medium text-gray-700 mb-1">
                  Results Per Page
                </label>
                <select id="resultsPerPage" className="input">
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="36">36</option>
                  <option value="48">48</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <button type="submit" className="btn-primary">
              <Save className="w-5 h-5 mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      )}
      
      {/* Approval Process Settings */}
      {activeTab === 'approval' && (
        <div className="animate-fade-in">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="text-yellow-600 mr-3">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-yellow-800 mb-1">Important</h3>
                <p className="text-yellow-700 text-sm">
                  Changes to approval settings will only affect new submissions and not retroactively apply to existing profiles.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Profile Approval Settings</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Require Manual Approval</h4>
                  <p className="text-sm text-gray-600">All profiles require admin approval before being published</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto-Verify Email Domains</h4>
                  <p className="text-sm text-gray-600">Automatically approve profiles from trusted email domains</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div>
                <label htmlFor="trustedDomains" className="block text-sm font-medium text-gray-700 mb-1">
                  Trusted Email Domains (one per line)
                </label>
                <textarea
                  id="trustedDomains"
                  rows={4}
                  className="input"
                  placeholder="e.g., realtor.com"
                  disabled
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="approvalChecklist" className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Approval Requirements
                </label>
                <textarea
                  id="approvalChecklist"
                  rows={6}
                  className="input"
                  defaultValue={`1. Professional photo (no selfies or casual photos)
2. Complete contact information
3. Proper agency affiliation
4. Professional bio without excessive self-promotion
5. Valid phone number format
6. Appropriate regions served`}
                ></textarea>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Verification Process</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="verificationMethod" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Method
                </label>
                <select id="verificationMethod" className="input">
                  <option value="manual">Manual Review</option>
                  <option value="document">Document Upload</option>
                  <option value="license">License Verification</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Require Business Email</h4>
                  <p className="text-sm text-gray-600">Reject profiles using free email providers (Gmail, Yahoo, etc.)</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <button className="btn-primary">
              <Save className="w-5 h-5 mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      )}
      
      {/* Email Templates */}
      {activeTab === 'email' && (
        <div className="animate-fade-in">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Email Templates</h3>
              <select className="border border-gray-300 rounded-md py-1 px-2 text-sm">
                <option value="approval">Profile Approval</option>
                <option value="rejection">Profile Rejection</option>
                <option value="welcome">Welcome Email</option>
                <option value="verification">Verification Request</option>
              </select>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Profile Approval Email</h4>
                  <div className="text-xs bg-success-100 text-success-800 px-2 py-1 rounded-full">
                    Active
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <label htmlFor="emailSubject" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Subject
                  </label>
                  <input
                    type="text"
                    id="emailSubject"
                    className="input"
                    defaultValue="Congratulations! Your GeorgiaRealty.Pro Profile Has Been Approved"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="emailBody" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Body
                  </label>
                  <textarea
                    id="emailBody"
                    rows={12}
                    className="input font-mono text-sm"
                    defaultValue={`Dear {{agent_name}},

Great news! Your profile on GeorgiaRealty.Pro has been approved and is now live on our platform.

Your profile can be viewed at: {{profile_url}}

What happens next:
- Your profile will now appear in search results
- Potential clients can contact you through the platform
- You can add up to 5 property links to showcase your listings

If you'd like to enhance your visibility, consider upgrading to our Featured Agent plan. Featured agents receive priority placement in search results and are highlighted on our homepage.

If you have any questions or need assistance with your profile, please don't hesitate to contact our support team.

Thank you for being part of GeorgiaRealty.Pro!

Best regards,
The GeorgiaRealty.Pro Team`}
                  ></textarea>
                </div>
                
                <div className="bg-gray-50 -mx-4 -mb-4 px-4 py-3 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>
                      Available variables: 
                      <code className="px-1 py-0.5 bg-gray-100 rounded text-xs ml-1">{{agent_name}}</code>
                      <code className="px-1 py-0.5 bg-gray-100 rounded text-xs ml-1">{{profile_url}}</code>
                      <code className="px-1 py-0.5 bg-gray-100 rounded text-xs ml-1">{{agent_email}}</code>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button className="btn-outline">
              Preview Template
            </button>
            <button className="btn-primary">
              <Save className="w-5 h-5 mr-2" />
              Save Template
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
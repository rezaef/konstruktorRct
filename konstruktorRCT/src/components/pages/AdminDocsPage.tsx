import { BookOpen, HelpCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export function AdminDocsPage() {
  const [openSection, setOpenSection] = useState<string | null>('getting-started');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections = [
    {
      id: 'getting-started',
      icon: BookOpen,
      title: 'Getting Started',
      items: [
        {
          question: 'How to access the admin dashboard?',
          answer: 'Login with your admin credentials at the login page. Use your email and password to access the dashboard.',
        },
        {
          question: 'How to navigate the dashboard?',
          answer: 'Use the sidebar menu to navigate between different sections: Dashboard, Projects, Finance, Materials, Settings, and Documentation.',
        },
        {
          question: 'What are the main features?',
          answer: 'The system includes project management, financial tracking, material inventory, team management, and comprehensive reporting tools.',
        },
      ],
    },
    {
      id: 'project-management',
      icon: HelpCircle,
      title: 'Project Management',
      items: [
        {
          question: 'How to create a new project?',
          answer: 'Go to Projects section and click the "New Project" button. Fill in project details including name, client, start date, and other relevant information.',
        },
        {
          question: 'How to update project progress?',
          answer: 'Click the Edit button on any project in the Projects list. Update the progress percentage and status as the project advances.',
        },
        {
          question: 'How to delete a project?',
          answer: 'Click the Delete icon next to the project. Confirm the deletion when prompted. Note: This action cannot be undone.',
        },
      ],
    },
    {
      id: 'finance',
      icon: HelpCircle,
      title: 'Finance & Reports',
      items: [
        {
          question: 'How to add income or expense?',
          answer: 'Navigate to the Finance section and use the transaction form to add new income or expense entries with date, description, and amount.',
        },
        {
          question: 'How to export financial reports?',
          answer: 'Click the "Export to CSV" button at the top of the Finance page. The system will generate a downloadable CSV file with all transactions.',
        },
        {
          question: 'How to view monthly performance?',
          answer: 'The Finance page displays monthly performance charts showing income vs expenses trends over time.',
        },
      ],
    },
    {
      id: 'troubleshooting',
      icon: AlertTriangle,
      title: 'Troubleshooting',
      items: [
        {
          question: 'Cannot login to the dashboard',
          answer: 'Ensure you are using the correct email and password. If you forgot your password, click "Forgot Password?" on the login page.',
        },
        {
          question: 'Data not updating',
          answer: 'Try refreshing the page. If the issue persists, check your internet connection or contact support.',
        },
        {
          question: 'Export function not working',
          answer: 'Make sure you have sufficient permissions and that pop-ups are not blocked in your browser settings.',
        },
      ],
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-[#2C2C2C]">Documentation & Help</h1>
        <p className="text-gray-600">Find answers to common questions and learn how to use the system</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <BookOpen size={32} className="text-[#D4AF37] mx-auto mb-3" />
          <h3 className="text-[#2C2C2C] mb-1">User Guide</h3>
          <p className="text-sm text-gray-600">Complete system documentation</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <HelpCircle size={32} className="text-[#D4AF37] mx-auto mb-3" />
          <h3 className="text-[#2C2C2C] mb-1">FAQs</h3>
          <p className="text-sm text-gray-600">Frequently asked questions</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <AlertTriangle size={32} className="text-[#D4AF37] mx-auto mb-3" />
          <h3 className="text-[#2C2C2C] mb-1">Support</h3>
          <p className="text-sm text-gray-600">Get help when you need it</p>
        </div>
      </div>

      {/* Documentation Sections */}
      <div className="bg-white rounded-lg shadow-md">
        {sections.map((section, sectionIndex) => {
          const Icon = section.icon;
          return (
            <div key={section.id} className={sectionIndex !== 0 ? 'border-t border-gray-200' : ''}>
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon size={24} className="text-[#D4AF37]" />
                  <h3 className="text-[#2C2C2C]">{section.title}</h3>
                </div>
                {openSection === section.id ? (
                  <ChevronUp size={20} className="text-gray-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400" />
                )}
              </button>

              {openSection === section.id && (
                <div className="px-6 pb-6">
                  <div className="space-y-4">
                    {section.items.map((item, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-[#2C2C2C] mb-2">{item.question}</h4>
                        <p className="text-gray-600">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Support */}
      <div className="bg-[#D4AF37] p-8 rounded-lg mt-8 text-center">
        <h3 className="text-white mb-3">Still Need Help?</h3>
        <p className="text-white/90 mb-6">
          Contact our support team for personalized assistance
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-white text-[#D4AF37] rounded-lg hover:bg-gray-100 transition-colors">
            Email Support
          </button>
          <button className="px-6 py-3 bg-[#2C2C2C] text-white rounded-lg hover:bg-gray-800 transition-colors">
            Call Support
          </button>
        </div>
      </div>
    </div>
  );
}

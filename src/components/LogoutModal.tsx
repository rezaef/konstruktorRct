import { AlertTriangle } from 'lucide-react';

interface LogoutModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function LogoutModal({ onConfirm, onCancel }: LogoutModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#D4AF37]/15 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle size={32} className="text-[#C19B2B]" />
          </div>
          
          <h2 className="text-[#0B1F3B] mb-2">Confirm Logout</h2>
          <p className="text-gray-600 mb-8">
            Are you sure you want to logout? You will need to login again to access the dashboard.
          </p>

          <div className="flex gap-4 w-full">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-white text-[#0B1F3B] rounded-lg border border-[#E2E8F0] hover:bg-[#F7F6F2] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-[#0E7C66] text-white rounded-lg hover:bg-[#0A6A58] transition-colors"
            >
              Yes, Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

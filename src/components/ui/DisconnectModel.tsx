interface DisconnectModalProps {
    title: string;
    onCancel: () => void;
    onConfirm: () => void;
  }
  
  const DisconnectModal = ({ title, onCancel, onConfirm }: DisconnectModalProps) => (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-10 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="mb-4">Do you want to disconnect {title}?</p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="cursor-pointer px-4 py-2 bg-[#353231] text-white rounded-lg"
            onClick={onConfirm}
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
  
  export default DisconnectModal;
  
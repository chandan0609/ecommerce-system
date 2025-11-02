const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={onClose} className="text-2xl hover:bg-gray-100 w-8 h-8 rounded">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
};
export default Modal
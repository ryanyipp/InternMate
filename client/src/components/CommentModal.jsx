import { motion, AnimatePresence } from "framer-motion";

const CommentModal = ({ comment, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.25)" // 👈 less opaque than 0.5
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 w-[90vw] max-w-lg"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Comment</h3>
          <textarea
            readOnly
            value={comment}
            rows={6}
            className="w-full border rounded-lg p-3 resize-none text-sm text-gray-700 bg-gray-100"
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommentModal;

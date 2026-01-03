const InputField = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      {...props}
      className="w-full border border-gray-300 rounded-md py-2.5 px-4 text-sm mt-1 outline-blue-500"
    />
  </div>
);

export default InputField;

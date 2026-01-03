import { useState } from 'react';

const PasswordField = ({ label, id = 'password', name, value, onChange }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={label}
          className="w-full border border-gray-300 rounded-md py-2.5 px-4 pr-10 text-sm mt-1 outline-blue-500"
          required
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <i className={`bx ${visible ? 'bx-show' : 'bx-hide'} text-lg`}></i>
        </button>
      </div>
    </div>
  );
};

export default PasswordField;

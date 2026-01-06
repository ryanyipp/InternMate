import { motion } from "framer-motion";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <motion.div
        className="w-12 h-12 rounded-full bg-blue-500"
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
};

export default Loader;


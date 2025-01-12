import { motion } from "framer-motion";
import "./Loader.scss";

const loaderVariants = {
  animationOne: {
    x: [20, -20],
    y: [0, -30],
    transition: {
      x: {
        repeatType: "reverse",
        repeat: Infinity,
        duration: 0.5,
      },
      y: {
        repeatType: "reverse",
        repeat: Infinity,
        duration: 0.25,
      },
    },
  },
};

const Loader = () => {
  return (
    <motion.div
      className="loader"
      variants={loaderVariants}
      animate="animationOne"
    ></motion.div>
  );
};

export default Loader;

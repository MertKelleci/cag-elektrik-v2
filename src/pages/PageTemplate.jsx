import { motion } from "framer-motion";
import "./PageTemplate.scss";
import PropTypes from "prop-types";

const cardVariants = {
  hovered: {
    scale: 1.2,
    boxShadow: "10px 10px 8px rgb(24, 24, 24)",
  },
};

const PageTemplate = ({ children }) => {
  return (
    <div className="pageBody">
      <motion.div
        className="backgroundCard"
        variants={cardVariants}
        whileHover="hovered"
      >
        <main style={{ width: "100%" }}>{children}</main>
      </motion.div>
    </div>
  );
};

PageTemplate.propTypes = {
  children: PropTypes.node.isRequired, // Ensures children are provided and are a valid React node
};

export default PageTemplate;

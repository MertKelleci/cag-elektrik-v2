import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./SetCompany.scss";
import { TiTick, TiEdit, TiDelete } from "react-icons/ti";
import PropTypes from "prop-types";

const buttonVar = {
  init: {
    backgroundColor: "#000000",
    color: "#EEEEEE",
  },
  hover: {
    backgroundColor: "#00ADB5",
    color: "#EEEEEE",
    scale: 1.2,
  },
};

const SetCompany = ({ item, setSelected, selected, deleteItem }) => {
  const { discount, name, serial } = item;
  const [highLight, setHighlight] = useState(false);

  useEffect(() => {
    if (selected !== item) {
      setHighlight(false);
    } else {
      setHighlight(true);
    }
  }, [selected]);

  return (
    <tr>
      <th>{name}</th>
      <th>{serial}</th>
      <th>{discount}</th>
      <th>
        <motion.button
          className="button"
          variants={buttonVar}
          initial="init"
          whileHover="hover"
          onClick={() => {
            setSelected(item);
          }}
        >
          {highLight ? <TiTick /> : <TiEdit />}
        </motion.button>
      </th>
      <th>
        <motion.button
          className="button"
          variants={buttonVar}
          initial="init"
          whileHover="hover"
          onClick={() => {
            deleteItem(item);
          }}
        >
          <TiDelete />
        </motion.button>
      </th>
    </tr>
  );
};

SetCompany.propTypes = {
  item: PropTypes.shape({
    discount: PropTypes.number.isRequired, // Validate 'discount' as a number
    name: PropTypes.string.isRequired, // Validate 'name' as a string
    serial: PropTypes.string.isRequired, // Validate 'serial' as a string
  }).isRequired, // Ensure 'item' is an object with the specified shape
  setSelected: PropTypes.func.isRequired, // Validate 'setSelected' as a function
  selected: PropTypes.object, // Validate 'selected' as an object (can be null)
  deleteItem: PropTypes.func.isRequired, // Validate 'deleteItem' as a function
};

export default SetCompany;

import { useState, useEffect } from "react";
import "./SetProduct.scss";
import { motion } from "framer-motion";
import { TiTick, TiEdit, TiDelete } from "react-icons/ti";
const { ipcRenderer } = window.require("electron");
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

const ProductComp = ({ item, setSelected, selected, brand, deleteItem }) => {
  let { brandID, price, serial, stored, name } = item;
  const [disc, setDisc] = useState(0);
  const [highLight, setHighlight] = useState(false);

  useEffect(() => {
    ipcRenderer.invoke("getCompInfo", { brandID }).then((discount) => {
      setDisc(discount);
    });
  }, []);

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
      <th>
        {price}₺ {" -> "}
        {(price - (price * disc) / 100).toFixed(2)}₺
      </th>
      <th>{disc}</th>
      <th>{brand?.label}</th>
      <th>{stored}</th>

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

ProductComp.propTypes = {
  item: PropTypes.shape({
    brandID: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    serial: PropTypes.string.isRequired,
    stored: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  setSelected: PropTypes.func.isRequired,
  selected: PropTypes.object, // Can be null or an object
  brand: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }),
  deleteItem: PropTypes.func.isRequired,
};

export default ProductComp;

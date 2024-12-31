import "./ReceiptComp.scss";
import { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const ReceiptComp = ({ item }) => {
  const { payment, items, customer, currentUser, company, date, total } = item;
  const [open, setOpen] = useState(false);

  // Convert Firestore timestamp to a readable date
  const dateFlag = new Date(date.seconds * 1000);
  const time = `${dateFlag.getDate()}.${
    dateFlag.getMonth() + 1
  }.${dateFlag.getFullYear()} ${dateFlag.getHours()}:${dateFlag.getMinutes()}`;

  return (
    <motion.div
      layout
      className="receipts-maindiv-card"
      transition={{ layout: { duration: 1, type: "spring" } }}
      style={{
        borderRadius: "10px",
        borderColor: "#222831",
        boxShadow: "0px 5px 15px rgba(0,0,0, 0.30)",
      }}
      onClick={() => setOpen(!open)}
    >
      <motion.h4 layout="position">
        {company} - {customer}
      </motion.h4>
      <motion.h4 layout="position">
        {currentUser} - {time}
      </motion.h4>

      {/* Expand the table when open is true */}
      {open && (
        <motion.div
          className="expand"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <table>
            <thead>
              <tr>
                <th>İsim</th>
                <th>Kod</th>
                <th>Fiyat</th>
                <th>İskonto</th>
                <th>Adet</th>
                <th>Tutar</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.serial}</td>
                  <td>
                    {item.initPrice}₺ {" -> "} {item.soldPrice}₺
                  </td>
                  <td>{item.disc}</td>
                  <td>{item.amount}</td>
                  <td>{Number(item.totalPrice).toFixed(2)}₺</td>
                </tr>
              ))}
              <tr>
                <td colSpan="2">Toplam Tutar:</td>
                <td colSpan="1">{total}₺</td>
                <td colSpan="2">Ödenen Tutar:</td>
                <td colSpan="1">{payment}₺</td>
              </tr>
              <tr>
                <td colSpan="3">Kalan Ödeme:</td>
                <td colSpan="3">{(total - payment).toFixed(2)}₺</td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
};

ReceiptComp.propTypes = {
  item: PropTypes.shape({
    payment: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        serial: PropTypes.string.isRequired,
        initPrice: PropTypes.number.isRequired,
        soldPrice: PropTypes.number.isRequired,
        disc: PropTypes.number.isRequired,
        amount: PropTypes.string.isRequired,
        totalPrice: PropTypes.number.isRequired,
      }).isRequired
    ).isRequired,
    customer: PropTypes.string.isRequired,
    currentUser: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    date: PropTypes.shape({
      seconds: PropTypes.number.isRequired,
    }).isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
};

export default ReceiptComp;

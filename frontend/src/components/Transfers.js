import React, { useState } from 'react';
import { transfersAPI } from '../services/api';
import './Transfers.css';

const Transfers = () => {
  const [formData, setFormData] = useState({
    asset: '',
    fromBase: '',
    toBase: '',
    quantity: '',
    reason: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.fromBase === formData.toBase) {
      setMessage('Source and destination bases cannot be the same');
      return;
    }
    setLoading(true);
    try {
      await transfersAPI.create(formData);
      setMessage('Transfer initiated successfully!');
      setFormData({
        asset: '',
        fromBase: '',
        toBase: '',
        quantity: '',
        reason: '',
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error initiating transfer: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transfers-container">
      <h1>Transfer Assets</h1>
      {message && <div className={message.includes('Error') ? 'error-msg' : 'success-msg'}>{message}</div>}
      <form onSubmit={handleSubmit} className="transfer-form">
        <div className="form-group">
          <label htmlFor="asset">Asset:</label>
          <input
            type="text"
            id="asset"
            name="asset"
            value={formData.asset}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fromBase">From Base:</label>
          <select id="fromBase" name="fromBase" value={formData.fromBase} onChange={handleChange} required>
            <option value="">Select Source Base</option>
            <option value="base1">Base 1</option>
            <option value="base2">Base 2</option>
            <option value="base3">Base 3</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="toBase">To Base:</label>
          <select id="toBase" name="toBase" value={formData.toBase} onChange={handleChange} required>
            <option value="">Select Destination Base</option>
            <option value="base1">Base 1</option>
            <option value="base2">Base 2</option>
            <option value="base3">Base 3</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
          />
        </div>
        <div className="form-group">
          <label htmlFor="reason">Reason:</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="4"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Initiate Transfer'}
        </button>
      </form>
    </div>
  );
};

export default Transfers;

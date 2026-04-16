import React, { useState } from 'react';
import { purchasesAPI } from '../services/api';
import './Purchases.css';

const Purchases = () => {
  const [formData, setFormData] = useState({
    asset: '',
    base: '',
    quantity: '',
    unitCost: '',
    vendor: '',
    reference: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await purchasesAPI.create(formData);
      setMessage('Purchase recorded successfully!');
      setFormData({
        asset: '',
        base: '',
        quantity: '',
        unitCost: '',
        vendor: '',
        reference: '',
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error recording purchase: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="purchases-container">
      <h1>Record Purchase</h1>
      {message && <div className={message.includes('Error') ? 'error-msg' : 'success-msg'}>{message}</div>}
      <form onSubmit={handleSubmit} className="purchase-form">
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
          <label htmlFor="base">Base:</label>
          <select id="base" name="base" value={formData.base} onChange={handleChange} required>
            <option value="">Select Base</option>
            <option value="base1">Base 1</option>
            <option value="base2">Base 2</option>
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
          <label htmlFor="unitCost">Unit Cost:</label>
          <input
            type="number"
            id="unitCost"
            name="unitCost"
            value={formData.unitCost}
            onChange={handleChange}
            required
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label htmlFor="vendor">Vendor:</label>
          <input
            type="text"
            id="vendor"
            name="vendor"
            value={formData.vendor}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reference">Reference:</label>
          <input
            type="text"
            id="reference"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Recording...' : 'Record Purchase'}
        </button>
      </form>
    </div>
  );
};

export default Purchases;

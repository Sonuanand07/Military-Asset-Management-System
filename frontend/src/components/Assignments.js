import React, { useState } from 'react';
import { assignmentsAPI } from '../services/api';
import './Assignments.css';

const Assignments = () => {
  const [formData, setFormData] = useState({
    asset: '',
    base: '',
    assignedTo: '',
    quantity: '',
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
      const assignmentData = {
        ...formData,
        assignedTo: { name: formData.assignedTo },
      };
      await assignmentsAPI.create(assignmentData);
      setMessage('Asset assigned successfully!');
      setFormData({
        asset: '',
        base: '',
        assignedTo: '',
        quantity: '',
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error assigning asset: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assignments-container">
      <h1>Assign Assets</h1>
      {message && <div className={message.includes('Error') ? 'error-msg' : 'success-msg'}>{message}</div>}
      <form onSubmit={handleSubmit} className="assignment-form">
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
          <label htmlFor="assignedTo">Assigned To:</label>
          <input
            type="text"
            id="assignedTo"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            placeholder="Personnel Name"
            required
          />
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
        <button type="submit" disabled={loading}>
          {loading ? 'Assigning...' : 'Assign Asset'}
        </button>
      </form>
    </div>
  );
};

export default Assignments;

import React, { useState, useEffect } from 'react';
import { dashboardAPI, purchasesAPI, transfersAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ base: '', startDate: '', endDate: '' });
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [popup, setPopup] = useState(false);
  const [purchaseData, setPurchaseData] = useState([]);
  const [transferData, setTransferData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getSummary(
        filters.base,
        filters.startDate,
        filters.endDate
      );
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNetMovementClick = async (asset) => {
    setSelectedAsset(asset);
    try {
      const purchases = await purchasesAPI.getAll({ asset: asset.id });
      const transfers = await transfersAPI.getAll();
      setPurchaseData(purchases.data || []);
      setTransferData(transfers.data || []);
    } catch (error) {
      console.error('Error fetching detailed data:', error);
    }
    setPopup(true);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!data) return <div className="error">Error loading dashboard</div>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="filters">
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          placeholder="Start Date"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          placeholder="End Date"
        />
        <select value={filters.base} onChange={(e) => setFilters({ ...filters, base: e.target.value })}>
          <option value="">All Bases</option>
          <option value="base1">Base 1</option>
          <option value="base2">Base 2</option>
        </select>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Opening Balance</h3>
          <p className="value">{data.totals.totalOpeningBalance}</p>
        </div>
        <div className="summary-card">
          <h3>Total Closing Balance</h3>
          <p className="value">{data.totals.totalClosingBalance}</p>
        </div>
        <div className="summary-card">
          <h3>Total Net Movement</h3>
          <p className="value">{data.totals.totalNetMovement}</p>
        </div>
        <div className="summary-card">
          <h3>Total Assigned</h3>
          <p className="value">{data.totals.totalAssigned}</p>
        </div>
        <div className="summary-card">
          <h3>Total Expended</h3>
          <p className="value">{data.totals.totalExpended}</p>
        </div>
      </div>

      <table className="assets-table">
        <thead>
          <tr>
            <th>Asset Name</th>
            <th>Type</th>
            <th>Opening Balance</th>
            <th>Closing Balance</th>
            <th>Net Movement</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.summary.map((asset) => (
            <tr key={asset.id}>
              <td>{asset.name}</td>
              <td>{asset.type}</td>
              <td>{asset.openingBalance}</td>
              <td>{asset.closingBalance}</td>
              <td>
                <button
                  className="net-movement-btn"
                  onClick={() => handleNetMovementClick(asset)}
                >
                  {asset.netMovement}
                </button>
              </td>
              <td>
                <button className="detail-btn">View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {popup && selectedAsset && (
        <div className="modal" onClick={() => setPopup(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setPopup(false)}>&times;</span>
            <h2>Net Movement Details - {selectedAsset.name}</h2>
            <div className="modal-body">
              <div className="section">
                <h3>Purchases</h3>
                {purchaseData.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Quantity</th>
                        <th>Unit Cost</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseData.map((p) => (
                        <tr key={p._id}>
                          <td>{new Date(p.purchaseDate).toLocaleDateString()}</td>
                          <td>{p.quantity}</td>
                          <td>${p.unitCost}</td>
                          <td>${p.totalCost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No purchases</p>
                )}
              </div>
              <div className="section">
                <h3>Transfers</h3>
                {transferData.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transferData.map((t) => (
                        <tr key={t._id}>
                          <td>{new Date(t.transferDate).toLocaleDateString()}</td>
                          <td>{t.fromBase?.name}</td>
                          <td>{t.toBase?.name}</td>
                          <td>{t.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No transfers</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

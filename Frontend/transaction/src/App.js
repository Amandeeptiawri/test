import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/transactions';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ title: '', type: '', amount: '' });
  const [editingId, setEditingId] = useState(null);

  // Fetching transactions
  const fetchTransactions = async () => {
    const response = await axios.get(API_URL);
    setTransactions(response.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Handle form submission (Add or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
    
      await axios.put(`${API_URL}/${editingId}`, form);
      setEditingId(null);
    } else {
   
      await axios.post(API_URL, form);
    }
    setForm({ title: '', type: '', amount: '' });
    fetchTransactions();
  };

  // Handle delete
  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTransactions();
  };

  // Handle edit
  const handleEdit = (transaction) => {
    setForm({
      title: transaction.title,
      type: transaction.type,
      amount: transaction.amount,
    });
    setEditingId(transaction.id);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Transaction Manager</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          required
        >
          <option value="">Select Type</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Add'} Transaction</button>
      </form>

      <table border="1" width="100%" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Title</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.title}</td>
              <td>{transaction.type}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.date}</td>
              <td>{transaction.total}</td>
              <td>
                <button onClick={() => handleEdit(transaction)}>Edit</button>
                <button onClick={() => handleDelete(transaction.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
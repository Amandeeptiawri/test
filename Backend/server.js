const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let transactions = []; 
let total = 0; 

// Getting all transactions
app.get('/transactions', (req, res) => {
  res.json(transactions);
});


// Adding new transaction
app.post('/transactions', (req, res) => {
  const { title, type, amount } = req.body;
  const id = transactions.length + 1;
  const date = new Date().toLocaleDateString();

  const amountValue = parseFloat(amount);
  if (type === 'credit') {
    total += amountValue;
  } else if (type === 'debit') {
    total -= amountValue;
  }

  const transaction = { id, title, type, amount: amountValue, date, total };
  transactions.push(transaction);

  res.status(201).json(transaction);
});

// Updating transaction
app.put('/transactions/:id', (req, res) => {
  const { id } = req.params;
  const { title, type, amount } = req.body;

  const transaction = transactions.find((tx) => tx.id === parseInt(id));
  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found' });
  }

  // Updating total balance
  const oldAmount = transaction.amount;
  if (transaction.type === 'credit') total -= oldAmount;
  else total += oldAmount;

  const newAmount = parseFloat(amount);
  if (type === 'credit') total += newAmount;
  else total -= newAmount;

 
  transaction.title = title;
  transaction.type = type;
  transaction.amount = newAmount;
  transaction.total = total;

  res.json(transaction);
});

// Deleting transaction
app.delete('/transactions/:id', (req, res) => {
  const { id } = req.params;

  const index = transactions.findIndex((tx) => tx.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ message: 'Transaction not found' });
  }

  const [deleted] = transactions.splice(index, 1);

  // Updating total balance
  if (deleted.type === 'credit') total -= deleted.amount;
  else total += deleted.amount;

  res.json({ message: 'Transaction deleted', deleted });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const customers = [];

const getBalance = (statement) => {
  const balance = statement.reduce((acc, operation) => {
    if (operation.type === "credit") {
      return acc + operation.amount;
    } else {
      return acc - operation.amount;
    }
  }, 0);
  return balance;
};
const autenticationAccountByCpf = (req, res, next) => {
  const { cpf } = req.headers;
  const customer = customers.find((customer) => customer.cpf === cpf);
  if (!customer) {
    return res.status(400).json({ error: "The customer is not registered" });
  }
  req.customer = customer;
  return next();
};
app.get("/statement", autenticationAccountByCpf, (req, res) => {
  const { customer } = req;
  return res.json(customer.statement);
});
app.get("/statement/date", autenticationAccountByCpf, (req, res) => {
  const { customer } = req;
  const { date } = req.query;

  const dateFormat = new Date(date + " 00:00");
  const statement = customer.statement.filter(
    (statement) =>
      statement.created_at.toDateString() ===
      new Date(dateFormat).toDateString()
  );

  return res.json(statement);
});
app.get("/account", autenticationAccountByCpf, (req, res) => {
  const { customer } = req
  return res.status(200).json(customer)
})
app.get("/balance", autenticationAccountByCpf, (req, res) => {
  const { customer } = req
  const balance = getBalance(customer.statement)
  return res.status(200).json(customer)

})
app.post("/withdraw", autenticationAccountByCpf, (req, res) => {
  const { amount } = req.body;
  const { customer } = req;
  const balance = getBalance(customer.statement);
  if (balance < amount) {
    return res.status(400).json({ error: "Insufficient balance!" });
  }
  const statementOperation = {
    amount,
    created_at: new Date(),
    type: "debit",
  };
  customer.statement.push(statementOperation);
  return res.status(201).send();
});
app.post("/account", (req, res) => {
  const { cpf, name } = req.body;
  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );
  if (customerAlreadyExists) {
    return res.status(400).json({ error: "Customer already exists" });
  }
  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: [],
  });
  return res.status(201).send();
});
app.post("/deposit", autenticationAccountByCpf, (req, res) => {
  const { description, amount } = req.body;
  const { customer } = req;
  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit",
  };

  customer.statement.push(statementOperation);
  return res.status(200).send();
});
app.put('/account', autenticationAccountByCpf, (req, res) => {
  const { name } = req.body
  const { customer } = req

  customer.name = name

  return res.status(201).send()
})
app.delete("/account", autenticationAccountByCpf, (req, res) => {
  const { customer } = req
  customers.splice(customer, 1)
  return res.status(200).json(customers)
})

app.listen(3333, () => console.log("ouvindo na porta 3333"));

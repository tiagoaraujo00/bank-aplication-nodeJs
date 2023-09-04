const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const customers = [];

const autenticationAccountByCpf = (req, res, next) => {
  const { cpf } = req.headers
  const customer = customers.find((customer) => customer.cpf === cpf)
  if(!customer) {
    return res.status(400).json({ error: 'The customer is not registered' })
  }
  req.customer = customer
  return next()
}

app.get("/statement/", autenticationAccountByCpf, (req, res) => {
  const { customer } = req
  return res.json(customer.statement)
})
app.post("/account", (req, res) => {
  const { cpf, name } = req.body;
  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );
  if(customerAlreadyExists) {
    return res.status(400).json({ error: "Customer already exists" })
  }
  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: [],
  });
  return res.status(201).send();
});


app.listen(3333, () => console.log("ouvindo na porta 3333"));

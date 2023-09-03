const express = require('express')
const { v4: uuidv4 } = require('uuid')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const customers = []

app.post('/account', (req, res) => {
  const id = uuidv4()
  const { cpf, name } = req.body
  customers.push({
    cpf,
    name,
    id,
    statement: []
  })
  return res.status(201).send()
})

app.listen(3333, () => console.log('ouvindo na porta 3333'))
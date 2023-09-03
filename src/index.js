const express = require('express')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/account', (req, res) => {
  const { cpf, name } = request.body
})

app.listen(3333, () => console.log('ouvindo na porta 3333'))
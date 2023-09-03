const express = require('express')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/courses', (_request, response) => {
  return response.json(['Curso 01', 'Curso 02', 'Curso 03'])
})
app.post('/courses', (request, response) => {
  const { body } = request
  console.log(body);
  return response.json(['Curso 01', 'Curso 02', 'Curso 03', 'Curso 04'])
})

app.listen(3333, () => console.log('ouvindo na porta 3333'))
const express = require('express')
const app = express()
app.listen(3000, console.log('Server Encendido'))

const { obtenerInventario, obtenerInventarioPorFiltros, obtenerTotal } = require('./consultas')

app.get('/joyas', async (req, res) => {
  try {
    const queryStrings = req.query
    const joyas = await obtenerInventario(queryStrings)
    const HATEOAS = await prepararHATEOAS(joyas)
    res.json(HATEOAS)
  } catch (error) {
    res.status(500).send(error)
  }
})

app.get('/joyas/filtros', async (req, res) => {
  try {
    const queryStrings = req.query
    const joyas = await obtenerInventarioPorFiltros(queryStrings)
    res.json(joyas)
  } catch (error) {
    res.status(500).send(error)
  }
})


const prepararHATEOAS = (joyas) => {
  const results = joyas.map((m) => {
    return {
      name: m.nombre,
      href: `/joyas/joya/${m.id}`,
    }
  }).slice(0, 4)
  
  const totalJoyas = joyas.length
   
   const stockTotal = joyas.length
  const HATEOAS = {
    totalJoyas,
    stockTotal,
    results
  }
  return HATEOAS
}

app.get("*", (req, res) => {
  res.status(404).send("Esta ruta no existe")
})
const { Pool } = require("pg");
const format = require('pg-format');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "1234",
    database: "joyas",
    port: 5432,
    allowExitOnIdle: true
});

const obtenerInventario = async ({ limits = 'all', order_by = "id_ASC", page = 0 }) => {
    const [campo, direccion] = order_by.split("_")
    var offset = 0
    if (limits === 'all') {
        offset = page * 0
        console.log(offset)
    } else {
        offset = page * limits
        console.log(offset)
    }
    //(page - 1) * limits

    const formattedQuery = format('SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s', campo, direccion, limits, offset);

    const { rows: joyas } = await pool.query(formattedQuery)
    return joyas
}

const obtenerInventarioPorFiltros = async ({ precio_max, precio_min, categoria, metal }) => {
    let filtros = []
    const values = []
    const agregarFiltro = (campo, comparador, valor) => {
        values.push(valor)
        const { length } = filtros
        filtros.push(`${campo} ${comparador} $${length + 1}`)
    }
    if (precio_max) agregarFiltro('precio', '<=', precio_max)
    if (precio_min) agregarFiltro('precio', '>=', precio_min)
    if (categoria) agregarFiltro('categoria', '>=', categoria)
    if (metal) agregarFiltro('metal', '>=', metal) 
    let consulta = "SELECT * FROM inventario"
    if (filtros.length > 0) {
        filtros = filtros.join(" AND ")
        consulta += ` WHERE ${filtros}`
    }
    const { rows: joyas } = await pool.query(consulta, values)
    return joyas
}

const obtenerTotal =async ()=>{
    let consulta = "SELECT count(*) FROM inventario" 
    const { rows: total } = await pool.query(consulta)
    return total
}



module.exports = { obtenerInventario, obtenerInventarioPorFiltros, obtenerTotal}
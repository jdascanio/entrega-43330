const socket = io()

function listadoProductos (listado) {
    const divProductos = document.getElementById('productos')
    divProductos.innerHTML=""
    listado.forEach((item) => {
        let elemento = document.createElement('div')
        elemento.innerHTML = `<div class="card">
        <ul>
            <li class="title">${item.title}</li>
            <li class="description">${item.description}</li>
            <li class="price">Precio:$${item.price}</li>
            <li class="stock">Stock:${item.stock}</li>
            <li class="code">Código:${item.code} / id: ${item.id}</li>
        </ul>
    </div>
        `
        divProductos.append(elemento)
    });
}

socket.on ('update', (data)=>{
    listadoProductos (data)
})
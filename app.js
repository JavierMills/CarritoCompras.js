const cards = document.querySelector('#cards');
const elementos = document.querySelector('#elementos');
const footer = document.querySelector('#footer');
const templateCard =document.querySelector('#template-card').content;
const templateFooter = document.querySelector('#template-footer').content
const templateCarrito = document.querySelector('#template-carrito').content
const fragment = document.createDocumentFragment();
let carrito = {}
document.addEventListener('DOMContentLoaded', () => {
    fetchData();

    if(localStorage.getItem ('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'));
        pintarCarrito()
    }
})

cards.addEventListener('click', e => {
    addCarrito(e)
})

elementos.addEventListener ('click', e => {
    btnAccion(e)
})


const fetchData = async () =>{
    try {
        const res = await fetch('base.json');
        const data = await res.json();
        // console.log(data);
        pintarCards(data)
    } catch (error) {
        console.log(error);
    }
}
const pintarCards = data =>{
    console.log(data);
        data.forEach(producto =>{
            templateCard.querySelector('h5').textContent = producto.title
            templateCard.querySelector('p').textContent =producto.precio
            templateCard.querySelector('img').setAttribute('src', producto.thumbnailUrl);
            templateCard.querySelector('.btn-outline-warning').dataset.id = producto.id
            const clone = templateCard.cloneNode(true)
            fragment.appendChild(clone);

        })
        cards.appendChild(fragment);
}

const addCarrito = e => {

    // console.log(e.target)
    // console.log(e.target.classList.contains('btn-success'));
    if(e.target.classList.contains('btn-outline-warning')){
    setCarrito(e.target.parentElement);
    }
    e.stopPropagation();
    
}
const setCarrito = objeto =>{
//   console.log(objeto);
  const producto = {
      id: objeto.querySelector('.btn-outline-warning').dataset.id,
      title: objeto.querySelector('h5').textContent,
      precio: objeto.querySelector('p').textContent,
      cantidad : 1
  }
  if(carrito.hasOwnProperty(producto.id)){
      producto.cantidad = carrito [producto.id].cantidad + 1
  }

  carrito[producto.id] = {...producto}

//   console.log(producto);
  pintarCarrito();
}

const pintarCarrito = () => {
    // console.log(carrito);
    elementos.innerHTML =''
    Object.values(carrito).forEach( producto => {
        templateCarrito.querySelector ('th').textContent = producto.id
        templateCarrito.querySelectorAll ('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll ('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector ('.btn-warning').dataset.id = producto.id
        templateCarrito.querySelector ('.btn-primary').dataset.id = producto.id
        templateCarrito.querySelector ('span').textContent = producto.cantidad * producto.precio

        const clone  = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)

    })
    elementos.appendChild(fragment);

    pintarFooter ();

    localStorage.setItem('carrito', JSON.stringify(carrito))
    

}

const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
    footer.innerHTML =`
    <th scope="row" colspan="5">Carrito vacío - Comience a comprar!</th>

    
    `

    return
    }
    const nCantidad = Object.values(carrito).reduce((acumulado, {cantidad}) => acumulado + cantidad ,0)
    const nPrecio = Object.values(carrito).reduce((acumulado, {cantidad, precio}) => acumulado + cantidad * precio ,0)

    templateFooter.querySelectorAll('td')[0].textContent= nCantidad
    templateFooter.querySelector('span').textContent= nPrecio


    
    console.log(nPrecio);
    // console.log('hola fer');

    const clone  = templateFooter.cloneNode(true)
    fragment.appendChild(clone);
    footer.appendChild(fragment);
    // console.log(clone);
    const Vaciar = document.getElementById('vaciar-carrito');
    Vaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}
 const btnAccion = e => {
     console.log(e.target);
     if(e.target.classList.contains('btn-warning')){
        //  carrito[e.target.dataset.id]
        //  console.log(carrito[e.target.dataset.id]);
         const producto  = carrito[e.target.dataset.id]
         producto.cantidad = producto.cantidad +1
         carrito[e.target.dataset.id] = {...producto}
         pintarCarrito()
     }
     if(e.target.classList.contains('btn-primary')){
        // console.log(carrito[e.target.dataset.id]);
        const producto  = carrito[e.target.dataset.id]
        producto.cantidad = producto.cantidad - 1
        if(producto.cantidad === 0 ){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
     }
     e.stopPropagation();
    }
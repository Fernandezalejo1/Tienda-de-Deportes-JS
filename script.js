document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('products-container');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutForm = document.getElementById('checkout-form');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const closeModalButtons = document.querySelectorAll('.close');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            displayProducts(products);
            attachEventListeners(products);
        })
        .catch(error => console.error('Error al cargar los productos:', error));

    function displayProducts(products) {
        productsContainer.innerHTML = '';
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Agregar al Carrito</button>
            `;
            productsContainer.appendChild(productDiv);
        });
    }

    function attachEventListeners(products) {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.target.getAttribute('data-id'));
                const product = products.find(p => p.id === productId);
                addToCart(product);
            });
        });

        cartBtn.addEventListener('click', () => {
            cartModal.style.display = 'block';
            updateCart();
        });

        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                cartModal.style.display = 'none';
                checkoutModal.style.display = 'none';
            });
        });

        checkoutForm.addEventListener('submit', event => {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            alert(`Gracias por tu compra, ${name}! Te enviaremos un email a ${email}.`);
            cart = [];
            updateCart();
            saveCartToStorage();
            checkoutModal.style.display = 'none';
        });

        clearCartBtn.addEventListener('click', () => {
            cart = [];
            updateCart();
            saveCartToStorage();
        });

        document.getElementById('checkout-btn').addEventListener('click', () => {
            checkoutModal.style.display = 'block';
        });
    }

    function addToCart(product) {
        cart.push(product);
        updateCart();
        saveCartToStorage();
    }

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <p>${item.name} - $${item.price.toFixed(2)}</p>
                <button data-index="${index}" class="remove-item">Eliminar</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        totalPriceElement.textContent = total.toFixed(2);

        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                removeFromCart(index);
            });
        });
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCart();
        saveCartToStorage();
    }

    function saveCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    updateCart();
});

let basket = [];
let basketPrices = [];
let amounts = [];


function render() {
    renderPizzas();
    loadBasket();
}


function generatePizzaHtml(pizza) {
    let toppingsHtml = '';
    for (let i = 0; i < pizza.toppings.length; i++) {
        toppingsHtml += pizza.toppings[i];
        if (i < pizza.toppings.length - 1) {
            toppingsHtml += ', ';
        }
    }
    return createPizzaElement(pizza.name, toppingsHtml, pizza.price);
}


function createPizzaElement(name, toppingsHtml, price) {
    return `
    <div class="categorie-pizza">
        <div class="pizzas">
            <div>
                <h2>${name}</h2>
                <p>Toppings: ${toppingsHtml}</p>
                <h3>${price.toFixed(2)}€</h3>
            </div>
            <div>
                <img onclick="addToBasket('${name}', ${price}, 1)" class="plus-icon" src="./img/plus.png" alt="">
            </div>
        </div>
    </div>
`;
}


function renderPizzas() {
    const dishesElement = document.getElementById('dishes');
    for (let i = 0; i < pizzas.length; i++) {
        const pizzaHtml = generatePizzaHtml(pizzas[i]);
        dishesElement.innerHTML += pizzaHtml;
    }
}


function addToBasket(name, price, amount) {
    const index = basket.findIndex(item => item.name === name);
    if (index !== -1) {
        amounts[index] += amount;
    } else {
        basket.push({
            name,
            price
        });
        basketPrices.push(price);
        amounts.push(amount);
    }
    renderBasket();
    hideBasket()
}


function hideBasket() {
    const fillBasket = document.getElementById('fillBasket');
    fillBasket.classList.remove('fill-basket')
    fillBasket.classList.add('d-none')
}


function renderBasket() {
    const basketSelected = document.getElementById('basketSelected');
    basketSelected.innerHTML = '';

    let totalPrice = 0;

    for (let i = 0; i < basket.length; i++) {
        const item = basket[i];
        const price = basketPrices[i];
        const amount = amounts[i];

        totalPrice += price * amount;

        basketSelected.innerHTML += renderBasketItem(item, price, amount, i);
    }

    basketSelected.innerHTML += renderTotalPrice(totalPrice);
    saveBasket();
}


function renderBasketItem(item, price, totalAmount, index) {
    const totalPriceForItem = price * totalAmount;

    return `
    <div class="selected-food">
        <b>${totalAmount} x</b>
        <b>${item.name}</b>
        <b>${totalPriceForItem.toFixed(2)} €</b>
    </div>
    <div class="plus-minus-container">
        <div onclick="addFood(${index})" id="plus" class="plus-minus-button"><img class="icon" src="./img/plus.png" alt=""></div>
        <div>${totalAmount}</div>
        <div onclick="removeFood(${index})" id="minus" class="plus-minus-button"><img class="icon" src="./img/minus.png"></div>        
    </div>
`;
}


function renderTotalPrice(totalPrice) {
    const minOrderValueText = getMinOrderValueText(totalPrice);
    const minOrderValueDiv = (minOrderValueText !== '') ?
        `<div class="min-order" id="minOrderValue"><p>${minOrderValueText}</p></div>` :
        '';

    return `
    <div class="totalprice">
        <div class="prices"><p>Zwischensumme</p> <p>${totalPrice.toFixed(2)} €</p></div>
        <div class="prices"><p>Lieferkosten</p><p>Kostenlos</p></div>
        <div class="prices"><b>Zwischensumme</b> <b>${totalPrice.toFixed(2)} €</b></div>
        ${minOrderValueDiv}
        <div class="pay"><button class="pay-button" onclick="sendOrder()">Bezahlen ${totalPrice.toFixed(2)}</button></div>
    </div>
    `;
}


function removeFood(index) {
    if (amounts[index] >= 2) {
        amounts[index] -= 1;
    } else {
        basket.splice(index, 1);
        basketPrices.splice(index, 1);
        amounts.splice(index, 1);
    }

    saveBasket();
    renderBasket();
}


function addFood(index) {
    amounts[index] += 1;
    
    saveBasket();
    renderBasket();
}


function getMinOrderValueText(totalPrice) {
    if (totalPrice < 25) {
        return `Benötigter Betrag, um den Mindestbestellwert zu erreichen: ${(25 - totalPrice).toFixed(2)} €`;
    } else {
        return '';
    }
}


function sendOrder() {
    const minOrderValue = 25;
    let totalPrice = 0;
    for (let i = 0; i < basket.length; i++) {
        totalPrice += basketPrices[i] * amounts[i];
    }
    if (totalPrice >= minOrderValue) {
        function clearBasket() {
            basket = [];
            basketPrices = [];
            amounts = [];
            renderBasket();
        }
        clearBasket();
        alert('Danke für ihre Bestellung.');
    } else {
        alert('Mindestbestellwert nicht erreicht!');
    }
}


function openBasket() {
    document.getElementById('left').classList.add('d-none');
    document.getElementById('header').classList.add('d-none');
    document.getElementById('footer').classList.add('d-none');
    document.getElementById('basketButton').classList.add('d-none');
    document.getElementById('closeBasket').classList.remove('d-none');
    document.getElementById('basketDelivery').classList.remove('d-none');
    document.getElementById('right').classList.remove('d-none');

    addBasketStyle();
}


function addBasketStyle() {
    if (!document.getElementById('basketStyle')) {
        let style = document.createElement('style');
        style.id = 'basketStyle';
        style.type = 'text/css';
        style.innerHTML = `
            @media (max-width: 1000px) {
                #right {
                    display: block !important;
                    width: 100%;
                }
            }
        `;
        document.getElementsByTagName('head')[0].appendChild(style);
    }
}


function closeBasket() {
    document.getElementById('left').classList.remove('d-none');
    document.getElementById('header').classList.remove('d-none');
    document.getElementById('footer').classList.remove('d-none');
    document.getElementById('basketButton').classList.remove('d-none');
    document.getElementById('closeBasket').classList.add('d-none');

    let styleElement = document.getElementById('basketStyle');
    if (styleElement) {
        styleElement.remove();
    }

    render();
}


function openBurgerMenu() {
    document.getElementById('burgerMenu').classList.remove('d-none')
}


function closeBurgerMenu() {
    document.getElementById('burgerMenu').classList.add('d-none')
}


function saveBasket() {
    let basketData = JSON.stringify({ basket, basketPrices, amounts });
    localStorage.setItem('basket', basketData);
}


function loadBasket() {
    let basketData = localStorage.getItem('basket');
    if (basketData) {
        let parsedBasketData = JSON.parse(basketData);
        basket = parsedBasketData.basket;
        basketPrices = parsedBasketData.basketPrices;
        amounts = parsedBasketData.amounts;

        renderBasketItems();
        renderBasket();
    }

    updateFillBasketElement();
}


function renderBasketItems() {
    for (let i = 0; i < basket.length; i++) {
        renderBasketItem(basket[i], basketPrices[i], amounts[i], i);
    }
}


function updateFillBasketElement() {
    const fillBasketElement = document.getElementById('fillBasket');
    if (basket.length === 0) {
        fillBasketElement.classList.remove('d-none');
        fillBasketElement.classList.add('fill-basket');
    } else {
        fillBasketElement.classList.add('d-none');
        fillBasketElement.classList.remove('fill-basket');
    }
}

// Fungsi inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    loadItemsFromStorage();
    autoDate();
    document.getElementById('add-item').addEventListener('click', addItem);
    document.getElementById('clear-item').addEventListener('click', clearAllItems);
    document.getElementById('item-list').addEventListener('input', (e) => {
        if (e.target.matches('input')) {
            calculateTotalPrice();
            saveItemsToStorage();
        }
    });
});

function autoDate() {
    const date = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    const formattedDate = date.toLocaleDateString('id-ID', options);
    document.getElementById('date').textContent = formattedDate;
}

function addItem() {
    const itemlist = document.getElementById('item-list');
    const counter = itemlist.querySelectorAll('.item-list').length + 1;

    const newItem = document.createElement('div');
    newItem.className = 'item-list';
    newItem.dataset.id = counter;

    newItem.innerHTML = `
        <label for="item-${counter}">${counter}</label>
        <input type="text" name="desc-${counter}" id="desc-${counter}">
        <input type="number" name="price-${counter}" id="price-${counter}">
        <input type="number" class="qty" name="qty-${counter}" id="qty-${counter}" value="1" min="1">
        <button class="delete-item" onclick="deleteItem(${counter})">×</button>
    `;

    itemlist.appendChild(newItem);
    saveItemsToStorage();
}

function calculateTotalPrice() {
    const items = document.querySelectorAll('.item-list');
    let total = 0;

    items.forEach(item => {
        const priceInput = item.querySelector('input[type="number"][name^="price"]');
        const qtyInput = item.querySelector('input[type="number"].qty');
        const price = parseFloat(priceInput.value) || 0;
        const qty = parseInt(qtyInput.value) || 0;
        total += price * qty;
    });

    document.getElementById('total-price').textContent = total;
}

function deleteItem(id) {
    const itemToDelete = document.querySelector(`.item-list[data-id='${id}']`);
    if (itemToDelete) {
        itemToDelete.remove();
        updateLabels();
        calculateTotalPrice();
        saveItemsToStorage();
    }
}

function updateLabels() {
    const items = document.querySelectorAll('.item-list');
    items.forEach((item, index) => {
        const newCounter = index + 1;
        const label = item.querySelector('label');
        const deleteButton = item.querySelector('button.delete-item');

        item.dataset.id = newCounter;
        label.textContent = newCounter;
        label.setAttribute('for', `item-${newCounter}`);
        item.querySelector('input[type="text"]').name = `desc-${newCounter}`;
        item.querySelector('input[type="text"]').id = `desc-${newCounter}`;
        item.querySelector('input[type="number"][name^="price"]').name = `price-${newCounter}`;
        item.querySelector('input[type="number"][name^="price"]').id = `price-${newCounter}`;
        item.querySelector('input[type="number"].qty').name = `qty-${newCounter}`;
        item.querySelector('input[type="number"].qty').id = `qty-${newCounter}`;
        deleteButton.setAttribute('onclick', `deleteItem(${newCounter})`);
    });
}

function saveItemsToStorage() {
    const items = [];
    document.querySelectorAll('.item-list').forEach(item => {
        const descInput = item.querySelector('input[type="text"]');
        const priceInput = item.querySelector('input[type="number"][name^="price"]');
        const qtyInput = item.querySelector('input[type="number"].qty');

        if (descInput && priceInput && qtyInput) {
            items.push({
                desc: descInput.value,
                price: priceInput.value,
                qty: qtyInput.value
            });
        }
    });
    localStorage.setItem('shopItems', JSON.stringify(items));
}

function loadItemsFromStorage() {
    const items = JSON.parse(localStorage.getItem('shopItems') || '[]');
    const itemlist = document.getElementById('item-list');
    
    // Clear existing items except the header
    const header = itemlist.querySelector('.item-list-header');
    itemlist.innerHTML = '';
    if (header) {
        itemlist.appendChild(header);
    }

    if (items.length === 0) {
        // Add a default item if storage is empty
        addItem();
    } else {
        items.forEach((item, idx) => {
            const counter = idx + 1;
            const newItem = document.createElement('div');
            newItem.className = 'item-list';
            newItem.dataset.id = counter;

            newItem.innerHTML = `
                <label for="item-${counter}">${counter}</label>
                <input type="text" name="desc-${counter}" id="desc-${counter}" value="${item.desc}">
                <input type="number" name="price-${counter}" id="price-${counter}" value="${item.price}">
                <input type="number" class="qty" name="qty-${counter}" id="qty-${counter}" value="${item.qty}" min="1">
                <button class="delete-item" onclick="deleteItem(${counter})">×</button>
            `;
            itemlist.appendChild(newItem);
        });
    }
    calculateTotalPrice();
}

function clearAllItems() {
    localStorage.removeItem('shopItems');
    const itemlist = document.getElementById('item-list');
    const header = itemlist.querySelector('.item-list-header');
    itemlist.innerHTML = '';
    if (header) {
        itemlist.appendChild(header);
    }
    addItem(); // Add a single empty item
    calculateTotalPrice();
}

function printToPrinter() {
    window.print();
}

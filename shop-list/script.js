// Fungsi inisialisasi
autoDateField = document.getElementById('date');
document.getElementById('price-1').addEventListener('input', calculateTotalPrice);
document.getElementById('qty-1').addEventListener('input', calculateTotalPrice);


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

// Panggil fungsi autoDate saat halaman dimuat
document.addEventListener('DOMContentLoaded', autoDate);


function addItem() {
    const itemlist = document.getElementById('item-list');
    const counter = itemlist.childElementCount + 1; // Hitung jumlah elemen anak dan tambahkan 1 untuk elemen baru

    // Buat elemen div baru untuk item
    const newItem = document.createElement('div');
    newItem.className = 'item-list';

    // Tambahkan elemen label
    const label = document.createElement('label');
    label.setAttribute('for', `item-${counter}`);
    label.textContent = counter;

    // Tambahkan input untuk deskripsi
    const descInput = document.createElement('input');
    descInput.type = 'text';
    descInput.name = `desc-${counter}`;
    descInput.id = `desc-${counter}`;

    // Tambahkan input untuk harga
    const priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.name = `price-${counter}`;
    priceInput.id = `price-${counter}`;
    priceInput.addEventListener('input', calculateTotalPrice);

    // Tambahkan input jumlah item
    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.classList.add('qty');
    qtyInput.name = `qty-${counter}`;
    qtyInput.id = `qty-${counter}`;
    qtyInput.value = 1;
    qtyInput.min = 1;
    qtyInput.addEventListener('input', calculateTotalPrice);

    // Tambahkan tombol buang item
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-item');
    deleteButton.id = `delete-${counter}`;
    deleteButton.innerHTML = '×';
    deleteButton.addEventListener('click', () => deleteItem(counter));

    // Masukkan elemen-elemen ke dalam div baru
    newItem.appendChild(label);
    newItem.appendChild(descInput);
    newItem.appendChild(priceInput);
    newItem.appendChild(qtyInput);
    newItem.appendChild(deleteButton);

    // Tambahkan div baru ke dalam item-list
    itemlist.appendChild(newItem);

    updateLabels(); // Perbarui label dan ID setelah item ditambahkan
    saveItemsToStorage(); // Simpan data ke localStorage
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

function deleteItem(counter) {
    const itemToDelete = document.getElementById(`delete-${counter}`).parentElement;
    itemToDelete.remove();
    updateLabels(); // Perbarui label dan ID setelah item dihapus
    calculateTotalPrice(); // Hitung ulang total harga
}

function updateLabels() {
    const items = document.querySelectorAll('.item-list');
    items.forEach((item, index) => {
        const label = item.querySelector('label');
        const priceInput = item.querySelector('input[type="number"][name^="price"]');
        const qtyInput = item.querySelector('input[type="number"].qty');
        const descInput = item.querySelector('input[type="text"]');
        const deleteButton = item.querySelector('button.delete-item');

        const newCounter = index + 1; // Perbarui nomor urut
        label.textContent = newCounter;
        label.setAttribute('for', `item-${newCounter}`);
        descInput.name = `desc-${newCounter}`;
        descInput.id = `desc-${newCounter}`;
        priceInput.name = `price-${newCounter}`;
        priceInput.id = `price-${newCounter}`;
        qtyInput.name = `qty-${newCounter}`;
        qtyInput.id = `qty-${newCounter}`;
        deleteButton.id = `delete-${newCounter}`;

        // Hapus event listener lama dan tambahkan yang baru
        deleteButton.replaceWith(deleteButton.cloneNode(true));
        const newDeleteButton = item.querySelector('button.delete-item');
        newDeleteButton.addEventListener('click', () => deleteItem(newCounter));
    });
}

// Simpan data ke localStorage
function saveItemsToStorage() {
    const items = [];
    document.querySelectorAll('.item-list').forEach(item => {
        items.push({
            desc: item.querySelector('input[type="text"]').value,
            price: item.querySelector('input[type="number"][name^="price"]').value,
            qty: item.querySelector('input[type="number"].qty').value
        });
    });
    localStorage.setItem('shopItems', JSON.stringify(items));
}

// Muat data dari localStorage
function loadItemsFromStorage() {
    const items = JSON.parse(localStorage.getItem('shopItems') || '[]');
    const itemlist = document.getElementById('item-list');
    itemlist.innerHTML = ''; // Kosongkan dulu
    items.forEach((item, idx) => {
        const counter = idx + 1;
        const newItem = document.createElement('div');
        newItem.className = 'item-list';

        const label = document.createElement('label');
        label.setAttribute('for', `item-${counter}`);
        label.textContent = counter;

        const descInput = document.createElement('input');
        descInput.type = 'text';
        descInput.name = `desc-${counter}`;
        descInput.id = `desc-${counter}`;
        descInput.value = item.desc;

        const priceInput = document.createElement('input');
        priceInput.type = 'number';
        priceInput.name = `price-${counter}`;
        priceInput.id = `price-${counter}`;
        priceInput.value = item.price;
        priceInput.addEventListener('input', () => {
            calculateTotalPrice();
            saveItemsToStorage();
        });

        const qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.classList.add('qty');
        qtyInput.name = `qty-${counter}`;
        qtyInput.id = `qty-${counter}`;
        qtyInput.value = item.qty;
        qtyInput.min = 1;
        qtyInput.addEventListener('input', () => {
            calculateTotalPrice();
            saveItemsToStorage();
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-item');
        deleteButton.id = `delete-${counter}`;
        deleteButton.innerHTML = '×';
        deleteButton.addEventListener('click', () => deleteItem(counter));

        newItem.appendChild(label);
        newItem.appendChild(descInput);
        newItem.appendChild(priceInput);
        newItem.appendChild(qtyInput);
        newItem.appendChild(deleteButton);

        itemlist.appendChild(newItem);
    });
    calculateTotalPrice();
}

// Hapus semua data dari localStorage dan halaman
function clearAllItems() {
    localStorage.removeItem('shopItems');
    const itemlist = document.getElementById('item-list');
    itemlist.innerHTML = `
        <div class="item-list-header">
            <label for="no">No</label>
            <label for="item">Nama Item</label>
            <label for="price">Harga</label>
            <label for="qty">Jumlah</label>
        </div>
        <div class="item-list">
            <label for="item-1">1</label>
            <input type="text" name="desc-1" id="desc-1">
            <input type="number" name="price-1" id="price-1">
            <input type="number" class="qty" name="qty-1" id="qty-1" value="1" min="1">
            <button class="delete-item" id="delete-1" onclick="deleteItem(1)">×</button>
        </div>
    `;
    calculateTotalPrice();
}

// Tambahkan pemanggilan saveItemsToStorage pada perubahan data
document.addEventListener('input', function(e) {
    if (
        e.target.matches('input[type="text"]') ||
        e.target.matches('input[type="number"][name^="price"]') ||
        e.target.matches('input[type="number"].qty')
    ) {
        saveItemsToStorage();
    }
});

// Fungsi untuk mencetak ke printer
function printToPrinter() {
    window.print();
}
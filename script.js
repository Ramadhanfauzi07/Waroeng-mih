document.addEventListener('DOMContentLoaded', () => {
    const UNIT_PRICE = 8000; // Rp 8.000 per gelas
    const PHONE_NUMBER = '6289605673133'; // +62 896-0567-3133
    const STORE_ADDRESS = 'Jl. Pahlawan, Gasol, Kec. Cugenang, Kabupaten Cianjur, Jawa Barat 43252, Indonesia';

    let quantity = 1;

    const formatRupiah = (amount) => {
        return 'Rp ' + amount.toLocaleString('id-ID') + ',00';
    };

    // 1. Tambahkan badge status jam operasional di header (07.00 - 20.00 WIB)
    const header = document.querySelector('header');
    if (header) {
        const now = new Date();
        const hour = now.getHours();
        const isOpen = hour >= 7 && hour < 20;

        const badge = document.createElement('div');
        badge.className = `status-badge ${isOpen ? '' : 'closed'}`;
        badge.innerHTML = `
            <span class="status-dot"></span>
            <span>${isOpen ? 'Buka Sekarang • Siap Kirim' : 'Tutup Sementara • Buka Pukul 07.00'}</span>
        `;
        header.appendChild(badge);
    }

    // 2. Tambahkan kalkulator jumlah gelas sederhana di bagian produk unggulan
    const heroSection = document.querySelector('.section.hero');
    const orderBox = document.createElement('div');
    orderBox.className = 'order-box';
    orderBox.innerHTML = `
        <div><strong>Hitung Perkiraan Pesanan:</strong></div>
        <div class="qty-control">
            <button type="button" class="qty-btn" id="decreaseQty" aria-label="Kurangi jumlah">-</button>
            <span class="qty-value" id="qtyDisplay">1</span>
            <button type="button" class="qty-btn" id="increaseQty" aria-label="Tambah jumlah">+</button>
            <span>gelas</span>
        </div>
        <p class="total-text" id="totalDisplay">Subtotal: ${formatRupiah(UNIT_PRICE)}</p>
        <small style="color: #52606d;">*Belum termasuk ongkos kirim sesuai jarak.</small>
    `;

    const priceEl = heroSection ? heroSection.querySelector('.price') : null;
    if (priceEl) {
        priceEl.insertAdjacentElement('afterend', orderBox);
    }

    const qtyDisplay = document.getElementById('qtyDisplay');
    const totalDisplay = document.getElementById('totalDisplay');
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');

    const updateOrderSummary = () => {
        if (qtyDisplay) qtyDisplay.textContent = quantity;
        if (totalDisplay) {
            totalDisplay.textContent = `Subtotal: ${formatRupiah(quantity * UNIT_PRICE)}`;
        }
    };

    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            if (quantity > 1) {
                quantity -= 1;
                updateOrderSummary();
            }
        });
    }

    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            quantity += 1;
            updateOrderSummary();
        });
    }

    // 3. Tombol Pesan Sekarang (WhatsApp dengan jumlah pesanan + konfirmasi) & Salin Alamat
    const orderBtn = document.querySelector('.contact .btn');
    if (orderBtn) {
        orderBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const total = formatRupiah(quantity * UNIT_PRICE);
            const message = `Halo WARUNG AMIH, saya ingin pesan *Air Kelapa Murni* sebanyak *${quantity} gelas* (Subtotal: ${total}). Mohon info ongkos kirimnya ya.`;
            const waUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;

            alert(`Terima kasih! Pesanan Anda (${quantity} gelas - ${total}) akan diarahkan ke WhatsApp/telepon WARUNG AMIH.`);
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        });

        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'btn btn-secondary';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i> Salin Alamat';

        const actionGroup = document.createElement('div');
        actionGroup.className = 'action-group';
        orderBtn.parentNode.insertBefore(actionGroup, orderBtn);
        actionGroup.appendChild(orderBtn);
        actionGroup.appendChild(copyBtn);

        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(STORE_ADDRESS);
                const originalHtml = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Alamat Tersalin!';
                setTimeout(() => {
                    copyBtn.innerHTML = originalHtml;
                }, 2000);
            } catch {
                alert('Alamat: ' + STORE_ADDRESS);
            }
        });
    }
});

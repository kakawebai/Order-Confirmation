document.addEventListener('DOMContentLoaded', () => {
    // State
    let products = [];
    let editingId = null;
    let tempImageBase64 = null;
    let currentCurrency = '$';
    let currentCurrencyCode = 'USD';

    // DOM Elements
    const dom = {
        // Form Inputs
        languageSelect: document.getElementById('languageSelector'),
        customerInput: document.getElementById('customerNameInput'),
        customerNameDisplay: document.getElementById('customerNameDisplay'),
        dateInput: document.getElementById('orderDate'),
        currencySelect: document.getElementById('currencySelector'),
        imageFitSelect: document.getElementById('imageFitSelector'),
        discountInput: document.getElementById('discountInput'),
        priceSymbol: document.getElementById('priceCurrencySymbol'),
        imageInput: document.getElementById('productImage'),
        imagePreviewBox: document.getElementById('imagePreviewBox'),
        titleInput: document.getElementById('productTitle'),
        priceInput: document.getElementById('productPrice'),
        qtyInput: document.getElementById('productQty'),
        noteInput: document.getElementById('productNote'),
        
        // Preview Text Labels
        previewTitle: document.getElementById('previewTitle'),
        labelCustomer: document.getElementById('labelCustomer'),
        labelDate: document.getElementById('labelDate'),
        labelTotalItems: document.getElementById('labelTotalItems'),
        labelOriginalPrice: document.getElementById('labelOriginalPrice'),
        labelDiscount: document.getElementById('labelDiscount'),
        labelTotalAmount: document.getElementById('labelTotalAmount'),
        
        // Total Display
        totalCurrencyCode: document.getElementById('totalCurrencyCode'),
        totalCurrencySymbol: document.getElementById('totalCurrencySymbol'),
        originalPriceRow: document.getElementById('originalPriceRow'),
        originalCurrencyCode: document.getElementById('originalCurrencyCode'),
        originalCurrencySymbol: document.getElementById('originalCurrencySymbol'),
        originalAmount: document.getElementById('originalAmount'),
        discountRow: document.getElementById('discountRow'),
        discountPercent: document.getElementById('discountPercent'),
        
        // Buttons
        addBtn: document.getElementById('addProductBtn'),
        updateBtn: document.getElementById('updateProductBtn'),
        cancelBtn: document.getElementById('cancelEditBtn'),
        clearAllBtn: document.getElementById('clearAllBtn'),
        saveBtn: document.getElementById('saveBtn'),
        saveWhatsAppBtn: document.getElementById('saveWhatsAppBtn'),

        // Lists/Display
        productList: document.getElementById('productList'),
        previewItems: document.getElementById('previewItems'),
        currentDate: document.getElementById('currentDate'),
        totalCount: document.getElementById('totalCount'),
        totalAmount: document.getElementById('totalAmount'),
        captureArea: document.getElementById('captureArea')
    };

    // Translations
    const translations = {
        'en': {
            title: 'Order Confirmation',
            customer: 'Customer',
            date: 'Date',
            totalItems: 'Total Items:',
            originalPrice: 'Original Price:',
            discount: 'Discount:',
            totalAmount: 'Total Amount:'
        },
        'zh-CN': {
            title: '订单确认',
            customer: '客户',
            date: '日期',
            totalItems: '商品总数:',
            originalPrice: '原价:',
            discount: '折扣:',
            totalAmount: '合计金额:'
        },
        'zh-TW': {
            title: '訂單確認',
            customer: '客戶',
            date: '日期',
            totalItems: '商品總數:',
            originalPrice: '原價:',
            discount: '折扣:',
            totalAmount: '合計金額:'
        },
        'ar': {
            title: 'تأكيد الطلب',
            customer: 'العميل',
            date: 'التاريخ',
            totalItems: 'إجمالي العناصر:',
            originalPrice: 'السعر الأصلي:',
            discount: 'الخصم:',
            totalAmount: 'المبلغ الإجمالي:'
        },
        'ja': {
            title: '注文確認書',
            customer: '顧客',
            date: '日付',
            totalItems: '合計点数:',
            originalPrice: '元値:',
            discount: '割引:',
            totalAmount: '合計金額:'
        },
        'ko': {
            title: '주문 확인서',
            customer: '고객',
            date: '날짜',
            totalItems: '총 수량:',
            originalPrice: '원래 가격:',
            discount: '할인:',
            totalAmount: '총 금액:'
        },
        'ru': {
            title: 'Подтверждение заказа',
            customer: 'Клиент',
            date: 'Дата',
            totalItems: 'Всего товаров:',
            originalPrice: 'Исходная цена:',
            discount: 'Скидка:',
            totalAmount: 'Итоговая сумма:'
        },
        'fr': {
            title: 'Confirmation de commande',
            customer: 'Client',
            date: 'Date',
            totalItems: 'Articles au total:',
            originalPrice: 'Prix original:',
            discount: 'Remise:',
            totalAmount: 'Montant total:'
        },
        'de': {
            title: 'Auftragsbestätigung',
            customer: 'Kunde',
            date: 'Datum',
            totalItems: 'Gesamtartikel:',
            originalPrice: 'Originalpreis:',
            discount: 'Rabatt:',
            totalAmount: 'Gesamtbetrag:'
        },
        'es': {
            title: 'Confirmación de pedido',
            customer: 'Cliente',
            date: 'Fecha',
            totalItems: 'Artículos totales:',
            originalPrice: 'Precio original:',
            discount: 'Descuento:',
            totalAmount: 'Importe total:'
        },
        'it': {
            title: 'Conferma d\'ordine',
            customer: 'Cliente',
            date: 'Data',
            totalItems: 'Articoli totali:',
            originalPrice: 'Prezzo originale:',
            discount: 'Sconto:',
            totalAmount: 'Importo totale:'
        }
    };

    // Initialize Date
    const now = new Date();
    dom.currentDate.textContent = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Event Listeners
    dom.customerInput.addEventListener('input', () => {
        const val = dom.customerInput.value.trim();
        if (val) {
            dom.customerNameDisplay.textContent = val;
            dom.customerNameDisplay.parentElement.style.visibility = 'visible';
        } else {
            dom.customerNameDisplay.textContent = '';
            dom.customerNameDisplay.parentElement.style.visibility = 'hidden';
        }
    });
    // Init state
    dom.customerNameDisplay.parentElement.style.visibility = 'hidden';
    dom.dateInput.addEventListener('input', () => {
        dom.currentDate.textContent = dom.dateInput.value;
    });
    dom.languageSelect.addEventListener('change', handleLanguageChange);
    dom.currencySelect.addEventListener('change', handleCurrencyChange);
    dom.imageFitSelect.addEventListener('change', render);
    dom.discountInput.addEventListener('input', updateTotals);
    dom.imageInput.addEventListener('change', handleImageUpload);

    // Initialize Buttons
    dom.addBtn.addEventListener('click', addProduct);
    dom.updateBtn.addEventListener('click', updateProduct);
    dom.cancelBtn.addEventListener('click', cancelEdit);
    dom.clearAllBtn.addEventListener('click', clearAllProducts);
    dom.saveBtn.addEventListener('click', saveAsImage);
    dom.saveWhatsAppBtn.addEventListener('click', () => saveAsImage(true));
    dom.productList.addEventListener('click', handleListAction);

    // Initial sync
    handleCurrencyChange();
    handleLanguageChange();

    // --- Functions ---

    let html2canvasLoader = null;

    function loadHtml2Canvas() {
        if (window.html2canvas) return Promise.resolve(window.html2canvas);
        if (html2canvasLoader) return html2canvasLoader;

        html2canvasLoader = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.bootcdn.net/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            script.async = true;
            script.onload = () => resolve(window.html2canvas);
            script.onerror = () => reject(new Error('Failed to load html2canvas'));
            document.head.appendChild(script);
        });

        return html2canvasLoader;
    }

    function escapeHtml(input) {
        return String(input).replace(/[&<>"']/g, (ch) => {
            switch (ch) {
                case '&': return '&amp;';
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '"': return '&quot;';
                case "'": return '&#39;';
                default: return ch;
            }
        });
    }

    function handleLanguageChange() {
        const lang = dom.languageSelect.value;
        const t = translations[lang] || translations['en'];

        dom.previewTitle.textContent = t.title;
        dom.labelCustomer.textContent = t.customer;
        dom.labelDate.textContent = t.date;
        dom.labelTotalItems.textContent = t.totalItems;
        dom.labelOriginalPrice.textContent = t.originalPrice;
        dom.labelDiscount.textContent = t.discount;
        dom.labelTotalAmount.textContent = t.totalAmount;

        document.documentElement.lang = lang;
    }

    function handleCurrencyChange() {
        currentCurrency = dom.currencySelect.value;
        
        // Extract currency code from option text (e.g., "USD ($)" -> "USD")
        const selectedOption = dom.currencySelect.options[dom.currencySelect.selectedIndex];
        const text = selectedOption.text;
        currentCurrencyCode = text.split(' ')[0]; // Assumes format "CODE (SYMBOL)"

        // Update Form Label
        dom.priceSymbol.textContent = currentCurrency;
        // Update Total
        dom.totalCurrencyCode.textContent = currentCurrencyCode;
        dom.totalCurrencySymbol.textContent = currentCurrency;
        dom.originalCurrencyCode.textContent = currentCurrencyCode;
        dom.originalCurrencySymbol.textContent = currentCurrency;
        // Re-render Preview to update item prices
        render();
    }

    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                tempImageBase64 = event.target.result;
                displayImagePreview(tempImageBase64);
            };
            reader.readAsDataURL(file);
        }
    }

    function displayImagePreview(src) {
        if (src) {
            dom.imagePreviewBox.innerHTML = `<img src="${src}" alt="Preview">`;
        } else {
            dom.imagePreviewBox.innerHTML = `<span>暂无图片</span>`;
        }
    }

    function getFormData() {
        const title = dom.titleInput.value.trim();
        const price = parseFloat(dom.priceInput.value);
        const qty = parseInt(dom.qtyInput.value);
        const note = dom.noteInput.value.trim();

        if (!title) {
            alert('请输入商品标题');
            return null;
        }
        if (isNaN(price) || price < 0) {
            alert('请输入有效的单价');
            return null;
        }
        if (isNaN(qty) || qty < 1) {
            alert('请输入有效的数量');
            return null;
        }

        return {
            id: Date.now().toString(), // Simple ID generation
            image: tempImageBase64, // Can be null
            title,
            price,
            qty,
            note
        };
    }

    function addProduct() {
        const data = getFormData();
        if (data) {
            products.push(data);
            resetForm();
            render();
            // Focus on title for rapid entry
            dom.titleInput.focus();
        }
    }

    function clearAllProducts() {
        if (products.length === 0) return;
        if (confirm('确定清空所有商品吗？')) {
            products = [];
            cancelEdit();
            render();
        }
    }

    function handleListAction(e) {
        const btn = e.target.closest('.action-btn');
        if (!btn) return;

        const id = btn.dataset.id;
        if (btn.classList.contains('del-btn')) {
            if (confirm('确定删除该商品吗？')) {
                products = products.filter(p => p.id !== id);
                // If we were editing this item, cancel edit
                if (editingId === id) cancelEdit();
                render();
            }
        } else if (btn.classList.contains('edit-btn')) {
            startEdit(id);
        }
    }

    function startEdit(id) {
        const product = products.find(p => p.id === id);
        if (!product) return;

        editingId = id;
        
        // Populate form
        dom.titleInput.value = product.title;
        dom.priceInput.value = product.price;
        dom.qtyInput.value = product.qty;
        dom.noteInput.value = product.note;
        tempImageBase64 = product.image;
        displayImagePreview(tempImageBase64);

        // Switch buttons
        dom.addBtn.style.display = 'none';
        dom.updateBtn.style.display = 'inline-block';
        dom.cancelBtn.style.display = 'inline-block';
        
        // Scroll to top of form
        document.querySelector('.left-panel').scrollTop = 0;
    }

    function updateProduct() {
        if (!editingId) return;

        const data = getFormData(); // This gets new ID, we need to keep old ID
        if (data) {
            const index = products.findIndex(p => p.id === editingId);
            if (index !== -1) {
                products[index] = { ...data, id: editingId };
                cancelEdit(); // Reset UI state
                render();
            }
        }
    }

    function cancelEdit() {
        editingId = null;
        resetForm();
        dom.addBtn.style.display = 'inline-block';
        dom.updateBtn.style.display = 'none';
        dom.cancelBtn.style.display = 'none';
    }

    function resetForm() {
        dom.titleInput.value = '';
        dom.priceInput.value = '';
        dom.qtyInput.value = '1';
        dom.noteInput.value = '';
        dom.imageInput.value = ''; // Reset file input
        tempImageBase64 = null;
        displayImagePreview(null);
    }

    function render() {
        renderProductList();
        renderPreview();
        updateTotals();
    }

    function renderProductList() {
        dom.productList.innerHTML = '';
        products.forEach(p => {
            const item = document.createElement('div');
            item.className = 'list-item';
            // Use current currency symbol
            const symbol = dom.totalCurrencySymbol.textContent;
            const safeTitle = escapeHtml(p.title);
            
            item.innerHTML = `
                <img src="${p.image || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPjwvc3ZnPg=='}">
                <div class="list-item-info">
                    <div class="list-item-title">${safeTitle}</div>
                    <div class="list-item-desc">${symbol}${p.price.toFixed(2)} x ${p.qty}</div>
                </div>
                <div class="list-actions">
                    <button class="action-btn edit-btn" data-id="${p.id}">编辑</button>
                    <button class="action-btn del-btn" data-id="${p.id}">删除</button>
                </div>
            `;
            dom.productList.appendChild(item);
        });

        // Toggle Clear All Button
        if (dom.clearAllBtn) {
            dom.clearAllBtn.style.display = products.length > 0 ? 'block' : 'none';
        }
    }

    function renderPreview() {
        dom.previewItems.innerHTML = '';
        
        if (products.length === 0) {
            dom.previewItems.innerHTML = '<div class="empty-state">No items added</div>';
            return;
        }

        products.forEach(p => {
            const subtotal = p.price * p.qty;
            const item = document.createElement('div');
            item.className = 'preview-item';
            const safeTitle = escapeHtml(p.title);
            const safeNote = escapeHtml(p.note);
            
            // Default placeholder if no image
            const imgSrc = p.image || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YwZjBmMCIvPjwvc3ZnPg==';

            const isContain = dom.imageFitSelect.value === 'contain';
            const imgHtml = isContain 
                 ? `<img src="${imgSrc}" class="preview-img-contain" style="width: 160px; height: auto; object-fit: contain; border-radius: 4px; flex-shrink: 0; display: block; margin-right: 15px;">`
                 : `<div class="preview-img" style="background-image: url('${imgSrc}'); background-size: cover; margin-right: 15px;"></div>`;

            item.innerHTML = `
                ${imgHtml}
                <div class="preview-details" style="flex: 1; min-width: 0;">
                    <div>
                        <div class="preview-title">${safeTitle}</div>
                        ${p.note ? `<div class="preview-note">${safeNote}</div>` : ''}
                    </div>
                    <div class="preview-price-row">
                        <span class="price">${currentCurrency}${p.price.toFixed(2)} x ${p.qty}</span>
                        <span class="subtotal">${currentCurrency}${subtotal.toFixed(2)}</span>
                    </div>
                </div>
            `;
            dom.previewItems.appendChild(item);
        });
    }

    function updateTotals() {
        const totalQty = products.reduce((sum, p) => sum + p.qty, 0);
        const totalAmt = products.reduce((sum, p) => sum + (p.price * p.qty), 0);
        const rawPercent = parseFloat(dom.discountInput.value);
        const percent = isNaN(rawPercent) || rawPercent < 0 ? 0 : Math.min(100, rawPercent);
        const appliedDiscount = totalAmt * (percent / 100);
        const finalAmt = Math.max(0, totalAmt - appliedDiscount);
        const shouldShowDiscount = dom.discountInput.value.trim() !== '' && percent > 0;
        
        dom.totalCount.textContent = totalQty;
        dom.originalAmount.textContent = totalAmt.toFixed(2);
        dom.discountPercent.textContent = `-${percent}%`;
        dom.totalAmount.textContent = finalAmt.toFixed(2);
        
        dom.originalPriceRow.style.display = shouldShowDiscount ? 'flex' : 'none';
        dom.discountRow.style.display = shouldShowDiscount ? 'flex' : 'none';
    }

    function getExportScale() {
        // 既然用户要求超高清，我们将基础倍率设为 4，最高允许 6
        const base = Math.max(window.devicePixelRatio || 1, 4);
        return Math.min(6, base);
    }

    async function saveAsImage(isWhatsApp = false) {
        const btn = isWhatsApp ? dom.saveWhatsAppBtn : dom.saveBtn;
        const originalText = btn.textContent;
        
        btn.textContent = '生成超清图片中...';
        btn.disabled = true;

        let html2canvasFn;
        try {
            html2canvasFn = await loadHtml2Canvas();
        } catch (err) {
            btn.textContent = originalText;
            btn.disabled = false;
            alert('截图组件加载失败，请重试');
            return;
        }

        // WhatsApp 专用格式使用更高的倍率 (5倍)，普通保存使用 getExportScale (4-6倍)
        const scale = isWhatsApp ? 5 : getExportScale();
        
        // 记录原始样式以便恢复
        const originalWidth = dom.captureArea.style.width;
        const originalMaxWidth = dom.captureArea.style.maxWidth;
        
        // 在开始截图前，暂时固定宽度以确保布局一致性
        dom.captureArea.style.width = '450px';
        dom.captureArea.style.maxWidth = '450px';

        html2canvasFn(dom.captureArea, {
            scale: scale,
            useCORS: true, 
            backgroundColor: '#ffffff',
            width: 450, // 明确指定截图宽度为 450px
            windowWidth: 450, // 模拟窗口宽度
            onclone: (clonedDoc) => {
                const clonedCaptureArea = clonedDoc.getElementById('captureArea');
                if (clonedCaptureArea) {
                    clonedCaptureArea.style.width = '450px';
                    clonedCaptureArea.style.maxWidth = '450px';
                    clonedCaptureArea.style.boxShadow = 'none'; // 移除投影避免边框瑕疵
                    clonedCaptureArea.style.borderRadius = '0'; // 移除圆角
                }
            }
        }).then(canvas => {
            // 恢复原始样式
            dom.captureArea.style.width = originalWidth;
            dom.captureArea.style.maxWidth = originalMaxWidth;

            const link = document.createElement('a');
            const customerName = dom.customerInput.value.trim() || 'Customer';
            const dateStr = dom.dateInput.value.trim() || new Date().toISOString().split('T')[0];
            const suffix = isWhatsApp ? '_WA' : '';
            
            const safeCustomer = customerName.replace(/[\\/:*?"<>|]/g, '_');
            const safeDate = dateStr.replace(/[\\/:*?"<>|]/g, '_');
            
            link.download = `${safeCustomer}_${safeDate}${suffix}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            btn.textContent = originalText;
            btn.disabled = false;
        }).catch(err => {
            console.error('Save failed:', err);
            // 恢复原始样式
            dom.captureArea.style.width = originalWidth;
            dom.captureArea.style.maxWidth = originalMaxWidth;
            
            alert('图片生成失败，请重试');
            btn.textContent = originalText;
            btn.disabled = false;
        });
    }
});

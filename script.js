document.addEventListener('DOMContentLoaded', () => {
    // State
    let products = [];
    let editingId = null;
    let tempImageBase64 = null;
    let currentCurrency = '$';
    let currentCurrencyCode = 'USD';
    let activeMode = 'order';
    let invoiceItems = [];
    let invoice = {
        number: '',
        date: '',
        dueDate: '',
        fromName: '',
        fromAddress: '',
        fromPhone: '',
        fromTaxId: '',
        toName: '',
        toAddress: '',
        toPhone: '',
        toTaxId: '',
        taxRate: 0,
        notes: ''
    };

    // DOM Elements
    const dom = {
        // Form Inputs
        languageSelect: document.getElementById('languageSelector'),
        customerInput: document.getElementById('customerNameInput'),
        orderCustomerGroup: document.getElementById('orderCustomerGroup'),
        customerNameDisplay: document.getElementById('customerNameDisplay'),
        dateInput: document.getElementById('orderDate'),
        orderDateGroup: document.getElementById('orderDateGroup'),
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

        orderEditor: document.getElementById('orderEditor'),
        invoiceEditor: document.getElementById('invoiceEditor'),
        invoiceNumberInput: document.getElementById('invoiceNumberInput'),
        invoiceDateInput: document.getElementById('invoiceDateInput'),
        invoiceDueDateInput: document.getElementById('invoiceDueDateInput'),
        invoiceFromNameInput: document.getElementById('invoiceFromNameInput'),
        invoiceFromAddressInput: document.getElementById('invoiceFromAddressInput'),
        invoiceFromPhoneInput: document.getElementById('invoiceFromPhoneInput'),
        invoiceFromTaxIdInput: document.getElementById('invoiceFromTaxIdInput'),
        invoiceToNameInput: document.getElementById('invoiceToNameInput'),
        invoiceToAddressInput: document.getElementById('invoiceToAddressInput'),
        invoiceToPhoneInput: document.getElementById('invoiceToPhoneInput'),
        invoiceToTaxIdInput: document.getElementById('invoiceToTaxIdInput'),
        invoiceTaxRateInput: document.getElementById('invoiceTaxRateInput'),
        invoiceNotesInput: document.getElementById('invoiceNotesInput'),
        addInvoiceItemBtn: document.getElementById('addInvoiceItemBtn'),
        invoiceItemsEditor: document.getElementById('invoiceItemsEditor'),

        invoiceMeta: document.getElementById('invoiceMeta'),
        invoiceMetaLabelNumber: document.getElementById('invoiceMetaLabelNumber'),
        invoiceMetaLabelDate: document.getElementById('invoiceMetaLabelDate'),
        invoiceMetaLabelDue: document.getElementById('invoiceMetaLabelDue'),
        invoiceNumberDisplay: document.getElementById('invoiceNumberDisplay'),
        invoiceDateDisplay: document.getElementById('invoiceDateDisplay'),
        invoiceDueDateDisplay: document.getElementById('invoiceDueDateDisplay'),
        invoiceParties: document.getElementById('invoiceParties'),
        invoiceFromTitle: document.getElementById('invoiceFromTitle'),
        invoiceToTitle: document.getElementById('invoiceToTitle'),
        invoiceFromNameDisplay: document.getElementById('invoiceFromNameDisplay'),
        invoiceFromAddressDisplay: document.getElementById('invoiceFromAddressDisplay'),
        invoiceFromPhoneDisplay: document.getElementById('invoiceFromPhoneDisplay'),
        invoiceFromTaxIdDisplay: document.getElementById('invoiceFromTaxIdDisplay'),
        invoiceToNameDisplay: document.getElementById('invoiceToNameDisplay'),
        invoiceToAddressDisplay: document.getElementById('invoiceToAddressDisplay'),
        invoiceToPhoneDisplay: document.getElementById('invoiceToPhoneDisplay'),
        invoiceToTaxIdDisplay: document.getElementById('invoiceToTaxIdDisplay'),
        invoiceTaxRow: document.getElementById('invoiceTaxRow'),
        invoiceTaxLabel: document.getElementById('invoiceTaxLabel'),
        invoiceTaxAmount: document.getElementById('invoiceTaxAmount'),
        invoiceNotesDisplay: document.getElementById('invoiceNotesDisplay'),
        
        // Buttons
        addBtn: document.getElementById('addProductBtn'),
        updateBtn: document.getElementById('updateProductBtn'),
        cancelBtn: document.getElementById('cancelEditBtn'),
        clearAllBtn: document.getElementById('clearAllBtn'),
        saveBtn: document.getElementById('saveBtn'),
        saveWhatsAppBtn: document.getElementById('saveWhatsAppBtn'),

        invoiceToggleBtn: document.getElementById('invoiceToggleBtn'),
        previewModeHeader: document.getElementById('previewModeHeader'),

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

    const invoiceTitles = {
        'en': 'Invoice',
        'zh-CN': '发票',
        'zh-TW': '發票',
        'ar': 'فاتورة',
        'ja': '請求書',
        'ko': '송장',
        'ru': 'Счёт',
        'fr': 'Facture',
        'de': 'Rechnung',
        'es': 'Factura',
        'it': 'Fattura'
    };

    const previewModeHeaders = {
        order: {
            'en': 'Order Preview',
            'zh-CN': '订单预览',
            'zh-TW': '訂單預覽',
            'ar': 'معاينة الطلب',
            'ja': '注文プレビュー',
            'ko': '주문 미리보기',
            'ru': 'Предпросмотр заказа',
            'fr': 'Aperçu de commande',
            'de': 'Bestellvorschau',
            'es': 'Vista previa del pedido',
            'it': 'Anteprima ordine'
        },
        invoice: {
            'en': 'Invoice Preview',
            'zh-CN': '发票预览',
            'zh-TW': '發票預覽',
            'ar': 'معاينة الفاتورة',
            'ja': '請求書プレビュー',
            'ko': '송장 미리보기',
            'ru': 'Предпросмотр счёта',
            'fr': 'Aperçu de facture',
            'de': 'Rechnungsvorschau',
            'es': 'Vista previa de factura',
            'it': 'Anteprima fattura'
        }
    };

    const invoiceColumns = {
        'en': { item: 'Item', qty: 'Qty', unit: 'Unit', amount: 'Amount' },
        'zh-CN': { item: '商品', qty: '数量', unit: '单价', amount: '小计' },
        'zh-TW': { item: '商品', qty: '數量', unit: '單價', amount: '小計' },
        'ar': { item: 'الصنف', qty: 'الكمية', unit: 'سعر الوحدة', amount: 'المبلغ' },
        'ja': { item: '商品', qty: '数量', unit: '単価', amount: '小計' },
        'ko': { item: '상품', qty: '수량', unit: '단가', amount: '소계' },
        'ru': { item: 'Товар', qty: 'Кол-во', unit: 'Цена', amount: 'Сумма' },
        'fr': { item: 'Article', qty: 'Qté', unit: 'PU', amount: 'Montant' },
        'de': { item: 'Artikel', qty: 'Menge', unit: 'Stückpreis', amount: 'Betrag' },
        'es': { item: 'Artículo', qty: 'Cant.', unit: 'Unit.', amount: 'Importe' },
        'it': { item: 'Articolo', qty: 'Qtà', unit: 'Unit.', amount: 'Importo' }
    };

    const invoiceMetaLabels = {
        'en': { number: 'Number', date: 'Date', due: 'Due', tax: 'Tax', subtotal: 'Subtotal:', total: 'Total:' },
        'zh-CN': { number: '编号', date: '日期', due: '到期', tax: '税费', subtotal: '小计:', total: '合计:' },
        'zh-TW': { number: '編號', date: '日期', due: '到期', tax: '稅費', subtotal: '小計:', total: '合計:' },
        'ar': { number: 'الرقم', date: 'التاريخ', due: 'الاستحقاق', tax: 'الضريبة', subtotal: 'المجموع الفرعي:', total: 'الإجمالي:' },
        'ja': { number: '番号', date: '日付', due: '期日', tax: '税額', subtotal: '小計:', total: '合計:' },
        'ko': { number: '번호', date: '날짜', due: '기한', tax: '세금', subtotal: '소계:', total: '합계:' },
        'ru': { number: 'Номер', date: 'Дата', due: 'Срок', tax: 'Налог', subtotal: 'Промежуточный итог:', total: 'Итого:' },
        'fr': { number: 'N°', date: 'Date', due: 'Échéance', tax: 'Taxe', subtotal: 'Sous-total:', total: 'Total:' },
        'de': { number: 'Nr.', date: 'Datum', due: 'Fällig', tax: 'Steuer', subtotal: 'Zwischensumme:', total: 'Gesamt:' },
        'es': { number: 'Núm.', date: 'Fecha', due: 'Vence', tax: 'Impuesto', subtotal: 'Subtotal:', total: 'Total:' },
        'it': { number: 'N.', date: 'Data', due: 'Scadenza', tax: 'Imposta', subtotal: 'Subtotale:', total: 'Totale:' }
    };

    const invoicePartyLabels = {
        'en': { from: 'From', to: 'To' },
        'zh-CN': { from: '开票方', to: '收票方' },
        'zh-TW': { from: '開票方', to: '收票方' },
        'ar': { from: 'من', to: 'إلى' },
        'ja': { from: '差出人', to: '宛先' },
        'ko': { from: '보낸 사람', to: '받는 사람' },
        'ru': { from: 'От', to: 'Кому' },
        'fr': { from: 'De', to: 'À' },
        'de': { from: 'Von', to: 'An' },
        'es': { from: 'De', to: 'Para' },
        'it': { from: 'Da', to: 'A' }
    };

    // Initialize Date
    const now = new Date();
    dom.currentDate.textContent = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    initInvoiceDefaults();

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

    if (dom.addInvoiceItemBtn) {
        dom.addInvoiceItemBtn.addEventListener('click', addInvoiceItem);
    }
    if (dom.invoiceItemsEditor) {
        dom.invoiceItemsEditor.addEventListener('input', handleInvoiceItemChange);
        dom.invoiceItemsEditor.addEventListener('click', handleInvoiceItemClick);
    }
    bindInvoiceField(dom.invoiceNumberInput, (v) => { invoice.number = v; });
    bindInvoiceField(dom.invoiceFromNameInput, (v) => { invoice.fromName = v; });
    bindInvoiceField(dom.invoiceFromAddressInput, (v) => { invoice.fromAddress = v; });
    bindInvoiceField(dom.invoiceFromPhoneInput, (v) => { invoice.fromPhone = v; });
    bindInvoiceField(dom.invoiceFromTaxIdInput, (v) => { invoice.fromTaxId = v; });
    bindInvoiceField(dom.invoiceToNameInput, (v) => { invoice.toName = v; });
    bindInvoiceField(dom.invoiceToAddressInput, (v) => { invoice.toAddress = v; });
    bindInvoiceField(dom.invoiceToPhoneInput, (v) => { invoice.toPhone = v; });
    bindInvoiceField(dom.invoiceToTaxIdInput, (v) => { invoice.toTaxId = v; });
    bindInvoiceField(dom.invoiceNotesInput, (v) => { invoice.notes = v; });
    if (dom.invoiceDateInput) {
        dom.invoiceDateInput.addEventListener('input', () => {
            invoice.date = dom.invoiceDateInput.value;
            renderInvoicePreviewFields();
        });
    }
    if (dom.invoiceDueDateInput) {
        dom.invoiceDueDateInput.addEventListener('input', () => {
            invoice.dueDate = dom.invoiceDueDateInput.value;
            renderInvoicePreviewFields();
        });
    }
    if (dom.invoiceTaxRateInput) {
        dom.invoiceTaxRateInput.addEventListener('input', () => {
            const raw = parseFloat(dom.invoiceTaxRateInput.value);
            const rate = isNaN(raw) || raw < 0 ? 0 : Math.min(100, raw);
            invoice.taxRate = rate;
            updateTotals();
        });
    }

    if (dom.invoiceToggleBtn) {
        dom.invoiceToggleBtn.addEventListener('click', () => {
            activeMode = activeMode === 'invoice' ? 'order' : 'invoice';
            if (activeMode === 'invoice') {
                if (invoiceItems.length === 0 && products.length > 0) {
                    invoiceItems = products.map(p => ({
                        id: p.id,
                        description: p.title,
                        qty: p.qty,
                        unitPrice: p.price
                    }));
                }
                if (!invoice.toName && dom.customerInput?.value?.trim()) {
                    invoice.toName = dom.customerInput.value.trim();
                    if (dom.invoiceToNameInput) dom.invoiceToNameInput.value = invoice.toName;
                }
                if (!invoice.date && dom.dateInput?.value?.trim()) {
                    const val = dom.dateInput.value.trim();
                    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
                        invoice.date = val;
                        if (dom.invoiceDateInput) dom.invoiceDateInput.value = val;
                    }
                }
                renderInvoiceItemsEditor();
                renderInvoicePreviewFields();
            }
            applyModeUI();
        });
    }

    // Initial sync
    handleCurrencyChange();
    handleLanguageChange();
    applyModeUI();

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

        dom.previewTitle.textContent = activeMode === 'invoice' ? (invoiceTitles[lang] || invoiceTitles['en']) : t.title;
        dom.labelCustomer.textContent = t.customer;
        dom.labelDate.textContent = t.date;
        dom.labelTotalItems.textContent = t.totalItems;
        dom.labelOriginalPrice.textContent = t.originalPrice;
        dom.labelDiscount.textContent = t.discount;
        dom.labelTotalAmount.textContent = t.totalAmount;

        document.documentElement.lang = lang;
        applyModeUI();
    }

    function applyModeUI() {
        const isInvoice = activeMode === 'invoice';

        dom.captureArea.classList.toggle('invoice-mode', isInvoice);

        if (dom.orderCustomerGroup) dom.orderCustomerGroup.style.display = isInvoice ? 'none' : 'flex';
        if (dom.orderDateGroup) dom.orderDateGroup.style.display = isInvoice ? 'none' : 'flex';

        if (dom.orderEditor) dom.orderEditor.style.display = isInvoice ? 'none' : 'block';
        if (dom.invoiceEditor) dom.invoiceEditor.style.display = isInvoice ? 'block' : 'none';
        if (dom.invoiceMeta) dom.invoiceMeta.style.display = isInvoice ? 'block' : 'none';
        if (dom.invoiceParties) dom.invoiceParties.style.display = isInvoice ? 'grid' : 'none';
        if (dom.invoiceTaxRow) dom.invoiceTaxRow.style.display = 'none';
        if (dom.invoiceNotesDisplay) dom.invoiceNotesDisplay.style.display = isInvoice ? 'block' : 'none';

        if (dom.previewModeHeader) {
            const lang = dom.languageSelect?.value || 'en';
            const modeKey = isInvoice ? 'invoice' : 'order';
            dom.previewModeHeader.textContent = previewModeHeaders[modeKey]?.[lang] || previewModeHeaders[modeKey]?.['en'] || '';
        }

        if (dom.invoiceToggleBtn) {
            dom.invoiceToggleBtn.setAttribute('aria-pressed', isInvoice ? 'true' : 'false');
            dom.invoiceToggleBtn.classList.toggle('primary-btn', isInvoice);
            dom.invoiceToggleBtn.classList.toggle('secondary-btn', !isInvoice);
        }

        const lang = dom.languageSelect?.value || 'en';
        const t = translations[lang] || translations['en'];
        if (dom.previewTitle) {
            dom.previewTitle.textContent = isInvoice ? (invoiceTitles[lang] || invoiceTitles['en']) : t.title;
        }

        if (isInvoice) {
            const labels = invoiceMetaLabels[lang] || invoiceMetaLabels['en'];
            const partyLabels = invoicePartyLabels[lang] || invoicePartyLabels['en'];
            if (dom.invoiceMetaLabelNumber) dom.invoiceMetaLabelNumber.textContent = labels.number;
            if (dom.invoiceMetaLabelDate) dom.invoiceMetaLabelDate.textContent = labels.date;
            if (dom.invoiceMetaLabelDue) dom.invoiceMetaLabelDue.textContent = labels.due;
            if (dom.invoiceFromTitle) dom.invoiceFromTitle.textContent = partyLabels.from;
            if (dom.invoiceToTitle) dom.invoiceToTitle.textContent = partyLabels.to;
            if (dom.labelOriginalPrice) dom.labelOriginalPrice.textContent = labels.subtotal;
            if (dom.labelTotalAmount) dom.labelTotalAmount.textContent = labels.total;
            if (dom.invoiceTaxLabel) dom.invoiceTaxLabel.textContent = `${labels.tax} (${invoice.taxRate || 0}%):`;
            renderInvoicePreviewFields();
            renderInvoiceItemsEditor();
        }

        renderPreview();
        updateTotals();
    }

    function initInvoiceDefaults() {
        const today = new Date();
        const due = new Date(today);
        due.setDate(due.getDate() + 30);
        const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        invoice.date = fmt(today);
        invoice.dueDate = fmt(due);
        if (dom.invoiceDateInput) dom.invoiceDateInput.value = invoice.date;
        if (dom.invoiceDueDateInput) dom.invoiceDueDateInput.value = invoice.dueDate;
    }

    function bindInvoiceField(el, setter) {
        if (!el) return;
        el.addEventListener('input', () => {
            setter(el.value);
            renderInvoicePreviewFields();
        });
    }

    function addInvoiceItem() {
        invoiceItems.push({
            id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
            description: '',
            qty: 1,
            unitPrice: 0
        });
        renderInvoiceItemsEditor();
        renderPreview();
        updateTotals();
    }

    function renderInvoiceItemsEditor() {
        if (!dom.invoiceItemsEditor) return;
        if (activeMode !== 'invoice') return;

        if (invoiceItems.length === 0) {
            dom.invoiceItemsEditor.innerHTML = '<div class="empty-state" style="margin-top: 10px;">No items added</div>';
            return;
        }

        const rowsHtml = invoiceItems.map((it) => {
            const amount = (Number(it.qty) || 0) * (Number(it.unitPrice) || 0);
            return `
                <div class="invoice-edit-row" data-id="${it.id}">
                    <input class="invoice-edit-desc" type="text" value="${escapeHtml(it.description)}" data-field="description" placeholder="Description">
                    <input class="invoice-edit-qty" type="number" value="${escapeHtml(it.qty)}" data-field="qty" min="1">
                    <input class="invoice-edit-unit" type="number" value="${escapeHtml(it.unitPrice)}" data-field="unitPrice" step="0.01" min="0">
                    <div class="invoice-edit-amount">${currentCurrency}${amount.toFixed(2)}</div>
                    <button type="button" class="btn text-btn invoice-edit-remove" data-action="remove">×</button>
                </div>
            `;
        }).join('');

        dom.invoiceItemsEditor.innerHTML = `
            <div class="invoice-edit-head">
                <div>描述</div>
                <div style="text-align:right;">数量</div>
                <div style="text-align:right;">单价</div>
                <div style="text-align:right;">金额</div>
                <div></div>
            </div>
            ${rowsHtml}
        `;
    }

    function handleInvoiceItemChange(e) {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;
        const row = target.closest('.invoice-edit-row');
        if (!row) return;
        const id = row.getAttribute('data-id');
        if (!id) return;
        const field = target.getAttribute('data-field');
        if (!field) return;

        const idx = invoiceItems.findIndex(it => it.id === id);
        if (idx === -1) return;

        if (field === 'description') {
            invoiceItems[idx].description = target.value;
        } else if (field === 'qty') {
            const raw = parseInt(target.value, 10);
            if (!isNaN(raw)) invoiceItems[idx].qty = raw;
        } else if (field === 'unitPrice') {
            const raw = parseFloat(target.value);
            if (!isNaN(raw)) invoiceItems[idx].unitPrice = raw;
        }

        const qtyEl = row.querySelector('input[data-field="qty"]');
        const unitEl = row.querySelector('input[data-field="unitPrice"]');
        const qty = qtyEl ? parseFloat(qtyEl.value) : (Number(invoiceItems[idx].qty) || 0);
        const unit = unitEl ? parseFloat(unitEl.value) : (Number(invoiceItems[idx].unitPrice) || 0);
        const amount = (isNaN(qty) ? 0 : qty) * (isNaN(unit) ? 0 : unit);
        const amountEl = row.querySelector('.invoice-edit-amount');
        if (amountEl) amountEl.textContent = `${currentCurrency}${amount.toFixed(2)}`;

        renderPreview();
        updateTotals();
    }

    function handleInvoiceItemClick(e) {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;
        const action = target.getAttribute('data-action');
        if (action !== 'remove') return;
        const row = target.closest('.invoice-edit-row');
        if (!row) return;
        const id = row.getAttribute('data-id');
        if (!id) return;
        invoiceItems = invoiceItems.filter(it => it.id !== id);
        renderInvoiceItemsEditor();
        renderPreview();
        updateTotals();
    }

    function renderInvoicePreviewFields() {
        if (activeMode !== 'invoice') return;
        if (dom.invoiceNumberDisplay) dom.invoiceNumberDisplay.textContent = invoice.number || '';
        if (dom.invoiceDateDisplay) dom.invoiceDateDisplay.textContent = invoice.date || '';
        if (dom.invoiceDueDateDisplay) dom.invoiceDueDateDisplay.textContent = invoice.dueDate || '';

        if (dom.invoiceFromNameDisplay) dom.invoiceFromNameDisplay.textContent = invoice.fromName || '';
        if (dom.invoiceFromAddressDisplay) dom.invoiceFromAddressDisplay.textContent = invoice.fromAddress || '';
        if (dom.invoiceFromPhoneDisplay) dom.invoiceFromPhoneDisplay.textContent = invoice.fromPhone ? `Tel: ${invoice.fromPhone}` : '';
        if (dom.invoiceFromTaxIdDisplay) dom.invoiceFromTaxIdDisplay.textContent = invoice.fromTaxId ? `Tax: ${invoice.fromTaxId}` : '';

        if (dom.invoiceToNameDisplay) dom.invoiceToNameDisplay.textContent = invoice.toName || '';
        if (dom.invoiceToAddressDisplay) dom.invoiceToAddressDisplay.textContent = invoice.toAddress || '';
        if (dom.invoiceToPhoneDisplay) dom.invoiceToPhoneDisplay.textContent = invoice.toPhone ? `Tel: ${invoice.toPhone}` : '';
        if (dom.invoiceToTaxIdDisplay) dom.invoiceToTaxIdDisplay.textContent = invoice.toTaxId ? `Tax: ${invoice.toTaxId}` : '';

        if (dom.invoiceNotesDisplay) {
            const val = (invoice.notes || '').trim();
            dom.invoiceNotesDisplay.textContent = val;
            dom.invoiceNotesDisplay.style.display = val ? 'block' : 'none';
        }

        if (dom.invoiceTaxLabel) {
            const lang = dom.languageSelect?.value || 'en';
            const labels = invoiceMetaLabels[lang] || invoiceMetaLabels['en'];
            dom.invoiceTaxLabel.textContent = `${labels.tax} (${invoice.taxRate || 0}%):`;
        }
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

        const items = activeMode === 'invoice' ? invoiceItems : products;
        if (items.length === 0) {
            dom.previewItems.innerHTML = '<div class="empty-state">No items added</div>';
            return;
        }

        if (activeMode === 'invoice') {
            const lang = dom.languageSelect?.value || 'en';
            const cols = invoiceColumns[lang] || invoiceColumns['en'];

            const head = document.createElement('div');
            head.className = 'invoice-table-head';
            head.innerHTML = `
                <div class="c-item">${cols.item}</div>
                <div class="c-qty">${cols.qty}</div>
                <div class="c-unit">${cols.unit}</div>
                <div class="c-amount">${cols.amount}</div>
            `;
            dom.previewItems.appendChild(head);

            invoiceItems.forEach(p => {
                const subtotal = p.unitPrice * p.qty;
                const row = document.createElement('div');
                row.className = 'invoice-line';
                const safeTitle = escapeHtml(p.description);
                row.innerHTML = `
                    <div class="c-item" title="${safeTitle}">${safeTitle}</div>
                    <div class="c-qty">${p.qty}</div>
                    <div class="c-unit">${currentCurrency}${p.unitPrice.toFixed(2)}</div>
                    <div class="c-amount">${currentCurrency}${subtotal.toFixed(2)}</div>
                `;
                dom.previewItems.appendChild(row);
            });

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
        if (activeMode === 'invoice') {
            const totalQty = invoiceItems.reduce((sum, p) => sum + (Number(p.qty) || 0), 0);
            const subtotal = invoiceItems.reduce((sum, p) => sum + ((Number(p.unitPrice) || 0) * (Number(p.qty) || 0)), 0);
            const rate = Number(invoice.taxRate) || 0;
            const clampedRate = Math.max(0, Math.min(100, rate));
            const taxAmt = subtotal * (clampedRate / 100);
            const total = subtotal + taxAmt;

            dom.totalCount.textContent = totalQty;
            dom.originalAmount.textContent = subtotal.toFixed(2);
            dom.totalAmount.textContent = total.toFixed(2);

            dom.originalPriceRow.style.display = 'flex';
            dom.discountRow.style.display = 'none';

            const lang = dom.languageSelect?.value || 'en';
            const labels = invoiceMetaLabels[lang] || invoiceMetaLabels['en'];

            if (dom.invoiceTaxLabel) dom.invoiceTaxLabel.textContent = `${labels.tax} (${clampedRate}%):`;
            if (dom.invoiceTaxAmount) dom.invoiceTaxAmount.textContent = `${currentCurrency}${taxAmt.toFixed(2)}`;

            const shouldShowTax = clampedRate > 0 && taxAmt > 0;
            if (dom.invoiceTaxRow) dom.invoiceTaxRow.style.display = shouldShowTax ? 'flex' : 'none';

            return;
        }

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
            const customerName = activeMode === 'invoice'
                ? (invoice.toName || '').trim() || 'Customer'
                : dom.customerInput.value.trim() || 'Customer';
            const dateStr = activeMode === 'invoice'
                ? (invoice.date || '').trim() || new Date().toISOString().split('T')[0]
                : dom.dateInput.value.trim() || new Date().toISOString().split('T')[0];
            const suffix = isWhatsApp ? '_WA' : '';
            const modeSuffix = activeMode === 'invoice' ? '_Invoice' : '';
            
            const safeCustomer = customerName.replace(/[\\/:*?"<>|]/g, '_');
            const safeDate = dateStr.replace(/[\\/:*?"<>|]/g, '_');
            
            link.download = `${safeCustomer}_${safeDate}${modeSuffix}${suffix}.png`;
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

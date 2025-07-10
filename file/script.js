    document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONFIG & INITIALIZATION ---
    const firebaseConfig = {
        // PASTE YOUR FIREBASE CONFIG OBJECT HERE
        apiKey: "AIzaSy...YOUR_API_KEY",
        authDomain: "your-project-id.firebaseapp.com",
        databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
        projectId: "your-project-id",
        storageBucket: "your-project-id.appspot.com",
        messagingSenderId: "your-sender-id",
        appId: "1:your-app-id"
    };
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.database();
    
    let currentUser = null;
    let cartItemCount = 0;
    const PURCHASE_HIDE_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

    const dummyProducts = [
        { id: 'p1', image: 'https://via.placeholder.com/200x150?text=Smartphone', title: 'Latest Smartphone Model X', price: '₹15,999', rating: 4.5, newSeason: 'Summer 2025 Collection', detailedDescription: 'Experience the next generation of mobile technology with the Model X.', additionalImages: ['https://via.placeholder.com/600x400?text=Phone+Front', 'https://via.placeholder.com/600x400?text=Phone+Back', 'https://via.placeholder.com/600x400?text=Camera+Detail'], timeLimit: 'Ends in 2h 30m' },
        { id: 'p2', image: 'https://via.placeholder.com/200x150?text=Headphones', title: 'Noise Cancelling Headphones', price: '₹2,499', rating: 4.2, newSeason: 'Audio Gear Focus', detailedDescription: 'Immersive sound, comfortable fit for all-day listening.', additionalImages: ['https://via.placeholder.com/600x400?text=Headphones+Side', 'https://via.placeholder.com/600x400?text=Headphones+Folded'], timeLimit: 'Ends in 1d 10h' },
        { id: 'p3', image: 'https://via.placeholder.com/200x150?text=Smartwatch', title: 'Fitness Tracker Smartwatch', price: '₹3,999', rating: 4.0, newSeason: 'Fitness Tech', detailedDescription: 'Track your health and stay connected on the go.', additionalImages: ['https://via.placeholder.com/600x400?text=Watch+Face', 'https://via.placeholder.com/600x400?text=Watch+Strap'], timeLimit: 'Limited stock!' },
        { id: 'p4', image: 'https://via.placeholder.com/200x150?text=Laptop', title: 'Ultra-thin Laptop 14-inch', price: '₹45,000', rating: 4.7, newSeason: 'Work Essentials', detailedDescription: 'Lightweight and powerful for productivity.', additionalImages: ['https://via.placeholder.com/600x400?text=Laptop+Open', 'https://via.placeholder.com/600x400?text=Laptop+Closed'], timeLimit: 'Flash Sale!' }
    ];

    // --- 2. AUTHENTICATION (MODAL & FIREBASE) ---
    const authModal = document.getElementById('authModal');
    const authContainer = document.getElementById('auth-container');
    const authErrorMessage = document.getElementById('auth-error-message');

    auth.onAuthStateChanged(user => {
        currentUser = user;
        updateAuthUI(user);
        populateAllProductSections();
    });

    function updateAuthUI(user) {
        authContainer.innerHTML = '';
        if (user) {
            authContainer.innerHTML = `
                <li><span class="user-info">Hi, ${user.displayName || user.email.split('@')[0]}</span></li>
                <li><button id="logoutButton" class="auth-button">Logout</button></li>
                <li><a href="#" class="cart-icon"><i class="fas fa-shopping-cart"></i><span id="cartCount">${cartItemCount}</span></a></li>
            `;
            document.getElementById('logoutButton').addEventListener('click', () => auth.signOut());
        } else {
            authContainer.innerHTML = `
                <li><button id="loginButtonTrigger" class="auth-button">Login</button></li>
                <li><a href="#" class="cart-icon"><i class="fas fa-shopping-cart"></i><span id="cartCount">${cartItemCount}</span></a></li>
            `;
            document.getElementById('loginButtonTrigger').addEventListener('click', () => openAuthModal());
        }
        document.getElementById('cartCount').textContent = cartItemCount;
    }

    function openAuthModal(defaultForm = 'login') {
        authModal.style.display = 'flex';
        switchAuthForm(defaultForm);
    }

    function switchAuthForm(formName) {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`.auth-tab[data-form="${formName}"]`).classList.add('active');
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        document.getElementById(`${formName}Form`).classList.add('active');
        authErrorMessage.textContent = '';
    }
    
    // Auth Modal Listeners
    authModal.querySelector('.auth-close-button').addEventListener('click', () => authModal.style.display = 'none');
    document.querySelectorAll('.auth-tab').forEach(tab => tab.addEventListener('click', () => switchAuthForm(tab.dataset.form)));
    
    // Form Submission
    document.getElementById('loginForm').addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const pass = document.getElementById('loginPassword').value;
        auth.signInWithEmailAndPassword(email, pass)
            .then(() => authModal.style.display = 'none')
            .catch(err => authErrorMessage.textContent = err.message);
    });

    document.getElementById('registerForm').addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const pass = document.getElementById('registerPassword').value;
        auth.createUserWithEmailAndPassword(email, pass)
            .then(cred => {
                // Update profile with name
                return cred.user.updateProfile({ displayName: name }).then(() => {
                    // Save user info to Realtime Database
                    db.ref('users/' + cred.user.uid).set({
                        name: name,
                        email: email
                    });
                    authModal.style.display = 'none';
                });
            })
            .catch(err => authErrorMessage.textContent = err.message);
    });

    // --- 3. PRODUCT RENDERING & FILTERING ---
    async function getFilteredProducts() {
        if (!currentUser) return dummyProducts;
        const snapshot = await db.ref(`users/${currentUser.uid}/purchases`).get();
        if (!snapshot.exists()) return dummyProducts;

        const purchases = snapshot.val();
        const recentPurchaseIds = new Set();
        const now = Date.now();
        for (const key in purchases) {
            if (now - purchases[key].purchaseTimestamp < PURCHASE_HIDE_DURATION_MS) {
                recentPurchaseIds.add(purchases[key].productId);
            }
        }
        return dummyProducts.filter(p => !recentPurchaseIds.has(p.id));
    }

    async function populateAllProductSections() {
        const productsToShow = await getFilteredProducts();
        populateSlider('stillLookingSlider', productsToShow);
        populateSlider('suggestedForYouSlider', [...productsToShow].sort(() => 0.5 - Math.random()));
    }
    
    function populateSlider(sliderId, products) {
        const slider = document.getElementById(sliderId);
        slider.innerHTML = '';
        products.forEach(product => slider.appendChild(createProductCard(product)));
    }

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}"><h3>${product.title}</h3>
            <div class="price">${product.price}</div><div class="rating">${'⭐'.repeat(Math.round(product.rating))}</div>
            ${product.timeLimit ? `<div class="time-limit">${product.timeLimit}</div>` : ''}`;
        card.addEventListener('click', () => openProductModal(product));
        return card;
    }

    // --- 4. PRODUCT MODAL & PURCHASE FLOW ---
    const productModal = document.getElementById('productDetailModal');
    const productModalContent = document.getElementById('productDetailContent');
    productModal.querySelector('.auth-close-button').addEventListener('click', () => productModal.style.display = 'none');
    window.addEventListener('click', e => { if (e.target === productModal) productModal.style.display = 'none'; });

    async function openProductModal(product) {
        const relatedProducts = (await getFilteredProducts()).filter(p => p.id !== product.id).slice(0, 3);
        productModalContent.innerHTML = `
            <div class="product-image-gallery">
                <img src="${product.additionalImages[0]}" alt="${product.title}" id="mainProductImage">
                <div class="thumbnail-images">${product.additionalImages.map((img, i) => `<img src="${img}" class="${i===0 ? 'active':''}" alt="Thumbnail">`).join('')}</div>
            </div>
            <div class="product-info">
                <h2>${product.title}</h2><span class="new-season">${product.newSeason}</span>
                <div class="modal-rating">${'⭐'.repeat(Math.round(product.rating))} (${product.rating} stars)</div>
                <div class="modal-price">${product.price}</div>
                ${product.timeLimit ? `<div class="modal-time-limit">Offer: ${product.timeLimit}</div>` : ''}
                <p>${product.detailedDescription}</p><div class="modal-buttons">
                    <button class="buy-now-button"><i class="fas fa-bolt"></i> Buy Now</button>
                    <button class="add-to-cart-button"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
                </div>
                <div class="product-extra-info"><h3>More Information</h3><ul><li><i class="fas fa-truck"></i>Free Delivery</li><li><i class="fas fa-undo"></i>Easy Returns</li></ul>
                <h3>More like this</h3><div class="content-slider" style="border:none; padding:0;">
                ${relatedProducts.map(p => `<div class="content-card" style="min-width:150px;" data-product-id="${p.id}"><img src="${p.image}" style="height:100px;"><h5>${p.title}</h5></div>`).join('')}
                </div></div></div>`;

        productModal.style.display = 'flex';
        
        // Modal Event Listeners
        productModalContent.querySelector('.add-to-cart-button').addEventListener('click', () => {
            cartItemCount++;
            document.getElementById('cartCount').textContent = cartItemCount;
            alert(`${product.title} added to cart!`);
        });
        productModalContent.querySelector('.buy-now-button').addEventListener('click', () => handleBuyNow(product));
        productModalContent.querySelectorAll('.thumbnail-images img').forEach(thumb => {
            thumb.addEventListener('click', () => {
                document.getElementById('mainProductImage').src = thumb.src;
                document.querySelectorAll('.thumbnail-images img').forEach(t=>t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });
        productModalContent.querySelectorAll('.content-slider .content-card').forEach(card => card.addEventListener('click', (e) => {
            e.stopPropagation();
            openProductModal(dummyProducts.find(p => p.id === card.dataset.productId));
        }));
    }

    function handleBuyNow(product) {
        if (!currentUser) { openAuthModal(); return; }
        const numericPrice = parseFloat(product.price.replace('₹', '').replace(/,/g, ''));
        const options = {
            key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your actual Razorpay Key ID
            amount: numericPrice * 100,
            currency: "INR",
            name: "MySite E-commerce",
            description: `Purchase for ${product.title}`,
            handler: function (response){
                alert(`Payment successful!`);
                recordPurchaseInDB(product);
            },
            prefill: { name: currentUser.displayName, email: currentUser.email },
            theme: { color: "#2874f0" }
        };
        const rzp1 = new Razorpay(options);
        rzp1.on('payment.failed', response => alert(`Payment failed: ${response.error.description}`));
        rzp1.open();
    }

    function recordPurchaseInDB(product) {
        db.ref(`users/${currentUser.uid}/purchases`).push().set({
            productId: product.id,
            purchaseTimestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            productModal.style.display = 'none';
            populateAllProductSections();
        }).catch(err => console.error("Firebase write failed: ", err));
    }

    // --- 5. SLIDER & MISC INITIALIZATION ---
    function setupSlider(sliderId, prevBtnId, nextBtnId, isMain = false) {
        const slider = document.getElementById(sliderId), prev = document.getElementById(prevBtnId), next = document.getElementById(nextBtnId);
        if (isMain) {
            const images = [ 'https://via.placeholder.com/1200x280?text=Mega+Sale', 'https://via.placeholder.com/1200x280?text=New+Arrivals' ];
            slider.innerHTML = images.map(src => `<img src="${src}">`).join('');
            let idx = 0, auto = setInterval(() => next.click(), 5000);
            const move = () => slider.scrollLeft = idx * slider.clientWidth;
            next.addEventListener('click', () => { idx = (idx + 1) % images.length; move(); });
            prev.addEventListener('click', () => { idx = (idx - 1 + images.length) % images.length; move(); });
        } else {
            next.addEventListener('click', () => slider.scrollBy({ left: 300, behavior: 'smooth' }));
            prev.addEventListener('click', () => slider.scrollBy({ left: -300, behavior: 'smooth' }));
        }
    }
    
    updateAuthUI(null);
    setupSlider('mainImageSlider', 'prevImageSlide', 'nextImageSlide', true);
    setupSlider('stillLookingSlider', 'prevStillLookingSlide', 'nextStillLookingSlide');
    setupSlider('suggestedForYouSlider', 'prevSuggestedSlide', 'nextSuggestedSlide');
});

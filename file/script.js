        // Firebase Configuration - REPLACE WITH YOUR ACTUAL CONFIG
        const firebaseConfig = {
            apiKey: "YOUR_API_KEY",
            authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
            projectId: "YOUR_PROJECT_ID",
            storageBucket: "YOUR_PROJECT_ID.appspot.com",
            messagingSenderId: "YOUR_SENDER_ID",
            appId: "YOUR_APP_ID",
            databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com" // Realtime Database URL
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();
        const database = firebase.database(); // Initialize Realtime Database

        document.addEventListener('DOMContentLoaded', () => {
            // --- Top Bar Functionality ---
            const searchInput = document.getElementById('searchInput');
            const searchButton = document.getElementById('searchButton');
            const loginButton = document.getElementById('loginButton');
            const registerButton = document.getElementById('registerButton');
            const profileButton = document.getElementById('profileButton');
            const logoutButton = document.getElementById('logoutButton');
            const cartCountSpan = document.getElementById('cartCount');
            const loginMenuItem = document.getElementById('loginMenuItem');
            const registerMenuItem = document.getElementById('registerMenuItem');
            const profileMenuItem = document.getElementById('profileMenuItem');
            const logoutMenuItem = document.getElementById('logoutMenuItem');

            searchButton.addEventListener('click', () => {
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    alert(`Searching for: ${searchTerm}`);
                    // In a real app, you'd send this to a backend search API
                } else {
                    alert('Please enter a search term.');
                }
            });

            // --- Authentication Modals ---
            const loginModal = document.getElementById('loginModal');
            const registerModal = document.getElementById('registerModal');
            const closeLoginModal = document.getElementById('closeLoginModal');
            const closeRegisterModal = document.getElementById('closeRegisterModal');
            const switchToRegister = document.getElementById('switchToRegister');
            const switchToLogin = document.getElementById('switchToLogin');
            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm');
            const loginEmailInput = document.getElementById('loginEmail');
            const loginPasswordInput = document.getElementById('loginPassword');
            const registerNameInput = document.getElementById('registerName');
            const registerEmailInput = document.getElementById('registerEmail');
            const registerPasswordInput = document.getElementById('registerPassword');
            const loginErrorMessage = document.getElementById('loginErrorMessage');
            const registerErrorMessage = document.getElementById('registerErrorMessage');

            loginButton.addEventListener('click', () => {
                loginModal.style.display = 'flex';
                loginErrorMessage.textContent = ''; // Clear previous errors
            });

            registerButton.addEventListener('click', () => {
                registerModal.style.display = 'flex';
                registerErrorMessage.textContent = ''; // Clear previous errors
            });

            closeLoginModal.addEventListener('click', () => {
                loginModal.style.display = 'none';
            });
            closeRegisterModal.addEventListener('click', () => {
                registerModal.style.display = 'none';
            });

            switchToRegister.addEventListener('click', (e) => {
                e.preventDefault();
                loginModal.style.display = 'none';
                registerModal.style.display = 'flex';
                registerErrorMessage.textContent = '';
            });

            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                registerModal.style.display = 'none';
                loginModal.style.display = 'flex';
                loginErrorMessage.textContent = '';
            });

            // Firebase Login
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = loginEmailInput.value;
                const password = loginPasswordInput.value;
                try {
                    await auth.signInWithEmailAndPassword(email, password);
                    loginModal.style.display = 'none';
                    alert('Logged in successfully!');
                } catch (error) {
                    loginErrorMessage.textContent = error.message;
                    console.error('Login Error:', error.message);
                }
            });

            // Firebase Registration
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = registerNameInput.value;
                const email = registerEmailInput.value;
                const password = registerPasswordInput.value;
                try {
                    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                    await userCredential.user.updateProfile({ displayName: name });
                    registerModal.style.display = 'none';
                    alert('Registered successfully!');
                } catch (error) {
                    registerErrorMessage.textContent = error.message;
                    console.error('Registration Error:', error.message);
                }
            });

            // Logout Functionality
            logoutButton.addEventListener('click', async () => {
                try {
                    await auth.signOut();
                    alert('Logged out successfully!');
                } catch (error) {
                    console.error('Logout Error:', error.message);
                }
            });

            // Simulate cart count (will be dynamic with backend)
            let cartItemCount = 0;
            function updateCartCount() {
                cartCountSpan.textContent = cartItemCount;
            }
            updateCartCount();

            // --- Image Slider (Top Banner) ---
            const mainImageSlider = document.getElementById('mainImageSlider');
            const prevImageSlide = document.getElementById('prevImageSlide');
            const nextImageSlide = document.getElementById('nextImageSlide');

            const mainBannerImages = [
                'https://rukminim2.flixcart.com/image/312/312/xif0q/headphone/r/p/t/-original-imagspdrzrf4razp.jpeg',
                'https://rukminim2.flixcart.com/image/120/120/kmds4nk0/vehicle-indicator-light/c/g/9/set-of-4-bike-front-side-rear-smd-blue-led-light-indicator-turn-original-imagfatnzgzegkmg.jpeg',
                'https://rukminim2.flixcart.com/flap/120/120/image/f1ffa6330a602013.jpeg',
                'https://rukminim2.flixcart.com/image/120/120/kylvr0w0/shirt/u/p/t/m-1596-fs-maple-killer-original-imagasvf8qupbpuz.jpeg'
            ];

            let currentImageIndex = 0;

            function loadImageSlider() {
                mainImageSlider.innerHTML = ''; // Clear previous images
                mainBannerImages.forEach(src => {
                    const img = document.createElement('img');
                    img.src = src;
                    mainImageSlider.appendChild(img);
                });
                showImage(currentImageIndex);
            }

            function showImage(index) {
                const imageWidth = mainImageSlider.clientWidth;
                mainImageSlider.scrollLeft = index * imageWidth;
            }

            function nextImage() {
                currentImageIndex = (currentImageIndex + 1) % mainBannerImages.length;
                showImage(currentImageIndex);
            }

            function prevImage() {
                currentImageIndex = (currentImageIndex - 1 + mainBannerImages.length) % mainBannerImages.length;
                showImage(currentImageIndex);
            }

            // Auto-slide functionality
            let imageSliderInterval = setInterval(nextImage, 3000); // Change image every 5 seconds

            // Pause on hover
            mainImageSlider.addEventListener('mouseenter', () => clearInterval(imageSliderInterval));
            mainImageSlider.addEventListener('mouseleave', () => imageSliderInterval = setInterval(nextImage, 5000));

            prevImageSlide.addEventListener('click', () => {
                clearInterval(imageSliderInterval);
                prevImage();
                imageSliderInterval = setInterval(nextImage, 5000);
            });
            nextImageSlide.addEventListener('click', () => {
                clearInterval(imageSliderInterval);
                nextImage();
                imageSliderInterval = setInterval(nextImage, 5000);
            });

            // Initial load
            loadImageSlider();
            window.addEventListener('resize', () => showImage(currentImageIndex)); // Adjust on resize


            // --- Content Sliders (Still Looking For These?, Suggested For You) ---
            const dummyProducts = [
                {
                    id: 'product1',
                    image: 'https://rukminim2.flixcart.com/image/120/120/xif0q/washing-machine-new/r/b/m/-original-imah2tx7cyakc7p8.jpeg',
                    title: 'Samsung 9 kg 5 Star',
                    description: 'Bank Offer10% instant discount',
                    price: '₹15,999',
                    rating: 4.5,
                    newSeason: 'Summer 2025 Collection',
                    detailedDescription: 'Samsung 9 kg 5 Star, AI Ecobubble, Super Speed, Wi-Fi, Hygiene Steam, Digital Inverter Motor Fully Automatic Front Load Washing Machine with In-built Heater Grey  (WW90DG5U24AXTL)',
                    additionalImages: [
                        'https://rukminim2.flixcart.com/image/120/120/xif0q/washing-machine-new/r/b/m/-original-imah2tx7cyakc7p8.jpeg',
                        'https://rukminim2.flixcart.com/image/120/120/xif0q/washing-machine-new/r/b/m/-original-imah2tx7cyakc7p8.jpeg',
                        'https://rukminim2.flixcart.com/image/120/120/xif0q/washing-machine-new/r/b/m/-original-imah2tx7cyakc7p8.jpeg'
                    ],
                    timeLimit: 'Ends in 1h 30m'
                },
                {
                    id: 'product2',
                    image: 'https://via.placeholder.com/200x150?text=Wireless+Headphones',
                    title: 'Noise Cancelling Headphones',
                    description: 'Immersive sound, comfortable fit.',
                    price: '₹2,499',
                    rating: 4.2,
                    newSeason: 'Audio Gear Focus',
                    detailedDescription: 'Escape into your music with these premium noise-cancelling headphones. Ergonomically designed for long-listening comfort, they deliver rich, clear audio with deep bass. Features include touch controls, 30-hour battery life, and a foldable design for portability.',
                    additionalImages: [
                        'https://via.placeholder.com/600x400?text=Headphones+View+1',
                        'https://via.placeholder.com/600x400?text=Headphones+View+2'
                    ],
                    timeLimit: 'Ends in 1d 10h'
                },
                {
                    id: 'product3',
                    image: 'https://via.placeholder.com/200x150?text=Smartwatch',
                    title: 'Fitness Tracker Smartwatch',
                    description: 'Track your health and stay connected.',
                    price: '₹3,999',
                    rating: 4.0,
                    newSeason: 'Fitness Tech',
                    detailedDescription: 'Monitor your health and fitness goals with this advanced smartwatch. It tracks heart rate, steps, sleep, and features multiple sports modes. Receive notifications, control music, and make calls directly from your wrist. Water-resistant design.',
                    additionalImages: [
                        'https://via.placeholder.com/600x400?text=Smartwatch+View+1',
                        'https://via.placeholder.com/600x400?text=Smartwatch+View+2'
                    ],
                    timeLimit: 'Limited stock!'
                },
                {
                    id: 'product4',
                    image: 'https://via.placeholder.com/200x150?text=Laptop',
                    title: 'Ultra-thin Laptop 14-inch',
                    description: 'Lightweight and powerful for productivity.',
                    price: '₹45,000',
                    rating: 4.7,
                    newSeason: 'Back to Work Essentials',
                    detailedDescription: 'Boost your productivity with this ultra-thin and lightweight 14-inch laptop. Equipped with the latest processor, ample RAM, and a fast SSD, it handles multitasking with ease. Features a backlit keyboard and a high-resolution display.',
                    additionalImages: [
                        'https://via.placeholder.com/600x400?text=Laptop+View+1',
                        'https://via.placeholder.com/600x400?text=Laptop+View+2'
                    ],
                    timeLimit: 'Flash Sale!'
                },
                {
                    id: 'product5',
                    image: 'https://via.placeholder.com/200x150?text=Jeans',
                    title: 'Men\'s Slim Fit Jeans',
                    description: 'Comfortable and stylish denim.',
                    price: '₹1,299',
                    rating: 3.8,
                    newSeason: 'Casual Wear',
                    detailedDescription: 'Upgrade your wardrobe with these versatile slim-fit jeans. Made from high-quality denim with a hint of stretch for ultimate comfort and flexibility. Perfect for everyday wear, pair them with a t-shirt or a casual shirt.',
                    additionalImages: [
                        'https://via.placeholder.com/600x400?text=Jeans+View+1',
                        'https://via.placeholder.com/600x400?text=Jeans+View+2'
                    ],
                    timeLimit: 'New arrival discount'
                },
                {
                    id: 'product6',
                    image: 'https://via.placeholder.com/200x150?text=Coffee+Maker',
                    title: 'Automatic Coffee Maker',
                    description: 'Brew perfect coffee every morning.',
                    price: '₹3,500',
                    rating: 4.3,
                    newSeason: 'Kitchen Appliances',
                    detailedDescription: 'Start your day right with freshly brewed coffee from this automatic coffee maker. Features a programmable timer, large water reservoir, and a keep-warm function. Easy to clean and brews up to 12 cups.',
                    additionalImages: [
                        'https://via.placeholder.com/600x400?text=Coffee+Maker+View+1',
                        'https://via.placeholder.com/600x400?text=Coffee+Maker+View+2'
                    ],
                    timeLimit: 'Grab it now!'
                }
            ];

            function createProductCard(product) {
                const card = document.createElement('div');
                card.classList.add('content-card');
                card.dataset.productId = product.id; // Store product ID for detail view

                card.innerHTML = `
                    <img src="${product.image}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p>${product.description}</p>
                    <div class="price">${product.price}</div>
                    <div class="rating">${'⭐'.repeat(Math.floor(product.rating))} (${product.rating})</div>
                    ${product.timeLimit ? `<div class="time-limit" style="font-size:0.8em; color:red; margin-top:5px;">${product.timeLimit}</div>` : ''}
                `;
                return card;
            }

            function populateSlider(sliderElement, products) {
                sliderElement.innerHTML = ''; // Clear existing content
                products.forEach(product => {
                    const card = createProductCard(product);
                    sliderElement.appendChild(card);
                });
            }

            // Populate "Still Looking For These?"
            const stillLookingSlider = document.getElementById('stillLookingSlider');
            populateSlider(stillLookingSlider, dummyProducts.slice(0, 4)); // Show first 4 for this section

            // Populate "Suggested For You"
            const suggestedForYouSlider = document.getElementById('suggestedForYouSlider');
            // Randomize or pick different products for suggested
            const shuffledProducts = [...dummyProducts].sort(() => 0.5 - Math.random());
            populateSlider(suggestedForYouSlider, shuffledProducts.slice(0, 4));


            // Slider navigation for content cards
            function setupContentSlider(sliderId, prevBtnId, nextBtnId) {
                const slider = document.getElementById(sliderId);
                const prevBtn = document.getElementById(prevBtnId);
                const nextBtn = document.getElementById(nextBtnId);

                if (!slider || !prevBtn || !nextBtn) return; // Exit if elements not found

                const scrollAmount = 250; // Adjust based on card width + margin

                prevBtn.addEventListener('click', () => {
                    slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                });

                nextBtn.addEventListener('click', () => {
                    slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                });
            }

            setupContentSlider('stillLookingSlider', 'prevStillLookingSlide', 'nextStillLookingSlide');
            setupContentSlider('suggestedForYouSlider', 'prevSuggestedSlide', 'nextSuggestedSlide');


            // --- Product Detail Modal ---
            const productDetailModal = document.getElementById('productDetailModal');
            const productDetailContent = document.getElementById('productDetailContent');
            const closeButtonProductDetail = productDetailModal.querySelector('.close-button');

            // Open modal when a product card is clicked
            document.querySelectorAll('.content-card').forEach(card => {
                card.addEventListener('click', (event) => {
                    const productId = event.currentTarget.dataset.productId;
                    const product = dummyProducts.find(p => p.id === productId);

                    if (product) {
                        renderProductDetail(product);
                        productDetailModal.style.display = 'flex'; // Show modal
                    }
                });
            });

            // Close product detail modal
            closeButtonProductDetail.addEventListener('click', () => {
                productDetailModal.style.display = 'none';
            });

            window.addEventListener('click', (event) => {
                if (event.target === productDetailModal) {
                    productDetailModal.style.display = 'none';
                } else if (event.target === loginModal) {
                    loginModal.style.display = 'none';
                } else if (event.target === registerModal) {
                    registerModal.style.display = 'none';
                } else if (event.target === profileModal) {
                    profileModal.style.display = 'none';
                }
            });

            function renderProductDetail(product) {
                productDetailContent.innerHTML = `
                    <div class="product-image-gallery">
                        <img src="${product.image}" alt="${product.title}" id="mainProductImage">
                        <div class="thumbnail-images" style="display: flex; gap: 10px; margin-top: 10px;">
                            ${product.additionalImages.map((imgSrc, index) => `
                                <img src="${imgSrc}" alt="Thumbnail ${index + 1}" style="width: 80px; height: 60px; object-fit: cover; cursor: pointer; border: 1px solid #ddd;" onclick="document.getElementById('mainProductImage').src='${imgSrc}'">
                            `).join('')}
                        </div>
                    </div>
                    <div class="product-info">
                        <h2>${product.title}</h2>
                        <span class="new-season">${product.newSeason}</span>
                        <p class="short-description">${product.detailedDescription}</p>
                        <div class="modal-price">${product.price}</div>
                        <div class="modal-rating">${'⭐'.repeat(Math.floor(product.rating))} (${product.rating})</div>
                        ${product.timeLimit ? `<div class="time-limit" style="font-size:1em; color:red; margin-top:10px; font-weight:bold;">Offer: ${product.timeLimit}</div>` : ''}
                        <div class="modal-buttons">
                            <button class="buy-now-button">Buy Now</button>
                            <button class="add-to-cart-button">Add to Cart</button>
                        </div>
                        <div class="product-reviews" style="margin-top: 30px;">
                            <h3>Customer Reviews</h3>
                            <p>No reviews yet. Be the first to review!</p>
                            </div>
                        <div class="more-options" style="margin-top: 20px;">
                            <h3>More Options</h3>
                            <ul>
                                <li>Free Delivery Available</li>
                                <li>Cash on Delivery</li>
                                <li>Easy Returns</li>
                            </ul>
                        </div>
                        <div class="similar-products" style="margin-top: 30px;">
                            <h3>More products like this</h3>
                            <div class="content-slider" style="border:none; box-shadow:none;">
                                 ${dummyProducts.slice(0, 3).map(p => `
                                    <div class="content-card" style="min-width:180px; max-width:200px; margin-right:15px; cursor:pointer;" data-product-id="${p.id}">
                                        <img src="${p.image}" alt="${p.title}" style="height:120px;">
                                        <h3>${p.title}</h3>
                                        <div class="price">${p.price}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;

                // Re-attach event listeners for newly created "similar products" cards inside modal
                productDetailContent.querySelectorAll('.similar-products .content-card').forEach(card => {
                    card.addEventListener('click', (event) => {
                        const newProductId = event.currentTarget.dataset.productId;
                        const newProduct = dummyProducts.find(p => p.id === newProductId);
                        if (newProduct) {
                            renderProductDetail(newProduct); // Re-render modal with new product
                        }
                    });
                });

                // Attach event listeners for buy now/add to cart inside modal
                productDetailContent.querySelector('.add-to-cart-button').addEventListener('click', () => {
                    cartItemCount++;
                    updateCartCount();
                    alert(`${product.title} added to cart!`);
                    // In a real app, update cart in backend/local storage
                });

                // Razorpay integration for Buy Now
                productDetailContent.querySelector('.buy-now-button').addEventListener('click', async () => {
                    if (!auth.currentUser) { // Check if user is logged in
                        alert('Please log in to proceed with the purchase.');
                        loginModal.style.display = 'flex'; // Open login modal
                        return;
                    }

                    alert(`Initiating payment for ${product.title}...`);

                    try {
                        // Dummy Razorpay Order Creation - In a real app, this would be a backend call
                        // const response = await fetch('/api/create-razorpay-order', { ... });
                        // const orderData = await response.json();
                        const dummyOrderId = 'order_' + Math.random().toString(36).substr(2, 9);
                        const dummyAmount = parseFloat(product.price.replace('₹', '').replace(/,/g, '')) * 100; // Amount in paisa
                        const dummyCurrency = 'INR';

                        const options = {
                            key: 'rzp_test_YOUR_KEY_ID', // Replace with your actual Test Key ID from Razorpay Dashboard
                            amount: dummyAmount,
                            currency: dummyCurrency,
                            name: 'My E-commerce Site',
                            description: `Purchase of ${product.title}`,
                            order_id: dummyOrderId, // This would come from your backend
                            handler: async function (response) {
                                alert('Payment successful! Verifying payment...');
                                // In a real app, send payment details to your backend for verification
                                // const verifyResponse = await fetch('/api/verify-razorpay-payment', { ... });
                                // const verifyResult = await verifyResponse.json();

                                // Simulate backend verification and purchase recording
                                if (response.razorpay_payment_id) {
                                    alert('Payment verified and order placed successfully!');
                                    const currentUser = auth.currentUser;
                                    if (currentUser) {
                                        // Record purchase in Firebase Realtime Database
                                        const purchaseId = database.ref('users/' + currentUser.uid + '/purchases').push().key;
                                        const purchaseData = {
                                            productId: product.id,
                                            title: product.title,
                                            price: product.price,
                                            image: product.image,
                                            purchaseDate: firebase.database.ServerValue.TIMESTAMP, // Store server timestamp
                                            paymentId: response.razorpay_payment_id,
                                            orderId: response.razorpay_order_id || dummyOrderId // Use actual order_id if available from Razorpay
                                        };
                                        await database.ref('users/' + currentUser.uid + '/purchases/' + purchaseId).set(purchaseData);
                                        // Update profile view if modal is open
                                        if (profileModal.style.display === 'flex') {
                                            displayPurchasedProducts(currentUser);
                                        }
                                    }
                                } else {
                                    alert('Payment verification failed: Simulated error');
                                }
                            },
                            prefill: {
                                name: auth.currentUser.displayName || '',
                                email: auth.currentUser.email || '',
                                contact: '' // User's phone number if available
                            },
                            notes: {
                                address: 'Customer Address' // Add delivery address if collected
                            },
                            theme: {
                                color: '#2874f0'
                            }
                        };

                        const rzp1 = new Razorpay(options);
                        rzp1.on('payment.failed', function (response) {
                            alert(`Payment failed: ${response.error.description} (Code: ${response.error.code})`);
                            console.error('Razorpay Error:', response.error);
                        });
                        rzp1.open();

                    } catch (error) {
                        alert(`Error during payment initiation: ${error.message}`);
                        console.error('Payment Error:', error);
                    }
                });
            }

            // --- Profile Modal Functionality ---
            const profileModal = document.getElementById('profileModal');
            const closeProfileModal = document.getElementById('closeProfileModal');
            const profileNameDisplay = document.getElementById('profileNameDisplay');
            const profileEmailDisplay = document.getElementById('profileEmailDisplay');
            const editProfileButton = document.getElementById('editProfileButton');
            const profileEditForm = document.getElementById('profileEditForm');
            const editNameInput = document.getElementById('editName');
            const editPasswordInput = document.getElementById('editPassword');
            const profileEditErrorMessage = document.getElementById('profileEditErrorMessage');
            const purchasedProductsList = document.getElementById('purchasedProductsList');

            profileButton.addEventListener('click', () => {
                if (auth.currentUser) {
                    profileNameDisplay.textContent = auth.currentUser.displayName || 'N/A';
                    profileEmailDisplay.textContent = auth.currentUser.email || 'N/A';
                    editNameInput.value = auth.currentUser.displayName || '';
                    editPasswordInput.value = ''; // Clear password field
                    profileEditErrorMessage.textContent = '';
                    profileEditForm.style.display = 'none'; // Hide edit form initially
                    profileModal.style.display = 'flex';
                    displayPurchasedProducts(auth.currentUser); // Load purchases
                } else {
                    alert('Please log in to view your profile.');
                    loginModal.style.display = 'flex';
                }
            });

            closeProfileModal.addEventListener('click', () => {
                profileModal.style.display = 'none';
            });

            editProfileButton.addEventListener('click', () => {
                profileEditForm.style.display = 'block';
            });

            profileEditForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const newName = editNameInput.value.trim();
                const newPassword = editPasswordInput.value.trim();
                const user = auth.currentUser;

                if (!user) {
                    profileEditErrorMessage.textContent = 'No user logged in.';
                    return;
                }

                try {
                    if (newName && newName !== user.displayName) {
                        await user.updateProfile({ displayName: newName });
                        profileNameDisplay.textContent = newName;
                    }

                    if (newPassword) {
                        await user.updatePassword(newPassword);
                        editPasswordInput.value = ''; // Clear after successful update
                        alert('Password updated successfully. Please re-login if prompted next time.');
                    }
                    profileEditErrorMessage.textContent = '';
                    profileEditForm.style.display = 'none'; // Hide form after saving
                    alert('Profile updated successfully!');

                } catch (error) {
                    // Handle specific Firebase errors like 'auth/requires-recent-login'
                    if (error.code === 'auth/requires-recent-login') {
                        profileEditErrorMessage.textContent = 'Please log in again to update your password (for security reasons).';
                        // You might want to re-authenticate the user here
                    } else {
                        profileEditErrorMessage.textContent = error.message;
                    }
                    console.error('Profile Update Error:', error);
                }
            });

            async function displayPurchasedProducts(user) {
                purchasedProductsList.innerHTML = '<p>Loading purchases...</p>';
                try {
                    // Fetch purchases from Realtime Database
                    const snapshot = await database.ref('users/' + user.uid + '/purchases').once('value');
                    const purchases = snapshot.val();
                    let hasVisiblePurchases = false;

                    if (purchases) {
                        purchasedProductsList.innerHTML = ''; // Clear loading message
                        const today = new Date();

                        Object.values(purchases).reverse().forEach(purchase => { // Display newest first
                            const purchaseDate = new Date(purchase.purchaseDate);
                            // Set validity to 3 days (72 hours) after purchase
                            const validUntil = new Date(purchaseDate.getTime() + (3 * 24 * 60 * 60 * 1000));

                            if (today <= validUntil) { // Only show products within the 3-day window
                                hasVisiblePurchases = true;
                                const purchaseItem = document.createElement('div');
                                purchaseItem.classList.add('purchase-item');
                                purchaseItem.innerHTML = `
                                    <img src="${purchase.image}" alt="${purchase.title}">
                                    <div class="purchase-item-details">
                                        <h4>${purchase.title}</h4>
                                        <p>Purchased on: ${purchaseDate.toLocaleDateString()} at ${purchaseDate.toLocaleTimeString()}</p>
                                        <p class="price">${purchase.price}</p>
                                        <p style="color: green;">Valid until: ${validUntil.toLocaleDateString()} ${validUntil.toLocaleTimeString()}</p>
                                    </div>
                                `;
                                purchasedProductsList.appendChild(purchaseItem);
                            }
                        });
                    }

                    if (!hasVisiblePurchases) {
                        purchasedProductsList.innerHTML = '<p>No recent purchases found or all have expired.</p>';
                    }

                } catch (error) {
                    console.error('Error fetching purchases:', error);
                    purchasedProductsList.innerHTML = '<p>Error loading purchases.</p>';
                }
            }


            // --- Firebase Auth State Listener ---
            auth.onAuthStateChanged(user => {
                if (user) {
                    // User is signed in.
                    loginMenuItem.style.display = 'none';
                    registerMenuItem.style.display = 'none';
                    profileMenuItem.style.display = 'list-item';
                    logoutMenuItem.style.display = 'list-item';
                    console.log('User logged in:', user.email, user.displayName);

                    // If profile modal is open, refresh data
                    if (profileModal.style.display === 'flex') {
                        profileNameDisplay.textContent = user.displayName || 'N/A';
                        profileEmailDisplay.textContent = user.email || 'N/A';
                        editNameInput.value = user.displayName || '';
                        displayPurchasedProducts(user);
                    }

                } else {
                    // User is signed out.
                    loginMenuItem.style.display = 'list-item';
                    registerMenuItem.style.display = 'list-item';
                    profileMenuItem.style.display = 'none';
                    logoutMenuItem.style.display = 'none';
                    console.log('User logged out.');
                }
            });
        });

// Firebase Configuration - REPLACE WITH YOUR ACTUAL CONFIG
        const firebaseConfig = {
            apiKey: "AIzaSyDZBDLtZAjrS_64gKRV66h6yHazPswMynA",
            authDomain: "tast-4ce84.firebaseapp.com",
            projectId: "tast-4ce84",
            storageBucket: "tast-4ce84.firebasestorage.app",
            messagingSenderId: "198938893717",
            appId: "1:198938893717:web:6c37335e075b1a43e62a9c",
            databaseURL: "https://tast-4ce84-default-rtdb.firebaseio.com" // Realtime Database URL
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
                    Category: 'Electronics',
                    brand: 'Samsung',
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
                    Category: 'Electronics',
                    brand: 'Sony',
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
                    Category: 'Electronics',
                    brand: 'Noise',
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
                    Category: 'Electronics',
                    brand: 'HP',
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
                    Category: 'Fashion',
                    brand: 'Levi\'s',
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
                    Category: 'Kitchen Appliances',
                    brand: 'Philips',
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
                    <span class="category-label" style="position:absolute;top:8px;left:8px;background:#2874f0;color:#fff;font-size:12px;padding:2px 8px;border-radius:12px;font-weight:600;z-index:2;">
                        ${product.Category || 'Product'}
                    </span>
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
                if(!sliderElement) return;
                sliderElement.innerHTML = ''; // Clear existing content
                products.forEach(product => {
                    const card = createProductCard(product);
                    sliderElement.appendChild(card);
                });
            }

            // Populate "Still Looking For These?"
            const stillLookingSlider = document.getElementById('stillLookingSlider');
            const fashionProducts = dummyProducts.filter(p => p.Category === 'Fashion');
            populateSlider(stillLookingSlider, fashionProducts.slice(0)); // 0, 5 Show first 5 for this section

            // Populate "Best for Electronics"
            const bestElectronicsSlider = document.getElementById('bestElectronicsSlider');
            const electronicsProducts = dummyProducts.filter(p => p.Category === 'Electronics');
            populateSlider(bestElectronicsSlider, electronicsProducts.slice(0)); // 0, 5 Show first 5 for this section

            // Populate "Suggested For You"
            const suggestedForYouSlider = document.getElementById('suggestedForYouSlider');
            const shuffledProducts = [...dummyProducts].sort(() => 0.5 - Math.random());
            populateSlider(suggestedForYouSlider, shuffledProducts.slice(0)); // 0, 5 Show first 5 for this section


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
            setupContentSlider('bestElectronicsSlider', 'prevBestElectronicsSlide', 'nextBestElectronicsSlide');


            // --- Product Detail Modal ---
            const productDetailModal = document.getElementById('productDetailModal');
            const productDetailContent = document.getElementById('productDetailContent');
            const closeButtonProductDetail = productDetailModal.querySelector('.close-button');
            
            function openProductDetail(product) {
                if (product) {
                    renderProductDetail(product);
                    productDetailModal.style.display = 'flex'; // Show modal
                }
            }

            // Open modal when a product card is clicked
            document.body.addEventListener('click', (event) => {
                const card = event.target.closest('.content-card');
                if (card && card.dataset.productId) {
                    const productId = card.dataset.productId;
                    const product = dummyProducts.find(p => p.id === productId);
                    openProductDetail(product);
                }
            });

            // Close product detail modal
            closeButtonProductDetail.addEventListener('click', () => {
                productDetailModal.style.display = 'none';
            });
            
            // --- Address Confirmation Modal ---
            const addressModal = document.getElementById('addressModal');
            const buyNowAddressForm = document.getElementById('buyNowAddressForm');
            const closeAddressModal = document.getElementById('closeAddressModal');
            let currentProductForPurchase = null;
            
            closeAddressModal.addEventListener('click', () => {
                addressModal.style.display = 'none';
            });

            buyNowAddressForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const address = {
                    name: document.getElementById('addressName').value,
                    mobile: document.getElementById('addressMobile').value,
                    email: document.getElementById('addressEmail').value,
                    pincode: document.getElementById('addressPincode').value,
                    state: document.getElementById('addressState').value,
                    country: document.getElementById('addressCountry').value,
                };
                
                // Simple validation
                if(!address.name || !address.mobile || !address.email || !address.pincode) {
                    document.getElementById('addressError').textContent = 'Please fill all required fields.';
                    return;
                }
                document.getElementById('addressError').textContent = '';

                if (document.getElementById('saveAddressPermanently').checked) {
                    localStorage.setItem('userDeliveryAddress', JSON.stringify(address));
                    alert('Address saved permanently!');
                }
                
                addressModal.style.display = 'none';
                initiatePayment(currentProductForPurchase, address);
            });
            
            document.getElementById('useCurrentLocationBtn').addEventListener('click', () => {
                alert("Simulating fetching current location... In a real app, this would use the Geolocation API.");
                // Dummy data for demonstration
                 document.getElementById('addressPincode').value = "400001";
                 document.getElementById('addressState').value = "Maharashtra";
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
                } else if (event.target === addressModal) {
                    addressModal.style.display = 'none';
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
                });

                // NEW: Updated "Buy Now" logic
                productDetailContent.querySelector('.buy-now-button').addEventListener('click', () => {
                    if (!auth.currentUser) {
                        alert('Please log in to proceed with the purchase.');
                        loginModal.style.display = 'flex';
                        return;
                    }
                    currentProductForPurchase = product;
                    productDetailModal.style.display = 'none'; // Close product detail
                    
                    // Pre-fill address form
                    const savedAddress = JSON.parse(localStorage.getItem('userDeliveryAddress'));
                    if(savedAddress) {
                        document.getElementById('addressName').value = savedAddress.name || auth.currentUser.displayName;
                        document.getElementById('addressMobile').value = savedAddress.mobile || '';
                        document.getElementById('addressEmail').value = savedAddress.email || auth.currentUser.email;
                        document.getElementById('addressPincode').value = savedAddress.pincode || '';
                        document.getElementById('addressState').value = savedAddress.state || '';
                        document.getElementById('addressCountry').value = savedAddress.country || 'India';
                    } else {
                        document.getElementById('addressName').value = auth.currentUser.displayName;
                        document.getElementById('addressEmail').value = auth.currentUser.email;
                    }
                    
                    addressModal.style.display = 'flex'; // Open address confirmation modal
                });
            }

            // Payment initiation logic
            async function initiatePayment(product, address) {
                 alert(`Initiating payment for ${product.title}...`);
                 try {
                        const dummyOrderId = 'order_' + Math.random().toString(36).substr(2, 9);
                        const dummyAmount = parseFloat(product.price.replace('₹', '').replace(/,/g, '')) * 100; // Amount in paisa
                        const dummyCurrency = 'INR';

                        const options = {
                            key: 'rzp_test_YOUR_KEY_ID', // Replace with your actual Test Key ID
                            amount: dummyAmount,
                            currency: dummyCurrency,
                            name: 'My flipkart Site',
                            description: `Purchase of ${product.title}`,
                            order_id: dummyOrderId, 
                            handler: async function (response) {
                                if (response.razorpay_payment_id) {
                                    alert('Payment verified and order placed successfully!');
                                    // NEW: Simulate confirmation messages
                                    alert(`A confirmation SMS has been sent to ${address.mobile} and an email to ${address.email}.`);
                                    
                                    const currentUser = auth.currentUser;
                                    if (currentUser) {
                                        const purchaseId = database.ref('users/' + currentUser.uid + '/purchases').push().key;
                                        const purchaseData = {
                                            productId: product.id,
                                            title: product.title,
                                            price: product.price,
                                            image: product.image,
                                            purchaseDate: firebase.database.ServerValue.TIMESTAMP,
                                            paymentId: response.razorpay_payment_id,
                                            orderId: response.razorpay_order_id || dummyOrderId,
                                            deliveryAddress: address
                                        };
                                        await database.ref('users/' + currentUser.uid + '/purchases/' + purchaseId).set(purchaseData);
                                        if (profileModal.style.display === 'flex') {
                                            displayPurchasedProducts(currentUser);
                                        }
                                    }
                                } else {
                                    alert('Payment verification failed: Simulated error');
                                }
                            },
                            prefill: {
                                name: address.name,
                                email: address.email,
                                contact: address.mobile
                            },
                            notes: {
                                address: `${address.pincode}, ${address.state}, ${address.country}`
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
                    } else {
                        profileEditErrorMessage.textContent = error.message;
                    }
                    console.error('Profile Update Error:', error);
                }
            });

            async function displayPurchasedProducts(user) {
                purchasedProductsList.innerHTML = '<p>Loading purchases...</p>';
                try {
                    const snapshot = await database.ref('users/' + user.uid + '/purchases').once('value');
                    const purchases = snapshot.val();
                    let hasVisiblePurchases = false;

                    if (purchases) {
                        purchasedProductsList.innerHTML = ''; // Clear loading message
                        const today = new Date();

                        Object.values(purchases).reverse().forEach(purchase => { // Display newest first
                            const purchaseDate = new Date(purchase.purchaseDate);
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
                    loginMenuItem.style.display = 'none';
                    registerMenuItem.style.display = 'none';
                    profileMenuItem.style.display = 'list-item';
                    logoutMenuItem.style.display = 'list-item';
                    if (profileModal.style.display === 'flex') {
                        profileNameDisplay.textContent = user.displayName || 'N/A';
                        profileEmailDisplay.textContent = user.email || 'N/A';
                        editNameInput.value = user.displayName || '';
                        displayPurchasedProducts(user);
                    }

                } else {
                    loginMenuItem.style.display = 'list-item';
                    registerMenuItem.style.display = 'list-item';
                    profileMenuItem.style.display = 'none';
                    logoutMenuItem.style.display = 'none';
                }
            });


        // --- Cart Modal Functionality ---
        const cartModal = document.getElementById('cartModal');
        const closeCartModal = document.getElementById('closeCartModal');
        const cartProductsList = document.getElementById('cartProductsList');
        const checkoutForm = document.getElementById('checkoutForm');
        // Editable address fields
        const checkoutName = document.getElementById('checkoutName');
        const checkoutMobile = document.getElementById('checkoutMobile');
        const checkoutEmail = document.getElementById('checkoutEmail');
        const checkoutAddress = document.getElementById('checkoutAddress');
        const saveAddressBtn = document.getElementById('saveAddressBtn');
        const addressSaveStatus = document.getElementById('addressSaveStatus');
        let cartProducts = [];

        // Show cart modal when cart icon is clicked
        document.querySelector('.cart-icon').addEventListener('click', (e) => {
            e.preventDefault();
            displayCartProducts();
            if (auth.currentUser) {
                checkoutName.value = auth.currentUser.displayName || '';
                checkoutEmail.value = auth.currentUser.email || '';
            } else {
                checkoutName.value = '';
                checkoutEmail.value = '';
            }
            checkoutMobile.value = '';
            checkoutAddress.value = '';
            cartModal.style.display = 'flex';
        });

        closeCartModal.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });

        function displayCartProducts() {
            if (cartProducts.length === 0) {
                cartProductsList.innerHTML = '<p>Your cart is empty.</p>';
            } else {
                cartProductsList.innerHTML = '';
                cartProducts.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'purchase-item';
                    div.innerHTML = `
                        <img src="${item.image}" alt="${item.title}">
                        <div class="purchase-item-details">
                            <h4>${item.title}</h4>
                            <p class="price">${item.price}</p>
                        </div>
                    `;
                    cartProductsList.appendChild(div);
                });
            }
        }

        function addToCart(product) {
            cartProducts.push(product);
            cartItemCount = cartProducts.length;
            updateCartCount();
        }

        function autofillAddressFields() {
            const saved = JSON.parse(localStorage.getItem('userDeliveryAddress') || '{}');
            if (saved.name) checkoutName.value = saved.name;
            if (saved.mobile) checkoutMobile.value = saved.mobile;
            if (saved.email) checkoutEmail.value = saved.email;
            if (saved.address) checkoutAddress.value = saved.address;
        }

        document.querySelector('.cart-icon').addEventListener('click', (e) => {
            e.preventDefault();
            displayCartProducts();
            autofillAddressFields();
            cartModal.style.display = 'flex';
            addressSaveStatus.textContent = '';
        });

        saveAddressBtn.addEventListener('click', () => {
            const name = checkoutName.value.trim();
            const mobile = checkoutMobile.value.trim();
            const email = checkoutEmail.value.trim();
            const address = checkoutAddress.value.trim();
            if (!name || !mobile || !email || !address) {
                addressSaveStatus.textContent = 'Please fill all fields before saving.';
                addressSaveStatus.style.color = 'red';
                return;
            }
            localStorage.setItem('userDeliveryAddress', JSON.stringify({
                name, mobile, email, address
            }));
            addressSaveStatus.textContent = 'Address saved permanently!';
            addressSaveStatus.style.color = 'green';
        });

        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = checkoutName.value.trim();
            const mobile = checkoutMobile.value.trim();
            const email = checkoutEmail.value.trim();
            const address = checkoutAddress.value.trim();
            if (!name || !mobile || !email || !address) {
                alert('Please fill all delivery address fields.');
                return;
            }
            localStorage.setItem('userDeliveryAddress', JSON.stringify({
                name, mobile, email, address
            }));
            cartProducts = [];
            updateCartCount();
            cartModal.style.display = 'none';
            window.location.href = 'order-post.html';
        });

        // --- NEW: Category View Modal Logic ---
        const categoryViewModal = document.getElementById('categoryViewModal');
        const closeCategoryViewModal = document.getElementById('closeCategoryViewModal');
        const categoryViewTitle = document.getElementById('categoryViewTitle');
        const categoryProductGrid = document.getElementById('categoryProductGrid');
        const filterSidebar = document.getElementById('filterSidebar');
        const filterToggleButton = document.getElementById('filterToggleButton');
        const closeFilterSidebarBtn = document.getElementById('closeFilterSidebarBtn');
        const loadMoreProductsBtn = document.getElementById('loadMoreProductsBtn');

        let currentCategoryProducts = [];
        let filteredProductsList = [];
        const PRODUCTS_PER_PAGE = 8;
        let currentPage = 1;

        document.querySelectorAll('.view-all-btn').forEach(button => {
            button.addEventListener('click', () => {
                const section = button.dataset.section;
                let productsToShow = [];
                let title = "";

                if (section === 'electronics') {
                    productsToShow = dummyProducts.filter(p => p.Category === 'Electronics');
                    title = "Best for Electronics";
                } else if (section === 'suggested') {
                    productsToShow = [...dummyProducts].sort(() => 0.5 - Math.random());
                    title = "Suggested For You";
                } else { // 'still-looking' or other general categories
                    productsToShow = dummyProducts;
                    title = "All Products";
                }
                
                openCategoryView(title, productsToShow);
            });
        });
        
        function openCategoryView(title, products) {
            currentCategoryProducts = products;
            categoryViewTitle.textContent = title;
            populateFilterOptions(products);
            applyFiltersAndRender();
            categoryViewModal.style.display = 'flex';
            if (window.innerWidth <= 992) {
                filterSidebar.classList.remove('is-open');
            }
        }
        
        closeCategoryViewModal.addEventListener('click', () => {
            categoryViewModal.style.display = 'none';
        });
        
        window.addEventListener('click', (event) => {
            if (event.target === categoryViewModal) {
                categoryViewModal.style.display = 'none';
            }
        });
        
        // Sidebar toggle logic
        filterToggleButton.addEventListener('click', () => {
            filterSidebar.classList.add('is-open');
        });
        closeFilterSidebarBtn.addEventListener('click', () => {
            filterSidebar.classList.remove('is-open');
        });

        
        function populateFilterOptions(products) {
            const brandFilter = document.getElementById('brandFilter');
            const categoryFilter = document.getElementById('categoryFilter');
            
            const brands = [...new Set(products.map(p => p.brand))];
            const categories = [...new Set(products.map(p => p.Category))];
            
            brandFilter.innerHTML = '<h4>Brand</h4>'; // Reset
            brands.forEach(brand => {
                brandFilter.innerHTML += `<div class="filter-option"><input type="checkbox" name="brand" value="${brand}"> ${brand}</div>`;
            });

            categoryFilter.innerHTML = '<h4>Category</h4>'; // Reset
            categories.forEach(cat => {
                categoryFilter.innerHTML += `<div class="filter-option"><input type="checkbox" name="category" value="${cat}"> ${cat}</div>`;
            });
        }
        
        document.getElementById('applyFiltersBtn').addEventListener('click', applyFiltersAndRender);
        
        function applyFiltersAndRender() {
            let filteredProducts = [...currentCategoryProducts];
            
            const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
            if(selectedCategories.length > 0) {
                filteredProducts = filteredProducts.filter(p => selectedCategories.includes(p.Category));
            }
            
            const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(cb => cb.value);
            if (selectedBrands.length > 0) {
                filteredProducts = filteredProducts.filter(p => selectedBrands.includes(p.brand));
            }
            
            const selectedPrice = document.querySelector('input[name="price"]:checked').value;
            if (selectedPrice !== 'all') {
                const [min, max] = selectedPrice.split('-').map(parseFloat);
                filteredProducts = filteredProducts.filter(p => {
                    const price = parseFloat(p.price.replace('₹', '').replace(/,/g, ''));
                    return price >= min && price < (max || Infinity);
                });
            }
            
            const selectedRating = document.querySelector('input[name="rating"]:checked').value;
            if (selectedRating !== 'all') {
                filteredProducts = filteredProducts.filter(p => p.rating >= parseFloat(selectedRating));
            }

            filteredProductsList = filteredProducts;
            currentPage = 1;
            categoryProductGrid.innerHTML = ''; // Clear grid for new results
            renderProductPage();
            
            if (window.innerWidth <= 992) {
                filterSidebar.classList.remove('is-open');
            }
        }

        function renderProductPage() {
            const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
            const end = start + PRODUCTS_PER_PAGE;
            const productsToRender = filteredProductsList.slice(start, end);

            if (currentPage === 1 && productsToRender.length === 0) {
                categoryProductGrid.innerHTML = '<p>No products match your criteria.</p>';
                loadMoreProductsBtn.style.display = 'none';
                return;
            }

            productsToRender.forEach(product => {
                const card = createProductCard(product);
                categoryProductGrid.appendChild(card);
            });

            if (end >= filteredProductsList.length) {
                loadMoreProductsBtn.style.display = 'none';
            } else {
                loadMoreProductsBtn.style.display = 'block';
            }
        }

        loadMoreProductsBtn.addEventListener('click', () => {
            currentPage++;
            renderProductPage();
        });
        });

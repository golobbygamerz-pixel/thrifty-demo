const products = [

  {
    id:1,
    name:"Oversized Essential T-Shirt",
    cat:"T-Shirts",
    gender:"Men",
    price:699,
    old:999,
    rating:4.5,
    sizes:["M","L","XL"],
    new:true,
    offer:true,
    tone:"blue"
  },

  {
    id:2,
    name:"Classic Oxford Shirt",
    cat:"Shirts",
    gender:"Men",
    price:899,
    old:1299,
    rating:4.7,
    sizes:["S","M","L","XL"],
    new:true,
    offer:false,
    tone:"slate"
  },

  {
    id:3,
    name:"Relaxed Straight Jeans",
    cat:"Jeans",
    gender:"Men",
    price:1199,
    old:1699,
    rating:4.4,
    sizes:["M","L","XL","XXL"],
    new:false,
    offer:true,
    tone:"denim"
  },

  {
    id:4,
    name:"Everyday Hoodie",
    cat:"Hoodies",
    gender:"Men",
    price:999,
    old:1499,
    rating:4.6,
    sizes:["M","L","XL"],
    new:true,
    offer:true,
    tone:"dark"
  },

  {
    id:5,
    name:"Ribbed Everyday Dress",
    cat:"Dresses",
    gender:"Women",
    price:1099,
    old:1599,
    rating:4.8,
    sizes:["S","M","L"],
    new:true,
    offer:true,
    tone:"rose"
  },

  {
    id:6,
    name:"Relaxed Fit Tee",
    cat:"T-Shirts",
    gender:"Women",
    price:649,
    old:899,
    rating:4.3,
    sizes:["S","M","L","XL"],
    new:false,
    offer:true,
    tone:"cream"
  },

  {
    id:7,
    name:"Minimal Overshirt",
    cat:"Shirts",
    gender:"Women",
    price:949,
    old:1399,
    rating:4.5,
    sizes:["S","M","L"],
    new:true,
    offer:false,
    tone:"sand"
  },

  {
    id:8,
    name:"Daily Wide Leg Jeans",
    cat:"Jeans",
    gender:"Women",
    price:1249,
    old:1799,
    rating:4.6,
    sizes:["S","M","L","XL"],
    new:false,
    offer:true,
    tone:"denim"
  },

  {
    id:9,
    name:"THRIFTY Basic Tee",
    cat:"T-Shirts",
    gender:"Men",
    price:499,
    old:699,
    rating:4.2,
    sizes:["S","M","L","XL","XXL"],
    new:false,
    offer:true,
    tone:"black"
  },

  {
    id:10,
    name:"Clean Zip Hoodie",
    cat:"Hoodies",
    gender:"Women",
    price:1049,
    old:1499,
    rating:4.7,
    sizes:["S","M","L","XL"],
    new:true,
    offer:false,
    tone:"lavender"
  },

  {
    id:11,
    name:"Daily Cotton Shirt",
    cat:"Shirts",
    gender:"Men",
    price:799,
    old:1199,
    rating:4.1,
    sizes:["M","L","XL"],
    new:false,
    offer:true,
    tone:"sky"
  },

  {
    id:12,
    name:"Essential Summer Dress",
    cat:"Dresses",
    gender:"Women",
    price:999,
    old:1399,
    rating:4.5,
    sizes:["S","M","L"],
    new:true,
    offer:false,
    tone:"coral"
  }

];


const toneMap = {

  blue:"linear-gradient(135deg,#2874f0,#8fb7ea)",

  slate:"linear-gradient(135deg,#68788c,#d5dce5)",

  denim:"linear-gradient(135deg,#315b91,#9bb5d5)",

  dark:"linear-gradient(135deg,#172337,#68788c)",

  rose:"linear-gradient(135deg,#9d7184,#ead7dd)",

  cream:"linear-gradient(135deg,#e5ded1,#9d978d)",

  sand:"linear-gradient(135deg,#c7b89f,#665f55)",

  black:"linear-gradient(135deg,#111827,#68707d)",

  lavender:"linear-gradient(135deg,#827aa5,#d8d3e6)",

  sky:"linear-gradient(135deg,#78a9c9,#d9e8f2)",

  coral:"linear-gradient(135deg,#c77e72,#efd3cd)"

};


let cart =
  JSON.parse(localStorage.getItem("thrifty_cart")) || [];

let wishlist =
  JSON.parse(localStorage.getItem("thrifty_wishlist")) || [];


let activeCategory = "All";
let searchTerm = "";
let activeSize = "";
let maxPrice = 2000;
let minRating = 0;

let currentProduct = null;
let selectedSize = "";
let selectedColor = "Blue";


const $ = selector =>
  document.querySelector(selector);

const $$ = selector =>
  [...document.querySelectorAll(selector)];


function money(number){

  return "₹" + number.toLocaleString("en-IN");

}


function saveData(){

  localStorage.setItem(
    "thrifty_cart",
    JSON.stringify(cart)
  );

  localStorage.setItem(
    "thrifty_wishlist",
    JSON.stringify(wishlist)
  );

  updateCounts();

}


function updateCounts(){

  const cartItems =
    cart.reduce((total,item) => total + item.qty,0);

  $("#cartCount").textContent = cartItems;

  $("#wishCount").textContent =
    wishlist.length;

}


function toast(message){

  const element = $("#toast");

  element.textContent = message;

  element.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer =
    setTimeout(() => {

      element.classList.remove("show");

    },1800);

}


/* FILTER */

function filteredProducts(){

  let result =
    products.filter(product => {

      const categoryMatch =
        activeCategory === "All" ||

        activeCategory === product.cat ||

        activeCategory === product.gender ||

        (
          activeCategory === "New Arrivals"
          &&
          product.new
        ) ||

        (
          activeCategory === "Offers"
          &&
          product.offer
        );


      const searchMatch =
        !searchTerm ||

        (
          product.name +
          " " +
          product.cat +
          " " +
          product.gender
        )
        .toLowerCase()
        .includes(searchTerm.toLowerCase());


      const priceMatch =
        product.price <= maxPrice;


      const ratingMatch =
        product.rating >= minRating;


      const sizeMatch =
        !activeSize ||
        product.sizes.includes(activeSize);


      return (
        categoryMatch &&
        searchMatch &&
        priceMatch &&
        ratingMatch &&
        sizeMatch
      );

    });


  const sort =
    $("#sortSelect").value;


  if(sort === "low"){

    result.sort(
      (a,b) => a.price - b.price
    );

  }


  if(sort === "high"){

    result.sort(
      (a,b) => b.price - a.price
    );

  }


  if(sort === "rating"){

    result.sort(
      (a,b) => b.rating - a.rating
    );

  }


  if(sort === "newest"){

    result.sort(
      (a,b) =>
        Number(b.new) -
        Number(a.new)
    );

  }


  return result;

}


/* PRODUCT CARD */

function productCard(product){

  const saved =
    wishlist.includes(product.id);


  const discount =
    Math.round(
      (1 - product.price / product.old) * 100
    );


  return `

    <article class="product-card">

      <div
        class="product-image"
        style="background:${toneMap[product.tone]}"
        data-product="${product.id}"
      >

        ${
          product.new
          ?
          `<span class="badge">NEW</span>`
          :
          ""
        }


        <button
          class="wishlist ${saved ? "saved" : ""}"
          data-wish="${product.id}"
          aria-label="Wishlist"
        >
          ${saved ? "♥" : "♡"}
        </button>


        <span>
          THRIFTY
        </span>

      </div>


      <div class="product-info">

        <h3>
          ${product.name}
        </h3>


        <div class="rating">
          ★★★★★ ${product.rating}
        </div>


        <div class="price">

          <strong>
            ${money(product.price)}
          </strong>

          <span class="old-price">
            ${money(product.old)}
          </span>

          <span class="discount">
            ${discount}% OFF
          </span>

        </div>


        <button
          class="add-btn"
          data-add="${product.id}"
        >
          Add to Cart
        </button>

      </div>

    </article>

  `;

}


/* RENDER PRODUCTS */

function renderGrid(){

  const result =
    filteredProducts();


  $("#resultCount").textContent =
    `${result.length} product${result.length === 1 ? "" : "s"}`;


  $("#shopTitle").textContent =
    activeCategory === "All"
    ?
    "All products"
    :
    activeCategory;


  $("#productGrid").innerHTML =
    result.length
    ?
    result.map(productCard).join("")
    :
    "";


  $("#emptyState").hidden =
    result.length !== 0;

}


function renderTrending(){

  $("#trendingGrid").innerHTML =
    products
      .slice(0,8)
      .map(productCard)
      .join("");

}


/* ADD TO CART */

function addToCart(
  id,
  size = "M",
  color = "Blue"
){

  const existing =
    cart.find(item =>
      item.id === id &&
      item.size === size &&
      item.color === color
    );


  if(existing){

    existing.qty++;

  }else{

    cart.push({

      id,
      size,
      color,
      qty:1

    });

  }


  saveData();

  toast("Added to cart ✓");

}


/* WISHLIST */

function toggleWishlist(id){

  const index =
    wishlist.indexOf(id);


  if(index !== -1){

    wishlist.splice(index,1);

    toast("Removed from wishlist");

  }else{

    wishlist.push(id);

    toast("Added to wishlist ♥");

  }


  saveData();

  renderTrending();

  renderGrid();

}


/* PRODUCT MODAL */

function openProduct(id){

  const product =
    products.find(
      item => item.id === id
    );


  if(!product) return;


  currentProduct = product;


  selectedSize =
    product.sizes.includes("M")
    ?
    "M"
    :
    product.sizes[0];


  $("#modalContent").innerHTML = `

    <div class="modal-product">

      <div
        class="modal-image"
        style="background:${toneMap[product.tone]}"
      >
        THRIFTY
      </div>


      <div>

        <span class="eyebrow blue">
          ${product.cat.toUpperCase()}
        </span>


        <h2>
          ${product.name}
        </h2>


        <div class="rating">
          ★★★★★ ${product.rating} · 120+ ratings
        </div>


        <div class="price">

          <strong>
            ${money(product.price)}
          </strong>

          <span class="old-price">
            ${money(product.old)}
          </span>

          <span class="discount">
            ${Math.round((1-product.price/product.old)*100)}% OFF
          </span>

        </div>


        <p>
          MRP incl. all taxes
        </p>


        <h4>
          Size
        </h4>


        <div
          class="option-row"
          id="sizeOptions"
        >

          ${product.sizes.map(size => `

            <button
              class="${size === selectedSize ? "active" : ""}"
              data-size="${size}"
            >
              ${size}
            </button>

          `).join("")}

        </div>


        <h4>
          Color
        </h4>


        <div
          class="option-row"
          id="colorOptions"
        >

          <button class="active">
            Blue
          </button>

          <button>
            Black
          </button>

          <button>
            White
          </button>

        </div>


        <button
          class="primary-btn"
          id="modalAdd"
          style="width:100%;margin-top:10px"
        >
          ADD TO CART
        </button>

      </div>

    </div>


    <hr>


    <h3>
      Product Details
    </h3>

    <p style="margin-top:10px;color:#667085;line-height:1.7">

      Comfortable everyday fashion designed
      for easy styling. Product details,
      material and care information can be
      connected to your product database.

    </p>


    <h3 style="margin-top:20px">
      Delivery
    </h3>

    <p style="margin-top:10px;color:#667085">

      Enter your pincode at checkout to check
      delivery availability.

    </p>

  `;


  $("#modalBackdrop")
    .classList
    .add("open");


  $("#modalContent").onclick = event => {


    const sizeButton =
      event.target.closest("[data-size]");


    if(sizeButton){

      selectedSize =
        sizeButton.dataset.size;


      $$("#sizeOptions button")
        .forEach(button =>
          button.classList.toggle(
            "active",
            button === sizeButton
          )
        );

    }


    const colorButton =
      event.target.closest(
        "#colorOptions button"
      );


    if(colorButton){

      selectedColor =
        colorButton.textContent.trim();


      $$("#colorOptions button")
        .forEach(button =>
          button.classList.toggle(
            "active",
            button === colorButton
          )
        );

    }


    if(event.target.id === "modalAdd"){

      addToCart(
        currentProduct.id,
        selectedSize,
        selectedColor
      );

      closeModal();

    }

  };

}


/* CART */

function renderCart(){

  const container =
    $("#drawerItems");


  if(!cart.length){

    container.innerHTML = `

      <div class="empty-state">

        <div class="empty-icon">
          🛒
        </div>

        <h3>
          Your cart is empty
        </h3>

        <p>
          Add something you love.
        </p>

      </div>

    `;


    $("#drawerTotal").textContent =
      "₹0";

    return;

  }


  let total = 0;


  container.innerHTML =
    cart.map(item => {

      const product =
        products.find(
          product => product.id === item.id
        );


      total +=
        product.price * item.qty;


      return `

        <div class="cart-row">

          <div
            class="mini-image"
            style="background:${toneMap[product.tone]}"
          >
            THRIFTY
          </div>


          <div>

            <h4>
              ${product.name}
            </h4>

            <p>
              ${item.size}
              ·
              ${item.color}
              ·
              ${money(product.price)}
            </p>


            <div class="qty">

              <button data-dec="${product.id}">
                −
              </button>

              <span>
                ${item.qty}
              </span>

              <button data-inc="${product.id}">
                +
              </button>

              <button
                class="remove"
                data-remove="${product.id}"
              >
                Remove
              </button>

            </div>

          </div>


          <strong>
            ${money(product.price * item.qty)}
          </strong>

        </div>

      `;

    }).join("");


  $("#drawerTotal").textContent =
    money(total);

}


function openCart(){

  renderCart();

  $("#cartDrawer")
    .classList
    .add("open");

  $("#backdrop")
    .classList
    .add("open");

}


function closeCart(){

  $("#cartDrawer")
    .classList
    .remove("open");

  $("#backdrop")
    .classList
    .remove("open");

}


function closeModal(){

  $("#modalBackdrop")
    .classList
    .remove("open");

}


/* CLICK HANDLING */

document.addEventListener(
  "click",
  event => {


    const category =
      event.target.closest(
        "[data-category]"
      );


    if(category){

      event.preventDefault();


      activeCategory =
        category.dataset.category;


      if(
        activeCategory !== "New Arrivals" &&
        activeCategory !== "Offers"
      ){

        $("#categoryFilter").value =
          activeCategory;

      }else{

        $("#categoryFilter").value =
          "All";

      }


      renderGrid();


      document
        .querySelector("#shop")
        .scrollIntoView({
          behavior:"smooth"
        });


      return;

    }


    const add =
      event.target.closest("[data-add]");


    if(add){

      addToCart(
        Number(add.dataset.add)
      );

      return;

    }


    const wish =
      event.target.closest("[data-wish]");


    if(wish){

      event.stopPropagation();

      toggleWishlist(
        Number(wish.dataset.wish)
      );

      return;

    }


    const product =
      event.target.closest(
        "[data-product]"
      );


    if(
      product &&
      !event.target.closest("button")
    ){

      openProduct(
        Number(product.dataset.product)
      );

    }


    const increase =
      event.target.closest("[data-inc]");


    if(increase){

      const item =
        cart.find(
          item =>
            item.id ==
            increase.dataset.inc
        );


      item.qty++;

      saveData();

      renderCart();

    }


    const decrease =
      event.target.closest("[data-dec]");


    if(decrease){

      const item =
        cart.find(
          item =>
            item.id ==
            decrease.dataset.dec
        );


      item.qty--;


      if(item.qty <= 0){

        cart =
          cart.filter(
            x => x !== item
          );

      }


      saveData();

      renderCart();

    }


    const remove =
      event.target.closest(
        "[data-remove]"
      );


    if(remove){

      cart =
        cart.filter(
          item =>
            item.id !=
            remove.dataset.remove
        );


      saveData();

      renderCart();

      toast("Removed from cart");

    }


    if(
      event.target.matches(
        "[data-close]"
      )
    ){

      closeCart();

      closeModal();

    }

  }
);


/* CART BUTTON */

$("#cartBtn").onclick =
  openCart;


$("#backdrop").onclick =
  closeCart;


/* WISHLIST BUTTON */

$("#wishlistBtn").onclick = () => {

  activeCategory = "All";

  searchTerm = "";

  renderGrid();

  document
    .querySelector("#shop")
    .scrollIntoView({
      behavior:"smooth"
    });

  toast(
    `${wishlist.length} item${wishlist.length === 1 ? "" : "s"} in wishlist`
  );

};


/* ACCOUNT */

$("#accountBtn").onclick = () => {

  $("#modalContent").innerHTML = `

    <h2>
      Welcome to THRIFTY
    </h2>

    <p style="margin:10px 0;color:#667085">
      Sign in to manage your orders,
      addresses and wishlist.
    </p>


    <label>

      Email or phone

      <input
        class="form-input"
        placeholder="Enter email or phone"
      >

    </label>


    <label>

      Password

      <input
        class="form-input"
        type="password"
        placeholder="Enter password"
      >

    </label>


    <button
      class="primary-btn"
      style="width:100%;margin-top:10px"
      id="loginDemo"
    >
      LOGIN
    </button>

  `;


  $("#modalBackdrop")
    .classList
    .add("open");


  $("#modalContent").onclick =
    event => {

      if(event.target.id === "loginDemo"){

        toast(
          "Login ready for backend integration"
        );

        closeModal();

      }

    };

};


/* CHECKOUT */

$("#checkoutBtn").onclick = () => {

  if(!cart.length){

    toast("Your cart is empty");

    return;

  }


  $("#modalContent").innerHTML = `

    <h2>
      Checkout
    </h2>

    <p style="margin:10px 0;color:#667085">
      Complete your delivery details.
    </p>


    <label>

      Full Name

      <input
        class="form-input"
        required
        placeholder="Your name"
      >

    </label>


    <label>

      Phone

      <input
        class="form-input"
        required
        placeholder="10-digit phone number"
      >

    </label>


    <label>

      Address

      <input
        class="form-input"
        required
        placeholder="House / street / area"
      >

    </label>


    <label>

      City

      <input
        class="form-input"
        placeholder="City"
      >

    </label>


    <label>

      Pincode

      <input
        class="form-input"
        placeholder="Pincode"
      >

    </label>


    <h3 style="margin-top:20px">
      Payment
    </h3>


    <div class="option-row">

      <button class="active">
        UPI
      </button>

      <button>
        Card
      </button>

      <button>
        Cash on Delivery
      </button>

    </div>


    <button
      class="primary-btn"
      style="width:100%"
      id="placeOrder"
    >
      PLACE ORDER
    </button>

  `;


  closeCart();


  $("#modalBackdrop")
    .classList
    .add("open");


  $("#modalContent").onclick =
    event => {

      if(
        event.target.id === "placeOrder"
      ){

        cart = [];

        saveData();

        closeModal();

        toast(
          "Order placed successfully ✓"
        );

      }

    };

};


/* SEARCH */

$("#searchForm").onsubmit =
  event => {

    event.preventDefault();

    searchTerm =
      $("#searchInput")
      .value
      .trim();


    renderGrid();


    $("#suggestions")
      .classList
      .remove("show");


    document
      .querySelector("#shop")
      .scrollIntoView({
        behavior:"smooth"
      });

  };


$("#searchInput").oninput =
  event => {

    const query =
      event.target.value
        .trim()
        .toLowerCase();


    const suggestions =
      $("#suggestions");


    if(!query){

      suggestions
        .classList
        .remove("show");

      return;

    }


    const matches =
      products
        .filter(product =>
          (
            product.name +
            " " +
            product.cat
          )
          .toLowerCase()
          .includes(query)
        )
        .slice(0,5);


    if(!matches.length){

      suggestions.innerHTML =
        `<div class="suggestion">
          No matching products
        </div>`;

    }else{

      suggestions.innerHTML =
        matches.map(product => `

          <div
            class="suggestion"
            data-suggestion="${product.id}"
          >

            ${product.name}

            <small style="display:block;color:#6b7280">
              ${product.cat}
            </small>

          </div>

        `).join("");

    }


    suggestions
      .classList
      .add("show");

  };


$("#suggestions").onclick =
  event => {

    const item =
      event.target.closest(
        "[data-suggestion]"
      );


    if(!item) return;


    const product =
      products.find(
        product =>
          product.id ==
          item.dataset.suggestion
      );


    $("#searchInput").value =
      product.name;


    searchTerm =
      product.name;


    renderGrid();


    $("#suggestions")
      .classList
      .remove("show");


    document
      .querySelector("#shop")
      .scrollIntoView({
        behavior:"smooth"
      });

  };


/* FILTERS */

$("#categoryFilter").onchange =
  event => {

    activeCategory =
      event.target.value;

    renderGrid();

  };


$("#sortSelect").onchange =
  renderGrid;


$("#priceFilter").oninput =
  event => {

    maxPrice =
      Number(event.target.value);


    $("#priceValue").textContent =
      money(maxPrice);


    renderGrid();

  };


$("#ratingFilter").onchange =
  event => {

    minRating =
      Number(event.target.value);

    renderGrid();

  };


$("#sizeChips").onclick =
  event => {

    const button =
      event.target.closest("button");


    if(!button) return;


    activeSize =
      activeSize === button.textContent
      ?
      ""
      :
      button.textContent;


    $$("#sizeChips button")
      .forEach(item => {

        item.classList.toggle(
          "active",
          activeSize &&
          item.textContent === activeSize
        );

      });


    renderGrid();

  };


$("#clearFilters").onclick =
  () => {

    activeCategory = "All";
    searchTerm = "";
    activeSize = "";
    maxPrice = 2000;
    minRating = 0;


    $("#categoryFilter").value =
      "All";

    $("#priceFilter").value =
      2000;

    $("#priceValue").textContent =
      "₹2,000";

    $("#ratingFilter").value =
      "0";

    $("#searchInput").value =
      "";


    $$("#sizeChips button")
      .forEach(button =>
        button.classList.remove("active")
      );


    renderGrid();

  };


$("#resetSearch").onclick =
  () => {

    $("#clearFilters").click();

  };


$("#filterMobile").onclick =
  () => {

    $("#filters")
      .classList
      .toggle("open");

  };


/* MOBILE MENU */

$("#menuBtn").onclick =
  () => {

    $(".category-nav")
      .classList
      .toggle("mobile-open");

  };


/* NEWSLETTER */

$("#newsletterForm").onsubmit =
  event => {

    event.preventDefault();

    toast(
      "You're subscribed ✓"
    );

    event.target.reset();

  };


/* HERO CAROUSEL */

let slide = 0;

const heroTrack =
  $("#heroTrack");

const heroDots =
  $("#heroDots");


function createDots(){

  heroDots.innerHTML =
    [0,1,2]
      .map(index => `

        <button
          class="hero-dot ${index === 0 ? "active" : ""}"
          data-dot="${index}"
        ></button>

      `)
      .join("");

}


function goToSlide(number){

  slide =
    (number + 3) % 3;


  heroTrack.style.transform =
    `translateX(-${slide * 100}%)`;


  $$(".hero-dot")
    .forEach(
      (dot,index) =>
        dot.classList.toggle(
          "active",
          index === slide
        )
    );

}


createDots();


$("#heroPrev").onclick =
  () => goToSlide(slide - 1);


$("#heroNext").onclick =
  () => goToSlide(slide + 1);


heroDots.onclick =
  event => {

    const dot =
      event.target.closest("[data-dot]");


    if(dot){

      goToSlide(
        Number(dot.dataset.dot)
      );

    }

  };


setInterval(
  () => goToSlide(slide + 1),
  5500
);


/* INITIAL */

renderTrending();

renderGrid();

updateCounts();
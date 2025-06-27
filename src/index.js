let allProducts = []; // define global empty array

let searchedProducts = [];

let filteredList; // define global empty array to hold items for search or filter 
// define a baseUrl string to load the json api
let baseUrl = "https://fakestoreapi.com/products";
let searchInputTimeout;

// First Call to pull atleast 20 products - when the window loads
// initial fetch declaration once the DOM is loaded
document.addEventListener("DOMContentLoaded",() => {
    // pulling into DOM DATA All products from https://fakestoreapi.com/products

    fetch(`${baseUrl}?`)
     .then(res => res.json())
     .then(products => {
        allProducts = products; // assign pulled products to global array

        // function to populate products on main-page
        //retrieveProducts(allProducts);
        renderInitialProducts(allProducts); // called on page load - loads only 100 products
        console.log(allProducts.length);

        
     })
     .catch(error => (console.error("Error loading the products", error)));


    // to check the search input
    document.getElementById('searchInput').addEventListener('input', () => {
        clearTimeout(searchInputTimeout); // ensures theres no existing/pending setTimeout function call
        searchInputTimeout = setTimeout(() => {
            const searchTerm = document.getElementById('searchInput').value;
            
            searchProducts(searchTerm); // calls the search function with the final searchTerm
        }, 300); // 300ms delay
    });

    // An EventListener to check the filter button
    document.getElementById('filterBtn').addEventListener('click', () => {
        // Get the search input value
        const searchInput = document.getElementById('searchInput');
        const searchTerm = searchInput.value.trim().toLowerCase();

        // filter first checks whether there's any search terms using if() 
        // Create a list to work with based on whether there's a search term
        
        if (searchTerm !== '') {
           
            filteredList = allProducts.filter(product => {
                return product.title.toLowerCase().includes(searchTerm);
            });
        } else {
            filteredList = allProducts;
        }
        applyAllFilters(filteredList);

    });
   

});


// search feature
function searchProducts(term) {
    console.log("Search begins "+term);
    searchedProducts = allProducts.filter(product =>
    product.title.toLowerCase().includes(term.toLowerCase())
  );
  renderProducts(searchedProducts);
}

// Add filter features on pricing and category
function applyAllFilters(filtered) {
  let finalFiltered; // Use let so we can assign later

  // Optional filters
  const category = document.getElementById('categoryFilter')?.value;
  const minPrice = parseFloat(document.getElementById('minPrice')?.value) || 0;
  const maxPrice = parseFloat(document.getElementById('maxPrice')?.value) || Infinity;
  console.log("the category: " + category);

  if (category || minPrice || maxPrice !== Infinity) {
    finalFiltered = filtered.filter(product => {
      const matchCategory = !category || product.category === category;
      const matchPrice = product.price >= minPrice && product.price <= maxPrice;
      return matchCategory && matchPrice;
    });
    renderProducts(finalFiltered);

  } else {
    renderProducts(filtered); // fallback when no filters are applied
  }
}



// basically slices the product list to 100

function renderInitialProducts(products){
    let initialProducts = products.slice(0,100);
    console.log('what after slice: '+initialProducts.length);

    renderProducts(initialProducts);
    
}

// function to populate products on main-page
function renderProducts(products){
    
    console.log('The length '+products.length);

    // declare some variables to used in the DOM
    const emptyState = document.getElementById('emptyState');
    const productsGrid = document.getElementById('products-grid');
    const productsCount = document.getElementById('productsCount');
    const productsOuter = document.getElementById('productsOuter');

    // This is to count & display the number of posts being loaded on the page
    productsCount.innerHTML = `<div class="flex justify-between items-center">
                                    <span>${products.length} Product Items</span>
                                    
                                </div>`;

     // What happens when there are no product items loaded

    if(products.length === 0){

        //productsOuter.innerHTML = "";
        productsOuter.style.height = '0px';
        emptyState.style.display = "block";
        productsCount.textContent = "0 posts";
    }
    else{ // There are posts availabe for display
       
        emptyState.style.display = 'none';
        console.log("We definitely have products");
        
        // Calls another function
        // createPostItem function - which fills Post Title, Author & Date
        productsGrid.innerHTML = products.map(product => createProductCard(product)).join('');
         

    }

}

// Create one post item
function createProductCard(product) {
    
    //console.log(post.time_stamp);
    //let dateCreated = formatToCustomDate(product.time_stamp);
    //console.log('date after format '+typeof dateCreated, dateCreated);


    return `

        <div class="p-3  m-1  bg-white border-gray-200 border rounded-2xl">
            <div class = "flex space-x-1">
                <div class="m-1"><img src="${product.image}" alt="" loading="lazy" class="object-cover w-[150px]"></div>
                <div class="p-1">
                    <a onclick="" class="my-2 mx-0.5 inline-block text-[18px] font-medium leading-tight cursor-pointer">${product.title}</a>
                    <p class = "my-2 mx-0.5 font-normal block text-[14px]">
                        ${product.description.split(" ").slice(0, 6).join(" ") +'...'}
                    </p>
                    <span class="inline-block"><span>${product.price}</span>
                    </span>
                    <span class="block">
                        <a onclick="editPost(${product.id})" class="cursor-pointer underline text-blue-900">Add To Cart</a>
                    
                    </span>
                </div>
            </div>

        </div>
    `;
}

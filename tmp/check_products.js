const axios = require('axios');
axios.get('https://classic-furniture-backend.onrender.com/api/products')
  .then(res => {
    const products = res.data.products || res.data;
    products.slice(0, 3).forEach(p => console.log(p.name, p.images, p.imageUrl));
  })
  .catch(err => console.error(err.message));

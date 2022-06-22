const API_URL = '.';

class BasketItem {
  constructor( title, price, id, quantity){
    this.id = id;
    this.title = title;
    this.price = price;
    this.quantity = quantity;
  }
  render (){
    return `
    <div class="basket-item" >
      <h3>${this.title}</h3>
      <p>Price: ${this.price} $.</p>      
      <p>Quantity: ${this.quantity}</p>
      <p>Amount: ${this.price * this.quantity} $.</p>
      <button class="addQuantity" data-id="${this.id}" > Add (+) </button>
      <button class="reduceQuantity" data-id="${this.id}" > Reduce (-) </button>
      <button class="remove-item" data-id="${this.id}">Remove this goods</button>
    </div>`;
  }
}

class BasketList {
  constructor(){
    this.goods = [];
  }

  addGood(good) {

    let isInGoods = false; 
    if(this.goods.length === 0){
      good.quantity = 1;
      this.goods.push(good);
    } else {
      
      this.goods.forEach( elem => {
        if(elem.id === good.id )
      {
         ++elem.quantity ;
         isInGoods = true;
      }
    })

    if(!isInGoods) {      
      good.quantity = 1;
      this.goods.push(good);
    }
  }

        
        console.log(this.goods);
        this.render();      
  }


  removeGood(id){

    const newGoods = [];

    this.goods.forEach( good =>{
      if( good.id != id ) {
        newGoods.push(good);        
      }
    });
    
    this.goods = newGoods;
    
    this.render();
  }

  addQuantityOfGood(id) {

    this.goods.forEach( good =>{
      if( good.id === id ) {
        ++good.quantity ;       
      }
    });

    this.render();

  }

  reduceQuantityOfGood(id){

    const newGoods = [];

    this.goods.forEach( good => {
      if( good.id != id ) {
        newGoods.push(good);        
      } else if(good.quantity > 1) {
        good.quantity--;
        newGoods.push(good);
      }
    });
    
    this.goods = newGoods;
    
    this.render(); 
  }

  countCommonPrice() {
    let sum = 0;

    console.log('sum= '+sum);


    this.goods.forEach( good => {
      sum += good.price * good.quantity;
    })
    return sum;
    
  }
  

  render() {
    let listHtml = '';

    this.goods.forEach( good => {
      const item = new BasketItem(good.title, good.price, good.id, good.quantity);
      listHtml = listHtml + item.render();
    });

    document.querySelector('.basket-list').innerHTML = listHtml;

    let basketButtons = document.querySelector('.basket-list').querySelectorAll('button.remove-item');    
    let reduceButtons =  document.querySelector('.basket-list').querySelectorAll('button.reduceQuantity');
    let addButtons =  document.querySelector('.basket-list').querySelectorAll('button.addQuantity');

    basketButtons.forEach( button =>{
      button.addEventListener('click', (e)=> {
        console.log(e.target.dataset.id); 

        this.goods.forEach( good => {
          if(good.id === Number(e.target.dataset.id)){
            this.removeGood(good.id);
          }
        });
      })

    })

    reduceButtons.forEach( button =>{
      button.addEventListener('click', (e)=> {
        console.log(e.target.dataset.id); 

        this.goods.forEach( good => {
          if(good.id === Number(e.target.dataset.id)){
            this.reduceQuantityOfGood(good.id);
          }
        });
      })

    })

    addButtons.forEach( button =>{
      button.addEventListener('click', (e)=> {
        console.log(e.target.dataset.id); 

        this.goods.forEach( good => {
          if(good.id === Number(e.target.dataset.id)){
            this.addQuantityOfGood(good.id);
          }
        });
      })

    })

    if(this.countCommonPrice() != 0) {

      document.querySelector('.common-price').innerText = `Total ($):  ${this.countCommonPrice()}`;

    } else {
      document.querySelector('.common-price').innerText = `The basket is empty yet`;
    }

    

  }
}

class GoodsItem {
  constructor(title, price, id, img_url) {
    this.id = id;
    this.title = title;
    this.price = price;  
    this.img_url = img_url;
  }  

  render() {
    return `
    <div class="goods-item">
    <img class="goods-item__img" src="./img/${this.img_url}" alt="${this.title}">
      <h3>${this.title}</h3>
      <p>Price: ${this.price} $</p> 
      <button class="goods-item__btn" type="button" data-id="${this.id}">Add to basket</button>
    </div>`;
  }
}

class GoodsList {
  constructor(){
    this.goods = [];
    this.searchGoods = [];
  }

  async fetchGoods() {

    const response = await fetch(`${API_URL}/catalogdata.json`);
   if(response.ok){

    const catalogItems = await response.json();
    this.goods = catalogItems;
    console.log( this.goods);

   }else{
    alert('Something went wrong(');
   }
  }

  findGoods(str = '', basket) {

    const regExp = new RegExp(str, 'i')
    this.searchGoods = this.goods.filter( good => {
      return regExp.test(good.title);
    });

    console.log(this.searchGoods);
    this.render(basket);

  }



  addGood(title, price, id) {

    this.goods.push({id, title, price});
  }

  countCommonPrice() {
    let sum = 0;

    this.goods.forEach( good => {
      sum += good.price;
    })
    return sum;
  }

  render(basket) {
    let listHtml = '';

    this.searchGoods.forEach( good => {
      const item = new GoodsItem(good.title, good.price, good.id, good.img_url);
      listHtml = listHtml + item.render();
    });

    document.querySelector('.goods-list').innerHTML = listHtml;

    let goodsButtons = document.querySelector('.goods-list').querySelectorAll('button');
    console.log(goodsButtons);

    goodsButtons.forEach( goodButton =>{
      goodButton.addEventListener('click', (e)=>{

        this.goods.forEach( good => {
          if(good.id === Number(e.target.dataset.id)){
            basket.addGood(good);
          }
        });
        

        

      }, true) 
  })
}
}




const init = async () => {

  const list = new GoodsList();
  console.log(list);  
  await list.fetchGoods();
  list.findGoods();
  const basket = new BasketList();
  list.render(basket);
  document.querySelector('.search-place__btn').addEventListener('click', (e) => {
    list.findGoods(document.querySelector('.search-place__input').value, basket);
  });
  document.querySelector('.cart-button').addEventListener('click', (e) => {

    basket.render();
    document.querySelector('.basket-list').classList.toggle('basket-list_active');
    document.querySelector('.common-price').classList.toggle('common-price_active');
    

    
  })
}

window.onload = init

export default 'select p.id, p.title, p.description, p.price, p.imageUrl, s.count from products as p join stocks as s on p.id = s.product_id;';

export default 'select p.id, p.title, p.description, p.price, p.image_url as "imageUrl", s.count from products as p join stocks as s on p.id = s.product_id;';

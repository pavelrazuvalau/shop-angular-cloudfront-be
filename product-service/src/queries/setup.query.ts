export default `
  create extension if not exists "uuid-ossp";

  create table if not exists products (
    id uuid not null default uuid_generate_v4() primary key,
    title text not null,
    description text,
    price integer,
    image_url text
  );

  create table if not exists stocks (
    product_id uuid not null primary key,
    count integer,
    foreign key (product_id) references products(id)
  );
`;

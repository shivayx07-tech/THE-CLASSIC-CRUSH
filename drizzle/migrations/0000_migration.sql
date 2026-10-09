
CREATE TYPE public.app_role AS ENUM ('admin','staff');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
CREATE POLICY "own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- First account to sign up becomes the café admin
CREATE OR REPLACE FUNCTION public.assign_first_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created_admin AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.assign_first_admin();

CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  tagline text,
  image_key text,
  sort int NOT NULL DEFAULT 0
);
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  subgroup text,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  unit text,
  image_key text,
  is_available boolean NOT NULL DEFAULT true,
  is_bestseller boolean NOT NULL DEFAULT false,
  is_veg boolean NOT NULL DEFAULT true,
  sort int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  cafe_name text NOT NULL DEFAULT 'The Classic Crush',
  phone_primary text NOT NULL DEFAULT '8090205081',
  phone_secondary text DEFAULT '8318008104',
  address text NOT NULL DEFAULT 'School of Hotel Management Campus',
  opening_hours text NOT NULL DEFAULT '10:00 AM – 9:00 PM',
  is_open boolean NOT NULL DEFAULT true,
  delivery_slabs jsonb NOT NULL DEFAULT '[{"max_km":2,"fee":20},{"max_km":4,"fee":30},{"max_km":6,"fee":40}]',
  max_radius_km numeric NOT NULL DEFAULT 6,
  free_delivery_threshold numeric NOT NULL DEFAULT 499,
  min_order_value numeric NOT NULL DEFAULT 99,
  tax_percent numeric NOT NULL DEFAULT 5,
  prep_minutes int NOT NULL DEFAULT 20,
  delivery_minutes int NOT NULL DEFAULT 25,
  instagram_url text DEFAULT 'https://instagram.com'
);
CREATE TABLE public.delivery_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  distance_km numeric NOT NULL,
  is_active boolean NOT NULL DEFAULT true
);
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  tracking_token uuid UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  fulfillment text NOT NULL CHECK (fulfillment IN ('delivery','pickup')),
  address jsonb,
  zone_name text,
  distance_km numeric,
  notes text,
  subtotal numeric(10,2) NOT NULL,
  delivery_fee numeric(10,2) NOT NULL DEFAULT 0,
  tax numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('upi','card','cod','pay_at_cafe')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
  payment_ref text,
  status text NOT NULL DEFAULT 'placed' CHECK (status IN ('placed','accepted','preparing','ready','out_for_delivery','delivered','picked_up','cancelled')),
  delivery_partner text,
  delivery_partner_phone text,
  eta_minutes int,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid,
  name text NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  quantity int NOT NULL CHECK (quantity > 0),
  line_total numeric(10,2) NOT NULL
);
CREATE TABLE public.order_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status text NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.log_order_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' OR NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.order_events(order_id, status) VALUES (NEW.id, NEW.status);
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER orders_status_log_ins AFTER INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.log_order_status();
CREATE OR REPLACE FUNCTION public.touch_order() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END $$;
CREATE TRIGGER orders_touch BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.touch_order();
CREATE OR REPLACE FUNCTION public.log_order_status_upd()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.order_events(order_id, status) VALUES (NEW.id, NEW.status);
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER orders_status_log_ins ON public.orders;
CREATE OR REPLACE FUNCTION public.log_order_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN INSERT INTO public.order_events(order_id, status) VALUES (NEW.id, NEW.status); RETURN NEW; END $$;
CREATE TRIGGER orders_log_insert AFTER INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.log_order_insert();
CREATE TRIGGER orders_log_update AFTER UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.log_order_status_upd();
DROP FUNCTION public.log_order_status();

-- grants
GRANT SELECT ON public.categories, public.products, public.settings, public.delivery_zones TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories, public.products, public.settings, public.delivery_zones TO authenticated;
GRANT SELECT, UPDATE ON public.orders TO authenticated;
GRANT SELECT ON public.order_items, public.order_events TO authenticated;
GRANT ALL ON public.categories, public.products, public.settings, public.delivery_zones, public.orders, public.order_items, public.order_events TO service_role;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read" ON public.settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public read" ON public.delivery_zones FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin write" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin write" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin write" ON public.settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin write" ON public.delivery_zones FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin read" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin read" ON public.order_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin read" ON public.order_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- seed
INSERT INTO public.settings(id) VALUES (1);
INSERT INTO public.delivery_zones(name, distance_km) VALUES
('Campus & Hostel Area',0.5),('Near Market (within 2 km)',1.8),('City Centre',3.2),('Railway Station Area',4.5),('Outer Colony',5.8);

INSERT INTO public.categories(slug,name,tagline,image_key,sort) VALUES
('signature-desserts','Signature Desserts','Chocolate-loaded waffle bowls','desserts',1),
('quick-bites','Quick Bites','Patties, pizza & Korean buns','quickbites',2),
('sandwiches-maggie','Sandwiches & Maggie','Grilled, cheesy, satisfying','sandwich',3),
('beverages','Beverages','Hot & cold, cool vibes','beverages',4),
('pastries-cakes','Pastries & Cakes','Freshly baked every day','pastries',5),
('burgers','Burgers','Stacked & saucy','burger',6),
('french-fries','French Fries','Crispy & irresistible','fries',7),
('momos','Momos','Steamed, fried & kurkure','momos',8);

WITH c AS (SELECT id, slug FROM public.categories)
INSERT INTO public.products(category_id,name,subgroup,price,unit,image_key,is_bestseller,sort,description)
SELECT c.id, v.name, v.sub, v.price, v.unit, v.img, v.best, v.sort, v.descr FROM (VALUES
('signature-desserts','Sprinkled Baby',NULL,49,NULL,'desserts',false,1,'Waffle bites with rainbow sprinkles and chocolate drizzle'),
('signature-desserts','Dark & White Delight',NULL,59,NULL,'desserts',false,2,'Dark and white chocolate layered dessert'),
('signature-desserts','Dark & Milk Delight',NULL,59,NULL,'desserts',false,3,'Dark and milk chocolate layered dessert'),
('signature-desserts','Oreo Dark Crunch',NULL,69,NULL,'desserts',false,4,'Crushed Oreo over rich dark chocolate'),
('signature-desserts','Dark Chocolate Fantasy',NULL,69,NULL,'desserts',false,5,'Intense dark chocolate indulgence'),
('signature-desserts','Milk Chocolate Fantasy',NULL,69,NULL,'desserts',false,6,'Creamy milk chocolate indulgence'),
('signature-desserts','Sweetheart',NULL,69,NULL,'desserts',false,7,'Strawberry and chocolate love'),
('signature-desserts','I''m a Gems Baby',NULL,69,NULL,'desserts',false,8,'Loaded with colourful Gems'),
('signature-desserts','Triple Chocolate',NULL,69,NULL,'desserts',true,9,'Dark, milk and white chocolate — our best seller'),
('signature-desserts','Naughty Nutella',NULL,69,NULL,'desserts',false,10,'Generous Nutella with waffle crunch'),
('signature-desserts','KitKat-ishh',NULL,69,NULL,'desserts',false,11,'KitKat pieces over chocolate waffles'),
('quick-bites','Masala Patties','Patties',25,NULL,'patties',false,1,'Flaky puff with spiced potato filling'),
('quick-bites','Regular Patties','Patties',20,NULL,'patties',false,2,'Classic flaky veg puff'),
('quick-bites','Paneer Patties','Patties',30,NULL,'patties',false,3,'Puff filled with spiced paneer'),
('quick-bites','Cheese Masala Patties','Patties',35,NULL,'patties',false,4,'Spiced filling with melted cheese'),
('quick-bites','Regular Veg Pizza','Pizza',59,NULL,'pizza',false,5,'Cheesy pizza with fresh veggies'),
('quick-bites','Korean Bun (1 Pc)','Pizza',39,NULL,'pizza',false,6,'Soft cream-cheese garlic bun'),
('quick-bites','Korean Bun (2 Pcs)','Pizza',59,NULL,'pizza',false,7,'Two soft cream-cheese garlic buns'),
('quick-bites','Paneer Pizza','Pizza',69,NULL,'pizza',false,8,'Loaded with paneer and cheese'),
('sandwiches-maggie','Veg Sandwich','Grilled Sandwiches',39,NULL,'sandwich',false,1,'Grilled with fresh veggies'),
('sandwiches-maggie','Cheese Sandwich','Grilled Sandwiches',59,NULL,'sandwich',false,2,'Grilled with gooey cheese'),
('sandwiches-maggie','Paneer Sandwich','Grilled Sandwiches',59,NULL,'sandwich',false,3,'Grilled with spiced paneer'),
('sandwiches-maggie','Corn Cheese Sandwich','Grilled Sandwiches',59,NULL,'sandwich',false,4,'Sweet corn and cheese'),
('sandwiches-maggie','Tandoori Sandwich','Grilled Sandwiches',69,NULL,'sandwich',false,5,'Smoky tandoori filling'),
('sandwiches-maggie','Veg Maggie','Maggie',39,NULL,'maggie',false,6,'Masala Maggie with veggies'),
('sandwiches-maggie','Paneer Maggie','Maggie',59,NULL,'maggie',false,7,'Maggie with paneer cubes'),
('sandwiches-maggie','Cheese Maggie','Maggie',59,NULL,'maggie',false,8,'Maggie with melted cheese'),
('beverages','Tea','Hot',15,NULL,'tea',false,1,'Fresh masala chai'),
('beverages','Hot Coffee','Hot',30,NULL,'tea',false,2,'Frothy hot coffee'),
('beverages','Cold Coffee','Cold',49,NULL,'beverages',false,3,'Chilled creamy cold coffee'),
('beverages','Mango Shake','Cold',30,NULL,'beverages',false,4,'Thick mango milkshake'),
('beverages','Lassi','Cold',30,NULL,'beverages',false,5,'Sweet chilled lassi'),
('beverages','Mojito','Cold',49,NULL,'mojito',false,6,'Mint and lime refresher'),
('beverages','Blue Lagoon','Cold',49,NULL,'mojito',false,7,'Blue curaçao-style mocktail'),
('pastries-cakes','Pineapple Pastry',NULL,39,NULL,'pastries',false,1,'Light sponge with pineapple cream'),
('pastries-cakes','Chocolate Pastry',NULL,49,NULL,'pastries',false,2,'Moist chocolate sponge pastry'),
('pastries-cakes','Hot Chocolate Brownie Cup',NULL,49,NULL,'pastries',false,3,'Warm brownie with chocolate sauce'),
('pastries-cakes','Brownie Tub',NULL,59,NULL,'pastries',false,4,'Fudgy brownie tub'),
('pastries-cakes','Celebration Cake (per kg)',NULL,600,'per kg','cake',false,5,'Made to order — tell us the flavour in notes'),
('burgers','Veg Burger',NULL,49,NULL,'burger',false,1,'Crispy veg patty burger'),
('burgers','Cheese Burger',NULL,59,NULL,'burger',false,2,'Veg patty with cheese slice'),
('burgers','Paneer Burger',NULL,59,NULL,'burger',false,3,'Crispy paneer patty burger'),
('french-fries','Classic Fries',NULL,39,NULL,'fries',false,1,'Salted golden fries'),
('french-fries','Peri Peri Fries',NULL,49,NULL,'fries',false,2,'Tossed in peri peri spice'),
('french-fries','Cheesy Fries',NULL,59,NULL,'fries',false,3,'Smothered in cheese sauce'),
('momos','Veg Momos',NULL,49,NULL,'momos',false,1,'Steamed veg momos with chutney'),
('momos','Fried Momos',NULL,59,NULL,'momos',false,2,'Crispy fried momos'),
('momos','Kurkure Momos',NULL,69,NULL,'momos',false,3,'Extra crunchy coated momos'),
('momos','Cheese Momos',NULL,69,NULL,'momos',false,4,'Momos stuffed with cheese')
) AS v(cat,name,sub,price,unit,img,best,sort,descr) JOIN c ON c.slug = v.cat;

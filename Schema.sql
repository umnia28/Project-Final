CREATE EXTENSION IF NOT EXISTS citext;


CREATE TABLE users (
  user_id        BIGSERIAL PRIMARY KEY,
  username       VARCHAR(60) NOT NULL UNIQUE,
  email          CITEXT NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL,
  contact_no     VARCHAR(30),
  profile_img    TEXT,
  full_name      VARCHAR(120),
  gender         VARCHAR(20),
  status         VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE admin (
  user_id         BIGINT PRIMARY KEY
                 REFERENCES users(user_id) ON DELETE CASCADE,
  clearance_level INT NOT NULL DEFAULT 1,
  is_employee     BOOLEAN NOT NULL DEFAULT TRUE,
  hire_date       DATE
);

CREATE TABLE customer (
  user_id BIGINT PRIMARY KEY
          REFERENCES users(user_id) ON DELETE CASCADE,
  points  INT NOT NULL DEFAULT 0
);



CREATE TABLE seller (
  user_id        BIGINT PRIMARY KEY
                 REFERENCES users(user_id) ON DELETE CASCADE,

  approved_by    BIGINT NOT NULL
                 REFERENCES admin(user_id) ON DELETE RESTRICT,

  approved_at    TIMESTAMPTZ,  

  business_name  VARCHAR(160) NOT NULL,
  kyc_status     VARCHAR(30) NOT NULL DEFAULT 'pending',
  rating_avg     NUMERIC(3,2) NOT NULL DEFAULT 0.00
);


CREATE TABLE delivery_man (
  user_id      BIGINT PRIMARY KEY
               REFERENCES users(user_id) ON DELETE CASCADE,
  joining_date DATE,
  salary       NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_orders INT NOT NULL DEFAULT 0
);


CREATE TABLE user_image (
  image_id   BIGSERIAL PRIMARY KEY,
  user_id    BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  image_url  TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_image_user ON user_image(user_id);

CREATE TABLE notification (
  notification_id          BIGSERIAL PRIMARY KEY,
  user_id                  BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  notification_description TEXT NOT NULL,
  seen_status              BOOLEAN NOT NULL DEFAULT FALSE,
  time_added               TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notification_user_time ON notification(user_id, time_added DESC);


CREATE TABLE shipping_address (
  address_id        BIGSERIAL PRIMARY KEY,
  user_id           BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  city              VARCHAR(80),
  address           TEXT NOT NULL,
  shipping_state    VARCHAR(80),
  zip_code          VARCHAR(20),
  country           VARCHAR(80),
  visibility_status BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_shipping_address_user ON shipping_address(user_id);


CREATE TABLE noticeboard (
  notice_id          BIGSERIAL PRIMARY KEY,
  admin_user_id      BIGINT NOT NULL REFERENCES admin(user_id) ON DELETE RESTRICT,
  notice_description TEXT NOT NULL,
  date_added         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_noticeboard_admin_time ON noticeboard(admin_user_id, date_added DESC);

CREATE TABLE store (
  store_id     BIGSERIAL PRIMARY KEY,
  user_id      BIGINT NOT NULL REFERENCES seller(user_id) ON DELETE CASCADE,
  store_name   VARCHAR(160) NOT NULL,
  store_status VARCHAR(30) NOT NULL DEFAULT 'active',
  ref_no       VARCHAR(80) UNIQUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_store_seller ON store(user_id);


CREATE TABLE category (
  category_id          BIGSERIAL PRIMARY KEY,
  category_name        VARCHAR(120) NOT NULL UNIQUE,
  category_description TEXT,
  category_img         TEXT,
  visibility_status    BOOLEAN NOT NULL DEFAULT TRUE,
  parent_category_id   BIGINT REFERENCES category(category_id) ON DELETE SET NULL
);

CREATE INDEX idx_category_parent ON category(parent_category_id);


CREATE TABLE product (
  product_id          BIGSERIAL PRIMARY KEY,
  store_id            BIGINT NOT NULL REFERENCES store(store_id) ON DELETE CASCADE,
  category_id         BIGINT REFERENCES category(category_id) ON DELETE SET NULL,
  product_name        VARCHAR(200) NOT NULL,
  price               NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  product_description TEXT,
  product_count       INT NOT NULL DEFAULT 0 CHECK (product_count >= 0),
  discount            NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  status              VARCHAR(30) NOT NULL DEFAULT 'active',
  visibility_status   BOOLEAN NOT NULL DEFAULT TRUE,
  date_added          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_store ON product(store_id);
CREATE INDEX idx_product_category ON product(category_id);


CREATE TABLE product_image (
  image_id   BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES product(product_id) ON DELETE CASCADE,
  image_url  TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_image_product ON product_image(product_id);


CREATE TABLE product_attributes (
  product_id      BIGINT NOT NULL REFERENCES product(product_id) ON DELETE CASCADE,
  attribute_name  VARCHAR(80) NOT NULL,
  attribute_value VARCHAR(120) NOT NULL,
  new_price       NUMERIC(12,2) CHECK (new_price IS NULL OR new_price >= 0),
  stock           INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sold            INT NOT NULL DEFAULT 0 CHECK (sold >= 0),
  base_spec       BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (product_id, attribute_name, attribute_value)
);

CREATE INDEX idx_product_attr_product ON product_attributes(product_id);

CREATE TABLE wishlist (
  user_id    BIGINT NOT NULL REFERENCES customer(user_id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES product(product_id) ON DELETE CASCADE,
  added_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);


CREATE TABLE product_review (
  review_id    BIGSERIAL PRIMARY KEY,
  product_id   BIGINT NOT NULL REFERENCES product(product_id) ON DELETE CASCADE,
  customer_id  BIGINT NOT NULL REFERENCES customer(user_id) ON DELETE CASCADE,
  rating       INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review       TEXT,
  time_added   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, customer_id)
);

CREATE INDEX idx_review_product_time ON product_review(product_id, time_added DESC);


CREATE TABLE product_qa (
  question_id    BIGSERIAL PRIMARY KEY,
  product_id     BIGINT NOT NULL REFERENCES product(product_id) ON DELETE CASCADE,
  asked_by       BIGINT NOT NULL REFERENCES customer(user_id) ON DELETE CASCADE,
  question_text  TEXT NOT NULL,
  time_asked     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_qa_product_time ON product_qa(product_id, time_asked DESC);

CREATE TABLE product_qa_answer (
  answer_id      BIGSERIAL PRIMARY KEY,
  question_id    BIGINT NOT NULL REFERENCES product_qa(question_id) ON DELETE CASCADE,
  answered_by    BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  item_answered  TEXT NOT NULL,
  time_answered  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_qa_answer_question ON product_qa_answer(question_id);


CREATE TABLE promo (
  promo_id         BIGSERIAL PRIMARY KEY,
  admin_user_id    BIGINT NOT NULL REFERENCES admin(user_id) ON DELETE RESTRICT,
  promo_name       VARCHAR(120) NOT NULL UNIQUE,
  promo_status     VARCHAR(30) NOT NULL DEFAULT 'inactive',
  promo_discount   NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (promo_discount >= 0),
  promo_start_date DATE,
  promo_end_date   DATE,
  CHECK (promo_end_date IS NULL OR promo_start_date IS NULL OR promo_end_date >= promo_start_date)
);

CREATE INDEX idx_promo_admin ON promo(admin_user_id);


CREATE TABLE "order" (
  order_id                BIGSERIAL PRIMARY KEY,
  customer_id             BIGINT NOT NULL REFERENCES customer(user_id) ON DELETE RESTRICT,
  address_id              BIGINT REFERENCES shipping_address(address_id) ON DELETE SET NULL,
  delivery_man_id         BIGINT REFERENCES delivery_man(user_id) ON DELETE SET NULL,
  promo_id                BIGINT REFERENCES promo(promo_id) ON DELETE SET NULL,

  date_added              TIMESTAMPTZ NOT NULL DEFAULT now(),
  payment_method          VARCHAR(30),
  payment_status          VARCHAR(30) NOT NULL DEFAULT 'pending',
  delivery_charge         NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (delivery_charge >= 0),
  discount_amount         NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  total_price             NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (total_price >= 0),
  transaction_id          VARCHAR(120),
  delivery_time           TIMESTAMPTZ,
  reason_for_cancellation TEXT
);

CREATE INDEX idx_order_customer_time ON "order"(customer_id, date_added DESC);
CREATE INDEX idx_order_delivery_man  ON "order"(delivery_man_id);
CREATE INDEX idx_order_address       ON "order"(address_id);


CREATE TABLE order_item (
  order_item_id     BIGSERIAL PRIMARY KEY,
  order_id          BIGINT NOT NULL REFERENCES "order"(order_id) ON DELETE CASCADE,
  product_id        BIGINT NOT NULL REFERENCES product(product_id) ON DELETE RESTRICT,
  qty               INT NOT NULL CHECK (qty > 0),
  price             NUMERIC(12,2) NOT NULL CHECK (price >= 0),
  discount_amount   NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  seller_earnings   NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (seller_earnings >= 0)
);

CREATE INDEX idx_order_item_order   ON order_item(order_id);
CREATE INDEX idx_order_item_product ON order_item(product_id);


CREATE TABLE order_status (
  order_status_id BIGSERIAL PRIMARY KEY,
  order_id        BIGINT NOT NULL REFERENCES "order"(order_id) ON DELETE CASCADE,
  status_type     VARCHAR(40) NOT NULL,
  status_time     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by      BIGINT REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE INDEX idx_order_status_order_time ON order_status(order_id, status_time DESC);


CREATE TABLE tracker (
  tracker_id              BIGSERIAL PRIMARY KEY,
  order_id                BIGINT NOT NULL UNIQUE REFERENCES "order"(order_id) ON DELETE CASCADE,
  tracker_description     TEXT,
  progress                VARCHAR(60),
  estimated_delivery_date DATE
);


CREATE TABLE payout (
  payout_id     BIGSERIAL PRIMARY KEY,
  seller_id     BIGINT NOT NULL REFERENCES seller(user_id) ON DELETE RESTRICT,
  store_id      BIGINT REFERENCES store(store_id) ON DELETE SET NULL,
  payout_status VARCHAR(30) NOT NULL DEFAULT 'pending',
  payout_date   TIMESTAMPTZ,
  amount        NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  method        VARCHAR(40),
  reference_no  VARCHAR(120)
);

CREATE INDEX idx_payout_seller_date ON payout(seller_id, payout_date DESC);

CREATE TABLE payout_item (
  payout_id     BIGINT NOT NULL REFERENCES payout(payout_id) ON DELETE CASCADE,
  order_item_id BIGINT NOT NULL REFERENCES order_item(order_item_id) ON DELETE RESTRICT,
  PRIMARY KEY (payout_id, order_item_id)
);

------ changes made so far:

ALTER TABLE "order"
ADD COLUMN IF NOT EXISTS refunded_amount NUMERIC(12,2) NOT NULL DEFAULT 0;

ALTER TABLE order_item
ADD COLUMN IF NOT EXISTS seller_status VARCHAR(30) NOT NULL DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS seller_confirmed_at TIMESTAMPTZ NULL,
ADD COLUMN IF NOT EXISTS seller_cancelled_at TIMESTAMPTZ NULL,
ADD COLUMN IF NOT EXISTS cancel_reason TEXT NULL,
ADD COLUMN IF NOT EXISTS delivery_status VARCHAR(30) NOT NULL DEFAULT 'not_ready',
ADD COLUMN IF NOT EXISTS cancelled_by VARCHAR(20) NULL,
ADD COLUMN IF NOT EXISTS customer_cancelled_at TIMESTAMPTZ NULL,
ADD COLUMN IF NOT EXISTS refund_status VARCHAR(30) NOT NULL DEFAULT 'not_refunded',
ADD COLUMN IF NOT EXISTS refunded_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ NULL;

---- function + trigger:

---- trigger and function for stock managing
CREATE OR REPLACE FUNCTION sync_product_status_from_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.product_count <= 0 THEN
        NEW.status := 'inactive';
    ELSE
        NEW.status := 'active';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_product_status_from_stock ON product;

CREATE TRIGGER trg_sync_product_status_from_stock
BEFORE INSERT OR UPDATE OF product_count
ON product
FOR EACH ROW
EXECUTE FUNCTION sync_product_status_from_stock();

-- 
-- ALTER TABLE order_item
-- ADD COLUMN IF NOT EXISTS seller_status VARCHAR(30) NOT NULL DEFAULT 'pending';

-- ALTER TABLE order_item
-- ADD COLUMN IF NOT EXISTS seller_confirmed_at TIMESTAMPTZ;

-- ALTER TABLE order_item
-- ADD COLUMN IF NOT EXISTS seller_cancelled_at TIMESTAMPTZ;

-- ALTER TABLE order_item
-- ADD COLUMN IF NOT EXISTS cancel_reason TEXT;

-- ALTER TABLE order_item
-- ADD COLUMN IF NOT EXISTS cancelled_by VARCHAR(30);

-- ALTER TABLE order_item
-- ADD COLUMN IF NOT EXISTS delivery_status VARCHAR(30) NOT NULL DEFAULT 'not_ready';

-- ALTER TABLE seller
-- ALTER COLUMN approved_by DROP NOT NULL;



<<<<<<< HEAD
                      ---- dola's latest changes 


-- ALTER TABLE "order"
-- ADD COLUMN points_awarded BOOLEAN DEFAULT FALSE;

-- ALTER TABLE customer
-- ADD COLUMN is_plus_member BOOLEAN DEFAULT FALSE,
-- ADD COLUMN plus_expiry TIMESTAMP NULL;

-- UPDATE customer
-- SET 
--     plus_expiry = NOW() + INTERVAL '30 days'
-- WHERE user_id = 12;


-- --- promo table


-- ALTER TABLE promo
-- ADD COLUMN promo_code VARCHAR(80) UNIQUE,
-- ADD COLUMN claimed_by_user_id BIGINT,
-- ADD COLUMN points_required INT,
-- ADD COLUMN is_reward_promo BOOLEAN DEFAULT FALSE,
-- ADD COLUMN is_used BOOLEAN DEFAULT FALSE;


-- ALTER TABLE promo
-- ALTER COLUMN admin_user_id DROP NOT NULL;
-- --- procedure to unlock promo by points

-- CREATE OR REPLACE PROCEDURE claim_points_reward(
--     IN p_user_id BIGINT,
--     IN p_reward_type VARCHAR(30),
--     INOUT p_success BOOLEAN DEFAULT FALSE,
--     INOUT p_message TEXT DEFAULT NULL,
--     INOUT p_promo_code VARCHAR(80) DEFAULT NULL,
--     INOUT p_remaining_points INT DEFAULT NULL
-- )
-- LANGUAGE plpgsql
-- AS $$
-- DECLARE
--     v_points INT;
--     v_points_required INT;
--     v_discount NUMERIC(12,2);
--     v_promo_name VARCHAR(120);
--     v_generated_code VARCHAR(80);
-- BEGIN
--     IF p_reward_type = 'reward_100' THEN
--         v_points_required := 100;
--         v_discount := 30;
--         v_promo_name := 'Reward Promo 30%';
--     ELSIF p_reward_type = 'reward_200' THEN
--         v_points_required := 200;
--         v_discount := 50;
--         v_promo_name := 'Reward Promo 50%';
--     ELSIF p_reward_type = 'reward_500' THEN
--         v_points_required := 500;
--         v_discount := 70;
--         v_promo_name := 'Reward Promo 70%';
--     ELSE
--         p_success := FALSE;
--         p_message := 'Invalid reward type';
--         RETURN;
--     END IF;

--     SELECT points
--     INTO v_points
--     FROM customer
--     WHERE user_id = p_user_id
--     FOR UPDATE;

--     IF NOT FOUND THEN
--         p_success := FALSE;
--         p_message := 'Customer not found';
--         RETURN;
--     END IF;

--     IF COALESCE(v_points, 0) < v_points_required THEN
--         p_success := FALSE;
--         p_message := 'Not enough points';
--         p_remaining_points := COALESCE(v_points, 0);
--         RETURN;
--     END IF;

--     UPDATE customer
--     SET points = COALESCE(points, 0) - v_points_required
--     WHERE user_id = p_user_id;

--     v_generated_code := 'RW' || p_user_id || EXTRACT(EPOCH FROM NOW())::BIGINT;

--     INSERT INTO promo (
--         admin_user_id,
--         promo_name,
--         promo_status,
--         promo_discount,
--         promo_start_date,
--         promo_end_date,
--         promo_code,
--         claimed_by_user_id,
--         points_required,
--         is_reward_promo,
--         is_used
--     )
--     VALUES (
--         NULL,
--         v_promo_name,
--         'active',
--         v_discount,
--         CURRENT_DATE,
--         CURRENT_DATE + 30,
--         v_generated_code,
--         p_user_id,
--         v_points_required,
--         TRUE,
--         FALSE
--     );

--     SELECT points
--     INTO p_remaining_points
--     FROM customer
--     WHERE user_id = p_user_id;

--     p_success := TRUE;
--     p_message := 'Reward promo claimed successfully';
--     p_promo_code := v_generated_code;
-- END;
-- $$;





=======  -- shreya'a changes
-- ALTER TABLE notification
-- ADD COLUMN IF NOT EXISTS product_id BIGINT
-- REFERENCES product(product_id) ON DELETE CASCADE;


//Function
-- CREATE OR REPLACE FUNCTION create_seller_product(
--     p_seller_id BIGINT,
--     p_store_id BIGINT,
--     p_category_id BIGINT,
--     p_product_name VARCHAR,
--     p_price NUMERIC,
--     p_product_description TEXT,
--     p_product_count INT,
--     p_discount NUMERIC,
--     p_images TEXT[]
-- )
-- RETURNS BIGINT
-- LANGUAGE plpgsql
-- AS $$
-- DECLARE
--     v_product_id BIGINT;
--     v_image_url TEXT;
-- BEGIN
--     -- validation
--     IF p_store_id IS NULL THEN
--         RAISE EXCEPTION 'store_id is required';
--     END IF;

--     IF p_product_name IS NULL OR btrim(p_product_name) = '' THEN
--         RAISE EXCEPTION 'product_name is required';
--     END IF;

--     IF p_price IS NULL OR p_price < 0 THEN
--         RAISE EXCEPTION 'invalid price';
--     END IF;

--     -- ownership check
--     IF NOT EXISTS (
--         SELECT 1 FROM store
--         WHERE store_id = p_store_id
--         AND user_id = p_seller_id
--     ) THEN
--         RAISE EXCEPTION 'Not your store';
--     END IF;

--     -- insert product
--     INSERT INTO product (
--         store_id,
--         category_id,
--         product_name,
--         price,
--         product_description,
--         product_count,
--         discount
--     )
--     VALUES (
--         p_store_id,
--         p_category_id,
--         p_product_name,
--         p_price,
--         p_product_description,
--         COALESCE(p_product_count, 0),
--         COALESCE(p_discount, 0)
--     )
--     RETURNING product_id INTO v_product_id;

--     -- insert images
--     IF p_images IS NOT NULL THEN
--         FOREACH v_image_url IN ARRAY p_images
--         LOOP
--             IF v_image_url IS NOT NULL AND length(trim(v_image_url)) > 5 THEN
--                 INSERT INTO product_image (product_id, image_url)
--                 VALUES (v_product_id, trim(v_image_url));
--             END IF;
--         END LOOP;
--     END IF;

--     -- 🔥 NEW PRODUCT NOTIFICATION
--     INSERT INTO notification (user_id, notification_description, product_id)
--     SELECT
--         c.user_id,
--         'New product "' || p_product_name || '" has arrived 🎉',
--         v_product_id
--     FROM customer c;

--     RETURN v_product_id;
-- END;
-- $$;


ALTER TABLE notification
ADD COLUMN IF NOT EXISTS notice_id BIGINT NULL REFERENCES noticeboard(notice_id) ON DELETE CASCADE;





-- CREATE OR REPLACE FUNCTION sync_seller_rating_from_reviews()
-- RETURNS TRIGGER
-- LANGUAGE plpgsql
-- AS $$
-- DECLARE
--     v_seller_user_id BIGINT;
--     v_product_id BIGINT;
-- BEGIN
--     -- determine affected product_id
--     IF TG_OP = 'DELETE' THEN
--         v_product_id := OLD.product_id;
--     ELSE
--         v_product_id := NEW.product_id;
--     END IF;

--     -- find seller owning this product
--     SELECT st.user_id
--     INTO v_seller_user_id
--     FROM product p
--     JOIN store st ON st.store_id = p.store_id
--     WHERE p.product_id = v_product_id
--     LIMIT 1;

--     -- if no seller found, do nothing
--     IF v_seller_user_id IS NULL THEN
--         IF TG_OP = 'DELETE' THEN
--             RETURN OLD;
--         END IF;
--         RETURN NEW;
--     END IF;

--     -- recalculate seller rating_avg from all reviews of all seller products
--     UPDATE seller s
--     SET rating_avg = COALESCE((
--         SELECT ROUND(AVG(pr.rating)::numeric, 2)
--         FROM product_review pr
--         JOIN product p ON p.product_id = pr.product_id
--         JOIN store st ON st.store_id = p.store_id
--         WHERE st.user_id = v_seller_user_id
--     ), 0.00)
--     WHERE s.user_id = v_seller_user_id;

--     IF TG_OP = 'DELETE' THEN
--         RETURN OLD;
--     END IF;

--     RETURN NEW;
-- END;
-- $$;


-- DROP TRIGGER IF EXISTS trg_sync_seller_rating_from_reviews ON product_review;

-- CREATE TRIGGER trg_sync_seller_rating_from_reviews
-- AFTER INSERT OR UPDATE OR DELETE
-- ON product_review
-- FOR EACH ROW
-- EXECUTE FUNCTION sync_seller_rating_from_reviews();
-- >>>>>>> origin/shreya_branch

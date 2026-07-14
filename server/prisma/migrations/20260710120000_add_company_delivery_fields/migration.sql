-- AddCompanyAndDeliveryFields
-- Adds companyName to Client, deliveryWindow to RetailOrder, and colorName to OrderItem.
-- Also creates order and contract display ID sequences, and trigram search indexes.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE SEQUENCE IF NOT EXISTS order_display_seq START 1 INCREMENT 1;
CREATE SEQUENCE IF NOT EXISTS contract_display_seq START 1 INCREMENT 1;

CREATE INDEX IF NOT EXISTS product_name_trgm_idx ON "Product" USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS product_sub_trgm_idx ON "Product" USING gin ("subCategory" gin_trgm_ops);

ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "companyName" TEXT;
ALTER TABLE "RetailOrder" ADD COLUMN IF NOT EXISTS "deliveryWindow" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "colorName" TEXT;

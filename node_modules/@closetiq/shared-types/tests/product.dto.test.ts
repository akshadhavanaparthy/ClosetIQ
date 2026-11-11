import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CreateCatalogProductSchema,
  VerifyCatalogProductSchema,
} from '../src/product.dto.js';

const validProduct = {
  merchantId: '4a826e44-e38f-495f-9ab2-03e987543a30',
  externalId: 'merchant-sku-1',
  title: 'Linen shirt',
  brand: 'Example brand',
  category: 'TOP',
  displayCategory: 'Shirts',
  subCategory: 'Button-up shirt',
  primaryColorHex: '#F5F1E8',
  primaryColorName: 'Natural',
  price: 1499,
  productUrl: 'https://merchant.example/products/linen-shirt',
  imageUrls: [],
  availableSizes: ['S', 'M'],
};

test('catalog products require secure product URLs and Indian rupee prices', () => {
  assert.equal(CreateCatalogProductSchema.safeParse(validProduct).success, true);
  assert.equal(
    CreateCatalogProductSchema.safeParse({ ...validProduct, productUrl: 'http://merchant.example/item' }).success,
    false,
  );
  assert.equal(CreateCatalogProductSchema.safeParse({ ...validProduct, currency: 'USD' }).success, false);
});

test('catalog images require permission confirmation and a source URL', () => {
  const image = 'https://cdn.merchant.example/item.jpg';
  assert.equal(
    CreateCatalogProductSchema.safeParse({ ...validProduct, imageUrls: [image] }).success,
    false,
  );
  assert.equal(
    CreateCatalogProductSchema.safeParse({
      ...validProduct,
      imageUrls: [image],
      imagePermissionConfirmed: true,
      imageAttributionUrl: 'https://merchant.example/products/linen-shirt',
    }).success,
    true,
  );
});

test('manual verification requires an explicit accuracy attestation', () => {
  assert.equal(VerifyCatalogProductSchema.safeParse({ inStock: true, attestAccuracy: true }).success, true);
  assert.equal(VerifyCatalogProductSchema.safeParse({ inStock: true, attestAccuracy: false }).success, false);
});

import React, { useEffect, useState } from 'react';
import { AuthModal } from './AuthModal';
import { api, UserSession } from '../services/api';
import {
  CreateCatalogProductDto,
  CreateMerchantDto,
  MerchantDto,
  ProductDto,
} from '@closetiq/shared-types';

interface CatalogAdminPageProps {
  session: UserSession | null;
  onAuthSuccess: (user: UserSession) => void;
}

const categoryOptions = [
  ['TOP', 'Top'],
  ['BOTTOM', 'Bottom'],
  ['DRESS', 'Dress'],
  ['OUTERWEAR', 'Outerwear'],
  ['FOOTWEAR', 'Footwear'],
  ['ACCESSORY', 'Accessory'],
  ['BAG', 'Bag'],
] as const;
const catalogVerificationMaxAgeMs = 24 * 60 * 60 * 1000;

const emptyProduct: CreateCatalogProductDto = {
  merchantId: '',
  externalId: '',
  title: '',
  brand: '',
  description: '',
  category: 'TOP',
  displayCategory: '',
  subCategory: '',
  styleCategory: '',
  primaryColorHex: '#6A6258',
  primaryColorName: '',
  pattern: 'Solid',
  formalityLevel: 'SMART_CASUAL',
  seasons: [],
  price: 1,
  currency: 'INR',
  retailPrice: null,
  productUrl: '',
  imageUrls: [],
  availableSizes: [],
  imageAttributionUrl: '',
  imagePermissionConfirmed: false,
};

const sourceLabels: Record<ProductDto['dataSource'], string> = {
  ADMIN_MANUAL: 'Manually maintained',
  OFFICIAL_API: 'Official API',
  AFFILIATE_FEED: 'Authorized affiliate feed',
  MERCHANT_FEED: 'Merchant feed',
};

export const CatalogAdminPage: React.FC<CatalogAdminPageProps> = ({ session, onAuthSuccess }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [merchants, setMerchants] = useState<MerchantDto[]>([]);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [merchantDraft, setMerchantDraft] = useState<CreateMerchantDto>({
    name: '',
    slug: '',
    homepageUrl: '',
  });
  const [productDraft, setProductDraft] = useState<CreateCatalogProductDto>(emptyProduct);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [verificationConsentId, setVerificationConsentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (session?.role !== 'ADMIN') return;
    setLoading(true);
    setError(null);
    Promise.all([api.getAdminMerchants(), api.getAdminProducts()])
      .then(([merchantList, productList]) => {
        setMerchants(merchantList);
        setProducts(productList);
      })
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : 'Catalog data could not be loaded.');
      })
      .finally(() => setLoading(false));
  }, [session]);

  if (!session) {
    return (
      <main className="admin-access">
        <h1>Catalog administration</h1>
        <p>Sign in with an administrator account to manage verified product information.</p>
        <button type="button" className="btn-primary" onClick={() => setIsAuthOpen(true)}>Sign in</button>
        <a href="/">Return to ClosetIQ</a>
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={onAuthSuccess} />
      </main>
    );
  }

  if (session.role !== 'ADMIN') {
    return (
      <main className="admin-access">
        <h1>Administrator access required</h1>
        <p>This account does not have permission to manage the catalog.</p>
        <a href="/">Return to ClosetIQ</a>
      </main>
    );
  }

  const refreshCatalog = async () => {
    const [merchantList, productList] = await Promise.all([
      api.getAdminMerchants(),
      api.getAdminProducts(),
    ]);
    setMerchants(merchantList);
    setProducts(productList);
  };

  const handleMerchantSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const merchant = await api.createAdminMerchant(merchantDraft);
      setMerchants((current) => [...current, merchant].sort((a, b) => a.name.localeCompare(b.name)));
      setProductDraft((current) => ({ ...current, merchantId: merchant.id }));
      setMerchantDraft({ name: '', slug: '', homepageUrl: '' });
      setNotice('Merchant saved. Products will remain hidden until an administrator verifies their details.');
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : 'Merchant could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const handleProductSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      if (editingProductId) {
        const { merchantId: _merchantId, ...updates } = productDraft;
        const updated = await api.updateAdminProduct(editingProductId, {
          ...updates,
          styleCategory: updates.styleCategory || null,
          imageAttributionUrl: updates.imageAttributionUrl || null,
        });
        setProducts((current) => current.map((item) => item.id === updated.id ? updated : item));
        setNotice('Product updated and returned to the unverified state.');
      } else {
        const created = await api.createAdminProduct({
          ...productDraft,
          styleCategory: productDraft.styleCategory || null,
          imageAttributionUrl: productDraft.imageAttributionUrl || null,
        });
        setProducts((current) => [created, ...current]);
        setNotice('Product saved as unverified. It is not visible to shoppers yet.');
      }
      setProductDraft(emptyProduct);
      setEditingProductId(null);
      setVerificationConsentId(null);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : 'Product could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const editProduct = (product: ProductDto) => {
    setProductDraft({
      ...emptyProduct,
      merchantId: product.merchantId,
      externalId: product.externalId,
      title: product.title,
      brand: product.brand,
      description: product.description,
      category: product.category,
      displayCategory: product.displayCategory || '',
      subCategory: product.subCategory,
      styleCategory: product.styleCategory || '',
      primaryColorHex: product.primaryColorHex,
      primaryColorName: product.primaryColorName,
      pattern: product.pattern,
      formalityLevel: product.formalityLevel,
      seasons: product.seasons,
      price: product.price,
      currency: 'INR',
      retailPrice: product.retailPrice,
      productUrl: product.productUrl,
      imageUrls: product.imageUrls,
      availableSizes: product.availableSizes,
      imageAttributionUrl: product.imageAttributionUrl || '',
      imagePermissionConfirmed: product.imagePermissionConfirmed || false,
    });
    setEditingProductId(product.id);
    setVerificationConsentId(null);
  };

  const verifyProduct = async (product: ProductDto) => {
    if (verificationConsentId !== product.id) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const updated = await api.verifyAdminProduct(product.id, {
        inStock: true,
        attestAccuracy: true,
      });
      setProducts((current) => current.map((item) => item.id === updated.id ? updated : item));
      setNotice(`${product.title} was marked manually verified and available.`);
      setVerificationConsentId(null);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : 'Product verification failed.');
    } finally {
      setSaving(false);
    }
  };

  const markUnavailable = async (product: ProductDto) => {
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const updated = await api.markAdminProductUnavailable(product.id);
      setProducts((current) => current.map((item) => item.id === updated.id ? updated : item));
      setNotice(`${product.title} is no longer shown as available.`);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : 'Availability could not be changed.');
    } finally {
      setSaving(false);
    }
  };

  const updateProductField = <K extends keyof CreateCatalogProductDto>(
    key: K,
    value: CreateCatalogProductDto[K],
  ) => setProductDraft((current) => ({ ...current, [key]: value }));

  return (
    <main className="container admin-catalog">
      <header className="admin-catalog-header">
        <div>
          <a href="/" className="admin-back-link">ClosetIQ</a>
          <p className="editorial-caps text-terracotta">Administrator workspace</p>
          <h1 className="editorial-title">Product catalog</h1>
          <p>Only enter products, prices, links, and images that you have permission to use and have checked.</p>
        </div>
      </header>

      <aside className="admin-catalog-notice">
        <strong>Verification policy</strong>
        <p>New manual listings are hidden from shoppers until checked. Manually maintained listings are labeled as such. ClosetIQ does not process purchases; purchase links open the merchant's product page.</p>
      </aside>

      {error && <p className="connection-error" role="alert">{error}</p>}
      {notice && <p className="connection-notice" role="status">{notice}</p>}

      <section className="admin-catalog-section">
        <h2>Merchants</h2>
        <form className="admin-form-grid" onSubmit={handleMerchantSubmit}>
          <label>
            Merchant or brand name
            <input required maxLength={100} value={merchantDraft.name}
              onChange={(event) => setMerchantDraft({ ...merchantDraft, name: event.target.value })} />
          </label>
          <label>
            URL slug
            <input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={merchantDraft.slug}
              onChange={(event) => setMerchantDraft({ ...merchantDraft, slug: event.target.value })} />
          </label>
          <label>
            Official homepage (HTTPS)
            <input required type="url" value={merchantDraft.homepageUrl}
              onChange={(event) => setMerchantDraft({ ...merchantDraft, homepageUrl: event.target.value })} />
          </label>
          <button type="submit" className="btn-secondary" disabled={saving}>Add merchant</button>
        </form>
        {merchants.length > 0 && (
          <ul className="admin-merchant-list">
            {merchants.map((merchant) => (
              <li key={merchant.id}><a href={merchant.homepageUrl} target="_blank" rel="noreferrer">{merchant.name}</a></li>
            ))}
          </ul>
        )}
      </section>

      <section className="admin-catalog-section">
        <h2>{editingProductId ? 'Edit manual listing' : 'Add a manually maintained product'}</h2>
        <p className="admin-help">Products entered here start unverified and remain private until reviewed. Use the merchant's own product URL, not a guessed or generic link.</p>
        <form className="admin-form-grid" onSubmit={handleProductSubmit}>
          <label>
            Merchant
            <select required value={productDraft.merchantId}
              onChange={(event) => updateProductField('merchantId', event.target.value)}>
              <option value="">Select a merchant</option>
              {merchants.map((merchant) => <option key={merchant.id} value={merchant.id}>{merchant.name}</option>)}
            </select>
          </label>
          <label>
            Product / SKU identifier
            <input required maxLength={150} value={productDraft.externalId}
              onChange={(event) => updateProductField('externalId', event.target.value)} />
          </label>
          <label>
            Product name
            <input required maxLength={200} value={productDraft.title}
              onChange={(event) => updateProductField('title', event.target.value)} />
          </label>
          <label>
            Brand
            <input required maxLength={100} value={productDraft.brand}
              onChange={(event) => updateProductField('brand', event.target.value)} />
          </label>
          <label>
            Broad styling slot
            <select value={productDraft.category} onChange={(event) =>
              updateProductField('category', event.target.value as CreateCatalogProductDto['category'])}>
              {categoryOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label>
            Shopper-facing category
            <input required maxLength={80} placeholder="For example, Sarees or Crop Tops" value={productDraft.displayCategory}
              onChange={(event) => updateProductField('displayCategory', event.target.value)} />
          </label>
          <label>
            Subcategory
            <input required maxLength={100} value={productDraft.subCategory}
              onChange={(event) => updateProductField('subCategory', event.target.value)} />
          </label>
          <label>
            Product page URL (HTTPS)
            <input required type="url" value={productDraft.productUrl}
              onChange={(event) => updateProductField('productUrl', event.target.value)} />
          </label>
          <label>
            Current listed price
            <input required type="number" min="0.01" step="0.01" value={productDraft.price}
              onChange={(event) => updateProductField('price', Number(event.target.value))} />
          </label>
          <label>
            Currency
            <input value="INR" readOnly aria-readonly="true" />
          </label>
          <label>
            Available sizes, comma-separated
            <input value={productDraft.availableSizes.join(', ')}
              onChange={(event) => updateProductField('availableSizes', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} />
          </label>
          <label>
            Primary color name
            <input required maxLength={60} value={productDraft.primaryColorName}
              onChange={(event) => updateProductField('primaryColorName', event.target.value)} />
          </label>
          <label>
            Primary color hex
            <input required pattern="#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})" value={productDraft.primaryColorHex}
              onChange={(event) => updateProductField('primaryColorHex', event.target.value)} />
          </label>
          <label className="admin-form-wide">
            Description
            <textarea maxLength={4000} value={productDraft.description || ''}
              onChange={(event) => updateProductField('description', event.target.value)} />
          </label>
          <label className="admin-form-wide">
            Product image URLs, one per line
            <textarea value={productDraft.imageUrls.join('\n')}
              onChange={(event) => updateProductField('imageUrls', event.target.value.split('\n').map((url) => url.trim()).filter(Boolean))} />
          </label>
          <label className="admin-form-wide">
            Image source / permission reference URL
            <input type="url" value={productDraft.imageAttributionUrl || ''}
              onChange={(event) => updateProductField('imageAttributionUrl', event.target.value || null)} />
          </label>
          <label className="admin-checkbox admin-form-wide">
            <input type="checkbox" checked={productDraft.imagePermissionConfirmed}
              onChange={(event) => updateProductField('imagePermissionConfirmed', event.target.checked)} />
            I have permission to display these product images.
          </label>
          <div className="admin-form-actions admin-form-wide">
            <button type="submit" className="btn-primary" disabled={saving || !merchants.length}>
              {saving ? 'Saving...' : editingProductId ? 'Update listing' : 'Save as unverified'}
            </button>
            {editingProductId && (
              <button type="button" className="btn-secondary" onClick={() => {
                setEditingProductId(null);
                setProductDraft(emptyProduct);
                setVerificationConsentId(null);
              }}>Cancel edit</button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-catalog-section">
        <div className="admin-products-heading">
          <h2>Catalog records</h2>
          <button type="button" className="btn-secondary" disabled={loading || saving} onClick={() => {
            setLoading(true);
            setError(null);
            refreshCatalog().catch((requestError: unknown) => {
              setError(requestError instanceof Error ? requestError.message : 'Catalog refresh failed.');
            }).finally(() => setLoading(false));
          }}>Refresh</button>
        </div>
        {loading ? <p role="status">Loading catalog records...</p> : products.length === 0 ? (
          <p className="admin-empty">No product records have been entered.</p>
        ) : (
          <div className="admin-product-list">
            {products.map((product) => (
              <article className="admin-product-row" key={product.id}>
                <div>
                  <p className="editorial-caps text-muted">{sourceLabels[product.dataSource]} · {product.displayCategory || product.subCategory}</p>
                  <h3>{product.title}</h3>
                  <p>{product.brand} · {product.currency} {product.price.toFixed(2)} · {product.merchantName}</p>
                  <a href={product.productUrl} target="_blank" rel="noreferrer">Open product page</a>
                  <p className="admin-product-status">
                    {product.verifiedAt &&
                      Date.now() - new Date(product.verifiedAt).getTime() >
                        catalogVerificationMaxAgeMs
                      ? 'verification expired'
                      : product.verificationStatus.replace(/_/g, ' ')}
                    {product.verifiedAt ? `, checked ${new Date(product.verifiedAt).toLocaleDateString()}` : ''}
                    {product.inStock ? ', marked available' : ', not shown as available'}
                  </p>
                </div>
                <div className="admin-product-actions">
                  <button type="button" className="btn-secondary" disabled={saving} onClick={() => editProduct(product)}>Edit</button>
                  {product.dataSource === 'ADMIN_MANUAL' && (
                    <div className="admin-verification">
                      <label className="admin-checkbox">
                        <input type="checkbox" checked={verificationConsentId === product.id}
                          onChange={(event) => setVerificationConsentId(event.target.checked ? product.id : null)} />
                        I checked this page, price, details, image rights, and current availability.
                      </label>
                      <button type="button" className="btn-primary"
                        disabled={saving || verificationConsentId !== product.id}
                        onClick={() => verifyProduct(product)}>
                        {product.inStock ? 'Recheck and keep available' : 'Mark checked and available'}
                      </button>
                    </div>
                  )}
                  {product.inStock && (
                    <button type="button" className="btn-secondary" disabled={saving} onClick={() => markUnavailable(product)}>
                      Mark unavailable
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

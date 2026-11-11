import React, { useEffect, useState } from 'react';
import { Bookmark, ExternalLink, Shirt } from 'lucide-react';
import { ProductDto } from '@closetiq/shared-types';
import { api } from '../services/api';

interface ProductDiscoveryProps {
  isAuthenticated: boolean;
  onOpenAuth: () => void;
}

const categories = [
  'All',
  'Fancy / Party Wear',
  'Traditional Wear',
  'Casual Wear',
  'Crop Tops',
  'Tops',
  'Shirts',
  'T-Shirts',
  'Jeans',
  'Trousers',
  'Skirts',
  'Dresses',
  'Ethnic Wear',
  'Kurtis',
  'Sarees',
  'Accessories',
];

const sourceLabel = (product: ProductDto) =>
  product.verificationStatus === 'LIVE_VERIFIED'
    ? 'Verified live feed'
    : 'Manually maintained';

export const ProductDiscovery: React.FC<ProductDiscoveryProps> = ({ isAuthenticated, onOpenAuth }) => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [minimumPrice, setMinimumPrice] = useState('');
  const [maximumPrice, setMaximumPrice] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [loading, setLoading] = useState(true);
  const [savingProductId, setSavingProductId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([api.getCatalogBrands(), api.getCatalogSizes()])
      .then(([brandList, sizeList]) => {
        if (!active) return;
        setBrands(brandList);
        setSizes(sizeList);
      })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Catalog filters could not be loaded.');
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    api.getCatalog({
      displayCategory: category,
      search: search.trim() || undefined,
      brand: brand || undefined,
      size: size || undefined,
      color: color.trim() || undefined,
      priceMin: minimumPrice ? Number(minimumPrice) : undefined,
      priceMax: maximumPrice ? Number(maximumPrice) : undefined,
      sortBy,
      pageSize: 100,
    }).then((results) => {
      if (active) setProducts(results);
    }).catch((requestError: unknown) => {
      if (active) setError(requestError instanceof Error ? requestError.message : 'Products could not be loaded.');
    }).finally(() => {
      if (active) setLoading(false);
    });

    return () => { active = false; };
  }, [category, search, brand, size, color, minimumPrice, maximumPrice, sortBy]);

  useEffect(() => {
    let active = true;
    if (!isAuthenticated) {
      setSavedIds([]);
      return () => { active = false; };
    }

    api.getWishlist().then((items) => {
      if (active) setSavedIds(items.map((item) => item.id));
    }).catch((requestError: unknown) => {
      if (active) setError(requestError instanceof Error ? requestError.message : 'Wishlist could not be loaded.');
    });

    return () => { active = false; };
  }, [isAuthenticated]);

  const toggleSaved = async (product: ProductDto) => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    const currentlySaved = savedIds.includes(product.id);
    setSavingProductId(product.id);
    setError(null);
    setNotice(null);
    try {
      const saved = await api.toggleWishlist(product.id, currentlySaved);
      setSavedIds((current) => saved
        ? [...current, product.id]
        : current.filter((id) => id !== product.id));
      setNotice(saved ? 'Saved to your wishlist.' : 'Removed from your wishlist.');
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : 'Wishlist could not be updated.');
    } finally {
      setSavingProductId(null);
    }
  };

  return (
    <section className="product-discovery" aria-labelledby="product-discovery-title">
      <header className="product-discovery-heading">
        <div>
          <span className="editorial-caps text-terracotta">Product discovery</span>
          <h1 id="product-discovery-title" className="editorial-title">Discover pieces</h1>
          <p>Browse product information checked by ClosetIQ. Purchases take place on the merchant's website.</p>
        </div>
      </header>

      <div className="category-filters" aria-label="Product categories">
        {categories.map((item) => (
          <button key={item} type="button" className={`category-filter${category === item ? ' active' : ''}`}
            aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>
        ))}
      </div>

      <div className="catalog-filters">
        <label>
          Search products
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
        <label>
          Brand
          <select value={brand} onChange={(event) => setBrand(event.target.value)}>
            <option value="">All brands</option>
            {brands.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          Size
          <select value={size} onChange={(event) => setSize(event.target.value)}>
            <option value="">All sizes</option>
            {sizes.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          Color
          <input type="search" value={color} onChange={(event) => setColor(event.target.value)} />
        </label>
        <label>
          Minimum price (INR)
          <input type="number" min="0" value={minimumPrice} onChange={(event) => setMinimumPrice(event.target.value)} />
        </label>
        <label>
          Maximum price (INR)
          <input type="number" min="0" value={maximumPrice} onChange={(event) => setMaximumPrice(event.target.value)} />
        </label>
        <label>
          Sort by
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
        </label>
      </div>

      {error && <p className="connection-error" role="alert">{error}</p>}
      {notice && <p className="connection-notice" role="status">{notice}</p>}

      {loading ? <p className="catalog-status" role="status">Loading verified product listings...</p> :
        products.length === 0 ? (
          <div className="empty-state">
            <h2>No verified products currently match these filters</h2>
            <p>ClosetIQ only shows products after their details and merchant page have been checked. No sample listings are used.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => {
              const isSaved = savedIds.includes(product.id);
              const displayImage = product.imagePermissionConfirmed ? product.imageUrls[0] : undefined;
              return (
                <article className="product-card" key={product.id}>
                  <div className="product-card-image">
                    {displayImage ? <img src={displayImage} alt={product.title} loading="lazy" decoding="async" /> :
                      <div className="image-placeholder" aria-hidden="true"><Shirt /></div>}
                    <span className="product-source-label">{sourceLabel(product)}</span>
                  </div>
                  <div className="product-card-content">
                    <p className="editorial-caps text-muted">{product.brand} · {product.displayCategory || product.subCategory}</p>
                    <h2>{product.title}</h2>
                    <p className="product-card-color">
                      <span aria-hidden="true" style={{ backgroundColor: product.primaryColorHex }} />
                      {product.primaryColorName}
                      {product.availableSizes.length > 0 ? ` · Sizes ${product.availableSizes.join(', ')}` : ''}
                    </p>
                    <p className="product-card-price">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: product.currency }).format(product.price)}
                    </p>
                    {product.verifiedAt && (
                      <p className="product-card-verified">Checked {new Date(product.verifiedAt).toLocaleDateString()}</p>
                    )}
                    <div className="product-card-actions">
                      <a className="btn-primary product-buy-link" href={product.productUrl} target="_blank" rel="noopener noreferrer">
                        Buy now <ExternalLink aria-hidden="true" size={15} />
                      </a>
                      <button type="button" className="product-save-button" aria-pressed={isSaved}
                        aria-label={isSaved ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
                        disabled={savingProductId === product.id} onClick={() => toggleSaved(product)}>
                        <Bookmark aria-hidden="true" size={17} />
                        {isSaved ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
    </section>
  );
};

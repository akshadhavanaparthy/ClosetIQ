import React, { useState } from 'react';
import { ProductDto } from '@closetiq/shared-types';
import { X, Heart, ShoppingBag, ExternalLink, Sparkles, ShieldCheck, Truck, Shirt } from 'lucide-react';

interface ProductDetailModalProps {
  product: ProductDto | null;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: ProductDto, size: string, quantity: number) => void;
  complementaryProducts: ProductDto[];
  onSelectProduct: (product: ProductDto) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  complementaryProducts,
  onSelectProduct,
}) => {
  if (!isOpen || !product) return null;

  const availableSizes = product.availableSizes || ['XS', 'S', 'M', 'L', 'XL'];
  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content p-8"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '52rem' }}
      >
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-muted"
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', border: 'none', background: 'transparent', cursor: 'pointer', zIndex: 10 }}
        >
          <X style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div
              className="aspect-garment product-placeholder rounded-lg overflow-hidden"
              style={{ border: '1px solid var(--border-stone)' }}
            >
              <Shirt aria-hidden="true" />
              <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                <span className="badge-formality" style={{ backgroundColor: 'rgba(255,255,255,0.92)' }}>
                  {product.merchantName || 'Merchant not provided'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted">
              <span
                style={{
                  width: '1rem',
                  height: '1rem',
                  borderRadius: '9999px',
                  backgroundColor: product.primaryColorHex,
                  border: '1px solid rgba(0,0,0,0.2)',
                  display: 'inline-block',
                }}
              />
              <span className="font-medium text-obsidian">{product.primaryColorName}</span>
              <span>•</span>
              <span className="badge-formality" style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem' }}>
                {product.category}
              </span>
            </div>
          </div>

          {/* Product Details & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <p className="editorial-caps text-muted mb-1" style={{ fontSize: '0.68rem' }}>
                {product.brand}
              </p>
              <h2 className="font-serif text-3xl font-medium text-obsidian">{product.title}</h2>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="font-serif text-3xl font-light text-terracotta">${product.price}</span>
                {product.retailPrice && product.retailPrice > product.price && (
                  <span className="text-sm text-muted line-through font-mono">${product.retailPrice}</span>
                )}
                <span className="text-xs text-muted font-mono">{product.currency}</span>
              </div>

              <p className="text-xs text-muted mt-4 leading-relaxed">{product.description}</p>

              {/* Size Selector */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="editorial-caps text-muted" style={{ fontSize: '0.62rem' }}>
                    Select Size
                  </span>
                  <span className="text-xs text-muted underline cursor-pointer" style={{ fontSize: '0.7rem' }}>
                    Sizing Guide
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition ${
                        selectedSize === sz
                          ? 'bg-obsidian text-white border-obsidian'
                          : 'bg-linen-pure text-muted border-stone hover:border-obsidian'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-3">
                <span className="editorial-caps text-muted" style={{ fontSize: '0.62rem' }}>
                  Quantity:
                </span>
                <div className="flex items-center border border-stone rounded-lg overflow-hidden bg-linen-warm">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-xs text-obsidian"
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-mono font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-xs text-obsidian"
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                  >
                    +
                  </button>
                </div>
                <span className="badge-formality badge-olive text-xs" style={{ fontSize: '0.65rem' }}>
                  {product.inStock ? 'In Stock (Direct Delivery)' : 'Pre-Order'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4" style={{ borderTop: '1px solid var(--border-stone-light)' }}>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="btn-primary flex-1"
                  style={{ padding: '0.85rem' }}
                >
                  <ShoppingBag style={{ width: '1rem', height: '1rem' }} />
                  <span>{addedToast ? 'Added to Bag ✓' : 'Add to Shopping Bag'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  className={`p-3 rounded-lg border transition flex items-center justify-center ${
                    isWishlisted ? 'bg-terracotta text-white border-terracotta' : 'bg-linen-pure text-muted border-stone'
                  }`}
                  style={{ width: '3rem', height: '3rem', cursor: 'pointer' }}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
                >
                  <Heart style={{ width: '1.2rem', height: '1.2rem', fill: isWishlisted ? 'currentColor' : 'none' }} />
                </button>
              </div>

              {product.productUrl && (
                <a
                  href={product.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full text-center"
                  style={{ padding: '0.65rem', fontSize: '0.75rem' }}
                >
                  <ExternalLink style={{ width: '0.85rem', height: '0.85rem' }} />
                  <span>View Original Boutique on {product.merchantName || 'Merchant'}</span>
                </a>
              )}

              <div className="flex items-center justify-between text-xs text-muted pt-2" style={{ fontSize: '0.7rem' }}>
                <span className="flex items-center gap-1">
                  <ShieldCheck style={{ width: '0.85rem', height: '0.85rem', color: 'var(--accent-olive)' }} />
                  100% Authenticity Guaranteed
                </span>
                <span className="flex items-center gap-1">
                  <Truck style={{ width: '0.85rem', height: '0.85rem', color: 'var(--accent-terracotta)' }} />
                  Complimentary White-Glove Shipping
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Complete My Outfit Strip */}
        {complementaryProducts.length > 0 && (
          <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--border-stone)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles style={{ width: '1rem', height: '1rem', color: 'var(--accent-terracotta)' }} />
              <h3 className="font-serif text-xl font-medium text-obsidian">Complete The Outfit Formula</h3>
              <span className="editorial-caps text-muted" style={{ fontSize: '0.62rem' }}>
                Algorithmic Pairings
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {complementaryProducts.slice(0, 3).map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => onSelectProduct(comp)}
                  className="editorial-card p-3 flex items-center gap-3 cursor-pointer"
                >
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-linen-warm flex-shrink-0 image-placeholder" aria-hidden="true">
                    <Shirt />
                  </div>
                  <div className="truncate">
                    <p className="editorial-caps text-muted" style={{ fontSize: '0.58rem' }}>{comp.brand}</p>
                    <p className="text-xs font-semibold text-obsidian truncate mt-0.5">{comp.title}</p>
                    <p className="text-xs font-mono text-terracotta mt-1">${comp.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

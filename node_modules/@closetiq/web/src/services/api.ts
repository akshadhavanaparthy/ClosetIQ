import {
  WardrobeItemDto,
  ProductDto,
  OutfitDto,
  BodyAnalysisResponseDto,
  ProfileResponseDto,
  CompleteMyOutfitDto,
  CreateWardrobeItemDto,
  CreateCatalogProductDto,
  CreateMerchantDto,
  MerchantDto,
  UpdateCatalogProductDto,
  VerifyCatalogProductDto,
} from '@closetiq/shared-types';

const API_BASE = '/api/v1';

// --- AUTH & USER TYPES ---
export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  role: 'USER' | 'STYLIST' | 'ADMIN';
  token: string;
}

export interface CartItem {
  product: ProductDto;
  size: string;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'CONFIRMED' | 'DISPATCHED' | 'DELIVERED';
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  paymentMethod: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  timestamp: string;
  details: string;
  userEmail: string;
}

// --- LOCAL STORAGE HELPERS ---
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`closetiq_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`closetiq_${key}`, JSON.stringify(value));
  } catch (err) {
    console.warn(`Could not persist ${key}:`, err);
  }
}

// Refresh tokens remain in HttpOnly cookies. Access tokens stay in memory only.
type StoredSessionIdentity = Omit<UserSession, 'token'>;
const storedIdentity = getStored<StoredSessionIdentity | null>('session_identity', null)
  || (() => {
    const legacySession = getStored<UserSession | null>('session', null);
    if (!legacySession) return null;
    const { id, email, fullName, role } = legacySession;
    return { id, email, fullName, role };
  })();
try {
  localStorage.removeItem('closetiq_session');
} catch (error) {
  console.warn('Could not remove the legacy session token from local storage:', error);
}
let sessionState: UserSession | null = storedIdentity ? { ...storedIdentity, token: '' } : null;
let refreshInFlight: Promise<UserSession | null> | null = null;

function persistSession(user: UserSession): void {
  sessionState = user;
  const { id, email, fullName, role } = user;
  setStored('session_identity', { id, email, fullName, role });
  try {
    localStorage.removeItem('closetiq_session');
  } catch (error) {
    console.warn('Could not remove the legacy session token from local storage:', error);
  }
}

function clearSession(): void {
  sessionState = null;
  try {
    localStorage.removeItem('closetiq_session');
    localStorage.removeItem('closetiq_session_identity');
  } catch (error) {
    console.warn('Could not clear the local session identity:', error);
  }
}

let profileState: ProfileResponseDto | null = getStored<ProfileResponseDto | null>('profile', null);
let wardrobeState: WardrobeItemDto[] = getStored<WardrobeItemDto[]>('wardrobe', []);
let catalogState: ProductDto[] = [];
let wishlistState: string[] = [];
let savedOutfitsState: OutfitDto[] = getStored<OutfitDto[]>('saved_outfits', []);
let cartState: CartItem[] = getStored<CartItem[]>('cart', []);
let ordersState: OrderRecord[] = getStored<OrderRecord[]>('orders', []);
let auditLogsState: AuditLogEntry[] = getStored<AuditLogEntry[]>('audit_logs', []);

const getAuthHeaders = (): HeadersInit =>
  sessionState?.token ? { Authorization: `Bearer ${sessionState.token}` } : {};

async function refreshSession(): Promise<UserSession | null> {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    const res = await globalThis.fetch(`${API_BASE}/auth/refresh`, { method: 'POST', credentials: 'include' });
    if (res.status === 401) {
      clearSession();
      return null;
    }
    if (!res.ok) throw new Error(`Session refresh failed (${res.status}).`);

    const json = await res.json();
    const user: UserSession = {
      id: json.data.user.id,
      email: json.data.user.email,
      fullName: json.data.user.fullName || json.data.user.email.split('@')[0],
      role: json.data.user.role,
      token: json.data.accessToken,
    };
    persistSession(user);
    return user;
  })();
  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

async function authenticatedFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const send = () => {
    const headers = new Headers(init.headers);
    if (sessionState?.token) headers.set('Authorization', `******`);
    return globalThis.fetch(input, { ...init, headers, credentials: 'include' });
  };
  let response = await send();
  if (response.status === 401) {
    const refreshedUser = await refreshSession();
    if (refreshedUser) response = await send();
  }
  return response;
}

const fetch = (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  if (url.includes(`${API_BASE}/auth/`)) {
    return globalThis.fetch(input, { ...init, credentials: 'include' });
  }
  return authenticatedFetch(input, init);
};

async function throwApiError(response: Response, action: string): Promise<never> {
  if (response.headers.get('content-type')?.includes('application/json')) {
    const json = await response.json();
    throw new Error(json.error?.message || `${action} (${response.status}).`);
  }
  throw new Error(`${action} (${response.status}).`);
}

// --- COMPLETE API CLIENT ---
export const api = {
  // Session & Authentication
  getCurrentUser(): UserSession | null {
    return sessionState;
  },

  async restoreSession(): Promise<UserSession | null> {
    if (sessionState?.token) return sessionState;
    if (!sessionState) return null;
    return refreshSession();
  },

  async login(email: string, password: string): Promise<UserSession> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    if (!res.ok) {
      await throwApiError(res, 'Sign-in failed');
    }
    const json = await res.json();
    const user: UserSession = {
      id: json.data.user.id,
      email: json.data.user.email,
      fullName: json.data.user.profile?.fullName || email.split('@')[0],
      role: json.data.user.role || 'USER',
      token: json.data.tokens.accessToken,
    };
    persistSession(user);
    this.logAudit('USER_LOGIN', 'Logged in via API', user.email);
    return user;
  },

  async register(name: string, email: string, password: string): Promise<UserSession> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: name, email, password }),
      credentials: 'include',
    });
    if (!res.ok) {
      await throwApiError(res, 'Account creation failed');
    }
    const json = await res.json();
    const user: UserSession = {
      id: json.data.user.id,
      email: json.data.user.email,
      fullName: name,
      role: 'USER',
      token: json.data.tokens.accessToken,
    };
    persistSession(user);
    this.logAudit('USER_REGISTERED', 'Account created via API', user.email);
    return user;
  },

  async logout(): Promise<void> {
    if (sessionState) {
      this.logAudit('USER_LOGOUT', `Logged out`, sessionState.email);
    }
    try {
      const res = await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
      if (!res.ok && res.status !== 401) throw new Error(`Sign-out failed (${res.status}).`);
    } finally {
      clearSession();
    }
  },

  // Profile
  async getProfile(): Promise<ProfileResponseDto> {
    const res = await fetch(`${API_BASE}/profile/me`, { headers: getAuthHeaders() });
    if (!res.ok) {
      throw new Error(`Profile request failed (${res.status}).`);
    }
    const json = await res.json();
    profileState = json.data;
    setStored('profile', profileState);
    return json.data;
  },

  async updateProfile(updates: Partial<ProfileResponseDto>): Promise<ProfileResponseDto> {
    const res = await fetch(`${API_BASE}/profile/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      throw new Error(`Profile update failed (${res.status}).`);
    }
    const json = await res.json();
    profileState = json.data;
    setStored('profile', profileState);
    return json.data;
  },

  // Wardrobe
  async getWardrobe(): Promise<WardrobeItemDto[]> {
    const res = await fetch(`${API_BASE}/wardrobe`, { headers: getAuthHeaders() });
    if (!res.ok) {
      throw new Error(`Wardrobe request failed (${res.status}).`);
    }
    const json = await res.json();
    wardrobeState = json.data;
    setStored('wardrobe', wardrobeState);
    return json.data;
  },

  async addWardrobeItem(dto: CreateWardrobeItemDto): Promise<WardrobeItemDto> {
    const res = await fetch(`${API_BASE}/wardrobe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      throw new Error(`Wardrobe item could not be saved (${res.status}).`);
    }
    const json = await res.json();
    wardrobeState.unshift(json.data);
    setStored('wardrobe', wardrobeState);
    this.logAudit('WARDROBE_ITEM_ADDED', `Added ${dto.name} (${dto.category})`, sessionState?.email || 'user');
    return json.data;
  },

  async updateWardrobeItem(id: string, updates: Partial<WardrobeItemDto>): Promise<WardrobeItemDto> {
    const res = await fetch(`${API_BASE}/wardrobe/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(updates),
    });
    if (!res.ok) await throwApiError(res, 'Wardrobe item could not be updated');
    const json = await res.json();
    const index = wardrobeState.findIndex((item) => item.id === id);
    if (index >= 0) wardrobeState[index] = json.data;
    setStored('wardrobe', wardrobeState);
    return json.data;
  },

  async deleteWardrobeItem(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/wardrobe/${encodeURIComponent(id)}`, { method: 'DELETE', headers: getAuthHeaders() });
    if (!res.ok) await throwApiError(res, 'Wardrobe item could not be deleted');
    wardrobeState = wardrobeState.filter((w) => w.id !== id);
    setStored('wardrobe', wardrobeState);
    this.logAudit('WARDROBE_ITEM_DELETED', `Deleted garment ${id}`, sessionState?.email || 'user');
  },

  // Catalog & Discovery
  async getCatalog(query?: {
    search?: string;
    category?: string;
    displayCategory?: string;
    priceMin?: number;
    priceMax?: number;
    brand?: string;
    color?: string;
    size?: string;
    sortBy?: 'recommended' | 'price_asc' | 'price_desc' | 'newest';
    pageSize?: number;
  }): Promise<ProductDto[]> {
    const searchParams = new URLSearchParams();
    if (query?.search) searchParams.set('search', query.search);
    if (query?.category && query.category !== 'ALL') searchParams.set('category', query.category);
    if (query?.displayCategory && query.displayCategory !== 'All') {
      searchParams.set('displayCategory', query.displayCategory);
    }
    if (query?.priceMin !== undefined) searchParams.set('priceMin', String(query.priceMin));
    if (query?.priceMax !== undefined) searchParams.set('priceMax', String(query.priceMax));
    if (query?.brand) searchParams.set('brand', query.brand);
    if (query?.color) searchParams.set('color', query.color);
    if (query?.size) searchParams.set('size', query.size);
    if (query?.sortBy) searchParams.set('sortBy', query.sortBy);
    if (query?.pageSize) searchParams.set('pageSize', String(query.pageSize));

    const queryString = searchParams.toString();
    const url = `${API_BASE}/discovery/search${queryString ? `?${queryString}` : ''}`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) {
      throw new Error(`Product catalog request failed (${res.status}).`);
    }
    const json = await res.json();
    catalogState = json.data;
    return catalogState;
  },

  async getCatalogBrands(): Promise<string[]> {
    const res = await fetch(`${API_BASE}/discovery/brands`);
    if (!res.ok) throw new Error(`Catalog brands request failed (${res.status}).`);
    const json = await res.json();
    return json.data;
  },

  async getCatalogSizes(): Promise<string[]> {
    const res = await fetch(`${API_BASE}/discovery/sizes`);
    if (!res.ok) throw new Error(`Catalog sizes request failed (${res.status}).`);
    const json = await res.json();
    return json.data;
  },

  async getAdminMerchants(): Promise<MerchantDto[]> {
    const res = await fetch(`${API_BASE}/admin/catalog/merchants`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`Merchant list request failed (${res.status}).`);
    const json = await res.json();
    return json.data;
  },

  async createAdminMerchant(merchant: CreateMerchantDto): Promise<MerchantDto> {
    const res = await fetch(`${API_BASE}/admin/catalog/merchants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(merchant),
    });
    if (!res.ok) throw new Error(`Merchant could not be saved (${res.status}).`);
    const json = await res.json();
    return json.data;
  },

  async getAdminProducts(): Promise<ProductDto[]> {
    const res = await fetch(`${API_BASE}/admin/catalog/products`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`Product list request failed (${res.status}).`);
    const json = await res.json();
    return json.data;
  },

  async createAdminProduct(product: CreateCatalogProductDto): Promise<ProductDto> {
    const res = await fetch(`${API_BASE}/admin/catalog/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error(`Product could not be saved (${res.status}).`);
    const json = await res.json();
    return json.data;
  },

  async updateAdminProduct(id: string, updates: UpdateCatalogProductDto): Promise<ProductDto> {
    const res = await fetch(`${API_BASE}/admin/catalog/products/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error(`Product could not be updated (${res.status}).`);
    const json = await res.json();
    return json.data;
  },

  async verifyAdminProduct(id: string, verification: VerifyCatalogProductDto): Promise<ProductDto> {
    const res = await fetch(`${API_BASE}/admin/catalog/products/${encodeURIComponent(id)}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(verification),
    });
    if (!res.ok) throw new Error(`Product verification failed (${res.status}).`);
    const json = await res.json();
    return json.data;
  },

  async markAdminProductUnavailable(id: string): Promise<ProductDto> {
    const res = await fetch(`${API_BASE}/admin/catalog/products/${encodeURIComponent(id)}/unavailable`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`Product availability could not be updated (${res.status}).`);
    const json = await res.json();
    return json.data;
  },

  async getProductById(id: string): Promise<ProductDto | null> {
    const res = await fetch(`${API_BASE}/discovery/${encodeURIComponent(id)}`);
    if (res.status === 404) return null;
    if (!res.ok) await throwApiError(res, 'Product details could not be loaded');
    const json = await res.json();
    return json.data;
  },

  // Complete My Outfit Engine with dynamic item swapping
  async completeMyOutfit(params: CompleteMyOutfitDto): Promise<OutfitDto[]> {
    const res = await fetch(`${API_BASE}/recommendations/complete-my-outfit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      throw new Error(`Outfit request failed (${res.status}).`);
    }
    const json = await res.json();
    return json.data;
  },

  // Wishlist
  async getWishlist(): Promise<ProductDto[]> {
    const res = await fetch(`${API_BASE}/discovery/wishlist`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`Wishlist request failed (${res.status}).`);
    const json = await res.json();
    wishlistState = (json.data as ProductDto[]).map((product) => product.id);
    return json.data;
  },

  async toggleWishlist(productId: string, currentlySaved = wishlistState.includes(productId)): Promise<boolean> {
    const res = await fetch(`${API_BASE}/discovery/wishlist/${encodeURIComponent(productId)}`, {
      method: currentlySaved ? 'DELETE' : 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`Wishlist update failed (${res.status}).`);
    wishlistState = currentlySaved
      ? wishlistState.filter((id) => id !== productId)
      : [...wishlistState, productId];
    return !currentlySaved;
  },

  // Saved Outfits
  async getSavedOutfits(): Promise<OutfitDto[]> {
    return savedOutfitsState;
  },

  async saveOutfit(outfit: OutfitDto): Promise<void> {
    if (!savedOutfitsState.some((o) => o.id === outfit.id)) {
      savedOutfitsState.unshift(outfit);
      setStored('saved_outfits', savedOutfitsState);
      this.logAudit('OUTFIT_SAVED', `Saved outfit ${outfit.name}`, sessionState?.email || 'user');
    }
  },

  async removeSavedOutfit(outfitId: string): Promise<void> {
    savedOutfitsState = savedOutfitsState.filter((o) => o.id !== outfitId);
    setStored('saved_outfits', savedOutfitsState);
  },

  // Shopping Cart & Orders
  getCart(): CartItem[] {
    return cartState;
  },

  addToCart(product: ProductDto, size: string, quantity = 1): CartItem[] {
    const existingIdx = cartState.findIndex((item) => item.product.id === product.id && item.size === size);
    if (existingIdx !== -1) {
      cartState[existingIdx].quantity += quantity;
    } else {
      cartState.push({ product, size, quantity });
    }
    setStored('cart', cartState);
    return [...cartState];
  },

  updateCartQty(productId: string, size: string, quantity: number): CartItem[] {
    if (quantity <= 0) {
      cartState = cartState.filter((item) => !(item.product.id === productId && item.size === size));
    } else {
      const item = cartState.find((item) => item.product.id === productId && item.size === size);
      if (item) item.quantity = quantity;
    }
    setStored('cart', cartState);
    return [...cartState];
  },

  removeFromCart(productId: string, size: string): CartItem[] {
    cartState = cartState.filter((item) => !(item.product.id === productId && item.size === size));
    setStored('cart', cartState);
    return [...cartState];
  },

  clearCart(): void {
    cartState = [];
    setStored('cart', cartState);
  },

  async placeOrder(_orderData: {
    shippingAddress: OrderRecord['shippingAddress'];
    paymentMethod: string;
  }): Promise<never> {
    throw new Error('ClosetIQ checkout is unavailable. Complete purchases on the merchant website.');
  },

  getOrders(): OrderRecord[] {
    return ordersState;
  },

  // Recommendation Feedback
  async recordRecommendationFeedback(outfitId: string, isLiked: boolean, tags: string[] = [], comment?: string): Promise<void> {
    const res = await fetch(`${API_BASE}/recommendations/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ outfitId, rating: isLiked ? 5 : 1, feedbackTags: tags, feedbackText: comment }),
    });
    if (!res.ok) await throwApiError(res, 'Recommendation feedback could not be saved');
    this.logAudit(
      'RECOMMENDATION_FEEDBACK',
      `Outfit ${outfitId}: ${isLiked ? 'Liked' : 'Disliked'} (${tags.join(', ')})`,
      sessionState?.email || 'user'
    );
  },

  // Admin Features
  async adminAddProduct(product: Omit<ProductDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductDto> {
    const newProduct: ProductDto = {
      ...product,
      id: `prod-custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    catalogState.unshift(newProduct);
    setStored('catalog', catalogState);
    this.logAudit('ADMIN_PRODUCT_CREATED', `Created product ${newProduct.title} ($${newProduct.price})`, sessionState?.email || 'admin');
    return newProduct;
  },

  async adminUpdateProduct(id: string, updates: Partial<ProductDto>): Promise<ProductDto> {
    const idx = catalogState.findIndex((p) => p.id === id);
    if (idx !== -1) {
      catalogState[idx] = { ...catalogState[idx], ...updates, updatedAt: new Date().toISOString() };
      setStored('catalog', catalogState);
      this.logAudit('ADMIN_PRODUCT_UPDATED', `Updated product ${id}`, sessionState?.email || 'admin');
      return catalogState[idx];
    }
    throw new Error('Product not found');
  },

  async adminDeleteProduct(id: string): Promise<void> {
    catalogState = catalogState.filter((p) => p.id !== id);
    setStored('catalog', catalogState);
    this.logAudit('ADMIN_PRODUCT_DELETED', `Deleted product ${id}`, sessionState?.email || 'admin');
  },

  getAuditLogs(): AuditLogEntry[] {
    return auditLogsState;
  },

  logAudit(action: string, details: string, userEmail: string): void {
    const entry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      action,
      timestamp: new Date().toISOString(),
      details,
      userEmail,
    };
    auditLogsState.unshift(entry);
    if (auditLogsState.length > 50) auditLogsState.pop();
    setStored('audit_logs', auditLogsState);
  },

  // Privacy & Data Rights
  async exportUserData(): Promise<string> {
    const res = await fetch(`${API_BASE}/privacy/export-data`, { headers: getAuthHeaders() });
    if (!res.ok) await throwApiError(res, 'Account data could not be exported');
    const json = await res.json();
    this.logAudit('DATA_EXPORT', 'Full client personal data archive generated', sessionState?.email || 'user');
    return JSON.stringify(json.data, null, 2);
  },

  async deleteAccount(): Promise<void> {
    const res = await fetch(`${API_BASE}/privacy/delete-account`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) await throwApiError(res, 'Account deletion could not be completed');
    clearSession();
    profileState = null;
    wardrobeState = [];
    catalogState = [];
    wishlistState = [];
    savedOutfitsState = [];
    cartState = [];
    ordersState = [];
    for (const key of ['profile', 'wardrobe', 'saved_outfits', 'cart', 'orders', 'catalog']) {
      try {
        localStorage.removeItem(`closetiq_${key}`);
      } catch (error) {
        console.warn(`Could not clear stored ${key} data after account deletion:`, error);
      }
    }
  },

  // Analysis Lab
  async getLatestAnalysis(): Promise<BodyAnalysisResponseDto | null> {
    const res = await fetch(`${API_BASE}/analysis/latest`, { headers: getAuthHeaders() });
    if (res.status === 404) {
      return null;
    }
    if (!res.ok) {
      throw new Error(`Style analysis request failed (${res.status}).`);
    }
    const json = await res.json();
    return json.data;
  },
};

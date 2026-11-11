import {
  WardrobeItemDto,
  ProductDto,
  OutfitDto,
  BodyAnalysisResponseDto,
  ProfileResponseDto,
  CompleteMyOutfitDto,
  CreateWardrobeItemDto,
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

// --- STATE STORE (SYNCHRONIZED WITH LOCALSTORAGE) ---
let sessionState: UserSession | null = getStored<UserSession | null>('session', null);
if (sessionState?.token === 'mock-jwt-token-2026' || sessionState?.token.startsWith('demo-token-')) {
  sessionState = null;
}

let profileState: ProfileResponseDto | null = getStored<ProfileResponseDto | null>('profile', null);
let wardrobeState: WardrobeItemDto[] = getStored<WardrobeItemDto[]>('wardrobe', []);
let catalogState: ProductDto[] = [];
let wishlistState: string[] = getStored<string[]>('wishlist', []);
let savedOutfitsState: OutfitDto[] = getStored<OutfitDto[]>('saved_outfits', []);
let cartState: CartItem[] = getStored<CartItem[]>('cart', []);
let ordersState: OrderRecord[] = getStored<OrderRecord[]>('orders', []);
let auditLogsState: AuditLogEntry[] = getStored<AuditLogEntry[]>('audit_logs', []);

const getAuthHeaders = (): HeadersInit =>
  sessionState?.token ? { Authorization: `Bearer ${sessionState.token}` } : {};

// --- COMPLETE API CLIENT ---
export const api = {
  // Session & Authentication
  getCurrentUser(): UserSession | null {
    return sessionState;
  },

  async login(email: string, password: string): Promise<UserSession> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      throw new Error(`Sign-in failed (${res.status}).`);
    }
    const json = await res.json();
    const user: UserSession = {
      id: json.data.user.id,
      email: json.data.user.email,
      fullName: json.data.user.profile?.fullName || email.split('@')[0],
      role: json.data.user.role || 'USER',
      token: json.data.accessToken,
    };
    sessionState = user;
    setStored('session', user);
    this.logAudit('USER_LOGIN', 'Logged in via API', user.email);
    return user;
  },

  async register(name: string, email: string, password: string): Promise<UserSession> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: name, email, password }),
    });
    if (!res.ok) {
      throw new Error(`Account creation failed (${res.status}).`);
    }
    const json = await res.json();
    const user: UserSession = {
      id: json.data.user.id,
      email: json.data.user.email,
      fullName: name,
      role: 'USER',
      token: json.data.accessToken,
    };
    sessionState = user;
    setStored('session', user);
    this.logAudit('USER_REGISTERED', 'Account created via API', user.email);
    return user;
  },

  logout(): void {
    if (sessionState) {
      this.logAudit('USER_LOGOUT', `Logged out`, sessionState.email);
    }
    sessionState = null;
    localStorage.removeItem('closetiq_session');
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
    const idx = wardrobeState.findIndex((w) => w.id === id);
    if (idx !== -1) {
      wardrobeState[idx] = { ...wardrobeState[idx], ...updates, updatedAt: new Date().toISOString() };
      setStored('wardrobe', wardrobeState);
      return wardrobeState[idx];
    }
    throw new Error('Wardrobe item not found');
  },

  async deleteWardrobeItem(id: string): Promise<void> {
    wardrobeState = wardrobeState.filter((w) => w.id !== id);
    setStored('wardrobe', wardrobeState);
    this.logAudit('WARDROBE_ITEM_DELETED', `Deleted garment ${id}`, sessionState?.email || 'user');
  },

  // Catalog & Discovery
  async getCatalog(query?: { search?: string; category?: string; priceMax?: number }): Promise<ProductDto[]> {
    const searchParams = new URLSearchParams();
    if (query?.search) searchParams.set('search', query.search);
    if (query?.category && query.category !== 'ALL') searchParams.set('category', query.category);
    if (query?.priceMax !== undefined) searchParams.set('priceMax', String(query.priceMax));

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

  async getProductById(id: string): Promise<ProductDto | null> {
    return catalogState.find((p) => p.id === id) || null;
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
    return catalogState.filter((p) => wishlistState.includes(p.id));
  },

  async toggleWishlist(productId: string): Promise<boolean> {
    const exists = wishlistState.includes(productId);
    if (exists) {
      wishlistState = wishlistState.filter((id) => id !== productId);
    } else {
      wishlistState.push(productId);
    }
    setStored('wishlist', wishlistState);
    return !exists;
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

  async placeOrder(orderData: {
    shippingAddress: OrderRecord['shippingAddress'];
    paymentMethod: string;
  }): Promise<OrderRecord> {
    if (cartState.length === 0) throw new Error('Cart is empty');

    const subtotal = cartState.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const shipping = 0; // Complimentary white-glove shipping
    const total = subtotal + tax + shipping;

    const order: OrderRecord = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString(),
      items: [...cartState],
      subtotal,
      tax,
      shipping,
      total,
      status: 'CONFIRMED',
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
    };

    ordersState.unshift(order);
    setStored('orders', ordersState);
    this.clearCart();
    this.logAudit('ORDER_PLACED', `Order ${order.id} placed for $${total}`, sessionState?.email || 'user');
    return order;
  },

  getOrders(): OrderRecord[] {
    return ordersState;
  },

  // Recommendation Feedback
  async recordRecommendationFeedback(outfitId: string, isLiked: boolean, tags: string[] = [], comment?: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/recommendations/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outfitId, rating: isLiked ? 5 : 1, feedbackTags: tags, feedbackText: comment }),
      });
    } catch {
      // Fallback
    }
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
  exportUserData(): string {
    const exportData = {
      user: sessionState,
      profile: profileState,
      wardrobe: wardrobeState,
      orders: ordersState,
      wishlist: wishlistState,
      savedOutfits: savedOutfitsState,
      exportedAt: new Date().toISOString(),
    };
    this.logAudit('DATA_EXPORT', 'Full client personal data archive generated', sessionState?.email || 'user');
    return JSON.stringify(exportData, null, 2);
  },

  async deleteAccount(): Promise<void> {
    this.logAudit('ACCOUNT_PURGED', 'User invoked Right to be Forgotten (Full Deletion)', sessionState?.email || 'user');
    localStorage.clear();
    sessionState = null;
    profileState = null;
    wardrobeState = [];
    cartState = [];
    wishlistState = [];
    savedOutfitsState = [];
    ordersState = [];
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

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Minus,
  PackagePlus,
  Plus,
  Ruler,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import {
  COLOR_SWATCHES,
  LOVE_NOTES,
  PRODUCTS,
  Product,
  ProductCategory,
  ProductColorName,
  ProductSize,
  SIZE_CHART_DATA,
  WHIMSY_HERO_IMAGE,
  formatRupiah,
} from '../data/catalogData';
import { PROFILE_INFO } from '../data/portfolioData';
import {
  HandDrawnButterfly,
  HandDrawnCloud,
  HandDrawnRibbon,
  HandDrawnStar,
  HandDrawnWildflower,
} from './WhimsyIllustrations';

const API_BASE_URL = "http://localhost:3001/api/produk";

type StoreTab = 'beranda' | 'belanja' | 'kontak';

interface ApiProductRecord {
  id?: string | number;
  name?: string;
  nama?: string;
  subtitle?: string;
  category?: ProductCategory;
  kategori?: ProductCategory;
  price?: number;
  harga?: number;
  jumlah?: number;
  description?: string;
  deskripsi?: string;
  images?: string[];
  foto?: string;
}

const mergeApiProductsWithFallback = (rows: ApiProductRecord[]): Product[] => {
  if (!rows.length) return PRODUCTS;
  const fallbackById = new Map(PRODUCTS.map((p) => [p.id, p]));
  return rows.map((row, idx) => {
    const idStr = row.id !== undefined ? String(row.id) : PRODUCTS[idx]?.id ?? `produk-${idx + 1}`;
    const base = fallbackById.get(idStr) ?? PRODUCTS[idx] ?? PRODUCTS[0];
    const parsedJumlah =
      typeof row.jumlah === 'number' && Number.isFinite(row.jumlah)
        ? Math.max(0, Math.floor(row.jumlah))
        : base.jumlah;
    return {
      ...base,
      id: idStr,
      name: row.name ?? row.nama ?? base.name,
      subtitle: row.subtitle ?? base.subtitle,
      category: row.category ?? row.kategori ?? base.category,
      price:
        typeof row.price === 'number'
          ? row.price
          : typeof row.harga === 'number'
            ? row.harga
            : base.price,
      jumlah: parsedJumlah,
      description: row.description ?? row.deskripsi ?? base.description,
      images:
        Array.isArray(row.images) && row.images.length > 0
          ? row.images
          : row.foto
            ? [row.foto]
            : base.images,
    };
  });
};

interface CartItem {
  key: string;
  product: Product;
  size?: ProductSize;
  color: ProductColorName;
  quantity: number;
}

interface CatalogViewProps {
  onBackToPortfolio: () => void;
  onNotify: (msg: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  onBackToPortfolio,
  onNotify,
}) => {
  const [activeTab, setActiveTab] = useState<StoreTab>('beranda');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [adminMode, setAdminMode] = useState(false);
  const [busyProductIds, setBusyProductIds] = useState<Record<string, boolean>>({});

  // Shop Filters
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | ProductCategory>('Semua');
  const [selectedPriceRange, setSelectedPriceRange] = useState<'semua' | 'bawah350' | '350to450' | 'atas450'>('semua');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<'Semua' | ProductSize>('Semua');
  const [selectedColorFilter, setSelectedColorFilter] = useState<'Semua' | ProductColorName>('Semua');
  const [sortBy, setSortBy] = useState<'kurator' | 'termurah' | 'termahal'>('kurator');

  // Cart & Wishlist State
  const [cart, setCart] = useState<CartItem[]>([
    {
      key: 'aurora-organza-dress-S-Soft Pink',
      product: PRODUCTS[0],
      size: 'S',
      color: 'Soft Pink',
      quantity: 1,
    },
  ]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['daisy-knit-cardigan']);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOnly, setWishlistOnly] = useState(false);

  // Checkout Flow State inside Cart Drawer
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [buyerPostal, setBuyerPostal] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Transfer Bank'>('Transfer Bank');
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // PDP Modal State
  const [pdpProduct, setPdpProduct] = useState<Product | null>(null);
  const [pdpImageIdx, setPdpImageIdx] = useState(0);
  const [pdpSize, setPdpSize] = useState<ProductSize | undefined>('M');
  const [pdpColor, setPdpColor] = useState<ProductColorName>('Soft Pink');
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Store Contact Form
  const [storeName, setStoreName] = useState('');
  const [storeEmail, setStoreEmail] = useState('');
  const [storeMessage, setStoreMessage] = useState('');
  const [storeSent, setStoreSent] = useState(false);

  const totalCartCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [cart]
  );

  useEffect(() => {
    let active = true;
    const loadProductsFromApi = async () => {
      try {
        const res = await fetch(API_BASE_URL);
        if (!res.ok) return;
        const payload = await res.json();
        const rows = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : null;
        if (active && rows && rows.length > 0) {
          setProducts(mergeApiProductsWithFallback(rows));
        }
      } catch {
        // Server MySQL belum aktif: gunakan data PRODUCTS lokal sebagai fallback
      }
    };
    loadProductsFromApi();
    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      if (wishlistOnly && !wishlistIds.includes(p.id)) return false;
      if (selectedCategory !== 'Semua' && p.category !== selectedCategory) return false;
      if (selectedPriceRange === 'bawah350' && p.price >= 350000) return false;
      if (selectedPriceRange === '350to450' && (p.price < 350000 || p.price > 450000)) return false;
      if (selectedPriceRange === 'atas450' && p.price <= 450000) return false;
      if (selectedSizeFilter !== 'Semua' && !p.sizes.includes(selectedSizeFilter)) return false;
      if (
        selectedColorFilter !== 'Semua' &&
        !p.colors.some((c) => c.name === selectedColorFilter)
      ) {
        return false;
      }
      return true;
    });

    if (sortBy === 'termurah') return [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'termahal') return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [
    products,
    wishlistOnly,
    wishlistIds,
    selectedCategory,
    selectedPriceRange,
    selectedSizeFilter,
    selectedColorFilter,
    sortBy,
  ]);

  const openPdp = (product: Product) => {
    setPdpProduct(product);
    setPdpImageIdx(0);
    setPdpSize(product.sizes.includes('M') ? 'M' : product.sizes[0]);
    setPdpColor(product.colors[0].name);
    setSizeChartOpen(false);
  };

  const addToCart = (
    product: Product,
    size: ProductSize | undefined = product.sizes.includes('M') ? 'M' : product.sizes[0],
    color: ProductColorName = product.colors[0].name
  ) => {
    const liveStock = products.find((p) => p.id === product.id)?.jumlah ?? product.jumlah;
    if (liveStock <= 0) {
      onNotify(`Maaf, stok ${product.name} sedang habis.`);
      return;
    }
    const currentInCart = cart
      .filter((i) => i.product.id === product.id)
      .reduce((sum, i) => sum + i.quantity, 0);
    if (currentInCart >= liveStock) {
      onNotify(`Stok ${product.name} hanya tersisa ${liveStock} pcs.`);
      return;
    }
    const key = `${product.id}-${size ?? 'one-size'}-${color}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { key, product, size, color, quantity: 1 }];
    });
    setConfirmedOrderId(null);
    onNotify(`${product.name} (${size ? `${size}, ` : ''}${color}) ditambahkan ke keranjang.`);
  };

  const applyStockUpdate = (productId: string, nextJumlah: number) => {
    const safeJumlah = Math.max(0, Math.floor(nextJumlah));
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, jumlah: safeJumlah } : p))
    );
    setPdpProduct((prev) =>
      prev && prev.id === productId ? { ...prev, jumlah: safeJumlah } : prev
    );
  };

  const handleSellStock = async (product: Product, rawQty: number) => {
    if (product.jumlah <= 0) return;
    const qty = Math.max(1, Math.min(product.jumlah, Math.floor(rawQty) || 1));
    setBusyProductIds((prev) => ({ ...prev, [product.id]: true }));
    let nextStock = Math.max(0, product.jumlah - qty);

    try {
      const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(product.id)}/jual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty }),
      });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (typeof data?.jumlah === 'number') {
          nextStock = Math.max(0, Math.floor(data.jumlah));
        } else if (typeof data?.data?.jumlah === 'number') {
          nextStock = Math.max(0, Math.floor(data.data.jumlah));
        }
      }
    } catch {
      // Fallback lokal agar stok tetap berkurang real-time saat server offline
    } finally {
      applyStockUpdate(product.id, nextStock);
      setBusyProductIds((prev) => ({ ...prev, [product.id]: false }));
      onNotify(`Barang keluar berhasil dicatat: ${qty}× ${product.name} (Sisa stok: ${nextStock}).`);
    }
  };

  const handleRestock = async (product: Product, rawQty: number) => {
    const qty = Math.max(1, Math.floor(rawQty) || 1);
    setBusyProductIds((prev) => ({ ...prev, [product.id]: true }));
    let nextStock = product.jumlah + qty;

    try {
      const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(product.id)}/restok`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty }),
      });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (typeof data?.jumlah === 'number') {
          nextStock = Math.max(0, Math.floor(data.jumlah));
        } else if (typeof data?.data?.jumlah === 'number') {
          nextStock = Math.max(0, Math.floor(data.data.jumlah));
        }
      }
    } catch {
      // Fallback lokal agar stok tetap bertambah real-time saat server offline
    } finally {
      applyStockUpdate(product.id, nextStock);
      setBusyProductIds((prev) => ({ ...prev, [product.id]: false }));
      onNotify(`Stok berhasil ditambahkan: +${qty} ${product.name} (Total stok: ${nextStock}).`);
    }
  };

  const updateCartQty = (key: string, delta: number) => {
    if (delta > 0) {
      const target = cart.find((item) => item.key === key);
      if (target) {
        const liveStock =
          products.find((p) => p.id === target.product.id)?.jumlah ?? target.product.jumlah;
        const totalForProduct = cart
          .filter((i) => i.product.id === target.product.id)
          .reduce((sum, i) => sum + i.quantity, 0);
        if (totalForProduct + delta > liveStock) {
          onNotify(`Stok ${target.product.name} hanya tersisa ${liveStock} pcs.`);
          return;
        }
      }
    }
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const toggleWishlist = (productId: string, productName: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      onNotify(
        exists
          ? `${productName} dihapus dari wishlist.`
          : `${productName} disimpan ke wishlist.`
      );
      return next;
    });
  };

  const resetFilters = () => {
    setSelectedCategory('Semua');
    setSelectedPriceRange('semua');
    setSelectedSizeFilter('Semua');
    setSelectedColorFilter('Semua');
    setWishlistOnly(false);
    setSortBy('kurator');
  };

  const goToCategory = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setWishlistOnly(false);
    setActiveTab('belanja');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingOrder) return;
    if (!buyerName.trim() || !buyerPhone.trim() || !buyerAddress.trim()) {
      onNotify('Mohon lengkapi nama, nomor telepon, dan alamat pengiriman.');
      return;
    }

    // Hitung total qty per produk di keranjang & validasi stok tersedia
    const qtyByProductId = new Map<string, number>();
    for (const item of cart) {
      qtyByProductId.set(
        item.product.id,
        (qtyByProductId.get(item.product.id) ?? 0) + item.quantity
      );
    }

    for (const [productId, orderedQty] of qtyByProductId.entries()) {
      const currentProduct = products.find((p) => p.id === productId);
      if (!currentProduct || currentProduct.jumlah < orderedQty) {
        const available = currentProduct?.jumlah ?? 0;
        onNotify(
          `Stok ${currentProduct?.name ?? 'produk'} tidak mencukupi (tersisa ${available} pcs).`
        );
        return;
      }
    }

    setIsSubmittingOrder(true);
    try {
      const updatedStockEntries = await Promise.all(
        Array.from(qtyByProductId.entries()).map(async ([productId, qty]) => {
          const currentStock = products.find((p) => p.id === productId)?.jumlah ?? 0;
          let nextStock = Math.max(0, currentStock - qty);
          try {
            const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(productId)}/jual`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ qty }),
            });
            if (res.ok) {
              const data = await res.json().catch(() => null);
              if (typeof data?.jumlah === 'number') {
                nextStock = Math.max(0, Math.floor(data.jumlah));
              } else if (typeof data?.data?.jumlah === 'number') {
                nextStock = Math.max(0, Math.floor(data.data.jumlah));
              }
            }
          } catch {
            // Fallback lokal agar stok tetap berkurang real-time saat server offline
          }
          return [productId, nextStock] as const;
        })
      );

      const nextStockMap = new Map(updatedStockEntries);
      setProducts((prev) =>
        prev.map((p) =>
          nextStockMap.has(p.id) ? { ...p, jumlah: nextStockMap.get(p.id)! } : p
        )
      );
      setPdpProduct((prev) =>
        prev && nextStockMap.has(prev.id)
          ? { ...prev, jumlah: nextStockMap.get(prev.id)! }
          : prev
      );

      const orderNum = `AT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmedOrderId(orderNum);
      setCart([]);
      setCheckoutMode(false);
      onNotify(`Pesanan ${orderNum} berhasil dikonfirmasi & stok produk telah diperbarui!`);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleStoreContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !storeEmail.trim() || !storeMessage.trim()) {
      onNotify('Mohon isi semua kolom pesan terlebih dahulu.');
      return;
    }
    setStoreSent(true);
    onNotify('Pesan untuk Atelier Adini telah terkirim.');
    setStoreName('');
    setStoreEmail('');
    setStoreMessage('');
  };

  const switchTab = (tab: StoreTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-whimsy-dots text-[#332B30] flex flex-col">
      {/* Slim Back-to-Portfolio Ribbon (<= 36px) */}
      <div className="bg-[#EAE4F7] border-b border-[#D8CEF0] text-xs py-1.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackToPortfolio}
            className="inline-flex items-center gap-1.5 font-semibold text-[#4A3B52] hover:text-[#9A7B3E] transition-colors cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Portfolio Adini</span>
          </button>
          <span className="hidden sm:inline text-[#62546A]">
            Gratis ongkir seluruh Indonesia untuk pembelian di atas Rp 500.000
          </span>
        </div>
      </div>

      {/* Storefront 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FCF9F2]/92 backdrop-blur-md border-b border-[#E8DFCE]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => switchTab('beranda')}
            className="font-serif italic text-2xl font-semibold text-[#332B30] tracking-tight whitespace-nowrap shrink-0 cursor-pointer"
          >
            Adini
          </button>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            aria-label="Navigasi Katalog Whimsy"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5A4E55]"
          >
            {[
              { id: 'beranda', label: 'Beranda' },
              { id: 'belanja', label: 'Belanja' },
              { id: 'kontak', label: 'Kontak' },
            ].map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => switchTab(item.id as StoreTab)}
                  className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 border-b-2 ${
                    active
                      ? 'text-[#332B30] font-semibold border-[#C8A96A]'
                      : 'border-transparent hover:text-[#332B30] hover:border-[#D8CEF0]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Mode Admin Toggle & Shopping Bag */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setAdminMode((prev) => !prev)}
              aria-pressed={adminMode}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                adminMode
                  ? 'bg-[#FAF0BE] border-[#C8A96A] text-[#332B30] shadow-xs'
                  : 'bg-white border-[#E5DAC6] text-[#5A4E55] hover:border-[#C8A96A] hover:text-[#332B30]'
              }`}
            >
              <ShieldCheck
                className={`w-4 h-4 ${adminMode ? 'text-[#9A7B3E]' : 'text-[#6E6068]'}`}
              />
              <span>Mode Admin</span>
            </button>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#332B30] text-[#FCF9F2] text-xs sm:text-sm font-semibold hover:bg-[#4E4149] transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 text-[#FAF0BE]" />
              <span>Keranjang</span>
              <span className="font-mono tabular-nums text-[#FAF0BE]">
                ({totalCartCount})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Buka menu toko"
              className="md:hidden p-2 rounded-lg text-[#332B30] hover:bg-[#EAE4F7]/60"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FCF9F2] border-t border-[#E8DFCE] px-4 py-3 flex flex-col gap-1.5">
            {[
              { id: 'beranda', label: 'Beranda' },
              { id: 'belanja', label: 'Belanja' },
              { id: 'kontak', label: 'Kontak' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => switchTab(item.id as StoreTab)}
                className={`text-left px-3 py-2.5 rounded-xl text-sm font-medium ${
                  activeTab === item.id
                    ? 'bg-[#EAE4F7] text-[#332B30] font-semibold'
                    : 'text-[#5A4E55]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* MAIN STOREFRONT CONTENT */}
      <main className="flex-1">
        {/* ======================== 1. BERANDA TOKO ======================== */}
        {activeTab === 'beranda' && (
          <div>
            {/* Dreamy Hero Banner */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-14">
              <div className="relative rounded-[2rem] overflow-hidden border border-[#E5DAC6] shadow-lg bg-[#EAE4F7]">
                <div className="aspect-[16/10] sm:aspect-[16/8] w-full relative">
                  <img
                    src={WHIMSY_HERO_IMAGE}
                    alt="Lampu vintage kaca patri dengan rangkaian bunga mawar dan hydrangea bernuansa pastel"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                  {/* Measured gradient scrim for WCAG AA legibility */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#231C22]/75 via-[#231C22]/40 to-transparent" />
                </div>

                {/* Whimsical floating line-art accents */}
                <div className="pointer-events-none absolute top-6 right-8 text-[#FAF0BE]/85 hidden sm:block">
                  <HandDrawnButterfly className="w-12 h-10" />
                </div>

                <div className="sm:absolute inset-0 flex items-center p-6 sm:p-12 lg:p-16 bg-[#332B30] sm:bg-transparent text-[#FCF9F2]">
                  <div className="max-w-xl space-y-5">
                    <div className="inline-flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-[#FAF0BE]">
                      <HandDrawnStar className="w-4 h-4 text-[#FAF0BE]" />
                      <span>Koleksi Musim Semi · Adini</span>
                    </div>

                    <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-semibold leading-[1.15] text-white">
                      Detail Kecil yang Menjadikan Harimu Lebih Istimewa
                    </h1>

                    <p className="text-sm sm:text-base text-[#F3EDE2] leading-relaxed max-w-md">
                      Koleksi busana pastel yang ringan, manis, dan nyaman dikenakan untuk menemani momen istimewa hingga keseharianmu.
                    </p>

                    <div className="pt-1 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => switchTab('belanja')}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FAF0BE] text-[#332B30] text-sm font-bold hover:bg-white transition-colors shadow-md cursor-pointer"
                      >
                        <span>Jelajahi Koleksi</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Highlight Kategori Produk */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#9A7B3E] mb-1">
                    <HandDrawnWildflower className="w-4 h-5 text-[#9A7B3E]" />
                    <span>Kurasi Lemari Impian</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#332B30]">
                    Kategori Pilihan
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    resetFilters();
                    switchTab('belanja');
                  }}
                  className="text-sm font-semibold text-[#6F597A] hover:text-[#332B30] inline-flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <span>Lihat Semua Produk</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {(
                  [
                    {
                      name: 'Dress',
                      subtitle: 'Gaun floral & pita',
                      bg: 'bg-[#EAE4F7]',
                      icon: <HandDrawnButterfly className="w-8 h-7 text-[#6F597A]" />,
                    },
                    {
                      name: 'Atasan',
                      subtitle: 'Blus satin bordir',
                      bg: 'bg-[#FAF0BE]',
                      icon: <HandDrawnStar className="w-7 h-7 text-[#9A7B3E]" />,
                    },
                    {
                      name: 'Rok',
                      subtitle: 'Rok ruffle mengembang',
                      bg: 'bg-[#D4E4D8]',
                      icon: <HandDrawnWildflower className="w-7 h-8 text-[#466B52]" />,
                    },
                    {
                      name: 'Outer',
                      subtitle: 'Kardigan rajut motif kucing',
                      bg: 'bg-[#D8EAF7]',
                      icon: <HandDrawnCloud className="w-10 h-7 text-[#486B85]" />,
                    },
                    {
                      name: 'Aksesori',
                      subtitle: 'Pita bunga tulip',
                      bg: 'bg-[#F5E9D6]',
                      icon: <HandDrawnRibbon className="w-8 h-7 text-[#9A7B3E]" />,
                    },
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => goToCategory(cat.name)}
                    className={`${cat.bg} rounded-t-[60px] rounded-b-2xl p-5 text-left border border-[#E5DAC6] hover:-translate-y-1 transition-transform duration-200 flex flex-col justify-between min-h-[148px] cursor-pointer shadow-xs`}
                  >
                    <div className="mb-3">{cat.icon}</div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-[#332B30]">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-[#5A4E55] mt-0.5">{cat.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Koleksi Edisi Terbatas */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
              <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
                <div className="flex items-center justify-center gap-2 text-[#9A7B3E]">
                  <HandDrawnStar className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase tracking-widest">
                    Diproduksi Dalam Jumlah Terbatas
                  </span>
                  <HandDrawnStar className="w-5 h-5" />
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#332B30]">
                  Koleksi Edisi Terbatas
                </h2>
                <p className="text-sm text-[#5A4E55]">
                  Potongan istimewa berdetail sulaman tangan dan kilau iridescent lembut untuk momen paling berkesan.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {products
                  .filter((p) => p.isLimitedEdition)
                  .slice(0, 3)
                  .map((product) => (
                    <ProductArchCard
                      key={product.id}
                      product={product}
                      isWishlisted={wishlistIds.includes(product.id)}
                      adminMode={adminMode}
                      isStockUpdating={Boolean(busyProductIds[product.id])}
                      onToggleWishlist={() => toggleWishlist(product.id, product.name)}
                      onOpenDetail={() => openPdp(product)}
                      onQuickAdd={() => addToCart(product)}
                      onSell={(qty) => handleSellStock(product, qty)}
                      onRestock={(qty) => handleRestock(product, qty)}
                    />
                  ))}
              </div>
            </section>

            {/* Customer Love Notes */}
            <section className="bg-[#EAE4F7]/55 border-y border-[#DED5EF] py-14">
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#705A7E] mb-1">
                      Love Notes
                    </p>
                    <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#332B30]">
                      Ulasan Pelanggan Kami
                    </h2>
                  </div>
                  <HandDrawnRibbon className="w-10 h-8 text-[#9A7B3E] hidden sm:block" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {LOVE_NOTES.map((note) => (
                    <blockquote
                      key={note.id}
                      className="bg-[#FCF9F2] rounded-3xl p-6 border border-[#E6DFEC] shadow-xs flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 text-[#C8A96A]">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <p className="text-sm text-[#433940] leading-relaxed italic">
                          &ldquo;{note.quote}&rdquo;
                        </p>
                      </div>
                      <footer className="pt-3 border-t border-[#EEE6DC] text-xs">
                        <p className="font-semibold text-[#332B30]">{note.author}</p>
                        <p className="text-[#6E6068] mt-0.5">{note.roleOrCity}</p>
                      </footer>
                    </blockquote>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ======================== 2. BELANJA (SHOP PAGE) ======================== */}
        {activeTab === 'belanja' && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#9A7B3E] mb-1">
                  Katalog Lengkap
                </p>
                <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#332B30]">
                  Koleksi Busana Whimsy
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setWishlistOnly((prev) => !prev)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                    wishlistOnly
                      ? 'bg-[#EAE4F7] border-[#B6A4DC] text-[#332B30]'
                      : 'bg-white border-[#E5DAC6] text-[#5A4E55] hover:border-[#C8A96A]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${wishlistOnly ? 'fill-[#CC5884] text-[#CC5884]' : ''}`} />
                  <span>Wishlist ({wishlistIds.length})</span>
                </button>

                <select
                  aria-label="Urutkan produk"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-4 py-2 rounded-full bg-white border border-[#E5DAC6] text-xs font-semibold text-[#332B30] focus:outline-none focus:border-[#C8A96A]"
                >
                  <option value="kurator">Urutkan: Pilihan Kurator</option>
                  <option value="termurah">Harga: Terendah ke Tertinggi</option>
                  <option value="termahal">Harga: Tertinggi ke Terendah</option>
                </select>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white/85 rounded-3xl p-5 sm:p-6 border border-[#E8DFCE] shadow-xs mb-10 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Kategori */}
                <div>
                  <label className="block text-xs font-semibold text-[#6E6068] mb-1.5">
                    Kategori
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) =>
                      setSelectedCategory(e.target.value as typeof selectedCategory)
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FCF9F2] border border-[#E5DAC6] text-sm text-[#332B30] focus:outline-none focus:border-[#C8A96A]"
                  >
                    <option value="Semua">Semua Kategori</option>
                    <option value="Dress">Dress</option>
                    <option value="Atasan">Atasan</option>
                    <option value="Rok">Rok</option>
                    <option value="Outer">Outer</option>
                    <option value="Aksesori">Aksesori</option>
                  </select>
                </div>

                {/* Harga */}
                <div>
                  <label className="block text-xs font-semibold text-[#6E6068] mb-1.5">
                    Rentang Harga
                  </label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) =>
                      setSelectedPriceRange(e.target.value as typeof selectedPriceRange)
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FCF9F2] border border-[#E5DAC6] text-sm text-[#332B30] focus:outline-none focus:border-[#C8A96A]"
                  >
                    <option value="semua">Semua Harga</option>
                    <option value="bawah350">Di bawah Rp 350.000</option>
                    <option value="350to450">Rp 350.000 – Rp 450.000</option>
                    <option value="atas450">Di atas Rp 450.000</option>
                  </select>
                </div>

                {/* Ukuran */}
                <div>
                  <label className="block text-xs font-semibold text-[#6E6068] mb-1.5">
                    Ukuran
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {(['Semua', 'XS', 'S', 'M', 'L', 'XL'] as const).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSizeFilter(sz)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          selectedSizeFilter === sz
                            ? 'bg-[#332B30] text-white border-[#332B30]'
                            : 'bg-[#FCF9F2] text-[#5A4E55] border-[#E5DAC6] hover:border-[#C8A96A]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Warna */}
                <div>
                  <label className="block text-xs font-semibold text-[#6E6068] mb-1.5">
                    Warna Pastel
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedColorFilter('Semua')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                        selectedColorFilter === 'Semua'
                          ? 'bg-[#332B30] text-white border-[#332B30]'
                          : 'bg-[#FCF9F2] text-[#5A4E55] border-[#E5DAC6]'
                      }`}
                    >
                      Semua
                    </button>
                    {(Object.keys(COLOR_SWATCHES) as ProductColorName[]).map((cName) => {
                      const active = selectedColorFilter === cName;
                      return (
                        <button
                          key={cName}
                          type="button"
                          title={cName}
                          aria-label={`Filter warna ${cName}`}
                          onClick={() => setSelectedColorFilter(cName)}
                          className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                            active
                              ? 'border-[#332B30] scale-110'
                              : 'border-white shadow-xs hover:scale-105'
                          }`}
                          style={{ backgroundColor: COLOR_SWATCHES[cName] }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0E9DA] flex items-center justify-between text-xs text-[#6E6068]">
                <span>
                  Menampilkan <strong className="text-[#332B30]">{filteredProducts.length}</strong>{' '}
                  produk
                </span>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="font-semibold text-[#9A7B3E] hover:underline cursor-pointer"
                >
                  Atur Ulang Filter
                </button>
              </div>
            </div>

            {/* Product Arch Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white/70 rounded-3xl border border-[#E8DFCE] space-y-4">
                <HandDrawnCloud className="w-16 h-10 text-[#9A7B3E] mx-auto" />
                <h2 className="font-serif text-2xl font-semibold text-[#332B30]">
                  Belum Ada Produk yang Cocok
                </h2>
                <p className="text-sm text-[#5A4E55]">
                  Coba sesuaikan kombinasi filter kategori, harga, ukuran, atau warna pastel lainnya.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-full bg-[#332B30] text-white text-sm font-semibold hover:bg-[#4A3E45] transition-colors cursor-pointer"
                >
                  Tampilkan Semua Koleksi
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductArchCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistIds.includes(product.id)}
                    adminMode={adminMode}
                    isStockUpdating={Boolean(busyProductIds[product.id])}
                    onToggleWishlist={() => toggleWishlist(product.id, product.name)}
                    onOpenDetail={() => openPdp(product)}
                    onQuickAdd={() => addToCart(product)}
                    onSell={(qty) => handleSellStock(product, qty)}
                    onRestock={(qty) => handleRestock(product, qty)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ======================== 3. KONTAK TOKO ======================== */}
        {activeTab === 'kontak' && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-5 space-y-5">
                <HandDrawnRibbon className="w-10 h-8 text-[#9A7B3E]" />
                <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#332B30]">
                  Sapa Tim Kami
                </h1>
                <p className="text-sm text-[#5A4E55] leading-relaxed">
                  Butuh rekomendasi ukuran, konsultasi padu padan untuk acara spesial, atau informasi pesanan khusus? Kirimkan catatan Anda di sini.
                </p>

                <div className="bg-white rounded-3xl p-6 border border-[#E8DFCE] space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-[#9A7B3E] mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-[#6E6068]">Email</p>
                      <a
                        href={`mailto:${PROFILE_INFO.email}`}
                        className="font-semibold text-[#332B30] hover:underline"
                      >
                        {PROFILE_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Instagram className="w-4 h-4 text-[#9A7B3E] mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-[#6E6068]">Instagram Resmi</p>
                      <a
                        href={PROFILE_INFO.instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-[#332B30] hover:underline"
                      >
                        {PROFILE_INFO.instagramHandle}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#9A7B3E] mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-[#6E6068]">Studio Pengiriman</p>
                      <p className="font-semibold text-[#332B30]">{PROFILE_INFO.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-7">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DFCE] shadow-xs">
                  {storeSent ? (
                    <div className="py-10 text-center space-y-4">
                      <CheckCircle2 className="w-10 h-10 text-[#466B52] mx-auto" />
                      <h2 className="font-serif text-2xl font-semibold text-[#332B30]">
                        Catatan Anda Telah Diterima
                      </h2>
                      <p className="text-sm text-[#5A4E55]">
                        Terima kasih telah menghubungi Atelier Adini. Kami akan segera membalas ke email Anda.
                      </p>
                      <button
                        type="button"
                        onClick={() => setStoreSent(false)}
                        className="px-5 py-2.5 rounded-full bg-[#332B30] text-white text-sm font-semibold cursor-pointer"
                      >
                        Kirim Pesan Baru
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleStoreContactSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#5A4E55] mb-1.5">
                          Nama Anda
                        </label>
                        <input
                          type="text"
                          required
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          placeholder="Nama lengkap"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FCF9F2] border border-[#E5DAC6] text-sm focus:outline-none focus:border-[#C8A96A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#5A4E55] mb-1.5">
                          Alamat Email
                        </label>
                        <input
                          type="email"
                          required
                          value={storeEmail}
                          onChange={(e) => setStoreEmail(e.target.value)}
                          placeholder="email@contoh.com"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FCF9F2] border border-[#E5DAC6] text-sm focus:outline-none focus:border-[#C8A96A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#5A4E55] mb-1.5">
                          Pesan atau Pertanyaan
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={storeMessage}
                          onChange={(e) => setStoreMessage(e.target.value)}
                          placeholder="Tanyakan soal ukuran, warna, atau stok koleksi..."
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FCF9F2] border border-[#E5DAC6] text-sm focus:outline-none focus:border-[#C8A96A]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#332B30] hover:bg-[#4E4149] text-white text-sm font-semibold transition-colors cursor-pointer"
                      >
                        <Send className="w-4 h-4 text-[#FAF0BE]" />
                        <span>Kirim Pesan</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Clean Storefront Footer */}
      <footer className="bg-[#332B30] text-[#FCF9F2] py-10 border-t border-[#4B4047]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="font-serif italic text-xl font-semibold">Adini</p>
            <p className="text-xs text-[#D5C9C1] mt-1">
              Koleksi Fashion Perempuan Bertema Whimsy · Karya Adini Riska Putri
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-[#E8DFCE]">
            <button
              type="button"
              onClick={() => switchTab('belanja')}
              className="hover:text-[#FAF0BE] cursor-pointer"
            >
              Belanja
            </button>
            <button
              type="button"
              onClick={() => switchTab('kontak')}
              className="hover:text-[#FAF0BE] cursor-pointer"
            >
              Kontak
            </button>
            <button
              type="button"
              onClick={onBackToPortfolio}
              className="font-semibold text-[#FAF0BE] hover:underline cursor-pointer"
            >
              Kembali ke Portfolio
            </button>
          </div>
        </div>
      </footer>

      {/* ======================== PRODUCT DETAIL MODAL (PDP) ======================== */}
      {pdpProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pdp-title"
          onClick={() => setPdpProduct(null)}
        >
          <div
            className="bg-[#FCF9F2] rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E5DAC6]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Modal Bar */}
            <div className="sticky top-0 z-10 bg-[#FCF9F2]/95 backdrop-blur-sm px-6 py-4 border-b border-[#EAE0CF] flex items-center justify-between">
              <div className="text-xs text-[#6E6068]">
                <span>{pdpProduct.category}</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span className="font-medium text-[#332B30]">{pdpProduct.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setPdpProduct(null)}
                aria-label="Tutup detail produk"
                className="p-2 rounded-full hover:bg-[#EAE4F7] text-[#332B30] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-10">
              {/* Two-column PDP module */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Swipeable Gallery */}
                <div className="lg:col-span-6 space-y-3">
                  <div
                    className="relative aspect-[3/4] rounded-t-[140px] rounded-b-2xl overflow-hidden bg-[#EAE4F7]/50 border border-[#E5DAC6]"
                    onTouchStart={(e) => {
                      touchStartX.current = e.touches[0].clientX;
                    }}
                    onTouchEnd={(e) => {
                      if (touchStartX.current === null) return;
                      const diff = e.changedTouches[0].clientX - touchStartX.current;
                      if (Math.abs(diff) > 40) {
                        setPdpImageIdx((prev) =>
                          diff < 0
                            ? (prev + 1) % pdpProduct.images.length
                            : (prev - 1 + pdpProduct.images.length) %
                              pdpProduct.images.length
                        );
                      }
                      touchStartX.current = null;
                    }}
                  >
                    <img
                      src={pdpProduct.images[pdpImageIdx]}
                      alt={`${pdpProduct.name} tampilan ${pdpImageIdx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />

                    {pdpProduct.images.length > 1 && (
                      <>
                        <button
                          type="button"
                          aria-label="Foto sebelumnya"
                          onClick={() =>
                            setPdpImageIdx(
                              (prev) =>
                                (prev - 1 + pdpProduct.images.length) %
                                pdpProduct.images.length
                            )
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 text-[#332B30] flex items-center justify-center shadow-sm hover:bg-white cursor-pointer"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          aria-label="Foto berikutnya"
                          onClick={() =>
                            setPdpImageIdx(
                              (prev) => (prev + 1) % pdpProduct.images.length
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 text-[#332B30] flex items-center justify-center shadow-sm hover:bg-white cursor-pointer"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Strip */}
                  <div className="flex items-center gap-2.5 justify-center">
                    {pdpProduct.images.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPdpImageIdx(i)}
                        className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          pdpImageIdx === i
                            ? 'border-[#C8A96A] scale-105'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${i + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: Contiguous Purchase Module */}
                <div className="lg:col-span-6 space-y-5">
                  <div>
                    {pdpProduct.editionTag && (
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#9A7B3E] mb-1">
                        {pdpProduct.editionTag}
                      </p>
                    )}
                    <h2 id="pdp-title" className="font-serif text-2xl sm:text-3xl font-semibold text-[#332B30]">
                      {pdpProduct.name}
                    </h2>
                    <p className="text-sm text-[#5A4E55] mt-1">{pdpProduct.subtitle}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <span className="font-mono tabular-nums text-2xl font-bold text-[#332B30]">
                        {formatRupiah(pdpProduct.price)}
                      </span>
                      {pdpProduct.originalPrice && (
                        <span className="font-mono tabular-nums text-sm text-[#8E7F86] line-through">
                          {formatRupiah(pdpProduct.originalPrice)}
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          pdpProduct.jumlah === 0
                            ? 'bg-[#FDE8EC] text-[#B4233C] border-[#F5C2CB]'
                            : pdpProduct.jumlah <= 5
                              ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                              : 'bg-[#E3F1E8] text-[#2F6B43] border-[#BBDAC6]'
                        }`}
                      >
                        {pdpProduct.jumlah === 0 ? 'Stok Habis' : `Stok: ${pdpProduct.jumlah}`}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-[#4A3F45] leading-relaxed">
                    {pdpProduct.description}
                  </p>

                  {/* Color Selector */}
                  <div>
                    <p className="text-xs font-semibold text-[#5A4E55] mb-2">
                      Warna Dipilih: <span className="text-[#332B30]">{pdpColor}</span>
                    </p>
                    <div className="flex items-center gap-2.5">
                      {pdpProduct.colors.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setPdpColor(c.name)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-2 cursor-pointer ${
                            pdpColor === c.name
                              ? 'border-[#332B30] bg-white shadow-xs'
                              : 'border-[#E5DAC6] bg-white/50'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/15"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selector + Size Chart Toggle */}
                  {pdpProduct.sizes.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-[#5A4E55]">
                          Ukuran: <span className="text-[#332B30]">{pdpSize}</span>
                        </p>
                        <button
                          type="button"
                          onClick={() => setSizeChartOpen((prev) => !prev)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#9A7B3E] hover:underline cursor-pointer"
                        >
                          <Ruler className="w-3.5 h-3.5" />
                          <span>{sizeChartOpen ? 'Tutup Panduan Ukuran' : 'Lihat Panduan Ukuran'}</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {pdpProduct.sizes.map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setPdpSize(sz)}
                            className={`w-11 h-10 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                              pdpSize === sz
                                ? 'bg-[#332B30] text-white border-[#332B30]'
                                : 'bg-white text-[#332B30] border-[#E5DAC6] hover:border-[#C8A96A]'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>

                      {sizeChartOpen && (
                        <div className="mt-3 overflow-x-auto rounded-2xl bg-white border border-[#E5DAC6] p-3">
                          <table className="w-full text-xs text-left">
                            <thead>
                              <tr className="border-b border-[#EFE8DA] text-[#6E6068]">
                                <th className="py-1.5 pr-3">Ukuran</th>
                                <th className="py-1.5 pr-3">Lingkar Dada</th>
                                <th className="py-1.5 pr-3">Pinggang</th>
                                <th className="py-1.5 pr-3">Pinggul</th>
                                <th className="py-1.5">Panjang</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F6F1E7] font-mono tabular-nums">
                              {SIZE_CHART_DATA.map((row) => (
                                <tr key={row.size}>
                                  <td className="py-1.5 pr-3 font-bold">{row.size}</td>
                                  <td className="py-1.5 pr-3">{row.bust}</td>
                                  <td className="py-1.5 pr-3">{row.waist}</td>
                                  <td className="py-1.5 pr-3">{row.hip}</td>
                                  <td className="py-1.5">{row.length}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Primary Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-1">
                    <button
                      type="button"
                      disabled={pdpProduct.jumlah === 0}
                      onClick={() => {
                        addToCart(pdpProduct, pdpSize, pdpColor);
                        setCartOpen(true);
                      }}
                      className={`flex-1 min-w-[190px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-white text-sm font-semibold transition-colors ${
                        pdpProduct.jumlah === 0
                          ? 'bg-[#9E9399] cursor-not-allowed opacity-70'
                          : 'bg-[#332B30] hover:bg-[#4A3F45] cursor-pointer'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4 text-[#FAF0BE]" />
                      <span>{pdpProduct.jumlah === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleWishlist(pdpProduct.id, pdpProduct.name)}
                      className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full border text-sm font-semibold transition-colors cursor-pointer ${
                        wishlistIds.includes(pdpProduct.id)
                          ? 'bg-[#EAE4F7] border-[#B6A4DC] text-[#332B30]'
                          : 'bg-white border-[#E5DAC6] text-[#332B30] hover:border-[#C8A96A]'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          wishlistIds.includes(pdpProduct.id)
                            ? 'fill-[#CC5884] text-[#CC5884]'
                            : ''
                        }`}
                      />
                      <span>Wishlist</span>
                    </button>
                  </div>

                  {/* Fabric & Care */}
                  <div className="rounded-2xl bg-white p-4 border border-[#EAE0CF] space-y-2 text-xs text-[#4D4249]">
                    <p className="font-semibold text-[#332B30]">Detail Bahan & Pengerjaan</p>
                    <ul className="space-y-1 list-disc pl-4">
                      {pdpProduct.fabricDetails.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                    <p className="pt-1 border-t border-[#F4EDE0]">
                      <strong className="text-[#332B30]">Perawatan:</strong>{' '}
                      {pdpProduct.careInstructions}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mix & Match Recommendations */}
              <div className="pt-6 border-t border-[#EAE0CF] space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#9A7B3E]" />
                  <h3 className="font-serif text-xl font-semibold text-[#332B30]">
                    Rekomendasi Padu Padan (Mix & Match)
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pdpProduct.mixMatchIds
                    .map((id) => products.find((p) => p.id === id))
                    .filter((p): p is Product => Boolean(p))
                    .map((pair) => (
                      <div
                        key={pair.id}
                        className="bg-white rounded-2xl p-3.5 border border-[#EAE0CF] flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={pair.images[0]}
                            alt={pair.name}
                            referrerPolicy="no-referrer"
                            className="w-16 h-20 rounded-xl object-cover bg-[#EAE4F7]"
                          />
                          <div>
                            <p className="text-xs text-[#9A7B3E] font-medium">{pair.category}</p>
                            <p className="font-serif text-base font-semibold text-[#332B30]">
                              {pair.name}
                            </p>
                            <p className="font-mono tabular-nums text-xs font-bold text-[#5A4E55] mt-0.5">
                              {formatRupiah(pair.price)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => openPdp(pair)}
                          className="px-3.5 py-2 rounded-full bg-[#EAE4F7] hover:bg-[#DDD3F2] text-xs font-semibold text-[#332B30] cursor-pointer shrink-0"
                        >
                          Lihat
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================== SLIDE-OVER CART & CHECKOUT DRAWER ======================== */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Keranjang Belanja"
          onClick={() => setCartOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#FCF9F2] h-full flex flex-col shadow-2xl border-l border-[#E5DAC6]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[#E8DFCE] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#9A7B3E]" />
                <h2 className="font-serif text-xl font-semibold text-[#332B30]">
                  Keranjang Belanja ({totalCartCount})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Tutup keranjang"
                className="p-2 rounded-full hover:bg-[#EAE4F7] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {confirmedOrderId ? (
                <div className="bg-white rounded-3xl p-6 border border-[#D4E4D8] text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-[#466B52] mx-auto" />
                  <h3 className="font-serif text-2xl font-semibold text-[#332B30]">
                    Pesanan Dikonfirmasi!
                  </h3>
                  <p className="font-mono text-sm font-bold text-[#9A7B3E]">
                    {confirmedOrderId}
                  </p>
                  <p className="text-xs sm:text-sm text-[#5A4E55] leading-relaxed">
                    Terima kasih telah berbelanja di Adini. Paket Anda sedang disiapkan dengan kartu ucapan manis kami.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmedOrderId(null);
                      setCartOpen(false);
                      switchTab('belanja');
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#332B30] text-white text-xs font-semibold cursor-pointer"
                  >
                    Lanjut Jelajahi Koleksi
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="py-16 text-center space-y-4">
                  <HandDrawnStar className="w-10 h-10 text-[#C8A96A] mx-auto" />
                  <p className="font-serif text-xl text-[#332B30]">
                    Keranjang Anda masih kosong
                  </p>
                  <p className="text-xs text-[#6E6068]">
                    Temukan gaun, blus sulam, atau kardigan rajut favorit Anda di katalog.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCartOpen(false);
                      switchTab('belanja');
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#332B30] text-white text-xs font-semibold cursor-pointer"
                  >
                    Lihat Katalog
                  </button>
                </div>
              ) : checkoutMode ? (
                <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setCheckoutMode(false)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#6E6068] hover:text-[#332B30] cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke daftar belanja</span>
                  </button>
                  <h3 className="font-serif text-lg font-semibold text-[#332B30]">
                    Informasi Pengiriman & Pembayaran
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold text-[#5A4E55] mb-1">
                      Nama Penerima
                    </label>
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E5DAC6] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5A4E55] mb-1">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E5DAC6] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#5A4E55] mb-1">
                      Alamat Lengkap
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={buyerAddress}
                      onChange={(e) => setBuyerAddress(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E5DAC6] text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#5A4E55] mb-1">
                        Kode Pos
                      </label>
                      <input
                        type="text"
                        required
                        value={buyerPostal}
                        onChange={(e) => setBuyerPostal(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E5DAC6] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#5A4E55] mb-1">
                        Pembayaran
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) =>
                          setPaymentMethod(e.target.value as 'COD' | 'Transfer Bank')
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5DAC6] text-sm"
                      >
                        <option value="Transfer Bank">Transfer Bank</option>
                        <option value="COD">COD (Bayar di Tempat)</option>
                      </select>
                    </div>
                  </div>
                </form>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.key}
                    className="bg-white rounded-2xl p-3.5 border border-[#E8DFCE] flex gap-3.5"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-24 rounded-xl object-cover bg-[#EAE4F7] shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <p className="font-serif text-sm font-semibold text-[#332B30] truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-[#6E6068] mt-0.5">
                          {item.size ? `Ukuran ${item.size} · ` : ''}{item.color}
                        </p>
                        <p className="font-mono tabular-nums text-sm font-bold text-[#332B30] mt-1">
                          {formatRupiah(item.product.price)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="inline-flex items-center rounded-full border border-[#E5DAC6] bg-[#FCF9F2]">
                          <button
                            type="button"
                            aria-label="Kurangi jumlah"
                            onClick={() => updateCartQty(item.key, -1)}
                            className="p-1.5 hover:text-[#9A7B3E] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-mono tabular-nums font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Tambah jumlah"
                            onClick={() => updateCartQty(item.key, 1)}
                            className="p-1.5 hover:text-[#9A7B3E] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          aria-label="Hapus item"
                          onClick={() => updateCartQty(item.key, -item.quantity)}
                          className="p-1.5 text-[#8E7F86] hover:text-[#CC5884] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && !confirmedOrderId && (
              <div className="p-6 border-t border-[#E8DFCE] bg-white space-y-4">
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between text-[#5A4E55]">
                    <span>Ongkos Kirim</span>
                    <span className="font-medium text-[#466B52]">
                      {cartSubtotal >= 500000 ? 'Gratis' : formatRupiah(20000)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-base text-[#332B30]">
                    <span>Total Belanja</span>
                    <span className="font-mono tabular-nums">
                      {formatRupiah(
                        cartSubtotal + (cartSubtotal >= 500000 ? 0 : 20000)
                      )}
                    </span>
                  </div>
                </div>

                {checkoutMode ? (
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={isSubmittingOrder}
                    className="w-full py-3.5 rounded-full bg-[#332B30] hover:bg-[#4A3F45] text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-65"
                  >
                    {isSubmittingOrder ? 'Memproses Pesanan...' : 'Konfirmasi Pesanan'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCheckoutMode(true)}
                    className="w-full py-3.5 rounded-full bg-[#332B30] hover:bg-[#4A3F45] text-white text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Lanjut ke Pembayaran
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface ProductArchCardProps {
  product: Product;
  isWishlisted: boolean;
  adminMode: boolean;
  isStockUpdating: boolean;
  onToggleWishlist: () => void;
  onOpenDetail: () => void;
  onQuickAdd: () => void;
  onSell: (qty: number) => void;
  onRestock: (qty: number) => void;
}

const ProductArchCard: React.FC<ProductArchCardProps> = ({
  product,
  isWishlisted,
  adminMode,
  isStockUpdating,
  onToggleWishlist,
  onOpenDetail,
  onQuickAdd,
  onSell,
  onRestock,
}) => {
  const [sellQty, setSellQty] = useState<number>(1);
  const [restockQty, setRestockQty] = useState<number>(1);

  useEffect(() => {
    setSellQty((prev) => {
      if (product.jumlah <= 0) return 1;
      return Math.max(1, Math.min(product.jumlah, prev));
    });
  }, [product.jumlah]);

  const stockBadgeClass =
    product.jumlah === 0
      ? 'bg-[#FDE8EC] text-[#B4233C] border-[#F5C2CB]'
      : product.jumlah <= 5
        ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
        : 'bg-[#E3F1E8] text-[#2F6B43] border-[#BBDAC6]';

  const stockBadgeText =
    product.jumlah === 0 ? 'Stok Habis' : `Stok: ${product.jumlah}`;

  return (
    <article className="group bg-white rounded-t-[160px] rounded-b-3xl p-3.5 border border-[#E8DFCE] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
      <div>
        <div
          onClick={onOpenDetail}
          className="relative aspect-[3/4] w-full rounded-t-[146px] rounded-b-2xl overflow-hidden bg-[#EAE4F7]/40 cursor-pointer"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Subtle single text tag if limited edition */}
          {product.editionTag && (
            <span className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#FCF9F2]/90 text-[11px] font-semibold text-[#9A7B3E] border border-[#E5DAC6] whitespace-nowrap">
              {product.editionTag}
            </span>
          )}

          {/* Wishlist Heart */}
          <button
            type="button"
            aria-label={isWishlisted ? 'Hapus dari wishlist' : 'Simpan ke wishlist'}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist();
            }}
            className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 text-[#332B30] flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted ? 'fill-[#CC5884] text-[#CC5884]' : 'text-[#5A4E55]'
              }`}
            />
          </button>
        </div>

        <div className="pt-4 px-2 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9A7B3E]">
              {product.category}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap ${stockBadgeClass}`}
            >
              {stockBadgeText}
            </span>
          </div>

          <h3
            onClick={onOpenDetail}
            className="font-serif text-lg font-semibold text-[#332B30] cursor-pointer hover:text-[#9A7B3E] transition-colors"
          >
            {product.name}
          </h3>
          <p className="font-mono tabular-nums text-sm font-bold text-[#4A3F45]">
            {formatRupiah(product.price)}
          </p>
        </div>
      </div>

      <div className="pt-4 px-2 pb-1 space-y-2.5">
        <button
          type="button"
          disabled={product.jumlah === 0}
          onClick={onQuickAdd}
          className={`w-full py-2.5 px-4 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${
            product.jumlah === 0
              ? 'bg-[#F3ECEE] text-[#9E9399] cursor-not-allowed'
              : 'bg-[#EAE4F7] group-hover:bg-[#332B30] text-[#332B30] group-hover:text-white cursor-pointer'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{product.jumlah === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}</span>
        </button>

        {/* Barang Keluar (Terjual -> Stok Berkurang) */}
        <div className="flex items-center gap-2 pt-1 border-t border-[#F3ECE0]">
          <input
            type="number"
            aria-label={`Jumlah barang keluar ${product.name}`}
            min={1}
            max={Math.max(1, product.jumlah)}
            disabled={product.jumlah === 0 || isStockUpdating}
            value={sellQty}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (Number.isNaN(val)) {
                setSellQty(1);
                return;
              }
              setSellQty(Math.max(1, Math.min(Math.max(1, product.jumlah), val)));
            }}
            className="w-16 px-2.5 py-2 rounded-xl bg-[#FCF9F2] border border-[#E5DAC6] text-xs font-mono font-semibold text-center text-[#332B30] focus:outline-none focus:border-[#C8A96A] disabled:opacity-50"
          />
          <button
            type="button"
            disabled={product.jumlah === 0 || isStockUpdating}
            onClick={() => onSell(sellQty)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap ${
              product.jumlah === 0 || isStockUpdating
                ? 'bg-[#F6F1EA] border-[#E8DFCE] text-[#A3969D] cursor-not-allowed opacity-65'
                : 'bg-[#FCF9F2] border-[#C8A96A] text-[#332B30] hover:bg-[#FAF0BE] cursor-pointer'
            }`}
          >
            Jual / Barang Keluar
          </button>
        </div>

        {/* Mode Admin: Barang Masuk / Tambah Stok */}
        {adminMode && (
          <div className="rounded-2xl bg-[#FAF5EB] border border-[#E5DAC6] p-2.5 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#6F597A]">
              <PackagePlus className="w-3.5 h-3.5 text-[#9A7B3E]" />
              <span>Admin Restok</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                aria-label={`Jumlah tambah stok ${product.name}`}
                min={1}
                disabled={isStockUpdating}
                value={restockQty}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setRestockQty(Number.isNaN(val) ? 1 : Math.max(1, val));
                }}
                className="w-16 px-2 py-1.5 rounded-xl bg-white border border-[#E5DAC6] text-xs font-mono font-semibold text-center text-[#332B30] focus:outline-none focus:border-[#466B52]"
              />
              <button
                type="button"
                disabled={isStockUpdating}
                onClick={() => onRestock(restockQty)}
                className="flex-1 py-1.5 px-2.5 rounded-xl bg-[#466B52] hover:bg-[#385742] text-white text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-60"
              >
                + Barang Masuk / Tambah Stok
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

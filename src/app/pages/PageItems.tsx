import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ProductCard } from '../components/ProductCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { ChevronLeft, ChevronRight, LayoutGrid, List, ChevronDown, ChevronUp, SlidersHorizontal, Heart, ShoppingCart, Loader2 } from 'lucide-react';
import api, { ENDPOINTS } from '../config/apiConfig';
import { notifyCartUpdated } from '../context/AuthContext';

// ============================================================
// Types
// ============================================================
interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  basePrice: number;
  salePrice: number | null;
  brandName: string;
  categoryName: string;
  primaryImage: string;
  cpu: string;
  ram: string;
  storage: string;
  display: string;
  avgRating: number;
  reviewCount: number;
}

interface Brand {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface PageResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ============================================================
// Price ranges
// ============================================================
const PRICE_RANGES = [
  { label: 'Dưới 10 triệu',   min: 0,         max: 10000000  },
  { label: '10 - 20 triệu',   min: 10000000,  max: 20000000  },
  { label: '20 - 30 triệu',   min: 20000000,  max: 30000000  },
  { label: '30 - 50 triệu',   min: 30000000,  max: 50000000  },
  { label: 'Trên 50 triệu',   min: 50000000,  max: 999999999 },
];

export default function PageItems() {
  const navigate = useNavigate();

  // ── State dữ liệu ──────────────────────────────────────────
  const [products, setProducts]     = useState<Product[]>([]);
  const [brands, setBrands]         = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(false);

  // ── State filter ───────────────────────────────────────────
  const [selectedBrandIds, setSelectedBrandIds]   = useState<number[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy]       = useState('newest');
  const [currentPage, setCurrentPage] = useState(0); // API dùng 0-based
  const PAGE_SIZE = 12;

  // ── Wishlist & Cart ────────────────────────────────────────
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  // ── State UI ───────────────────────────────────────────────
  const [viewMode, setViewMode]   = useState<'grid' | 'list'>('grid');
  const [openSections, setOpenSections] = useState({ brand: true, category: true, price: true });

  // ── Load brands & categories + wishlist một lần ───────────
  useEffect(() => {
    api.get(ENDPOINTS.CATALOG.BRANDS).then(res => setBrands(res.data));
    api.get(ENDPOINTS.CATALOG.CATEGORIES).then(res => setCategories(res.data));

    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      api.get<{ productId: number }[]>('/wishlist')
        .then(res => setWishlistIds(new Set(res.data.map(w => w.productId))))
        .catch(() => {});
    }
  }, []);

  // ── Load products khi filter/sort/page thay đổi ────────────
  useEffect(() => {
    fetchProducts();
  }, [selectedBrandIds, selectedCategoryId, selectedPriceRange, sortBy, currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const priceRange = selectedPriceRange !== null ? PRICE_RANGES[selectedPriceRange] : null;

      const params: Record<string, any> = {
        page: currentPage,
        size: PAGE_SIZE,
        sort: sortBy,
      };

      // API chỉ nhận 1 brandId — lấy cái đầu tiên nếu chọn nhiều
      if (selectedBrandIds.length > 0) params.brandId = selectedBrandIds[0];
      if (selectedCategoryId)          params.categoryId = selectedCategoryId;
      if (priceRange) {
        params.minPrice = priceRange.min;
        params.maxPrice = priceRange.max;
      }

      const res = await api.get<PageResponse>(ENDPOINTS.CATALOG.PRODUCTS, { params });
      setProducts(res.data.content);
      setTotalElements(res.data.totalElements);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Lỗi tải sản phẩm:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Helpers ────────────────────────────────────────────────
  const toggleSection = (section: keyof typeof openSections) =>
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));

  const toggleBrand = (id: number) => {
    setCurrentPage(0);
    setSelectedBrandIds(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const handleCategoryChange = (id: number) => {
    setCurrentPage(0);
    setSelectedCategoryId(prev => prev === id ? null : id);
  };

  const handlePriceRange = (idx: number) => {
    setCurrentPage(0);
    setSelectedPriceRange(prev => prev === idx ? null : idx);
  };

  const handleSort = (value: string) => {
    setCurrentPage(0);
    setSortBy(value);
  };

  const resetFilters = () => {
    setSelectedBrandIds([]);
    setSelectedCategoryId(null);
    setSelectedPriceRange(null);
    setSortBy('newest');
    setCurrentPage(0);
  };

  // ── Cart handler ──────────────────────────────────────────
  const handleAddToCart = async (productId: number) => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) { navigate('/login'); return; }
    setAddingToCart(productId);
    try {
      const res = await fetch(
        `${(import.meta as any).env?.VITE_API_URL || 'http://localhost:9765'}/api/cart`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ productId, quantity: 1 }),
        }
      );
      if (res.ok) notifyCartUpdated();
    } catch {}
    finally { setAddingToCart(null); }
  };

  // ── Wishlist handler ───────────────────────────────────────
  const handleWishlist = async (productId: number) => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) { navigate('/login'); return; }
    const inWishlist = wishlistIds.has(productId);
    // Optimistic update
    setWishlistIds(prev => {
      const next = new Set(prev);
      inWishlist ? next.delete(productId) : next.add(productId);
      return next;
    });
    try {
      if (inWishlist) {
        await api.delete(`/wishlist/${productId}`);
      } else {
        await api.post(`/wishlist/${productId}`);
      }
    } catch {
      // Rollback nếu lỗi
      setWishlistIds(prev => {
        const next = new Set(prev);
        inWishlist ? next.add(productId) : next.delete(productId);
        return next;
      });
    }
  };

  // ── Map Product → ProductCard props ───────────────────────
  const mapToCardProps = (p: Product) => ({
    id:            p.id,
    name:          p.name,
    brand:         p.brandName,
    price:         p.salePrice ?? p.basePrice,
    originalPrice: p.salePrice ? p.basePrice : undefined,
    rating:        p.avgRating,
    reviews:       p.reviewCount,
    image:         p.primaryImage,
    specs: {
      cpu:     p.cpu,
      ram:     p.ram,
      storage: p.storage,
      display: p.display,
    },
    badge: p.salePrice && p.salePrice < p.basePrice
      ? `Giảm ${Math.round((1 - p.salePrice / p.basePrice) * 100)}%`
      : undefined,
  });

  const startItem = currentPage * PAGE_SIZE + 1;
  const endItem   = Math.min((currentPage + 1) * PAGE_SIZE, totalElements);

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex flex-1">
        {/* ── FilterSidebar ── */}
        <aside className="w-64 bg-white border-r p-5 h-[calc(100vh-112px)] sticky top-28 overflow-y-auto flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <SlidersHorizontal className="size-5 text-red-600" />
              Bộ lọc
            </h2>
            <button onClick={resetFilters} className="text-xs text-red-600 hover:underline">
              Xóa tất cả
            </button>
          </div>

          {/* Danh mục */}
          <div className="mb-5 border-b pb-5">
            <button onClick={() => toggleSection('category')}
              className="flex items-center justify-between w-full mb-3">
              <span className="font-medium text-sm">Danh mục</span>
              {openSections.category ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
            {openSections.category && (
              <div className="space-y-2">
                {categories.map(cat => (
                  <div key={cat.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${cat.id}`}
                      checked={selectedCategoryId === cat.id}
                      onCheckedChange={() => handleCategoryChange(cat.id)}
                    />
                    <Label htmlFor={`cat-${cat.id}`} className="text-sm cursor-pointer">
                      {cat.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Thương hiệu */}
          <div className="mb-5 border-b pb-5">
            <button onClick={() => toggleSection('brand')}
              className="flex items-center justify-between w-full mb-3">
              <span className="font-medium text-sm">Thương hiệu</span>
              {openSections.brand ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
            {openSections.brand && (
              <div className="space-y-2">
                {brands.map(brand => (
                  <div key={brand.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand.id}`}
                      checked={selectedBrandIds.includes(brand.id)}
                      onCheckedChange={() => toggleBrand(brand.id)}
                    />
                    <Label htmlFor={`brand-${brand.id}`} className="text-sm cursor-pointer">
                      {brand.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Khoảng giá */}
          <div className="mb-5">
            <button onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full mb-3">
              <span className="font-medium text-sm">Khoảng giá</span>
              {openSections.price ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
            {openSections.price && (
              <div className="space-y-2">
                {PRICE_RANGES.map((range, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <Checkbox
                      id={`price-${idx}`}
                      checked={selectedPriceRange === idx}
                      onCheckedChange={() => handlePriceRange(idx)}
                    />
                    <Label htmlFor={`price-${idx}`} className="text-sm cursor-pointer">
                      {range.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 p-6">
          {/* Top bar */}
          <div className="bg-white rounded-lg p-4 mb-6 flex items-center justify-between shadow-sm">
            <div>
              <h1 className="text-xl font-bold mb-1">Tất cả sản phẩm</h1>
              <p className="text-sm text-gray-500">
                {loading ? 'Đang tải...' : `Hiển thị ${totalElements > 0 ? startItem : 0}–${endItem} của ${totalElements} sản phẩm`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sắp xếp:</span>
                <Select value={sortBy} onValueChange={handleSort}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                    <SelectItem value="popular">Phổ biến nhất</SelectItem>
                    <SelectItem value="price_asc">Giá tăng dần</SelectItem>
                    <SelectItem value="price_desc">Giá giảm dần</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-1 border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon" className="size-8"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="size-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon" className="size-8"
                  onClick={() => setViewMode('list')}
                >
                  <List className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-72 animate-pulse" />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && products.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg font-medium">Không tìm thấy sản phẩm</p>
              <p className="text-sm mt-1">Thử thay đổi bộ lọc</p>
              <Button onClick={resetFilters} className="mt-4 bg-red-600 hover:bg-red-700 text-white">
                Xóa bộ lọc
              </Button>
            </div>
          )}

          {/* Products */}
          {!loading && products.length > 0 && (
            <div className={`mb-8 ${
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col gap-4'
            }`}>
              {products.map(p => {
                const card = mapToCardProps(p);
                const inWishlist = wishlistIds.has(p.id);
                const isAdding = addingToCart === p.id;
                return (
                  <div key={p.id} className="relative group bg-white rounded-xl border hover:shadow-md transition-shadow flex flex-col">
                    {/* Image */}
                    <div className="relative overflow-hidden rounded-t-xl">
                      <Link to={`/product/${p.id}`}>
                        <img
                          src={card.image || ''}
                          alt={card.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=No+Image'; }}
                        />
                      </Link>
                      {card.badge && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {card.badge}
                        </span>
                      )}
                      {/* Nút tim wishlist */}
                      <button
                        onClick={() => handleWishlist(p.id)}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow hover:scale-110 transition-transform"
                        title={inWishlist ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                      >
                        <Heart className={`size-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-xs text-gray-500 mb-1">{card.brand}</p>
                      <Link to={`/product/${p.id}`}>
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-red-600 transition-colors">{card.name}</h3>
                      </Link>
                      <div className="text-xs text-gray-500 space-y-0.5 mb-3">
                        {card.specs.cpu && <p>CPU: {card.specs.cpu}</p>}
                        {card.specs.ram && <p>RAM: {card.specs.ram}</p>}
                        {card.specs.storage && <p>Ổ cứng: {card.specs.storage}</p>}
                        {card.specs.display && <p>Màn hình: {card.specs.display}</p>}
                      </div>
                      <div className="flex items-center gap-1 mb-3 text-xs text-gray-500">
                        <span className="text-yellow-400">★</span>
                        <span>{card.rating.toFixed(1)}</span>
                        <span>({card.reviews})</span>
                      </div>
                      <div className="flex items-baseline gap-2 mb-4 mt-auto">
                        <span className="text-lg font-bold text-red-600">{card.price.toLocaleString('vi-VN')}₫</span>
                        {card.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">{card.originalPrice.toLocaleString('vi-VN')}₫</span>
                        )}
                      </div>
                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(p.id)}
                          disabled={isAdding}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                        >
                          {isAdding
                            ? <Loader2 className="size-4 animate-spin" />
                            : <ShoppingCart className="size-4" />
                          }
                          Thêm vào giỏ
                        </button>
                        <Link
                          to={`/product/${p.id}`}
                          className="px-3 py-2 border border-gray-300 hover:border-red-600 hover:text-red-600 text-sm rounded-lg transition-colors whitespace-nowrap"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="icon"
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}>
                <ChevronLeft className="size-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  {page + 1}
                </Button>
              ))}

              <Button variant="outline" size="icon"
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
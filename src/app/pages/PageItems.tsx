import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProductCard } from '../components/ProductCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import apiFetch, { ENDPOINTS } from '../config/apiConfig';

// ============================================================
// Types
// ============================================================

/** Khớp với ProductResponse từ backend Spring Boot */
interface ProductResponse {
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

/** Spring Page<T> wrapper */
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;   // trang hiện tại (0-based) — khớp với Spring Page.number
  size: number;
}

// ============================================================
// Sort mapping: UI value → backend param
// ============================================================
const SORT_MAP: Record<string, string> = {
  popular:    'newest',      // backend chưa hỗ trợ popularity, fallback newest
  newest:     'newest',
  'price-asc':  'price-asc',
  'price-desc': 'price-desc',
  rating:     'newest',      // backend chưa hỗ trợ rating sort, fallback newest
};

const PAGE_SIZE = 9;

// ============================================================
// Helpers
// ============================================================

/** Map ProductResponse từ API sang props của ProductCard */
function mapToCardProps(p: ProductResponse) {
  const price         = p.salePrice ?? p.basePrice;
  const originalPrice = p.salePrice != null ? p.basePrice : undefined;
  const badge         =
    p.salePrice != null && p.salePrice < p.basePrice
      ? `Giảm ${Math.round((1 - p.salePrice / p.basePrice) * 100)}%`
      : undefined;

  return {
    id:            p.id,
    name:          p.name,
    brand:         p.brandName,
    price,
    originalPrice,
    rating:        p.avgRating,
    reviews:       p.reviewCount,
    image:         p.primaryImage,
    specs: {
      cpu:     p.cpu,
      ram:     p.ram,
      storage: p.storage,
      display: p.display,
    },
    badge,
  };
}

// ============================================================
// Component
// ============================================================
export default function PageItems() {
  // ── State dữ liệu ──────────────────────────────────────────
  const [products, setProducts]           = useState<ProductResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages]       = useState(1);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState<string | null>(null);

  // ── State filter / sort / pagination ──────────────────────
  const [sortBy, setSortBy]           = useState('popular');
  const [currentPage, setCurrentPage] = useState(0); // 0-based để khớp API

  // TODO: kết nối FilterSidebar khi component đó hỗ trợ props
  // brandId, categoryId, minPrice, maxPrice

  // ── State UI ───────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // ── Fetch sản phẩm ─────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: String(currentPage),
          size: String(PAGE_SIZE),
          sort: SORT_MAP[sortBy] ?? 'newest',
        });

        const data = await apiFetch<PageResponse<ProductResponse>>(
          `${ENDPOINTS.CATALOG.PRODUCTS}?${params.toString()}`
        );

        if (!cancelled) {
          setProducts(data.content);
          setTotalElements(data.totalElements);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
          console.error('Lỗi tải sản phẩm:', err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProducts();
    return () => { cancelled = true; };
  }, [sortBy, currentPage]);

  // ── Handlers ───────────────────────────────────────────────
  const handleSort = (value: string) => {
    setCurrentPage(0);
    setSortBy(value);
  };

  // ── Derived values ─────────────────────────────────────────
  const startItem = totalElements > 0 ? currentPage * PAGE_SIZE + 1 : 0;
  const endItem   = Math.min((currentPage + 1) * PAGE_SIZE, totalElements);

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        {/* FilterSidebar — TODO: truyền props brandId/categoryId/minPrice/maxPrice
            khi FilterSidebar hỗ trợ controlled state */}
        <FilterSidebar />

        <main className="flex-1 p-6">
          {/* Top Bar */}
          <div className="bg-white rounded-lg p-4 mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold mb-1">Tất cả sản phẩm</h1>
              <p className="text-sm text-gray-500">
                {loading
                  ? 'Đang tải...'
                  : `Hiển thị ${startItem}–${endItem} của ${totalElements} sản phẩm`}
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
                    <SelectItem value="popular">Phổ biến nhất</SelectItem>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                    <SelectItem value="price-asc">Giá tăng dần</SelectItem>
                    <SelectItem value="price-desc">Giá giảm dần</SelectItem>
                    <SelectItem value="rating">Đánh giá cao</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-1 border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  className="size-8"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="size-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  className="size-8"
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
                <div key={i} className="bg-white rounded-lg border h-72 animate-pulse" />
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="text-center py-20">
              <p className="text-red-500 font-medium">{error}</p>
              <Button
                className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => setCurrentPage(0)}
              >
                Thử lại
              </Button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg font-medium">Không tìm thấy sản phẩm</p>
              <p className="text-sm mt-1">Thử thay đổi bộ lọc</p>
            </div>
          )}

          {/* Products Grid / List */}
          {!loading && !error && products.length > 0 && (
            <div
              className={`mb-8 ${
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'flex flex-col gap-4'
              }`}
            >
              {products.map((p) => (
                <ProductCard key={p.id} {...mapToCardProps(p)} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="size-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                >
                  {page + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import {
  ChevronRight,
  Search,
  X,
  SlidersHorizontal,
  Grid3x3,
  List,
  ChevronDown,
} from 'lucide-react';

const allProducts = [
  {
    id: 1,
    name: 'Dell XPS 13 Plus - Laptop siêu mỏng nhẹ cho doanh nhân',
    brand: 'Dell',
    price: 32990000,
    originalPrice: 38990000,
    rating: 4.8,
    reviews: 245,
    image:
      'https://images.unsplash.com/photo-1759668358660-0d06064f0f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NzQ4ODczMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    specs: {
      cpu: 'Intel Core i7-1360P',
      ram: '16GB',
      storage: '512GB SSD',
      display: '13.4" FHD+',
    },
    tags: ['dell', 'xps', 'laptop', 'doanh nhân', 'mỏng nhẹ'],
  },
  {
    id: 2,
    name: 'HP EliteBook 840 G9 - Laptop doanh nghiệp bảo mật cao',
    brand: 'HP',
    price: 25990000,
    originalPrice: 29990000,
    rating: 4.7,
    reviews: 156,
    image:
      'https://images.unsplash.com/photo-1762341119317-fb5417c18407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGxhcHRvcCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzQ5NTc1MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    specs: {
      cpu: 'Intel Core i5-1235U',
      ram: '8GB',
      storage: '256GB SSD',
      display: '14" FHD IPS',
    },
    tags: ['hp', 'elitebook', 'laptop', 'doanh nghiệp', 'bảo mật'],
  },
  {
    id: 3,
    name: 'Asus ZenBook 14 OLED - Màn hình OLED tuyệt đẹp',
    brand: 'Asus',
    price: 21990000,
    originalPrice: 24990000,
    rating: 4.6,
    reviews: 234,
    image:
      'https://images.unsplash.com/photo-1754928864131-21917af96dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bHRyYWJvb2slMjB0aGluJTIwbGFwdG9wfGVufDF8fHx8MTc3NDg3NDI0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    specs: {
      cpu: 'Intel Core i7-1165G7',
      ram: '16GB',
      storage: '512GB SSD',
      display: '14" OLED 2.8K',
    },
    tags: ['asus', 'zenbook', 'laptop', 'oled', 'màn hình đẹp'],
  },
  {
    id: 4,
    name: 'Lenovo ThinkPad X1 Carbon Gen 11 - Bền bỉ đa nhiệm',
    brand: 'Lenovo',
    price: 35990000,
    rating: 4.8,
    reviews: 198,
    image:
      'https://images.unsplash.com/photo-1589913649361-56d3f8762bc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3Jrc3RhdGlvbiUyMGxhcHRvcCUyMHBvd2VyZnVsfGVufDF8fHx8MTc3NDk1NzUxNXww&ixlib=rb-4.1.0&q=80&w=1080',
    specs: {
      cpu: 'Intel Core i7-1355U',
      ram: '16GB',
      storage: '1TB SSD',
      display: '14" WUXGA IPS',
    },
    tags: ['lenovo', 'thinkpad', 'laptop', 'bền bỉ', 'đa nhiệm'],
  },
  {
    id: 5,
    name: 'MacBook Air M2 - Mỏng nhẹ đỉnh cao cho sáng tạo',
    brand: 'Apple',
    price: 28990000,
    originalPrice: 32990000,
    rating: 4.9,
    reviews: 567,
    image:
      'https://images.unsplash.com/photo-1532198528077-0d9e4ca9bb40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNib29rJTIwbGFwdG9wJTIwZGVza3xlbnwxfHx8fDE3NzQ5NTM2ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    specs: {
      cpu: 'Apple M2 8-core',
      ram: '16GB',
      storage: '512GB SSD',
      display: '13.6" Liquid Retina',
    },
    tags: ['apple', 'macbook', 'laptop', 'sáng tạo', 'mỏng nhẹ'],
  },
  {
    id: 6,
    name: 'MSI Gaming GF63 Thin - Gaming giá tốt hiệu năng cao',
    brand: 'MSI',
    price: 18990000,
    originalPrice: 21990000,
    rating: 4.5,
    reviews: 289,
    image:
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjBzZXR1cHxlbnwxfHx8fDE3NzQ5NTc1MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    specs: {
      cpu: 'Intel Core i5-11400H',
      ram: '8GB',
      storage: '512GB SSD',
      display: '15.6" FHD 144Hz',
    },
    tags: ['msi', 'gaming', 'laptop', 'giá rẻ', 'hiệu năng'],
  },
  {
    id: 7,
    name: 'Acer Swift 3 - Laptop văn phòng hiệu quả',
    brand: 'Acer',
    price: 15990000,
    originalPrice: 18990000,
    rating: 4.4,
    reviews: 178,
    image:
      'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBvZmZpY2UlMjBkZXNrfGVufDF8fHx8MTc3NDk1NzUxNXww&ixlib=rb-4.1.0&q=80&w=1080',
    specs: {
      cpu: 'Intel Core i5-1235U',
      ram: '8GB',
      storage: '256GB SSD',
      display: '14" FHD IPS',
    },
    tags: ['acer', 'swift', 'laptop', 'văn phòng', 'giá rẻ'],
  },
  {
    id: 8,
    name: 'Dell Inspiron 15 3520 - Laptop sinh viên đa năng',
    brand: 'Dell',
    price: 12990000,
    rating: 4.3,
    reviews: 412,
    image:
      'https://images.unsplash.com/photo-1504707748692-419802cf939d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwbGFwdG9wJTIwc3R1ZHlpbmd8ZW58MXx8fHwxNzc0OTU3NTE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    specs: {
      cpu: 'Intel Core i3-1215U',
      ram: '8GB',
      storage: '256GB SSD',
      display: '15.6" FHD',
    },
    tags: ['dell', 'inspiron', 'laptop', 'sinh viên', 'giá rẻ'],
  },
];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(true);

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [selectedRAM, setSelectedRAM] = useState<string[]>([]);

  // Filter products based on search query
  const filteredProducts = allProducts.filter((product) => {
    const searchLower = query.toLowerCase();
    const matchesQuery =
      product.name.toLowerCase().includes(searchLower) ||
      product.brand.toLowerCase().includes(searchLower) ||
      product.tags.some((tag) => tag.toLowerCase().includes(searchLower));

    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesRAM =
      selectedRAM.length === 0 ||
      selectedRAM.some((ram) => product.specs.ram.includes(ram));

    return matchesQuery && matchesBrand && matchesPrice && matchesRAM;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const brands = ['Dell', 'HP', 'Asus', 'Lenovo', 'Apple', 'MSI', 'Acer'];
  const ramOptions = ['4GB', '8GB', '16GB', '32GB'];

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleRAM = (ram: string) => {
    setSelectedRAM((prev) =>
      prev.includes(ram) ? prev.filter((r) => r !== ram) : [...prev, ram]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, 50000000]);
    setSelectedRAM([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-red-600">
              Trang chủ
            </Link>
            <ChevronRight className="size-4" />
            <span className="text-gray-900">Tìm kiếm</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Search className="size-6 text-gray-400" />
            <h1 className="text-2xl font-bold">
              Kết quả tìm kiếm cho "{query}"
            </h1>
          </div>
          <p className="text-gray-600">
            Tìm thấy <span className="font-semibold">{sortedProducts.length}</span>{' '}
            sản phẩm
          </p>
        </div>

        {/* Active Filters */}
        {(selectedBrands.length > 0 || selectedRAM.length > 0) && (
          <div className="bg-white rounded-lg border p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Bộ lọc đang áp dụng:</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="size-4 mr-1" />
                Xóa tất cả
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedBrands.map((brand) => (
                <Badge
                  key={brand}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => toggleBrand(brand)}
                >
                  {brand}
                  <X className="size-3 ml-1" />
                </Badge>
              ))}
              {selectedRAM.map((ram) => (
                <Badge
                  key={ram}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => toggleRAM(ram)}
                >
                  RAM {ram}
                  <X className="size-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          {showFilters && (
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg border p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <SlidersHorizontal className="size-5" />
                    Bộ lọc
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>

                {/* Brand Filter */}
                <div className="mb-6 pb-6 border-b">
                  <h3 className="font-semibold mb-3">Thương hiệu</h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center gap-2">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
                        />
                        <Label
                          htmlFor={`brand-${brand}`}
                          className="cursor-pointer flex-1"
                        >
                          {brand}
                        </Label>
                        <span className="text-sm text-gray-500">
                          (
                          {
                            allProducts.filter((p) => p.brand === brand).length
                          }
                          )
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-6 pb-6 border-b">
                  <h3 className="font-semibold mb-3">Khoảng giá</h3>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={50000000}
                      step={1000000}
                      className="mb-4"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {(priceRange[0] / 1000000).toFixed(0)}tr
                      </span>
                      <span className="text-gray-600">
                        {(priceRange[1] / 1000000).toFixed(0)}tr
                      </span>
                    </div>
                  </div>
                </div>

                {/* RAM Filter */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">RAM</h3>
                  <div className="space-y-2">
                    {ramOptions.map((ram) => (
                      <div key={ram} className="flex items-center gap-2">
                        <Checkbox
                          id={`ram-${ram}`}
                          checked={selectedRAM.includes(ram)}
                          onCheckedChange={() => toggleRAM(ram)}
                        />
                        <Label
                          htmlFor={`ram-${ram}`}
                          className="cursor-pointer flex-1"
                        >
                          {ram}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg border p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {!showFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(true)}
                  >
                    <SlidersHorizontal className="size-4 mr-2" />
                    Bộ lọc
                  </Button>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sắp xếp:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="popular">Phổ biến</option>
                    <option value="price-asc">Giá: Thấp đến cao</option>
                    <option value="price-desc">Giá: Cao đến thấp</option>
                    <option value="rating">Đánh giá</option>
                    <option value="name">Tên A-Z</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={
                    viewMode === 'grid' ? 'bg-red-600 hover:bg-red-700' : ''
                  }
                >
                  <Grid3x3 className="size-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={
                    viewMode === 'list' ? 'bg-red-600 hover:bg-red-700' : ''
                  }
                >
                  <List className="size-4" />
                </Button>
              </div>
            </div>

            {/* Products */}
            {sortedProducts.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border p-12 text-center">
                <Search className="size-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-bold mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-600 mb-6">
                  Không có sản phẩm nào phù hợp với tìm kiếm của bạn. Thử thay đổi
                  bộ lọc hoặc từ khóa tìm kiếm.
                </p>
                <Button onClick={clearFilters}>Xóa bộ lọc</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ChevronRight, Truck, CreditCard, Shield, Headphones } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const featuredProducts = [
  {
    id: 1,
    name: 'Dell XPS 13 Plus - Laptop siêu mỏng nhẹ cho doanh nhân',
    brand: 'Dell',
    price: 32990000,
    originalPrice: 38990000,
    rating: 4.8,
    reviews: 245,
    image: 'https://images.unsplash.com/photo-1759668358660-0d06064f0f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NzQ4ODczMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    specs: {
      cpu: 'Intel Core i7-1360P',
      ram: '16GB',
      storage: '512GB SSD',
      display: '13.4" FHD+',
    },
    badge: 'Giảm 15%',
  },
  {
    id: 2,
    name: 'MSI Gaming GE76 Raider - Laptop gaming cao cấp RTX 4080',
    brand: 'MSI',
    price: 54990000,
    originalPrice: 62990000,
    rating: 4.9,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1632603093711-0d93a0bcc6cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjByZ2J8ZW58MXx8fHwxNzc0ODYyODQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    specs: {
      cpu: 'Intel Core i9-13980HX',
      ram: '32GB',
      storage: '1TB SSD',
      display: '17.3" QHD 240Hz',
    },
    badge: 'Hot',
  },
  {
    id: 3,
    name: 'MacBook Air M2 - Mỏng nhẹ đỉnh cao cho sáng tạo',
    brand: 'Apple',
    price: 28990000,
    originalPrice: 32990000,
    rating: 4.9,
    reviews: 567,
    image: 'https://images.unsplash.com/photo-1532198528077-0d9e4ca9bb40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNib29rJTIwbGFwdG9wJTIwZGVza3xlbnwxfHx8fDE3NzQ5NTM2ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    specs: {
      cpu: 'Apple M2 8-core',
      ram: '16GB',
      storage: '512GB SSD',
      display: '13.6" Liquid Retina',
    },
  },
  {
    id: 4,
    name: 'HP EliteBook 840 G9 - Laptop doanh nghiệp bảo mật cao',
    brand: 'HP',
    price: 25990000,
    originalPrice: 29990000,
    rating: 4.7,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1762341119317-fb5417c18407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGxhcHRvcCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzQ5NTc1MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    specs: {
      cpu: 'Intel Core i5-1235U',
      ram: '8GB',
      storage: '256GB SSD',
      display: '14" FHD IPS',
    },
    badge: 'Bán chạy',
  },
];

const categories = [
  { name: 'Laptop Gaming', image: 'https://images.unsplash.com/photo-1632603093711-0d93a0bcc6cc?w=400' },
  { name: 'Laptop Văn Phòng', image: 'https://images.unsplash.com/photo-1759668358660-0d06064f0f84?w=400' },
  { name: 'Laptop Đồ Họa', image: 'https://images.unsplash.com/photo-1641430034785-47f6f91ab6cf?w=400' },
  { name: 'Laptop Mỏng Nhẹ', image: 'https://images.unsplash.com/photo-1754928864131-21917af96dfd?w=400' },
];

const gamingProducts = [
  {
    id: 101,
    name: 'Asus ROG Strix G16 - Gaming RTX 4070 144Hz',
    brand: 'Asus',
    price: 42990000,
    originalPrice: 49990000,
    rating: 4.8,
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600',
    specs: {
      cpu: 'Intel Core i9-13980HX',
      ram: '16GB DDR5',
      storage: '1TB NVMe SSD',
      display: '16" QHD 165Hz',
    },
    badge: 'Hot',
  },
  {
    id: 102,
    name: 'Acer Predator Helios 16 - RTX 4080 240Hz',
    brand: 'Acer',
    price: 58990000,
    originalPrice: 65990000,
    rating: 4.9,
    reviews: 198,
    image: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=600',
    specs: {
      cpu: 'Intel Core i9-13900HX',
      ram: '32GB DDR5',
      storage: '2TB NVMe SSD',
      display: '16" QHD 240Hz',
    },
    badge: 'Gaming',
  },
  {
    id: 103,
    name: 'Lenovo Legion Pro 7i - i9 RTX 4070 Ti',
    brand: 'Lenovo',
    price: 51990000,
    originalPrice: 59990000,
    rating: 4.8,
    reviews: 256,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
    specs: {
      cpu: 'Intel Core i9-13900HX',
      ram: '32GB DDR5',
      storage: '1TB NVMe SSD',
      display: '16" WQXGA 165Hz',
    },
    badge: 'Hot',
  },
  {
    id: 104,
    name: 'MSI Raider GE78 HX - RTX 4090 17.3"',
    brand: 'MSI',
    price: 74990000,
    originalPrice: 84990000,
    rating: 4.9,
    reviews: 143,
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600',
    specs: {
      cpu: 'Intel Core i9-13980HX',
      ram: '64GB DDR5',
      storage: '2TB NVMe SSD',
      display: '17.3" QHD 240Hz',
    },
    badge: 'Gaming',
  },
];

const officeProducts = [
  {
    id: 201,
    name: 'Lenovo ThinkPad E14 Gen 5 - Doanh nghiệp bền bỉ',
    brand: 'Lenovo',
    price: 19990000,
    originalPrice: 23990000,
    rating: 4.7,
    reviews: 421,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600',
    specs: {
      cpu: 'Intel Core i5-1335U',
      ram: '16GB',
      storage: '512GB SSD',
      display: '14" FHD IPS',
    },
    badge: 'Bán chạy',
  },
  {
    id: 202,
    name: 'HP EliteBook 840 G10 - Bảo mật vân tay, IR cam',
    brand: 'HP',
    price: 27990000,
    originalPrice: 31990000,
    rating: 4.7,
    reviews: 289,
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600',
    specs: {
      cpu: 'Intel Core i7-1355U',
      ram: '16GB',
      storage: '512GB SSD',
      display: '14" FHD IPS',
    },
    badge: 'Giảm 10%',
  },
  {
    id: 203,
    name: 'Dell Latitude 5540 - Laptop doanh nghiệp cao cấp',
    brand: 'Dell',
    price: 24990000,
    originalPrice: 28990000,
    rating: 4.6,
    reviews: 175,
    image: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=600',
    specs: {
      cpu: 'Intel Core i5-1345U',
      ram: '16GB',
      storage: '256GB SSD',
      display: '15.6" FHD',
    },
    badge: 'Bán chạy',
  },
  {
    id: 204,
    name: 'Asus ExpertBook B1 B1502 - Nhẹ 1.7kg văn phòng',
    brand: 'Asus',
    price: 17990000,
    originalPrice: 20990000,
    rating: 4.5,
    reviews: 334,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',
    specs: {
      cpu: 'Intel Core i5-1235U',
      ram: '8GB',
      storage: '512GB SSD',
      display: '15.6" FHD',
    },
    badge: 'Giảm 10%',
  },
];

const ultrabookProducts = [
  {
    id: 301,
    name: 'LG Gram 14 2024 - Siêu nhẹ 999g, pin 25h',
    brand: 'LG',
    price: 35990000,
    originalPrice: 39990000,
    rating: 4.9,
    reviews: 267,
    image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600',
    specs: {
      cpu: 'Intel Core Ultra 7 155H',
      ram: '16GB',
      storage: '512GB SSD',
      display: '14" WUXGA IPS',
    },
    badge: 'Mới',
  },
  {
    id: 302,
    name: 'Samsung Galaxy Book4 Pro 360 - AMOLED 2X',
    brand: 'Samsung',
    price: 38990000,
    originalPrice: 43990000,
    rating: 4.8,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600',
    specs: {
      cpu: 'Intel Core Ultra 7 155H',
      ram: '16GB',
      storage: '512GB SSD',
      display: '16" 3K AMOLED',
    },
    badge: 'Mới',
  },
  {
    id: 303,
    name: 'MacBook Air M3 - Chip M3 mạnh mẽ, mỏng 11.3mm',
    brand: 'Apple',
    price: 32990000,
    originalPrice: 36990000,
    rating: 4.9,
    reviews: 892,
    image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600',
    specs: {
      cpu: 'Apple M3 8-core',
      ram: '16GB',
      storage: '512GB SSD',
      display: '15.3" Liquid Retina',
    },
    badge: 'Siêu mỏng',
  },
  {
    id: 304,
    name: 'Dell XPS 13 9340 - InfinityEdge 13.4" mỏng 14.8mm',
    brand: 'Dell',
    price: 33990000,
    originalPrice: 38990000,
    rating: 4.8,
    reviews: 221,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
    specs: {
      cpu: 'Intel Core Ultra 5 125H',
      ram: '16GB',
      storage: '512GB SSD',
      display: '13.4" FHD+ IPS',
    },
    badge: 'Siêu mỏng',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div>
              <Badge className="mb-4 bg-yellow-400 text-black hover:bg-yellow-500">
                🔥 Khuyến mãi đặc biệt
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold mb-4">
                Laptop Chính Hãng Giá Tốt Nhất
              </h1>
              <p className="text-sm mb-3 text-red-100">
                Giảm giá lên đến 40% cho các dòng laptop cao cấp. Trả góp 0% lãi suất.
              </p>
              <div className="flex gap-4">
                <Button size="sm" className="bg-white text-red-600 hover:bg-gray-100">
                  <Link to="/products">Mua ngay</Link>
                </Button>
                <Button size="sm" variant="outline" className="border-white text-white hover:bg-red-800">
                  Xem thêm
                </Button>
              </div>
            </div>
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1580978608550-0390af9b72b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBzYWxlJTIwYmFubmVyJTIwcHJvbW90aW9ufGVufDF8fHx8MTc3NDk1Nzk3OHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Laptop Banner"
                className="w-full max-h-40 object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="size-12 bg-red-100 rounded-full flex items-center justify-center">
                <Truck className="size-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Miễn phí vận chuyển</h3>
                <p className="text-xs text-gray-500">Đơn hàng từ 5 triệu</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-12 bg-red-100 rounded-full flex items-center justify-center">
                <CreditCard className="size-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Trả góp 0%</h3>
                <p className="text-xs text-gray-500">Lãi suất ưu đãi</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-12 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="size-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Bảo hành chính hãng</h3>
                <p className="text-xs text-gray-500">Toàn quốc</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-12 bg-red-100 rounded-full flex items-center justify-center">
                <Headphones className="size-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Hỗ trợ 24/7</h3>
                <p className="text-xs text-gray-500">Tư vấn miễn phí</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Danh mục sản phẩm</h2>
            <Link to="/products" className="text-red-600 hover:text-red-700 flex items-center gap-1">
              Xem tất cả
              <ChevronRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                to="/products"
                className="group relative overflow-hidden rounded-lg border hover:shadow-lg transition-all"
              >
                <ImageWithFallback
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <h3 className="text-white font-semibold text-lg p-4">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Sản phẩm nổi bật</h2>
            <Link to="/products" className="text-red-600 hover:text-red-700 flex items-center gap-1">
              Xem tất cả
              <ChevronRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Gaming Products */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Laptop Gaming</h2>
            <Link to="/products" className="text-red-600 hover:text-red-700 flex items-center gap-1">
              Xem tất cả
              <ChevronRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gamingProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Office Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Laptop Văn Phòng</h2>
            <Link to="/products" className="text-red-600 hover:text-red-700 flex items-center gap-1">
              Xem tất cả
              <ChevronRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {officeProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Ultrabook Products */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Laptop Mỏng Nhẹ / Ultrabook</h2>
            <Link to="/products" className="text-red-600 hover:text-red-700 flex items-center gap-1">
              Xem tất cả
              <ChevronRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ultrabookProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-4">Laptop Gaming Đỉnh Cao</h2>
                <p className="text-lg mb-6 text-blue-100">
                  RTX 4080 - Intel Core i9 - Màn hình 240Hz. Trải nghiệm gaming tuyệt vời nhất.
                </p>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link to="/products">Khám phá ngay</Link>
                </Button>
              </div>
              <div>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1641430034785-47f6f91ab6cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwbGFwdG9wJTIwd29ya3NwYWNlJTIwbW9kZXJufGVufDF8fHx8MTc3NDk1Nzk3OHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Gaming Banner"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">LaptopShop</h3>
              <p className="text-gray-400 text-sm">
                Chuyên cung cấp laptop chính hãng, giá tốt nhất thị trường.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Về chúng tôi</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Giới thiệu</a></li>
                <li><a href="#" className="hover:text-white">Liên hệ</a></li>
                <li><a href="#" className="hover:text-white">Tuyển dụng</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Chính sách</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Chính sách bảo hành</a></li>
                <li><a href="#" className="hover:text-white">Chính sách đổi trả</a></li>
                <li><a href="#" className="hover:text-white">Chính sách vận chuyển</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Liên hệ</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Hotline: 1900 xxxx</li>
                <li>Email: support@laptopshop.vn</li>
                <li>Địa chỉ: Hà Nội, Việt Nam</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 LaptopShop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

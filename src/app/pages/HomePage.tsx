import { Link } from 'react-router';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ChevronRight, Truck, CreditCard, Shield, Headphones } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Footer } from '../components/Footer';

const featuredProducts = [
  {
    id: 1,
    name: 'Dell XPS 13 Plus - Laptop siêu mỏng nhẹ cho doanh nhân',
    brand: 'Dell',
    price: 32990000,
    originalPrice: 38990000,
    rating: 4.8,
    reviews: 245,
    image: 'https://images.unsplash.com/photo-1759668358660-0d06064f0f84?w=400',
    specs: { cpu: 'Intel Core i7-1360P', ram: '16GB', storage: '512GB SSD', display: '13.4" FHD+' },
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
    image: 'https://images.unsplash.com/photo-1632603093711-0d93a0bcc6cc?w=400',
    specs: { cpu: 'Intel Core i9-13980HX', ram: '32GB', storage: '1TB SSD', display: '17.3" QHD 240Hz' },
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
    image: 'https://images.unsplash.com/photo-1532198528077-0d9e4ca9bb40?w=400',
    specs: { cpu: 'Apple M2 8-core', ram: '16GB', storage: '512GB SSD', display: '13.6" Liquid Retina' },
  },
  {
    id: 4,
    name: 'HP EliteBook 840 G9 - Laptop doanh nghiệp bảo mật cao',
    brand: 'HP',
    price: 25990000,
    originalPrice: 29990000,
    rating: 4.7,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1762341119317-fb5417c18407?w=400',
    specs: { cpu: 'Intel Core i5-1235U', ram: '8GB', storage: '256GB SSD', display: '14" FHD IPS' },
    badge: 'Bán chạy',
  },
];

const gamingProducts = [
  {
    id: 5,
    name: 'Asus ROG Strix G16 - Laptop gaming RGB chiến mọi game',
    brand: 'Asus',
    price: 42990000,
    originalPrice: 49990000,
    rating: 4.8,
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1603481546238-487240415921?w=400',
    specs: { cpu: 'Intel Core i9-13980HX', ram: '16GB', storage: '1TB SSD', display: '16" QHD 165Hz' },
    badge: 'Hot',
  },
  {
    id: 6,
    name: 'Acer Predator Helios 300 - Chiến binh gaming tầm trung',
    brand: 'Acer',
    price: 35990000,
    originalPrice: 41990000,
    rating: 4.7,
    reviews: 278,
    image: 'https://images.unsplash.com/photo-1593640408182-31c228b30c9c?w=400',
    specs: { cpu: 'Intel Core i7-12700H', ram: '16GB', storage: '512GB SSD', display: '15.6" FHD 144Hz' },
    badge: 'Gaming',
  },
  {
    id: 7,
    name: 'Lenovo Legion 5 Pro - Gaming performance đỉnh cao',
    brand: 'Lenovo',
    price: 38990000,
    originalPrice: 45990000,
    rating: 4.8,
    reviews: 201,
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400',
    specs: { cpu: 'AMD Ryzen 7 6800H', ram: '16GB', storage: '1TB SSD', display: '16" QHD 165Hz' },
    badge: 'Hot',
  },
  {
    id: 8,
    name: 'MSI Raider GE68 - Siêu phẩm gaming RTX 4070',
    brand: 'MSI',
    price: 48990000,
    originalPrice: 55990000,
    rating: 4.9,
    reviews: 143,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400',
    specs: { cpu: 'Intel Core i9-13950HX', ram: '32GB', storage: '1TB SSD', display: '16" QHD 240Hz' },
    badge: 'Gaming',
  },
];

const officeProducts = [
  {
    id: 9,
    name: 'Lenovo ThinkPad X1 Carbon - Laptop doanh nhân cao cấp',
    brand: 'Lenovo',
    price: 36990000,
    originalPrice: 41990000,
    rating: 4.8,
    reviews: 324,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
    specs: { cpu: 'Intel Core i7-1265U', ram: '16GB', storage: '512GB SSD', display: '14" 2K IPS' },
    badge: 'Bán chạy',
  },
  {
    id: 10,
    name: 'Dell Latitude 5530 - Laptop văn phòng bền bỉ',
    brand: 'Dell',
    price: 22990000,
    originalPrice: 25990000,
    rating: 4.6,
    reviews: 187,
    image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400',
    specs: { cpu: 'Intel Core i5-1235U', ram: '8GB', storage: '256GB SSD', display: '15.6" FHD IPS' },
    badge: 'Giảm 10%',
  },
  {
    id: 11,
    name: 'Asus ExpertBook B5 - Laptop văn phòng siêu nhẹ',
    brand: 'Asus',
    price: 27990000,
    originalPrice: 32990000,
    rating: 4.7,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    specs: { cpu: 'Intel Core i7-1255U', ram: '16GB', storage: '512GB SSD', display: '14" FHD IPS' },
    badge: 'Bán chạy',
  },
  {
    id: 12,
    name: 'HP ProBook 450 G9 - Laptop văn phòng giá tốt',
    brand: 'HP',
    price: 19990000,
    originalPrice: 23990000,
    rating: 4.5,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
    specs: { cpu: 'Intel Core i5-1235U', ram: '8GB', storage: '256GB SSD', display: '15.6" FHD' },
    badge: 'Giảm 10%',
  },
];

const ultrabookProducts = [
  {
    id: 13,
    name: 'LG Gram 14 - Siêu nhẹ chỉ 999g, pin cả ngày',
    brand: 'LG',
    price: 31990000,
    originalPrice: 36990000,
    rating: 4.8,
    reviews: 198,
    image: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=400',
    specs: { cpu: 'Intel Core i7-1260P', ram: '16GB', storage: '512GB SSD', display: '14" WUXGA IPS' },
    badge: 'Siêu mỏng',
  },
  {
    id: 14,
    name: 'Samsung Galaxy Book3 Pro - Ultrabook màn hình AMOLED',
    brand: 'Samsung',
    price: 33990000,
    originalPrice: 38990000,
    rating: 4.7,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400',
    specs: { cpu: 'Intel Core i7-1360P', ram: '16GB', storage: '512GB SSD', display: '14" 3K AMOLED' },
    badge: 'Mới',
  },
  {
    id: 15,
    name: 'MacBook Air M3 - Chip M3 mạnh mẽ, thiết kế thanh lịch',
    brand: 'Apple',
    price: 34990000,
    originalPrice: 38990000,
    rating: 4.9,
    reviews: 421,
    image: 'https://images.unsplash.com/photo-1569770218135-bea267ed7e84?w=400',
    specs: { cpu: 'Apple M3 8-core', ram: '8GB', storage: '256GB SSD', display: '13.6" Liquid Retina' },
    badge: 'Mới',
  },
  {
    id: 16,
    name: 'Dell XPS 15 - Ultrabook màn hình OLED 3.5K',
    brand: 'Dell',
    price: 45990000,
    originalPrice: 52990000,
    rating: 4.8,
    reviews: 167,
    image: 'https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=400',
    specs: { cpu: 'Intel Core i7-13700H', ram: '16GB', storage: '512GB SSD', display: '15.6" OLED 3.5K' },
    badge: 'Siêu mỏng',
  },
];

const categories = [
  { name: 'Laptop Gaming', image: 'https://images.unsplash.com/photo-1632603093711-0d93a0bcc6cc?w=400' },
  { name: 'Laptop Văn Phòng', image: 'https://images.unsplash.com/photo-1759668358660-0d06064f0f84?w=400' },
  { name: 'Laptop Đồ Họa', image: 'https://images.unsplash.com/photo-1641430034785-47f6f91ab6cf?w=400' },
  { name: 'Laptop Mỏng Nhẹ', image: 'https://images.unsplash.com/photo-1754928864131-21917af96dfd?w=400' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Banner - nhỏ gọn hơn */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <Badge className="mb-3 bg-yellow-400 text-black hover:bg-yellow-500">
                🔥 Khuyến mãi đặc biệt
              </Badge>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Laptop Chính Hãng Giá Tốt Nhất
              </h1>
              <p className="text-sm mb-3 text-red-100">
                Giảm giá lên đến 40% cho các dòng laptop cao cấp. Trả góp 0% lãi suất.
              </p>
              <div className="flex gap-3">
                <Button size="sm" className="bg-white text-red-600 hover:bg-gray-100">
                  <Link to="/products">Mua ngay</Link>
                </Button>
                <Button size="sm" className="bg-white text-red-600 hover:bg-gray-100">
                  Xem thêm
                </Button>
              </div>
            </div>
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"
                alt="Laptop Banner"
                className="w-full max-h-36 object-cover rounded-lg shadow-2xl"
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
      <section className="py-10">
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
      <section className="py-10 bg-white">
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
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">🎮 Laptop Gaming</h2>
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

      {/* Promotional Banner Gaming - nhỏ gọn hơn */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-4 items-center p-6 md:p-8">
              <div className="text-white">
                <h2 className="text-xl font-bold mb-2">Laptop Gaming Đỉnh Cao</h2>
                <p className="text-sm mb-4 text-blue-100">
                  RTX 4080 - Intel Core i9 - Màn hình 240Hz. Trải nghiệm gaming tuyệt vời nhất.
                </p>
                <Button size="sm" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link to="/products">Khám phá ngay</Link>
                </Button>
              </div>
              <div>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1641430034785-47f6f91ab6cf?w=600"
                  alt="Gaming Banner"
                  className="w-full max-h-36 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Products */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">💼 Laptop Văn Phòng</h2>
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
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">✨ Laptop Mỏng Nhẹ / Ultrabook</h2>
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

      <Footer />
      
    </div>
  );
}
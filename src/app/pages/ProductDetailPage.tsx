import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  RotateCcw,
  CheckCircle,
  ChevronRight,
  Minus,
  Plus,
  ZoomIn,
  Phone,
  Mail,
  MapPin,
  Gift,
  Clock,
  Award,
  TrendingUp,
  Info,
  AlertCircle,
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

// Mock data cho sản phẩm
const productData = {
  id: 1,
  name: 'Dell XPS 13 Plus - Laptop siêu mỏng nhẹ cho doanh nhân',
  brand: 'Dell',
  price: 32990000,
  originalPrice: 38990000,
  rating: 4.8,
  reviews: 245,
  inStock: true,
  stockQuantity: 15,
  sold: 1234,
  sku: 'DELL-XPS13-2024',
  images: [
    'https://images.unsplash.com/photo-1759668358660-0d06064f0f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NzQ4ODczMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1721073468134-df54b77e01b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBrZXlib2FyZCUyMGRldGFpbHxlbnwxfHx8fDE3NzUxNDUwMjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1768561327873-206fe9c43b93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBzY3JlZW4lMjBkaXNwbGF5JTIwY2xvc2V8ZW58MXx8fHwxNzc1MTQ1MDMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1649269234528-6cf263c06ccc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBwb3J0cyUyMGNvbm5lY3Rpb25zfGVufDF8fHx8MTc3NTE0NTAzMHww&ixlib=rb-4.1.0&q=80&w=1080',
  ],
  description:
    'Dell XPS 13 Plus là chiếc laptop cao cấp được thiết kế dành cho các doanh nhân và người dùng chuyên nghiệp. Với thiết kế siêu mỏng nhẹ, hiệu năng mạnh mẽ cùng màn hình InfinityEdge tuyệt đẹp, XPS 13 Plus mang đến trải nghiệm làm việc đỉnh cao.',
  fullDescription: `
Dell XPS 13 Plus là sự kết hợp hoàn hảo giữa thiết kế đẳng cấp và hiệu năng vượt trội. Với vỏ nhôm nguyên khối cao cấp, laptop mang đến vẻ ngoài sang trọng và bền bỉ vượt thời gian.

Thiết kế InfinityEdge với viền màn hình siêu mỏng mang đến không gian hiển thị rộng rãi trong thân máy nhỏ gọn. Màn hình FHD+ sắc nét, độ sáng 500 nits đảm bảo hình ảnh rõ ràng ngay cả dưới ánh sáng mặt trời.

Bộ vi xử lý Intel Core i7 thế hệ 13 với 12 nhân 16 luồng mang đến hiệu năng mạnh mẽ cho mọi tác vụ từ văn phòng, thiết kế đồ họa đến chỉnh sửa video. RAM 16GB LPDDR5 đảm bảo đa nhiệm mượt mà, trong khi SSD 512GB PCIe NVMe cho tốc độ đọc/ghi nhanh chóng.

Pin 55WHr cung cấp thời lượng sử dụng cả ngày, kết hợp với sạc nhanh giúp bạn luôn sẵn sàng làm việc mọi lúc mọi nơi.
  `,
  specs: {
    cpu: 'Intel Core i7-1360P (12 nhân, 16 luồng, 18MB Cache, up to 5.0GHz)',
    ram: '16GB LPDDR5 5200MHz (Onboard)',
    storage: '512GB PCIe NVMe M.2 SSD',
    display: '13.4" FHD+ (1920 x 1200) InfinityEdge Non-Touch, Anti-Glare, 500 nits',
    gpu: 'Intel Iris Xe Graphics',
    battery: '55WHr, 4-Cell Battery',
    weight: '1.24kg',
    dimensions: '295.4 x 199.1 x 15.3 mm',
    os: 'Windows 11 Home',
    ports: '2x Thunderbolt 4 (USB-C), 1x Audio Jack',
    connectivity: 'Wi-Fi 6E (802.11ax), Bluetooth 5.2',
    keyboard: 'Backlit Keyboard - English',
    webcam: '720p HD Camera',
    audio: 'Dual Stereo Speakers, MaxxAudio Pro',
    color: 'Platinum Silver',
    material: 'Aluminum Unibody',
    warranty: '12 tháng chính hãng',
  },
  highlights: [
    'Thiết kế siêu mỏng nhẹ chỉ 1.24kg, dễ dàng mang theo',
    'Màn hình InfinityEdge 13.4" FHD+ viền siêu mỏng',
    'Hiệu năng mạnh mẽ với Intel Core i7 thế hệ 13',
    'RAM 16GB LPDDR5 5200MHz tốc độ cao',
    'SSD 512GB PCIe NVMe đọc/ghi siêu nhanh',
    'Pin 55WHr sử dụng cả ngày làm việc',
    'Bảo mật vân tay tích hợp Windows Hello',
    'Bảo hành chính hãng 12 tháng toàn quốc',
  ],
  promotions: [
    'Tặng balo Dell chính hãng trị giá 1,500,000₫',
    'Tặng chuột không dây Dell trị giá 500,000₫',
    'Miễn phí giao hàng toàn quốc',
    'Trả góp 0% lãi suất trong 6 tháng',
  ],
};

const relatedProducts = [
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
  },
  {
    id: 3,
    name: 'Asus ZenBook 14 OLED - Màn hình OLED tuyệt đ��p',
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
  },
];

const reviews = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    avatar:
      'https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBwcm9maWxlJTIwYXZhdGFyfGVufDF8fHx8MTc3NTE0NDQzN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 5,
    date: '2 tuần trước',
    verified: true,
    comment:
      'Laptop rất tốt, thiết kế đẹp mắt, hiệu năng mạnh mẽ. Màn hình sắc nét, pin trâu. Đóng gói cẩn thận, giao hàng nhanh. Rất hài lòng với sản phẩm này! Mình dùng cho công việc văn phòng và đôi khi chỉnh sửa video cũng rất mượt.',
    helpful: 24,
    images: [],
  },
  {
    id: 2,
    name: 'Trần Thị B',
    avatar:
      'https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3NTA0MjExN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 5,
    date: '1 tháng trước',
    verified: true,
    comment:
      'Sản phẩm chất lượng cao, xứng đáng với giá tiền. Dùng cho công việc văn phòng và thiết kế đồ họa rất mượt mà. Bàn phím gõ êm, touchpad nhạy. Khuyên mọi người mua!',
    helpful: 18,
    images: [],
  },
  {
    id: 3,
    name: 'Lê Văn C',
    avatar:
      'https://images.unsplash.com/photo-1622626426572-c268eb006092?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBidXNpbmVzcyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NTA0Njc4NXww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4,
    date: '1 tháng trước',
    verified: true,
    comment:
      'Laptop tốt nhưng giá hơi cao. Thiết kế đẹp, cấu hình mạnh mẽ đủ cho nhu cầu làm việc. Tuy nhiên pin có thể tốt hơn. Nhìn chung vẫn đáng mua.',
    helpful: 12,
    images: [],
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    avatar:
      'https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3NTA0MjExN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 5,
    date: '2 tháng trước',
    verified: true,
    comment:
      'Cực kỳ hài lòng! Máy chạy nhanh, không lag. Màn hình đẹp, âm thanh ổn. Shop tư vấn nhiệt tình. Giao hàng đúng hẹn. 5 sao không có gì để chê!',
    helpful: 32,
    images: [],
  },
  {
    id: 5,
    name: 'Hoàng Văn E',
    avatar:
      'https://images.unsplash.com/photo-1622626426572-c268eb006092?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBidXNpbmVzcyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NTA0Njc4NXww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4,
    date: '2 tháng trước',
    verified: false,
    comment:
      'Máy ổn, dùng tốt. Thiết kế đẹp, nhẹ. Tuy nhiên cổng kết nối hơi ít. Giá hợp lý so với cấu hình.',
    helpful: 8,
    images: [],
  },
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);

  const discount = Math.round(
    ((productData.originalPrice - productData.price) / productData.originalPrice) * 100
  );

  const handleAddToCart = () => {
    // Logic thêm vào giỏ hàng
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
  };

  const handleBuyNow = () => {
    // Logic mua ngay
    navigate('/checkout');
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
            <Link to="/products" className="hover:text-red-600">
              Sản phẩm
            </Link>
            <ChevronRight className="size-4" />
            <Link to="/products" className="hover:text-red-600">
              {productData.brand}
            </Link>
            <ChevronRight className="size-4" />
            <span className="text-gray-900 line-clamp-1">{productData.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8 mb-8">
          {/* Images - 5 columns */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              {/* Main Image */}
              <div className="bg-white rounded-lg border p-4 mb-4 relative group">
                <ImageWithFallback
                  src={productData.images[selectedImage]}
                  alt={productData.name}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
                {productData.originalPrice && (
                  <Badge className="absolute top-6 left-6 bg-red-500 hover:bg-red-600 text-lg px-3 py-1">
                    -{discount}%
                  </Badge>
                )}
                <button
                  className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setShowImageZoom(true)}
                >
                  <ZoomIn className="size-5 text-gray-700" />
                </button>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-3">
                {productData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden transition-all ${
                      selectedImage === index
                        ? 'border-red-600 ring-2 ring-red-200'
                        : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Share & Wishlist */}
              <div className="flex items-center gap-3 mt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsWishlist(!isWishlist)}
                >
                  <Heart
                    className={`size-5 mr-2 ${
                      isWishlist ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                  {isWishlist ? 'Đã yêu thích' : 'Yêu thích'}
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="size-5 mr-2" />
                  Chia sẻ
                </Button>
              </div>
            </div>
          </div>

          {/* Product Info - 4 columns */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg border p-6">
              {/* Brand & SKU */}
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="outline" className="text-red-600 border-red-600">
                  {productData.brand}
                </Badge>
                <span className="text-sm text-gray-500">SKU: {productData.sku}</span>
                {productData.sold && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <TrendingUp className="size-4" />
                    Đã bán {productData.sold}
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold mb-4 leading-tight">
                {productData.name}
              </h1>

              {/* Rating & Stock */}
              <div className="flex items-center gap-4 mb-4 pb-4 border-b flex-wrap">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-5 ${
                        i < Math.floor(productData.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="font-medium ml-2">{productData.rating}</span>
                </div>
                <span className="text-gray-400">|</span>
                <Link
                  to="#reviews"
                  className="text-gray-600 hover:text-red-600 transition-colors"
                >
                  {productData.reviews} đánh giá
                </Link>
                <span className="text-gray-400">|</span>
                {productData.inStock ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle className="size-4" />
                    Còn {productData.stockQuantity} sản phẩm
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center gap-1">
                    <AlertCircle className="size-4" />
                    Hết hàng
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mb-6 bg-red-50 rounded-lg p-4">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold text-red-600">
                    {productData.price.toLocaleString('vi-VN')}₫
                  </span>
                  {productData.originalPrice && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        {productData.originalPrice.toLocaleString('vi-VN')}₫
                      </span>
                      <Badge className="bg-red-500 hover:bg-red-600">
                        -{discount}%
                      </Badge>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Giá đã bao gồm VAT. Tiết kiệm được{' '}
                  <span className="font-semibold text-red-600">
                    {(productData.originalPrice - productData.price).toLocaleString(
                      'vi-VN'
                    )}
                    ₫
                  </span>
                </p>
              </div>

              {/* Key Specs */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3 text-sm">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Thông số chính:
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="text-gray-600">Bộ vi xử lý</span>
                    <span className="font-medium text-gray-900">
                      {productData.specs.cpu.split('(')[0].trim()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-600">RAM</span>
                    <span className="font-medium text-gray-900">
                      {productData.specs.ram.split(' ')[0]}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-600">Ổ cứng</span>
                    <span className="font-medium text-gray-900">
                      {productData.specs.storage}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-600">Màn hình</span>
                    <span className="font-medium text-gray-900">
                      {productData.specs.display.split(',')[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-gray-700 font-medium">Số lượng:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="size-4" />
                  </Button>
                  <span className="px-6 font-medium min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(productData.stockQuantity, quantity + 1))}
                    disabled={quantity >= productData.stockQuantity}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
                <span className="text-sm text-gray-500">
                  ({productData.stockQuantity} sản phẩm có sẵn)
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-4">
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 h-12"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!productData.inStock}
                >
                  <ShoppingCart className="size-5 mr-2" />
                  Thêm vào giỏ hàng
                </Button>
              </div>

              {/* Buy Now */}
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 mb-6"
                size="lg"
                onClick={handleBuyNow}
                disabled={!productData.inStock}
              >
                Mua ngay
              </Button>

              {/* Promotions */}
              {productData.promotions && productData.promotions.length > 0 && (
                <div className="border-t pt-4 mb-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Gift className="size-5 text-red-600" />
                    Khuyến mãi đặc biệt
                  </h3>
                  <ul className="space-y-2">
                    {productData.promotions.map((promo, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{promo}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Features */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="size-5 text-red-600 flex-shrink-0" />
                  <span>Miễn phí vận chuyển</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="size-5 text-red-600 flex-shrink-0" />
                  <span>Bảo hành 12 tháng</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <RotateCcw className="size-5 text-red-600 flex-shrink-0" />
                  <span>Đổi trả trong 7 ngày</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="size-5 text-red-600 flex-shrink-0" />
                  <span>Chính hãng 100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - 3 columns */}
          <div className="lg:col-span-3">
            {/* Delivery & Support */}
            <div className="bg-white rounded-lg border p-6 mb-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Truck className="size-5 text-red-600" />
                Thông tin vận chuyển
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="size-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Giao hàng toàn quốc</p>
                    <p className="text-gray-600">
                      Nhận hàng trong 2-5 ngày làm việc
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="size-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Giao nhanh nội thành</p>
                    <p className="text-gray-600">Trong 24h với đơn hàng nội thành</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200 p-6 mb-6">
              <h3 className="font-bold mb-3 text-red-900">
                Cần tư vấn thêm?
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Liên hệ với chúng tôi để được tư vấn miễn phí
              </p>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="size-4 text-red-600" />
                  <span className="font-medium">Hotline: 1900 xxxx</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="size-4 text-red-600" />
                  <span>support@laptopshop.vn</span>
                </div>
              </div>
              <Button className="w-full bg-red-600 hover:bg-red-700">
                <Phone className="size-4 mr-2" />
                Gọi ngay
              </Button>
            </div>

            {/* Warranty Info */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Shield className="size-5 text-red-600" />
                Chính sách bảo hành
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Bảo hành chính hãng 12 tháng</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Đổi mới trong 15 ngày nếu có lỗi NSX</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Hỗ trợ kỹ thuật trọn đời</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Bảo hành tại nhà cho khách VIP</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start mb-6 h-auto p-1 bg-gray-100">
              <TabsTrigger value="description" className="px-6 py-3">
                Mô tả sản phẩm
              </TabsTrigger>
              <TabsTrigger value="specs" className="px-6 py-3">
                Thông số kỹ thuật
              </TabsTrigger>
              <TabsTrigger value="reviews" className="px-6 py-3">
                Đánh giá ({productData.reviews})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4">Giới thiệu sản phẩm</h3>
                <div className="prose max-w-none">
                  {productData.fullDescription.split('\n\n').map((para, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-xl font-bold mb-4">Điểm nổi bật</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {productData.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specs">
              <h3 className="text-xl font-bold mb-6">Thông số kỹ thuật chi tiết</h3>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                {Object.entries(productData.specs).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex border-b pb-4 hover:bg-gray-50 transition-colors px-3 -mx-3 rounded"
                  >
                    <span className="text-gray-600 font-medium w-40 flex-shrink-0 capitalize">
                      {key === 'cpu'
                        ? 'Bộ vi xử lý'
                        : key === 'ram'
                        ? 'RAM'
                        : key === 'storage'
                        ? 'Ổ cứng'
                        : key === 'display'
                        ? 'Màn hình'
                        : key === 'gpu'
                        ? 'Card đồ họa'
                        : key === 'battery'
                        ? 'Pin'
                        : key === 'weight'
                        ? 'Trọng lượng'
                        : key === 'dimensions'
                        ? 'Kích thước'
                        : key === 'os'
                        ? 'Hệ điều hành'
                        : key === 'ports'
                        ? 'Cổng kết nối'
                        : key === 'connectivity'
                        ? 'Kết nối'
                        : key === 'keyboard'
                        ? 'Bàn phím'
                        : key === 'webcam'
                        ? 'Webcam'
                        : key === 'audio'
                        ? 'Âm thanh'
                        : key === 'color'
                        ? 'Màu sắc'
                        : key === 'material'
                        ? 'Chất liệu'
                        : key === 'warranty'
                        ? 'Bảo hành'
                        : key}
                      :
                    </span>
                    <span className="text-gray-900 flex-1">{value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" id="reviews">
              <div className="space-y-6">
                {/* Rating Summary */}
                <div className="flex flex-col md:flex-row items-start gap-8 pb-6 border-b">
                  <div className="text-center md:w-48">
                    <div className="text-5xl font-bold text-red-600 mb-2">
                      {productData.rating}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-5 ${
                            i < Math.floor(productData.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      {productData.reviews} đánh giá
                    </p>
                  </div>

                  <div className="flex-1 w-full">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const percentage =
                        stars === 5 ? 75 : stars === 4 ? 20 : stars === 3 ? 3 : 2;
                      const count = Math.round(
                        (productData.reviews * percentage) / 100
                      );
                      return (
                        <div key={stars} className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1 w-20">
                            <span className="text-sm text-gray-600">{stars}</span>
                            <Star className="size-4 fill-yellow-400 text-yellow-400" />
                          </div>
                          <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400 transition-all"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-16 text-right">
                            {count} đánh giá
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="md:w-48">
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      <Star className="size-4 mr-2" />
                      Viết đánh giá
                    </Button>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0">
                      <div className="flex items-start gap-4">
                        <ImageWithFallback
                          src={review.avatar}
                          alt={review.name}
                          className="size-12 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{review.name}</h4>
                                {review.verified && (
                                  <Badge
                                    variant="outline"
                                    className="text-green-600 border-green-600 text-xs"
                                  >
                                    <CheckCircle className="size-3 mr-1" />
                                    Đã mua hàng
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`size-4 ${
                                        i < review.rating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {review.date}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3 leading-relaxed">
                            {review.comment}
                          </p>
                          <div className="flex items-center gap-4">
                            <button className="text-sm text-gray-600 hover:text-red-600 flex items-center gap-1 transition-colors">
                              <CheckCircle className="size-4" />
                              Hữu ích ({review.helpful})
                            </button>
                            <button className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                              Phản hồi
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center pt-4">
                  <Button variant="outline" size="lg">
                    Xem thêm đánh giá
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Sản phẩm tương tự</h2>
            <Link
              to="/products"
              className="text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
            >
              Xem tất cả
              <ChevronRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

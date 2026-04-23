import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  ShoppingCart, Heart, Share2, Star, Truck, Shield, RotateCcw,
  CheckCircle, ChevronRight, Minus, Plus, ZoomIn, Phone, Mail,
  MapPin, Clock, Award, AlertCircle, Loader2,
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import api from '../config/apiConfig';
import { notifyCartUpdated } from '../context/AuthContext';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:9765';

interface ProductDetailResponse {
  id: number;
  name: string;
  slug: string;
  sku: string;
  basePrice: number;
  salePrice: number | null;
  description: string;
  brandName: string;
  categoryName: string;
  images: string[];
  cpu: string | null;
  ram: string | null;
  storage: string | null;
  display: string | null;
  gpu: string | null;
  os: string | null;
  weightKg: number | null;
  batteryWh: number | null;
  ports: string | null;
  color: string | null;
  avgRating: number;
  reviewCount: number;
  stockQuantity: number;
  inStock: boolean;
}

interface ReviewResponse {
  id: number;
  userName: string;
  userAvatar: string | null;
  rating: number;
  comment: string;
  createdAt: string;
  verified: boolean;
}

// Spring Page object trả về "content", không phải "reviews"
interface ReviewPageResponse {
  content: ReviewResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
}

const SPEC_LABELS: Record<string, string> = {
  cpu: 'Bộ vi xử lý', ram: 'RAM', storage: 'Ổ cứng', display: 'Màn hình',
  gpu: 'Card đồ họa', os: 'Hệ điều hành', weight: 'Trọng lượng',
  battery: 'Pin', ports: 'Cổng kết nối', color: 'Màu sắc',
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);

  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [reviewPage, setReviewPage] = useState<ReviewPageResponse | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setSelectedImage(0);

    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    Promise.all([
      fetch(`${API_URL}/api/products/${id}`).then(r => {
        if (!r.ok) throw new Error('Không tìm thấy sản phẩm');
        return r.json();
      }),
      fetch(`${API_URL}/api/products/${id}/reviews?page=0&size=10`)
        .then(r => r.ok ? r.json() : null)
        .catch(() => null),
      fetch(`${API_URL}/api/products?size=5&sort=newest`)
        .then(r => r.ok ? r.json() : null)
        .catch(() => null),
      // Load wishlist to check if this product is already saved
      token
        ? api.get<{ productId: number }[]>('/wishlist').then(res => res.data).catch(() => [])
        : Promise.resolve([]),
    ])
      .then(([prod, reviews, related, wishlist]) => {
        setProduct(prod);
        setReviewPage(reviews);
        if (related?.content) {
          setRelatedProducts(
            related.content
              .filter((p: any) => p.id !== Number(id))
              .slice(0, 4)
          );
        }
        if (Array.isArray(wishlist)) {
          setIsWishlist(wishlist.some((w: { productId: number }) => w.productId === Number(id)));
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-96">
          <Loader2 className="size-10 animate-spin text-red-600" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="size-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button onClick={() => navigate('/products')}>Quay lại danh sách</Button>
        </div>
      </div>
    );
  }

  const hasDiscount = product.salePrice !== null && product.salePrice < product.basePrice;
  const price = hasDiscount ? product.salePrice! : product.basePrice;
  const discount = hasDiscount
    ? Math.round(((product.basePrice - product.salePrice!) / product.basePrice) * 100)
    : 0;

  const specs: Record<string, string> = {};
  if (product.cpu) specs.cpu = product.cpu;
  if (product.ram) specs.ram = product.ram;
  if (product.storage) specs.storage = product.storage;
  if (product.display) specs.display = product.display;
  if (product.gpu) specs.gpu = product.gpu;
  if (product.os) specs.os = product.os;
  if (product.weightKg) specs.weight = `${product.weightKg}kg`;
  if (product.batteryWh) specs.battery = `${product.batteryWh}Wh`;
  if (product.ports) specs.ports = product.ports;
  if (product.color) specs.color = product.color;

  // ✅ Luôn là array, tránh lỗi .filter is not a function
  const reviewsList: ReviewResponse[] = Array.isArray(reviewPage?.content)
    ? reviewPage!.content
    : [];
  const rating = product.avgRating || 0;
  const reviewCount = product.reviewCount || 0;

  const handleAddToCart = async () => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) { navigate('/login'); return; }
    try {
      const res = await fetch(`${API_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: product.id, quantity }),
      });
      if (res.ok) {
        notifyCartUpdated();
        alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
      }
      else alert('Không thể thêm vào giỏ hàng');
    } catch { alert('Lỗi kết nối'); }
  };

  const handleWishlist = async () => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) { navigate('/login'); return; }
    try {
      if (isWishlist) {
        await api.delete(`/wishlist/${product.id}`);
      } else {
        await api.post(`/wishlist/${product.id}`);
      }
      setIsWishlist(prev => !prev);
    } catch { }
  };

  const handleBuyNow = () => navigate('/checkout');

  const images = product.images.length > 0 ? product.images : [''];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-red-600">Trang chủ</Link>
            <ChevronRight className="size-4" />
            <Link to="/products" className="hover:text-red-600">Sản phẩm</Link>
            <ChevronRight className="size-4" />
            <Link to={`/products?brand=${product.brandName}`} className="hover:text-red-600">
              {product.brandName}
            </Link>
            <ChevronRight className="size-4" />
            <span className="text-gray-900 line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8 mb-8">

          {/* Images */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg border p-4 mb-4 relative group">
                <ImageWithFallback
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
                {hasDiscount && (
                  <Badge className="absolute top-6 left-6 bg-red-500 hover:bg-red-600 text-lg px-3 py-1">
                    -{discount}%
                  </Badge>
                )}
                <button className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="size-5 text-gray-700" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden transition-all ${
                      selectedImage === index ? 'border-red-600 ring-2 ring-red-200' : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <ImageWithFallback src={image} alt={`Product ${index + 1}`} className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-4">
                <Button variant="outline" className="flex-1" onClick={handleWishlist}>
                  <Heart className={`size-5 mr-2 ${isWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                  {isWishlist ? 'Đã yêu thích' : 'Yêu thích'}
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="size-5 mr-2" />
                  Chia sẻ
                </Button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="outline" className="text-red-600 border-red-600">{product.brandName}</Badge>
                <span className="text-sm text-gray-500">SKU: {product.sku}</span>
              </div>
              <h1 className="text-2xl font-bold mb-4 leading-tight">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4 pb-4 border-b flex-wrap">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`size-5 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                  <span className="font-medium ml-2">{rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-400">|</span>
                <Link to="#reviews" className="text-gray-600 hover:text-red-600 transition-colors">
                  {reviewCount} đánh giá
                </Link>
                <span className="text-gray-400">|</span>
                {product.inStock ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle className="size-4" />
                    Còn {product.stockQuantity} sản phẩm
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
                  <span className="text-3xl font-bold text-red-600">{price.toLocaleString('vi-VN')}₫</span>
                  {hasDiscount && (
                    <>
                      <span className="text-lg text-gray-400 line-through">{product.basePrice.toLocaleString('vi-VN')}₫</span>
                      <Badge className="bg-red-500 hover:bg-red-600">-{discount}%</Badge>
                    </>
                  )}
                </div>
                {hasDiscount && (
                  <p className="text-sm text-gray-600">
                    Giá đã bao gồm VAT. Tiết kiệm được{' '}
                    <span className="font-semibold text-red-600">
                      {(product.basePrice - product.salePrice!).toLocaleString('vi-VN')}₫
                    </span>
                  </p>
                )}
              </div>

              {/* Key Specs */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm">
                <h3 className="font-semibold text-gray-900 mb-3">Thông số chính:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.cpu && (
                    <div className="flex flex-col">
                      <span className="text-gray-600">Bộ vi xử lý</span>
                      <span className="font-medium text-gray-900">{product.cpu.split('(')[0].trim()}</span>
                    </div>
                  )}
                  {product.ram && (
                    <div className="flex flex-col">
                      <span className="text-gray-600">RAM</span>
                      <span className="font-medium text-gray-900">{product.ram.split(' ')[0]}</span>
                    </div>
                  )}
                  {product.storage && (
                    <div className="flex flex-col">
                      <span className="text-gray-600">Ổ cứng</span>
                      <span className="font-medium text-gray-900">{product.storage}</span>
                    </div>
                  )}
                  {product.display && (
                    <div className="flex flex-col">
                      <span className="text-gray-600">Màn hình</span>
                      <span className="font-medium text-gray-900">{product.display.split(',')[0]}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-gray-700 font-medium">Số lượng:</span>
                <div className="flex items-center border rounded-lg">
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                    <Minus className="size-4" />
                  </Button>
                  <span className="px-6 font-medium min-w-[60px] text-center">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.min(product.stockQuantity || 99, quantity + 1))} disabled={quantity >= (product.stockQuantity || 99)}>
                    <Plus className="size-4" />
                  </Button>
                </div>
                <span className="text-sm text-gray-500">({product.stockQuantity} có sẵn)</span>
              </div>

              <div className="flex gap-3 mb-4">
                <Button className="flex-1 bg-red-600 hover:bg-red-700 h-12" size="lg" onClick={handleAddToCart} disabled={!product.inStock}>
                  <ShoppingCart className="size-5 mr-2" />
                  Thêm vào giỏ hàng
                </Button>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 mb-6" size="lg" onClick={handleBuyNow} disabled={!product.inStock}>
                Mua ngay
              </Button>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm"><Truck className="size-5 text-red-600 flex-shrink-0" /><span>Miễn phí vận chuyển</span></div>
                <div className="flex items-center gap-2 text-sm"><Shield className="size-5 text-red-600 flex-shrink-0" /><span>Bảo hành 12 tháng</span></div>
                <div className="flex items-center gap-2 text-sm"><RotateCcw className="size-5 text-red-600 flex-shrink-0" /><span>Đổi trả trong 7 ngày</span></div>
                <div className="flex items-center gap-2 text-sm"><Award className="size-5 text-red-600 flex-shrink-0" /><span>Chính hãng 100%</span></div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border p-6 mb-6">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Truck className="size-5 text-red-600" />Thông tin vận chuyển</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="size-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div><p className="font-medium">Giao hàng toàn quốc</p><p className="text-gray-600">Nhận hàng trong 2-5 ngày làm việc</p></div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="size-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div><p className="font-medium">Giao nhanh nội thành</p><p className="text-gray-600">Trong 24h với đơn hàng nội thành</p></div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200 p-6 mb-6">
              <h3 className="font-bold mb-3 text-red-900">Cần tư vấn thêm?</h3>
              <p className="text-sm text-gray-700 mb-4">Liên hệ với chúng tôi để được tư vấn miễn phí</p>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-gray-700"><Phone className="size-4 text-red-600" /><span className="font-medium">Hotline: 1900 xxxx</span></div>
                <div className="flex items-center gap-2 text-gray-700"><Mail className="size-4 text-red-600" /><span>support@laptopshop.vn</span></div>
              </div>
              <Button className="w-full bg-red-600 hover:bg-red-700"><Phone className="size-4 mr-2" />Gọi ngay</Button>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Shield className="size-5 text-red-600" />Chính sách bảo hành</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {['Bảo hành chính hãng 12 tháng', 'Đổi mới trong 15 ngày nếu có lỗi NSX', 'Hỗ trợ kỹ thuật trọn đời', 'Bảo hành tại nhà cho khách VIP'].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start mb-6 h-auto p-1 bg-gray-100">
              <TabsTrigger value="description" className="px-6 py-3">Mô tả sản phẩm</TabsTrigger>
              <TabsTrigger value="specs" className="px-6 py-3">Thông số kỹ thuật</TabsTrigger>
              <TabsTrigger value="reviews" className="px-6 py-3">Đánh giá ({reviewCount})</TabsTrigger>
            </TabsList>

            <TabsContent value="description">
              <h3 className="text-xl font-bold mb-4">Giới thiệu sản phẩm</h3>
              <div className="prose max-w-none">
                {product.description ? (
                  product.description.split('\n\n').map((para, i) => (
                    <p key={i} className="text-gray-700 leading-relaxed mb-4">{para}</p>
                  ))
                ) : (
                  <p className="text-gray-500">Chưa có mô tả cho sản phẩm này.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="specs">
              <h3 className="text-xl font-bold mb-6">Thông số kỹ thuật chi tiết</h3>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex border-b pb-4 hover:bg-gray-50 transition-colors px-3 -mx-3 rounded">
                    <span className="text-gray-600 font-medium w-40 flex-shrink-0">{SPEC_LABELS[key] ?? key}:</span>
                    <span className="text-gray-900 flex-1">{value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" id="reviews">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-start gap-8 pb-6 border-b">
                  <div className="text-center md:w-48">
                    <div className="text-5xl font-bold text-red-600 mb-2">{rating.toFixed(1)}</div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`size-5 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">{reviewCount} đánh giá</p>
                  </div>

                  <div className="flex-1 w-full">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      // ✅ reviewsList luôn là array
                      const count = reviewsList.filter(r => r.rating === stars).length;
                      const percentage = reviewsList.length > 0
                        ? Math.round((count / reviewsList.length) * 100)
                        : 0;
                      return (
                        <div key={stars} className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1 w-20">
                            <span className="text-sm text-gray-600">{stars}</span>
                            <Star className="size-4 fill-yellow-400 text-yellow-400" />
                          </div>
                          <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 transition-all" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="text-sm text-gray-600 w-16 text-right">{count} đánh giá</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="md:w-48">
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      <Star className="size-4 mr-2" />Viết đánh giá
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* ✅ reviewsList luôn là array */}
                  {reviewsList.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0">
                      <div className="flex items-start gap-4">
                        <ImageWithFallback
                          src={review.userAvatar || ''}
                          alt={review.userName}
                          className="size-12 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{review.userName}</h4>
                            {review.verified && (
                              <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                                <CheckCircle className="size-3 mr-1" />Đã mua hàng
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`size-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {reviewsList.length === 0 && (
                    <p className="text-center text-gray-500 py-8">Chưa có đánh giá nào cho sản phẩm này.</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Sản phẩm tương tự</h2>
              <Link to="/products" className="text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors">
                Xem tất cả<ChevronRight className="size-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  brand={p.brandName}
                  price={p.salePrice ?? p.basePrice}
                  originalPrice={p.salePrice ? p.basePrice : undefined}
                  rating={p.avgRating}
                  reviews={p.reviewCount}
                  image={p.primaryImage || ''}
                  specs={{ cpu: p.cpu || '', ram: p.ram || '', storage: p.storage || '', display: p.display || '' }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
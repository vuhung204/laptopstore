import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  ChevronRight, Minus, Plus, X, ShoppingCart,
  Tag, Truck, Shield, ArrowLeft, Loader2,
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:9765';

interface CartItemResponse {
  productId: number;
  productName: string;
  brandName: string | null;
  image: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  cpu: string | null;
  ram: string | null;
  storage: string | null;
}

interface CartResponse {
  items: CartItemResponse[];
  totalItems: number;
  totalPrice: number;
}

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // ✅ Đúng key khớp với AuthContext
  const getToken = () =>
    localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

  const fetchCart = async () => {
    const token = getToken();
    if (!token) { navigate('/login'); return; }
    try {
      const res = await fetch(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { navigate('/login'); return; }
      if (!res.ok) throw new Error('Không thể tải giỏ hàng');
      const data: CartResponse = await res.json();
      setCart(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const token = getToken();
    if (!token) return;
    setUpdatingId(productId);
    try {
      const res = await fetch(`${API_URL}/api/cart/${productId}?quantity=${newQuantity}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data: CartResponse = await res.json();
        setCart(data);
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (productId: number) => {
    const token = getToken();
    if (!token) return;
    setUpdatingId(productId);
    try {
      const res = await fetch(`${API_URL}/api/cart/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) await fetchCart();
    } finally {
      setUpdatingId(null);
    }
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'LAPTOP10') {
      setDiscount(10);
      alert('Mã giảm giá 10% đã được áp dụng!');
    } else if (couponCode.toUpperCase() === 'WELCOME20') {
      setDiscount(20);
      alert('Mã giảm giá 20% đã được áp dụng!');
    } else {
      alert('Mã giảm giá không hợp lệ!');
    }
  };

  // Loading
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

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchCart}>Thử lại</Button>
        </div>
      </div>
    );
  }

  // Empty cart
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg border p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="size-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="size-16 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Giỏ hàng trống</h2>
              <p className="text-gray-600 mb-6">
                Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
              </p>
              <Link to="/products">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  <ArrowLeft className="size-4 mr-2" />
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shippingFee = subtotal >= 10000000 ? 0 : 200000;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount + shippingFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-red-600">Trang chủ</Link>
            <ChevronRight className="size-4" />
            <span className="text-gray-900">Giỏ hàng</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Sản phẩm ({cart.items.length} sản phẩm)</h2>
                <Link to="/products" className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1">
                  <ArrowLeft className="size-4" />
                  Tiếp tục mua sắm
                </Link>
              </div>

              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex gap-4 pb-4 border-b last:border-b-0">
                    {/* Image */}
                    <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                      <ImageWithFallback
                        src={item.image || ''}
                        alt={item.productName}
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          {item.brandName && (
                            <Badge variant="outline" className="text-red-600 border-red-600 mb-2">
                              {item.brandName}
                            </Badge>
                          )}
                          <Link to={`/product/${item.productId}`}>
                            <h3 className="font-medium mb-2 hover:text-red-600 line-clamp-2">
                              {item.productName}
                            </h3>
                          </Link>
                          <div className="text-sm text-gray-600 space-y-1">
                            {item.cpu && <p>CPU: {item.cpu}</p>}
                            {item.ram && <p>RAM: {item.ram}</p>}
                            {item.storage && <p>Ổ cứng: {item.storage}</p>}
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          disabled={updatingId === item.productId}
                          className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 ml-2"
                        >
                          {updatingId === item.productId
                            ? <Loader2 className="size-5 animate-spin" />
                            : <X className="size-5" />
                          }
                        </button>
                      </div>

                      {/* Price & Quantity */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            disabled={item.quantity <= 1 || updatingId === item.productId}
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus className="size-4" />
                          </Button>
                          <span className="px-4 font-medium min-w-[3rem] text-center">
                            {updatingId === item.productId
                              ? <Loader2 className="size-4 animate-spin mx-auto" />
                              : item.quantity
                            }
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            disabled={updatingId === item.productId}
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="size-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-red-600">
                            {(item.unitPrice * item.quantity).toLocaleString('vi-VN')}₫
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-sm text-gray-500">
                              {item.unitPrice.toLocaleString('vi-VN')}₫ / sản phẩm
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg border p-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck className="size-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Miễn phí vận chuyển</h3>
                    <p className="text-xs text-gray-500">Đơn từ 10 triệu</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="size-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Bảo hành chính hãng</h3>
                    <p className="text-xs text-gray-500">Toàn quốc</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Tag className="size-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Giá tốt nhất</h3>
                    <p className="text-xs text-gray-500">Cam kết chính hãng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h2>

              {/* Coupon */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Mã giảm giá</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                  />
                  <Button variant="outline" onClick={applyCoupon} className="whitespace-nowrap">
                    Áp dụng
                  </Button>
                </div>
                {discount > 0 && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <Tag className="size-4" />
                    Đã áp dụng giảm giá {discount}%
                  </p>
                )}
                <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                  <p className="font-medium mb-1">💡 Mã giảm giá có sẵn:</p>
                  <p>• LAPTOP10 - Giảm 10%</p>
                  <p>• WELCOME20 - Giảm 20%</p>
                </div>
              </div>

              {/* Price Details */}
              <div className="space-y-3 pb-4 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-medium">{subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giảm giá ({discount}%)</span>
                    <span className="font-medium text-green-600">-{discountAmount.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-medium">
                    {shippingFee === 0
                      ? <span className="text-green-600">Miễn phí</span>
                      : `${shippingFee.toLocaleString('vi-VN')}₫`
                    }
                  </span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-xs text-gray-500">
                    Mua thêm {(10000000 - subtotal).toLocaleString('vi-VN')}₫ để được miễn phí vận chuyển
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-4 border-b">
                <span className="text-lg font-bold">Tổng cộng</span>
                <span className="text-2xl font-bold text-red-600">{total.toLocaleString('vi-VN')}₫</span>
              </div>

              {/* Checkout Button */}
              <Link to="/checkout">
                <Button size="lg" className="w-full mt-6 bg-red-600 hover:bg-red-700">
                  Tiến hành thanh toán
                </Button>
              </Link>

              <p className="text-xs text-gray-500 text-center mt-4">(Giá đã bao gồm VAT)</p>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-3">Phương thức thanh toán:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">COD</Badge>
                  <Badge variant="outline">Chuyển khoản</Badge>
                  <Badge variant="outline">Thẻ tín dụng</Badge>
                  <Badge variant="outline">Ví điện tử</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
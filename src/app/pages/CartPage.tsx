import { useState } from 'react';
import { Link } from 'react-router';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  ChevronRight,
  Minus,
  Plus,
  X,
  ShoppingCart,
  Tag,
  Truck,
  Shield,
  ArrowLeft,
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface CartItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
  specs: {
    cpu: string;
    ram: string;
    storage: string;
  };
}

const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: 'Dell XPS 13 Plus - Laptop siêu mỏng nhẹ cho doanh nhân',
    brand: 'Dell',
    price: 32990000,
    image:
      'https://images.unsplash.com/photo-1759668358660-0d06064f0f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NzQ4ODczMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    quantity: 1,
    specs: {
      cpu: 'Intel Core i7-1360P',
      ram: '16GB',
      storage: '512GB SSD',
    },
  },
  {
    id: 2,
    name: 'MSI Gaming GE76 Raider - Laptop gaming cao cấp RTX 4080',
    brand: 'MSI',
    price: 54990000,
    image:
      'https://images.unsplash.com/photo-1632603093711-0d93a0bcc6cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjByZ2J8ZW58MXx8fHwxNzc0ODYyODQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    quantity: 1,
    specs: {
      cpu: 'Intel Core i9-13980HX',
      ram: '32GB',
      storage: '1TB SSD',
    },
  },
  {
    id: 3,
    name: 'MacBook Air M2 - Mỏng nhẹ đỉnh cao cho sáng tạo',
    brand: 'Apple',
    price: 28990000,
    image:
      'https://images.unsplash.com/photo-1532198528077-0d9e4ca9bb40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNib29rJTIwbGFwdG9wJTIwZGVza3xlbnwxfHx8fDE3NzQ5NTM2ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    quantity: 2,
    specs: {
      cpu: 'Apple M2 8-core',
      ram: '16GB',
      storage: '512GB SSD',
    },
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
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

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = subtotal >= 10000000 ? 0 : 200000;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount + shippingFee;

  if (cartItems.length === 0) {
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
                Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm
                tuyệt vời của chúng tôi!
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
                <h2 className="font-semibold">
                  Sản phẩm ({cartItems.length} sản phẩm)
                </h2>
                <Link
                  to="/products"
                  className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <ArrowLeft className="size-4" />
                  Tiếp tục mua sắm
                </Link>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b last:border-b-0"
                  >
                    {/* Image */}
                    <Link
                      to={`/product/${item.id}`}
                      className="flex-shrink-0"
                    >
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge
                            variant="outline"
                            className="text-red-600 border-red-600 mb-2"
                          >
                            {item.brand}
                          </Badge>
                          <Link to={`/product/${item.id}`}>
                            <h3 className="font-medium mb-2 hover:text-red-600 line-clamp-2">
                              {item.name}
                            </h3>
                          </Link>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>CPU: {item.specs.cpu}</p>
                            <p>RAM: {item.specs.ram}</p>
                            <p>Ổ cứng: {item.specs.storage}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X className="size-5" />
                        </button>
                      </div>

                      {/* Price & Quantity */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="size-4" />
                          </Button>
                          <span className="px-4 font-medium min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="size-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-red-600">
                            {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-sm text-gray-500">
                              {item.price.toLocaleString('vi-VN')}₫ / sản phẩm
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
                <label className="text-sm font-medium mb-2 block">
                  Mã giảm giá
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    onClick={applyCoupon}
                    className="whitespace-nowrap"
                  >
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
                  <span className="font-medium">
                    {subtotal.toLocaleString('vi-VN')}₫
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giảm giá ({discount}%)</span>
                    <span className="font-medium text-green-600">
                      -{discountAmount.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-medium">
                    {shippingFee === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      `${shippingFee.toLocaleString('vi-VN')}₫`
                    )}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-xs text-gray-500">
                    Mua thêm{' '}
                    {(10000000 - subtotal).toLocaleString('vi-VN')}₫ để được miễn
                    phí vận chuyển
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-4 border-b">
                <span className="text-lg font-bold">Tổng cộng</span>
                <span className="text-2xl font-bold text-red-600">
                  {total.toLocaleString('vi-VN')}₫
                </span>
              </div>

              {/* Checkout Button */}
              <Button
                size="lg"
                className="w-full mt-6 bg-red-600 hover:bg-red-700"
              >
                <Link to="/checkout" className="flex items-center justify-center w-full">
                  Tiến hành thanh toán
                </Link>
              </Button>

              {/* VAT Notice */}
              <p className="text-xs text-gray-500 text-center mt-4">
                (Giá đã bao gồm VAT)
              </p>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-3">
                  Phương thức thanh toán:
                </p>
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
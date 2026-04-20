import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  FileText,
  Download,
  Printer,
  Home,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface OrderItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
}

const orderItems: OrderItem[] = [
  {
    id: 1,
    name: 'Dell XPS 13 Plus - Laptop siêu mỏng nhẹ cho doanh nhân',
    brand: 'Dell',
    price: 32990000,
    image:
      'https://images.unsplash.com/photo-1759668358660-0d06064f0f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NzQ4ODczMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    quantity: 1,
  },
  {
    id: 3,
    name: 'MacBook Air M2 - Mỏng nhẹ đỉnh cao cho sáng tạo',
    brand: 'Apple',
    price: 28990000,
    image:
      'https://images.unsplash.com/photo-1532198528077-0d9e4ca9bb40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNib29rJTIwbGFwdG9wJTIwZGVza3xlbnwxfHx8fDE3NzQ5NTM2ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    quantity: 2,
  },
];

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || 'DH' + Date.now();
  const orderDate = new Date().toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = 200000;
  const total = subtotal + shippingFee;

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 4);
  const deliveryDate = estimatedDelivery.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-8 mb-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <div className="size-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="size-12 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Đặt hàng thành công!
            </h1>
            <p className="text-green-50 text-lg mb-6">
              Cảm ơn bạn đã mua hàng tại LaptopShop. Đơn hàng của bạn đã được tiếp
              nhận và đang được xử lý.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <p className="text-sm text-green-100 mb-1">Mã đơn hàng</p>
                <p className="text-xl font-bold">{orderId}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <p className="text-sm text-green-100 mb-1">Tổng thanh toán</p>
                <p className="text-xl font-bold">
                  {total.toLocaleString('vi-VN')}₫
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-bold mb-6">Trạng thái đơn hàng</h2>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200"></div>

                {/* Timeline Items */}
                <div className="space-y-6 relative">
                  <div className="flex gap-4">
                    <div className="size-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 relative z-10">
                      <CheckCircle className="size-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Đơn hàng đã đặt</h3>
                      <p className="text-sm text-gray-600">{orderDate}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="size-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 relative z-10">
                      <Package className="size-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-400">
                        Đang xác nhận
                      </h3>
                      <p className="text-sm text-gray-400">Đang chờ xử lý</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="size-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 relative z-10">
                      <Truck className="size-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-400">
                        Đang vận chuyển
                      </h3>
                      <p className="text-sm text-gray-400">Chưa giao</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="size-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 relative z-10">
                      <CheckCircle className="size-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-400">Hoàn thành</h3>
                      <p className="text-sm text-gray-400">Chưa giao hàng</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <Calendar className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">
                    Dự kiến giao hàng
                  </h4>
                  <p className="text-blue-700 text-sm">{deliveryDate}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-bold mb-6">Chi tiết đơn hàng</h2>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b last:border-b-0"
                  >
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded border flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge
                            variant="outline"
                            className="text-red-600 border-red-600 mb-1"
                          >
                            {item.brand}
                          </Badge>
                          <h3 className="font-medium line-clamp-2 text-sm">
                            {item.name}
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Số lượng: {item.quantity}
                        </span>
                        <span className="font-semibold text-red-600">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-medium">
                    {subtotal.toLocaleString('vi-VN')}₫
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-medium">
                    {shippingFee.toLocaleString('vi-VN')}₫
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-bold text-lg">Tổng cộng</span>
                  <span className="font-bold text-2xl text-red-600">
                    {total.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping & Payment Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="size-5 text-red-600" />
                  <h3 className="font-bold">Địa chỉ giao hàng</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">Nguyễn Văn A</p>
                  <p className="text-gray-600">
                    Số 123, Đường ABC, Phường Dịch Vọng
                  </p>
                  <p className="text-gray-600">Quận Cầu Giấy, Hà Nội</p>
                  <div className="flex items-center gap-2 pt-2 border-t mt-3">
                    <Phone className="size-4 text-gray-400" />
                    <span className="text-gray-600">0912345678</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="size-5 text-red-600" />
                  <h3 className="font-bold">Phương thức thanh toán</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500 hover:bg-green-600">COD</Badge>
                    <span>Thanh toán khi nhận hàng</span>
                  </div>
                  <p className="text-gray-600 pt-2 border-t mt-3">
                    Vui lòng chuẩn bị{' '}
                    <span className="font-semibold text-red-600">
                      {total.toLocaleString('vi-VN')}₫
                    </span>{' '}
                    khi nhận hàng
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-bold mb-4">Thao tác nhanh</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.print()}
                >
                  <Printer className="size-4 mr-2" />
                  In đơn hàng
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="size-4 mr-2" />
                  Tải xuống PDF
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="size-4 mr-2" />
                  Gửi qua Email
                </Button>
              </div>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200 p-6">
              <h3 className="font-bold mb-3 text-red-900">
                Cần hỗ trợ đơn hàng?
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Liên hệ với chúng tôi qua hotline hoặc email để được hỗ trợ nhanh
                nhất.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="size-4 text-red-600" />
                  <span className="font-medium">Hotline: 1900 xxxx</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="size-4 text-red-600" />
                  <span>support@laptopshop.vn</span>
                </div>
              </div>
              <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
                Liên hệ hỗ trợ
              </Button>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-bold mb-4">Các bước tiếp theo</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="size-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-red-600">1</span>
                  </div>
                  <p className="text-gray-700">
                    Chúng tôi sẽ gọi điện xác nhận đơn hàng trong vòng 24h
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="size-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-red-600">2</span>
                  </div>
                  <p className="text-gray-700">
                    Đơn hàng sẽ được đóng gói và giao cho đơn vị vận chuyển
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="size-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-red-600">3</span>
                  </div>
                  <p className="text-gray-700">
                    Bạn sẽ nhận được thông báo khi đơn hàng đang được giao
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="size-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-red-600">4</span>
                  </div>
                  <p className="text-gray-700">
                    Kiểm tra sản phẩm và thanh toán khi nhận hàng
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Link to="/">
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  size="lg"
                >
                  <Home className="size-4 mr-2" />
                  Về trang chủ
                </Button>
              </Link>
              <Link to="/products">
                <Button
                  className="w-full justify-center bg-red-600 hover:bg-red-700"
                  size="lg"
                >
                  <ShoppingBag className="size-4 mr-2" />
                  Tiếp tục mua sắm
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Email Confirmation Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <Mail className="size-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-bold text-blue-900 mb-2">
            Email xác nhận đã được gửi
          </h3>
          <p className="text-sm text-blue-700">
            Chúng tôi đã gửi email xác nhận đơn hàng đến địa chỉ email của bạn. Vui
            lòng kiểm tra hộp thư để biết thêm chi tiết.
          </p>
        </div>
      </div>
    </div>
  );
}

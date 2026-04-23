import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  CheckCircle, Package, Truck, MapPin, Phone, Mail,
  Calendar, CreditCard, FileText, Printer, Home,
  ShoppingBag, ArrowRight, Loader2, AlertCircle,
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import api, { ENDPOINTS } from '../config/apiConfig';

// ── Types khớp với DB ─────────────────────────────────────────────────────────

type OrderStatus =
  | 'pending' | 'confirmed' | 'processing'
  | 'shipping' | 'delivered' | 'completed'
  | 'cancelled' | 'refunded';

type PaymentMethod = 'cod' | 'bank_transfer' | 'momo' | 'vnpay' | 'zalopay' | 'credit_card';
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

interface OrderItemResponse {
  productId: number;
  productName: string;
  brandName: string | null;
  image: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

interface AddressResponse {
  recipientName: string;
  phone: string;
  addressLine: string;
  ward: string | null;
  district: string;
  city: string;
}

interface PaymentResponse {
  method: string | PaymentMethod;
  status: PaymentStatus;
  amount: number;
  transactionId: string | null;
  paidAt: string | null;
}

interface OrderDetailResponse {
  id: number;
  orderCode: string;
  status: OrderStatus;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  note: string | null;
  orderedAt: string;
  items: OrderItemResponse[];
  address: AddressResponse | null;
  payment: PaymentResponse | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  cod: 'Thanh toán khi nhận hàng (COD)',
  bank_transfer: 'Chuyển khoản ngân hàng',
  momo: 'Ví MoMo',
  vnpay: 'VNPay',
  zalopay: 'ZaloPay',
  credit_card: 'Thẻ tín dụng / Ghi nợ',
};

const PAYMENT_STATUS_LABEL: Record<PaymentStatus, { label: string; color: string }> = {
  pending:  { label: 'Chờ thanh toán', color: 'bg-amber-500' },
  paid:     { label: 'Đã thanh toán',  color: 'bg-green-500' },
  failed:   { label: 'Thất bại',       color: 'bg-red-500'   },
  refunded: { label: 'Đã hoàn tiền',   color: 'bg-gray-500'  },
};

const TIMELINE_STEPS: { status: OrderStatus[]; label: string; sub: string; icon: React.ReactNode }[] = [
  {
    status: ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'completed'],
    label: 'Đơn hàng đã đặt',
    sub: '',
    icon: <CheckCircle className="size-5 text-white" />,
  },
  {
    status: ['confirmed', 'processing', 'shipping', 'delivered', 'completed'],
    label: 'Đã xác nhận',
    sub: 'Shop đã xác nhận đơn',
    icon: <Package className="size-5" />,
  },
  {
    status: ['processing', 'shipping', 'delivered', 'completed'],
    label: 'Đang xử lý',
    sub: 'Đang đóng gói sản phẩm',
    icon: <Package className="size-5" />,
  },
  {
    status: ['shipping', 'delivered', 'completed'],
    label: 'Đang vận chuyển',
    sub: 'Đơn hàng đang trên đường',
    icon: <Truck className="size-5" />,
  },
  {
    status: ['delivered', 'completed'],
    label: 'Hoàn thành',
    sub: 'Giao hàng thành công',
    icon: <CheckCircle className="size-5" />,
  },
];

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('vi-VN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

function estimatedDeliveryDate(orderedAt: string) {
  const d = new Date(orderedAt);
  d.setDate(d.getDate() + 4);
  return d.toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

// apiFetch giống CheckoutPage để đồng nhất xử lý lỗi
async function apiFetch<T>(path: string, options?: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; body?: unknown }): Promise<T> {
  try {
    const response = await api.request<T>({
      url: path,
      method: options?.method ?? 'GET',
      data: options?.body,
    });

    return response.data;
  } catch (error: any) {
    throw error;
  }
}

const ORDER_BASE = (ENDPOINTS && ENDPOINTS.ORDERS && ENDPOINTS.ORDERS.BASE) ? ENDPOINTS.ORDERS.BASE : '/orders';

// ── Component ─────────────────────────────────────────────────────────────────

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId'); // numeric id hoặc orderCode

  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!orderId) {
      setError('Không tìm thấy mã đơn hàng.');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const data = await apiFetch<OrderDetailResponse>(`${ORDER_BASE}/${orderId}`);
        setOrder(data);
      } catch (err: any) {
        const status = err.response?.status;
        if (status === 401) {
          // Không có token hoặc phiên hết hạn
          setUnauthorized(true);
          setError('Bạn chưa đăng nhập hoặc phiên đã hết hạn. Vui lòng đăng nhập để xem chi tiết đơn hàng.');
        } else if (err.response?.data) {
          const msg = err.response?.data?.message || err.response?.data?.error || 'Không thể tải thông tin đơn hàng.';
          setError(msg);
        } else {
          const msg = err.message || 'Không thể tải thông tin đơn hàng.';
          setError(msg);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

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

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="size-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy đơn hàng</h2>
          <p className="text-gray-500 mb-6">{error}</p>

          {unauthorized ? (
            <div className="flex flex-col items-center gap-3">
              <Button
                onClick={() => {
                  const next = encodeURIComponent(`/order-success?orderId=${orderId ?? ''}`);
                  navigate(`/login?next=${next}`);
                }}
              >
                Đăng nhập để xem đơn hàng
              </Button>
              <Button variant="ghost" onClick={() => navigate('/')}>
                Về trang chủ
              </Button>
            </div>
          ) : (
            <Button onClick={() => navigate('/profile')}>Xem đơn hàng của tôi</Button>
          )}
        </div>
      </div>
    );
  }

  const payment = order.payment;
  const address = order.address;
  const isCancelled = order.status === 'cancelled' || order.status === 'refunded';
  const paymentMethodKey = payment ? (String(payment.method).toLowerCase() as PaymentMethod) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className={`rounded-lg p-8 mb-8 text-white ${isCancelled ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-green-500 to-emerald-600'}`}>
          <div className="max-w-3xl mx-auto text-center">
            <div className="size-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              {isCancelled
                ? <AlertCircle className="size-12 text-red-500" />
                : <CheckCircle className="size-12 text-green-600" />
              }
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              {isCancelled ? 'Đơn hàng đã bị huỷ' : 'Đặt hàng thành công!'}
            </h1>
            <p className="text-green-50 text-lg mb-6">
              {isCancelled
                ? 'Đơn hàng của bạn đã bị huỷ hoặc hoàn tiền.'
                : 'Cảm ơn bạn đã mua hàng tại LaptopShop. Đơn hàng đang được xử lý.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <p className="text-sm text-green-100 mb-1">Mã đơn hàng</p>
                <p className="text-xl font-bold">{order.orderCode}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <p className="text-sm text-green-100 mb-1">Tổng thanh toán</p>
                <p className="text-xl font-bold">{order.totalAmount.toLocaleString('vi-VN')}₫</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <p className="text-sm text-green-100 mb-1">Thời gian đặt</p>
                <p className="text-xl font-bold">{formatDateTime(order.orderedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {!isCancelled && (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-bold mb-6">Trạng thái đơn hàng</h2>
                <div className="relative">
                  <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200" />
                  <div className="space-y-6 relative">
                    {TIMELINE_STEPS.map((step, idx) => {
                      const active = step.status.includes(order.status);
                      return (
                        <div key={idx} className="flex gap-4">
                          <div className={`size-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 ${active ? 'bg-green-500' : 'bg-gray-200'}`}>
                            <span className={active ? 'text-white' : 'text-gray-400'}>{step.icon}</span>
                          </div>
                          <div>
                            <h3 className={`font-semibold ${active ? '' : 'text-gray-400'}`}>{step.label}</h3>
                            <p className={`text-sm ${active ? 'text-gray-600' : 'text-gray-400'}`}>
                              {idx === 0 ? formatDateTime(order.orderedAt) : step.sub}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {['pending', 'confirmed', 'processing', 'shipping'].includes(order.status) && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                    <Calendar className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Dự kiến giao hàng</h4>
                      <p className="text-blue-700 text-sm">{estimatedDeliveryDate(order.orderedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-bold mb-6">Chi tiết đơn hàng</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <ImageWithFallback
                      src={item.image || ''}
                      alt={item.productName}
                      className="size-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">{item.brandName}</p>
                      <h3 className="font-medium mb-1 line-clamp-2">{item.productName}</h3>
                      <p className="text-sm text-gray-500">
                        {item.unitPrice.toLocaleString('vi-VN')}₫ × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-red-600">
                        {item.totalPrice.toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-medium">{order.subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giảm giá</span>
                    <span className="font-medium text-green-600">-{order.discountAmount.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-medium">
                    {order.shippingFee === 0
                      ? <span className="text-green-600">Miễn phí</span>
                      : `${order.shippingFee.toLocaleString('vi-VN')}₫`
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-bold text-lg">Tổng cộng</span>
                  <span className="font-bold text-2xl text-red-600">
                    {order.totalAmount.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>

              {order.note && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-start gap-2">
                  <FileText className="size-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600"><span className="font-medium">Ghi chú:</span> {order.note}</p>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="size-5 text-red-600" />
                  <h3 className="font-bold">Địa chỉ giao hàng</h3>
                </div>
                {address ? (
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">{address.recipientName}</p>
                    <p className="text-gray-600">{address.addressLine}</p>
                    <p className="text-gray-600">
                      {[address.ward, address.district, address.city].filter(Boolean).join(', ')}
                    </p>
                    <div className="flex items-center gap-2 pt-2 border-t mt-3">
                      <Phone className="size-4 text-gray-400" />
                      <span className="text-gray-600">{address.phone}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Mua trực tiếp tại cửa hàng</p>
                )}
              </div>

              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="size-5 text-red-600" />
                  <h3 className="font-bold">Phương thức thanh toán</h3>
                </div>
                {payment ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className={`${PAYMENT_STATUS_LABEL[payment.status].color} hover:opacity-90`}>
                        {PAYMENT_STATUS_LABEL[payment.status].label}
                      </Badge>
                    </div>
                    <p className="text-gray-700 font-medium">
                      {paymentMethodKey && PAYMENT_METHOD_LABEL[paymentMethodKey]
                        ? PAYMENT_METHOD_LABEL[paymentMethodKey]
                        : String(payment.method)}
                    </p>
                    {payment.transactionId && (
                      <p className="text-gray-500">Mã GD: {payment.transactionId}</p>
                    )}
                    {payment.paidAt && (
                      <p className="text-gray-500">Thanh toán lúc: {formatDateTime(payment.paidAt)}</p>
                    )}
                    {payment.status === 'pending' && (paymentMethodKey === 'cod' || String(payment.method).toLowerCase() === 'cod') && (
                      <p className="text-gray-600 pt-2 border-t mt-3">
                        Vui lòng chuẩn bị{' '}
                        <span className="font-semibold text-red-600">{order.totalAmount.toLocaleString('vi-VN')}₫</span>
                        {' '}khi nhận hàng
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Chưa có thông tin thanh toán</p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-bold mb-4">Thao tác nhanh</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => window.print()}>
                  <Printer className="size-4 mr-2" />
                  In đơn hàng
                </Button>
                <Link to="/profile?tab=orders">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="size-4 mr-2" />
                    Xem tất cả đơn hàng
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200 p-6">
              <h3 className="font-bold mb-3 text-red-900">Cần hỗ trợ đơn hàng?</h3>
              <p className="text-sm text-gray-700 mb-4">
                Liên hệ với chúng tôi qua hotline hoặc email để được hỗ trợ nhanh nhất.
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
              <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">Liên hệ hỗ trợ</Button>
            </div>

            {!isCancelled && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="font-bold mb-4">Các bước tiếp theo</h3>
                <div className="space-y-3 text-sm">
                  {[
                    'Chúng tôi sẽ gọi điện xác nhận đơn hàng trong vòng 24h',
                    'Đơn hàng sẽ được đóng gói và giao cho đơn vị vận chuyển',
                    'Bạn sẽ nhận được thông báo khi đơn hàng đang được giao',
                    'Kiểm tra sản phẩm và thanh toán khi nhận hàng',
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="size-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-red-600">{i + 1}</span>
                      </div>
                      <p className="text-gray-700">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Link to="/">
                <Button variant="outline" className="w-full justify-center" size="lg">
                  <Home className="size-4 mr-2" />
                  Về trang chủ
                </Button>
              </Link>
              <Link to="/products">
                <Button className="w-full justify-center bg-red-600 hover:bg-red-700" size="lg">
                  <ShoppingBag className="size-4 mr-2" />
                  Tiếp tục mua sắm
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <Mail className="size-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-bold text-blue-900 mb-2">Email xác nhận đã được gửi</h3>
          <p className="text-sm text-blue-700">
            Chúng tôi đã gửi email xác nhận đơn hàng <strong>{order.orderCode}</strong> đến địa chỉ email của bạn.
          </p>
        </div>
      </div>
    </div>
  );
}
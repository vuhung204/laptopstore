import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import {
  ChevronRight,
  CreditCard,
  Wallet,
  Banknote,
  Building2,
  Truck,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  AlertCircle,
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

const cartItems: CartItem[] = [
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

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [saveInfo, setSaveInfo] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    district: '',
    ward: '',
    address: '',
    note: '',
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = shippingMethod === 'express' ? 400000 : 200000;
  const discount = 0;
  const total = subtotal - discount + shippingFee;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('Vui lòng đồng ý với điều khoản và điều kiện');
      return;
    }
    // Xử lý đặt hàng
    const orderId = 'DH' + Date.now();
    navigate(`/order-success?orderId=${orderId}`);
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
            <Link to="/cart" className="hover:text-red-600">
              Giỏ hàng
            </Link>
            <ChevronRight className="size-4" />
            <span className="text-gray-900">Thanh toán</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="size-8 bg-red-100 rounded-full flex items-center justify-center">
                    <User className="size-4 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold">Thông tin người nhận</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="fullName">
                      Họ và tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Nguyễn Văn A"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">
                      Số điện thoại <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="0912345678"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="size-8 bg-red-100 rounded-full flex items-center justify-center">
                    <MapPin className="size-4 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold">Địa chỉ giao hàng</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">
                      Tỉnh/Thành phố <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Hà Nội"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="district">
                      Quận/Huyện <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="district"
                      name="district"
                      placeholder="Cầu Giấy"
                      value={formData.district}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="ward">
                      Phường/Xã <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="ward"
                      name="ward"
                      placeholder="Dịch Vọng"
                      value={formData.ward}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="md:col-span-3">
                    <Label htmlFor="address">
                      Địa chỉ chi tiết <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Số nhà, tên đường..."
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Checkbox
                    id="saveInfo"
                    checked={saveInfo}
                    onCheckedChange={(checked) => setSaveInfo(checked as boolean)}
                  />
                  <Label htmlFor="saveInfo" className="cursor-pointer">
                    Lưu thông tin cho lần mua sau
                  </Label>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="size-8 bg-red-100 rounded-full flex items-center justify-center">
                    <Truck className="size-4 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold">Phương thức vận chuyển</h2>
                </div>

                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                  <div className="flex items-center justify-between p-4 border rounded-lg mb-3 hover:border-red-600 transition-colors">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Truck className="size-5 text-gray-600" />
                          <div>
                            <p className="font-medium">Giao hàng tiêu chuẩn</p>
                            <p className="text-sm text-gray-500">
                              Giao hàng trong 3-5 ngày
                            </p>
                          </div>
                        </div>
                      </Label>
                    </div>
                    <span className="font-medium">200,000₫</span>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg hover:border-red-600 transition-colors">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Truck className="size-5 text-red-600" />
                          <div>
                            <p className="font-medium">Giao hàng nhanh</p>
                            <p className="text-sm text-gray-500">
                              Giao hàng trong 1-2 ngày
                            </p>
                          </div>
                        </div>
                      </Label>
                    </div>
                    <span className="font-medium">400,000₫</span>
                  </div>
                </RadioGroup>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="size-8 bg-red-100 rounded-full flex items-center justify-center">
                    <CreditCard className="size-4 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold">Phương thức thanh toán</h2>
                </div>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:border-red-600 transition-colors">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Banknote className="size-5 text-gray-600" />
                            <div>
                              <p className="font-medium">
                                Thanh toán khi nhận hàng (COD)
                              </p>
                              <p className="text-sm text-gray-500">
                                Thanh toán bằng tiền mặt khi nhận hàng
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Phổ biến
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:border-red-600 transition-colors">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank" className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Building2 className="size-5 text-gray-600" />
                            <div>
                              <p className="font-medium">Chuyển khoản ngân hàng</p>
                              <p className="text-sm text-gray-500">
                                Chuyển khoản qua ATM/Internet Banking
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:border-red-600 transition-colors">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <CreditCard className="size-5 text-gray-600" />
                            <div>
                              <p className="font-medium">Thẻ tín dụng/Ghi nợ</p>
                              <p className="text-sm text-gray-500">
                                Visa, Mastercard, JCB
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:border-red-600 transition-colors">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="ewallet" id="ewallet" />
                        <Label htmlFor="ewallet" className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Wallet className="size-5 text-gray-600" />
                            <div>
                              <p className="font-medium">Ví điện tử</p>
                              <p className="text-sm text-gray-500">
                                MoMo, ZaloPay, VNPay
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </div>
                </RadioGroup>

                {paymentMethod === 'bank' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold mb-2 text-blue-900">
                      Thông tin chuyển khoản:
                    </h3>
                    <div className="space-y-1 text-sm text-blue-800">
                      <p>• Ngân hàng: Vietcombank</p>
                      <p>• Số tài khoản: 1234567890</p>
                      <p>• Chủ tài khoản: CÔNG TY LAPTOPSHOP</p>
                      <p>• Nội dung: Họ tên + Số điện thoại</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Note */}
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="size-5 text-gray-600" />
                  <h2 className="text-lg font-bold">Ghi chú đơn hàng</h2>
                </div>
                <Textarea
                  id="note"
                  name="note"
                  placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn..."
                  rows={4}
                  value={formData.note}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Đơn hàng của bạn</h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 pb-6 border-b max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative flex-shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded border"
                        />
                        <span className="absolute -top-2 -right-2 size-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium line-clamp-2 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm font-semibold text-red-600">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Summary */}
                <div className="space-y-3 pb-4 border-b">
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
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Giảm giá</span>
                      <span className="font-medium text-green-600">
                        -{discount.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-4 border-b">
                  <span className="text-lg font-bold">Tổng cộng</span>
                  <span className="text-2xl font-bold text-red-600">
                    {total.toLocaleString('vi-VN')}₫
                  </span>
                </div>

                {/* Terms & Conditions */}
                <div className="mt-6">
                  <div className="flex items-start gap-2 mb-4">
                    <Checkbox
                      id="terms"
                      checked={agreeTerms}
                      onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="text-sm cursor-pointer">
                      Tôi đã đọc và đồng ý với{' '}
                      <a href="#" className="text-red-600 hover:underline">
                        Điều khoản và điều kiện
                      </a>{' '}
                      của website
                    </Label>
                  </div>

                  {!agreeTerms && (
                    <div className="flex items-center gap-2 text-amber-600 text-sm mb-4 p-3 bg-amber-50 rounded-lg">
                      <AlertCircle className="size-4 flex-shrink-0" />
                      <span>Vui lòng đồng ý với điều khoản để tiếp tục</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={!agreeTerms}
                  >
                    <CheckCircle className="size-5 mr-2" />
                    Hoàn tất đơn hàng
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Bằng việc đặt hàng, bạn đồng ý với các điều khoản sử dụng của chúng
                    tôi
                  </p>
                </div>

                {/* Security Badge */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="size-4 text-green-600" />
                    <span>Thanh toán an toàn và bảo mật</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
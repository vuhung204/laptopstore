import { useEffect, useState } from 'react';
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
  AlertCircle,
  Banknote,
  Building2,
  CheckCircle,
  ChevronRight,
  CreditCard,
  FileText,
  Loader2,
  MapPin,
  PlusCircle,
  Truck,
  User,
  Wallet,
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import api, { ENDPOINTS } from '../config/apiConfig';

const SHIPPING_FEE = 30000;

type PaymentMethod = 'cod' | 'bank_transfer' | 'momo' | 'vnpay' | 'zalopay' | 'credit_card';
type AddressSelection = number | 'new' | null;

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

interface AddressResponse {
  id: number;
  recipientName: string;
  phone: string;
  addressLine: string;
  ward: string | null;
  district: string;
  city: string;
  isDefault: boolean;
}

interface AddressRequest {
  recipientName: string;
  phone: string;
  addressLine: string;
  ward?: string;
  district: string;
  city: string;
  isDefault: boolean;
}

interface CreateOrderRequest {
  addressId: number;
  note?: string;
  paymentMethod: string;
}

interface OrderResponse {
  id: number;
  orderCode: string;
  totalAmount: number;
  status: string;
}

interface PaymentRequest {
  orderId: number;
  method: string;
}

interface PaymentResponse {
  id: number;
  status: string;
  paymentUrl?: string;
}

function getToken(): string | null {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

async function apiFetch<T>(path: string, options?: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; body?: unknown }): Promise<T> {
  try {
    const response = await api.request<T>({
      url: path,
      method: options?.method ?? 'GET',
      data: options?.body,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message
      || error.response?.data?.error
      || error.message
      || 'Khong the ket noi may chu.'
    );
  }
}

function toApiPaymentMethod(method: PaymentMethod) {
  return method.toUpperCase();
}

function formatCurrency(value: number) {
  return `${value.toLocaleString('vi-VN')}₫`;
}

function toAddressForm(address: AddressResponse) {
  return {
    fullName: address.recipientName,
    phone: address.phone,
    email: '',
    city: address.city,
    district: address.district,
    ward: address.ward ?? '',
    address: address.addressLine,
    note: '',
  };
}

export default function CheckoutPage() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [loadingCart, setLoadingCart] = useState(true);
  const [cartError, setCartError] = useState('');

  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressError, setAddressError] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<AddressSelection>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
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

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const onlinePaymentMethods: PaymentMethod[] = ['momo', 'vnpay', 'zalopay', 'credit_card'];
  const onlinePaymentLabel: Record<PaymentMethod, string> = {
    cod: 'COD',
    bank_transfer: 'chuyen khoan',
    momo: 'MoMo',
    vnpay: 'VNPay',
    zalopay: 'ZaloPay',
    credit_card: 'cong the',
  };

  const isUsingNewAddress = selectedAddressId === 'new' || addresses.length === 0;
  const discount = 0;
  const total = cartSubtotal - discount + SHIPPING_FEE;

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    const loadCheckoutData = async () => {
      try {
        const [cart, userAddresses] = await Promise.all([
          apiFetch<CartResponse>(ENDPOINTS.CART.BASE),
          apiFetch<AddressResponse[]>(ENDPOINTS.USER.ADDRESSES),
        ]);

        setCartItems(cart.items);
        setCartSubtotal(cart.totalPrice);
        setAddresses(userAddresses);

        if (userAddresses.length > 0) {
          const defaultAddress = userAddresses.find((address) => address.isDefault) ?? userAddresses[0];
          setSelectedAddressId(defaultAddress.id);
          setFormData((current) => ({
            ...current,
            ...toAddressForm(defaultAddress),
            note: current.note,
            email: current.email,
          }));
        } else {
          setSelectedAddressId('new');
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Khong the tai du lieu checkout.';
        if (message.includes('401')) {
          navigate('/login');
          return;
        }
        setCartError(message);
        setAddressError(message);
      } finally {
        setLoadingCart(false);
        setLoadingAddresses(false);
      }
    };

    loadCheckoutData();
  }, [navigate]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleAddressSelection = (value: string) => {
    if (value === 'new') {
      setSelectedAddressId('new');
      setFormData((current) => ({
        ...current,
        fullName: '',
        phone: '',
        city: '',
        district: '',
        ward: '',
        address: '',
      }));
      return;
    }

    const addressId = Number(value);
    const selectedAddress = addresses.find((item) => item.id === addressId);
    if (!selectedAddress) {
      return;
    }

    setSelectedAddressId(addressId);
    setFormData((current) => ({
      ...current,
      ...toAddressForm(selectedAddress),
      note: current.note,
      email: current.email,
    }));
  };

  const createAddressIfNeeded = async () => {
    if (!isUsingNewAddress && typeof selectedAddressId === 'number') {
      return selectedAddressId;
    }

    if (!formData.fullName || !formData.phone || !formData.city || !formData.district || !formData.address) {
      throw new Error('Vui long nhap day du thong tin giao hang.');
    }

    const payload: AddressRequest = {
      recipientName: formData.fullName,
      phone: formData.phone,
      city: formData.city,
      district: formData.district,
      addressLine: formData.address,
      isDefault: saveInfo,
      ...(formData.ward ? { ward: formData.ward } : {}),
    };

    const newAddress = await apiFetch<AddressResponse>(ENDPOINTS.USER.ADDRESSES, {
      method: 'POST',
      body: payload,
    });

    setAddresses((current) => [newAddress, ...current]);
    setSelectedAddressId(newAddress.id);
    return newAddress.id;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!agreeTerms) {
      return;
    }

    if (cartItems.length === 0) {
      setSubmitError('Gio hang trong, khong the dat hang.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const addressId = await createAddressIfNeeded();

      const orderPayload: CreateOrderRequest = {
        addressId,
        paymentMethod: toApiPaymentMethod(paymentMethod),
        ...(formData.note ? { note: formData.note } : {}),
      };

      const order = await apiFetch<OrderResponse>(ENDPOINTS.ORDERS.BASE, {
        method: 'POST',
        body: orderPayload,
      });

      if (onlinePaymentMethods.includes(paymentMethod)) {
        const paymentPayload: PaymentRequest = {
          orderId: order.id,
          method: toApiPaymentMethod(paymentMethod),
        };

        const payment = await apiFetch<PaymentResponse>('/payment', {
          method: 'POST',
          body: paymentPayload,
        });

        if (payment.paymentUrl) {
          window.location.href = payment.paymentUrl;
          return;
        }
      }

      navigate(`/order-success?orderId=${order.orderCode}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Dat hang that bai, vui long thu lai.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-red-600">Trang chu</Link>
            <ChevronRight className="size-4" />
            <Link to="/cart" className="hover:text-red-600">Gio hang</Link>
            <ChevronRight className="size-4" />
            <span className="text-gray-900">Thanh toan</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Thanh toan</h1>

        {(cartError || addressError) && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle className="size-5 flex-shrink-0" />
            <span>{cartError || addressError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-lg border bg-white p-6">
                <div className="mb-6 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-red-100">
                    <MapPin className="size-4 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold">Dia chi giao hang</h2>
                </div>

                {loadingAddresses ? (
                  <div className="flex items-center gap-2 py-4 text-sm text-gray-500">
                    <Loader2 className="size-4 animate-spin" />
                    Dang tai danh sach dia chi...
                  </div>
                ) : addresses.length > 0 ? (
                  <div className="mb-6 space-y-4">
                    <RadioGroup
                      value={selectedAddressId === 'new' ? 'new' : String(selectedAddressId)}
                      onValueChange={handleAddressSelection}
                    >
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className="flex items-start justify-between rounded-lg border p-4 transition-colors hover:border-red-300"
                        >
                          <div className="flex items-start gap-3">
                            <RadioGroupItem value={String(address.id)} id={`address-${address.id}`} />
                            <Label htmlFor={`address-${address.id}`} className="cursor-pointer space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{address.recipientName}</span>
                                {address.isDefault && (
                                  <Badge variant="outline" className="border-green-600 text-green-600">
                                    Mac dinh
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{address.phone}</p>
                              <p className="text-sm text-gray-600">
                                {[address.addressLine, address.ward, address.district, address.city]
                                  .filter(Boolean)
                                  .join(', ')}
                              </p>
                            </Label>
                          </div>
                        </div>
                      ))}

                      <div className="flex items-start gap-3 rounded-lg border border-dashed p-4">
                        <RadioGroupItem value="new" id="address-new" />
                        <Label htmlFor="address-new" className="flex cursor-pointer items-center gap-2 font-medium">
                          <PlusCircle className="size-4 text-red-600" />
                          Su dung dia chi moi
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                ) : (
                  <div className="mb-6 rounded-lg border border-dashed bg-gray-50 p-4 text-sm text-gray-600">
                    Ban chua co dia chi luu. Hay nhap dia chi moi de tiep tuc dat hang.
                  </div>
                )}

                <div className="mb-6 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-red-100">
                    <User className="size-4 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold">
                    {isUsingNewAddress ? 'Thong tin nguoi nhan' : 'Thong tin dia chi da chon'}
                  </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Label htmlFor="fullName">Ho va ten</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Nguyen Van A"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={!isUsingNewAddress}
                      required={isUsingNewAddress}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">So dien thoai</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="0912345678"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isUsingNewAddress}
                      required={isUsingNewAddress}
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

                  <div>
                    <Label htmlFor="city">Tinh/Thanh pho</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Ho Chi Minh"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isUsingNewAddress}
                      required={isUsingNewAddress}
                    />
                  </div>

                  <div>
                    <Label htmlFor="district">Quan/Huyen</Label>
                    <Input
                      id="district"
                      name="district"
                      placeholder="Quan 1"
                      value={formData.district}
                      onChange={handleInputChange}
                      disabled={!isUsingNewAddress}
                      required={isUsingNewAddress}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="ward">Phuong/Xa</Label>
                    <Input
                      id="ward"
                      name="ward"
                      placeholder="Ben Nghe"
                      value={formData.ward}
                      onChange={handleInputChange}
                      disabled={!isUsingNewAddress}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address">Dia chi chi tiet</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="So nha, ten duong..."
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isUsingNewAddress}
                      required={isUsingNewAddress}
                    />
                  </div>
                </div>

                {isUsingNewAddress && (
                  <div className="mt-4 flex items-center gap-2">
                    <Checkbox
                      id="saveInfo"
                      checked={saveInfo}
                      onCheckedChange={(checked) => setSaveInfo(checked as boolean)}
                    />
                    <Label htmlFor="saveInfo" className="cursor-pointer">
                      Luu dia chi nay cho lan mua sau
                    </Label>
                  </div>
                )}
              </div>

              <div className="rounded-lg border bg-white p-6">
                <div className="mb-6 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-red-100">
                    <Truck className="size-4 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold">Van chuyen</h2>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">Giao hang tieu chuan</p>
                      <p className="text-sm text-gray-500">Phi ship hien tai dang duoc backend ap dung co dinh cho moi don.</p>
                    </div>
                    <span className="font-semibold">{formatCurrency(SHIPPING_FEE)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-white p-6">
                <div className="mb-6 flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-red-100">
                    <CreditCard className="size-4 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold">Phuong thuc thanh toan</h2>
                </div>

                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border p-4 hover:border-red-600">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Banknote className="size-5 text-gray-600" />
                            <div>
                              <p className="font-medium">Thanh toan khi nhan hang</p>
                              <p className="text-sm text-gray-500">Thanh toan bang tien mat khi nhan hang</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                      <Badge variant="outline" className="border-green-600 text-green-600">Pho bien</Badge>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4 hover:border-red-600">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                        <Label htmlFor="bank_transfer" className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Building2 className="size-5 text-gray-600" />
                            <div>
                              <p className="font-medium">Chuyen khoan ngan hang</p>
                              <p className="text-sm text-gray-500">Thanh toan qua ATM hoac Internet Banking</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4 hover:border-red-600">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="credit_card" id="credit_card" />
                        <Label htmlFor="credit_card" className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <CreditCard className="size-5 text-gray-600" />
                            <div>
                              <p className="font-medium">The tin dung/Ghi no</p>
                              <p className="text-sm text-gray-500">Visa, Mastercard, JCB</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4 hover:border-red-600">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="momo" id="momo" />
                        <Label htmlFor="momo" className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Wallet className="size-5 text-gray-600" />
                            <div>
                              <p className="font-medium">Vi MoMo</p>
                              <p className="text-sm text-gray-500">Thanh toan qua vi dien tu MoMo</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4 hover:border-red-600">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="vnpay" id="vnpay" />
                        <Label htmlFor="vnpay" className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Wallet className="size-5 text-gray-600" />
                            <div>
                              <p className="font-medium">VNPay</p>
                              <p className="text-sm text-gray-500">Thanh toan qua cong VNPay</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4 hover:border-red-600">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="zalopay" id="zalopay" />
                        <Label htmlFor="zalopay" className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Wallet className="size-5 text-gray-600" />
                            <div>
                              <p className="font-medium">ZaloPay</p>
                              <p className="text-sm text-gray-500">Thanh toan qua vi ZaloPay</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </div>
                </RadioGroup>

                {paymentMethod === 'bank_transfer' && (
                  <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                    <p className="font-semibold text-blue-900">Thong tin chuyen khoan:</p>
                    <p>Ngan hang: Vietcombank</p>
                    <p>So tai khoan: 1234567890</p>
                    <p>Chu tai khoan: CONG TY LAPTOPSHOP</p>
                  </div>
                )}

                {onlinePaymentMethods.includes(paymentMethod) && (
                  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    Sau khi dat hang, ban se duoc chuyen sang trang thanh toan cua <strong>{onlinePaymentLabel[paymentMethod]}</strong>.
                  </div>
                )}
              </div>

              <div className="rounded-lg border bg-white p-6">
                <div className="mb-4 flex items-center gap-2">
                  <FileText className="size-5 text-gray-600" />
                  <h2 className="text-lg font-bold">Ghi chu don hang</h2>
                </div>
                <Textarea
                  id="note"
                  name="note"
                  placeholder="Them ghi chu giao hang neu can..."
                  rows={4}
                  value={formData.note}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-lg border bg-white p-6">
                <h2 className="mb-6 text-xl font-bold">Don hang cua ban</h2>

                <div className="mb-6 max-h-64 space-y-4 overflow-y-auto border-b pb-6">
                  {loadingCart ? (
                    <div className="flex items-center justify-center py-8 text-gray-400">
                      <Loader2 className="mr-2 size-5 animate-spin" />
                      <span className="text-sm">Dang tai gio hang...</span>
                    </div>
                  ) : cartItems.length === 0 && !cartError ? (
                    <p className="py-4 text-center text-sm text-gray-500">Gio hang trong</p>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.productId} className="flex gap-3">
                        <div className="relative flex-shrink-0">
                          <ImageWithFallback
                            src={item.image || ''}
                            alt={item.productName}
                            className="h-16 w-16 rounded border object-cover"
                          />
                          <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="mb-1 line-clamp-2 text-sm font-medium">{item.productName}</h3>
                          {item.brandName && <p className="mb-1 text-xs text-gray-500">{item.brandName}</p>}
                          <p className="text-sm font-semibold text-red-600">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="space-y-3 border-b pb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tam tinh</span>
                    <span className="font-medium">{formatCurrency(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phi van chuyen</span>
                    <span className="font-medium">{formatCurrency(SHIPPING_FEE)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b py-4">
                  <span className="text-lg font-bold">Tong cong</span>
                  <span className="text-2xl font-bold text-red-600">{formatCurrency(total)}</span>
                </div>

                {submitError && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <AlertCircle className="size-4 flex-shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="mt-6">
                  <div className="mb-4 flex items-start gap-2">
                    <Checkbox
                      id="terms"
                      checked={agreeTerms}
                      onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor="terms" className="cursor-pointer text-sm">
                      Toi da doc va dong y voi dieu khoan cua website
                    </Label>
                  </div>

                  {!agreeTerms && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                      <AlertCircle className="size-4 flex-shrink-0" />
                      <span>Vui long dong y dieu khoan de tiep tuc.</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={!agreeTerms || submitting || loadingCart || loadingAddresses}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 size-5 animate-spin" />
                        Dang xu ly...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 size-5" />
                        Hoan tat don hang
                      </>
                    )}
                  </Button>

                  <p className="mt-4 text-center text-xs text-gray-500">
                    Bang viec dat hang, ban dong y voi cac dieu khoan su dung cua chung toi.
                  </p>
                </div>

                <div className="mt-6 border-t pt-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="size-4 text-green-600" />
                    <span>Thanh toan an toan va bao mat</span>
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

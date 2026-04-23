import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import {
  AlertCircle,
  Bell,
  Camera,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  Edit,
  Eye,
  Heart,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Package,
  Phone,
  Plus,
  Save,
  Settings,
  Star,
  Trash2,
  Truck,
  User,
  X,
} from 'lucide-react';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import api, { ENDPOINTS } from '../config/apiConfig';
import { useAuth } from '../context/AuthContext';

type ActiveTab =
  | 'overview'
  | 'profile'
  | 'orders'
  | 'wishlist'
  | 'addresses'
  | 'password'
  | 'notifications';

interface UserProfileResponse {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  status: string;
}

interface UpdateProfileRequest {
  fullName: string;
  phone: string;
  avatarUrl: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
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

interface OrderItemResponse {
  productId: number;
  productName: string;
  brandName: string | null;
  image: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface OrderResponse {
  id: number;
  orderCode: string;
  status: string;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  note: string | null;
  orderedAt: string;
  items: OrderItemResponse[];
}

interface WishlistResponse {
  productId: number;
  productName: string;
  slug: string;
  basePrice: number;
  salePrice: number | null;
  primaryImage: string | null;
  brandName: string;
  addedAt: string;
}

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1704726135027-9c6f034cfa41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NTIzMDUyMHww&ixlib=rb-4.1.0&q=80&w=1080';

function formatCurrency(value: number) {
  return `${value.toLocaleString('vi-VN')}₫`;
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function getStatusLabel(status: string) {
  const normalized = status.toLowerCase();
  switch (normalized) {
    case 'pending':
      return 'Chờ xác nhận';
    case 'confirmed':
      return 'Đã xác nhận';
    case 'processing':
      return 'Đang xử lý';
    case 'shipping':
      return 'Đang giao';
    case 'delivered':
      return 'Đã giao';
    case 'completed':
      return 'Hoàn thành';
    case 'cancelled':
      return 'Đã hủy';
    case 'refunded':
      return 'Đã hoàn tiền';
    default:
      return status;
  }
}

function getStatusColor(status: string) {
  const normalized = status.toLowerCase();
  switch (normalized) {
    case 'pending':
    case 'confirmed':
      return 'border-amber-200 bg-amber-50 text-amber-700';
    case 'processing':
      return 'border-orange-200 bg-orange-50 text-orange-700';
    case 'shipping':
      return 'border-blue-200 bg-blue-50 text-blue-700';
    case 'delivered':
    case 'completed':
      return 'border-green-200 bg-green-50 text-green-700';
    case 'cancelled':
    case 'refunded':
      return 'border-red-200 bg-red-50 text-red-700';
    default:
      return 'border-gray-200 bg-gray-50 text-gray-700';
  }
}

function getStatusIcon(status: string) {
  const normalized = status.toLowerCase();
  switch (normalized) {
    case 'pending':
    case 'confirmed':
      return <Clock className="size-4 text-amber-600" />;
    case 'processing':
      return <Package className="size-4 text-orange-600" />;
    case 'shipping':
      return <Truck className="size-4 text-blue-600" />;
    case 'delivered':
    case 'completed':
      return <CheckCircle className="size-4 text-green-600" />;
    case 'cancelled':
    case 'refunded':
      return <X className="size-4 text-red-600" />;
    default:
      return <Package className="size-4 text-gray-600" />;
  }
}

function emptyAddressForm(): AddressRequest {
  return {
    recipientName: '',
    phone: '',
    addressLine: '',
    ward: '',
    district: '',
    city: '',
    isDefault: false,
  };
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [wishlistItems, setWishlistItems] = useState<WishlistResponse[]>([]);
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);

  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileForm, setProfileForm] = useState<UpdateProfileRequest>({
    fullName: '',
    phone: '',
    avatarUrl: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressMessage, setAddressMessage] = useState('');
  const [addressForm, setAddressForm] = useState<AddressRequest>(emptyAddressForm());

  // -- Tách ra để có thể gọi lại khi cần (refresh)
  const loadBaseData = async () => {
    setLoading(true);
    setPageError('');

    try {
      const profileRes = await api.get<UserProfileResponse>(ENDPOINTS.USER.PROFILE);
      setProfile(profileRes.data);
      setProfileForm({
        fullName: profileRes.data.fullName || '',
        phone: profileRes.data.phone || '',
        avatarUrl: profileRes.data.avatarUrl || '',
      });

      // Đồng thời load wishlist, addresses và (nhẹ) load orders để có tổng ngay
      const [wishlistRes, addressesRes, ordersRes] = await Promise.allSettled([
        api.get<WishlistResponse[]>('/wishlist'),
        api.get<AddressResponse[]>(ENDPOINTS.USER.ADDRESSES),
        // Gọi orders để lấy tổng; nếu API trả mảng lớn có thể cân nhắc backend cung cấp summary endpoint
        api.get<OrderResponse[]>(ENDPOINTS.ORDERS.BASE),
      ]);

      setWishlistItems(wishlistRes.status === 'fulfilled' ? wishlistRes.value.data : []);
      setAddresses(addressesRes.status === 'fulfilled' ? addressesRes.value.data : []);
      if (ordersRes.status === 'fulfilled') {
        setOrders(ordersRes.value.data);
        setOrdersLoaded(true);
        setOrdersError('');
      } else {
        // Nếu fetch orders thất bại, giữ trạng thái hiện tại (không block trang)
        setOrdersLoaded(false);
        setOrders([]);
        setOrdersError('Không thể tải đơn hàng.');
      }

      const failedSections = [
        wishlistRes.status === 'rejected' ? 'danh sách yêu thích' : null,
        addressesRes.status === 'rejected' ? 'địa chỉ' : null,
      ].filter(Boolean);

      if (failedSections.length > 0) {
        setPageError(`Không thể tải ${failedSections.join(', ')}. Các phần còn lại vẫn hiển thị bình thường.`);
      }
    } catch (error: any) {
      setPageError(error.response?.data?.error || error.response?.data?.message || error.message || 'Không thể tải trang tài khoản.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    loadBaseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // Nếu trang được điều hướng với state.refresh hoặc có flag trong localStorage (ví dụ từ thanh toán)
  useEffect(() => {
    const needRefresh = Boolean(location.state && (location.state as any).refresh) || Boolean(localStorage.getItem('needProfileRefresh'));
    if (needRefresh) {
      // xóa flag localStorage nếu có
      localStorage.removeItem('needProfileRefresh');

      // load lại dữ liệu
      loadBaseData();

      // xóa state.refresh khỏi history để tránh fetch lặp lại
      if (location.state && (location.state as any).refresh) {
        navigate(location.pathname, { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  useEffect(() => {
    // Lazy load orders if user clicks Orders tab and orders chưa load
    if (activeTab !== 'orders' || ordersLoaded || ordersLoading) {
      return;
    }

    const loadOrders = async () => {
      setOrdersLoading(true);
      setOrdersError('');

      try {
        const response = await api.get<OrderResponse[]>(ENDPOINTS.ORDERS.BASE);
        setOrders(response.data);
        setOrdersLoaded(true);
      } catch (error: any) {
        setOrders([]);
        setOrdersLoaded(true);
        setOrdersError(error.response?.data?.error || error.response?.data?.message || 'Không thể tải đơn hàng lúc này.');
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0),
    [orders]
  );

  const memberLevel = useMemo(() => {
    if (totalSpent >= 50000000) return 'Platinum';
    if (totalSpent >= 20000000) return 'Gold';
    if (totalSpent >= 5000000) return 'Silver';
    return 'Member';
  }, [totalSpent]);

  const defaultAddress = useMemo(
    () => addresses.find((address) => address.isDefault),
    [addresses]
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileChange = (field: keyof UpdateProfileRequest, value: string) => {
    setProfileForm((current) => ({ ...current, [field]: value }));
  };

  const handleSaveProfile = async () => {
    if (!editMode) {
      setEditMode(true);
      return;
    }

    setSavingProfile(true);
    setProfileMessage('');

    try {
      const response = await api.put<UserProfileResponse>(ENDPOINTS.USER.PROFILE, profileForm);
      setProfile(response.data);
      setProfileForm({
        fullName: response.data.fullName || '',
        phone: response.data.phone || '',
        avatarUrl: response.data.avatarUrl || '',
      });
      setEditMode(false);
      setProfileMessage('Đã cập nhật thông tin cá nhân.');
    } catch (error: any) {
      setProfileMessage(error.response?.data?.error || error.response?.data?.message || 'Không thể cập nhật hồ sơ.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async () => {
    setPasswordMessage('');

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordMessage('Vui lòng nhập đầy đủ thông tin mật khẩu.');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordMessage('Mật khẩu mới phải có ít nhất 8 ký tự.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage('Xác nhận mật khẩu mới chưa khớp.');
      return;
    }

    setSavingPassword(true);

    try {
      const payload: ChangePasswordRequest = {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      };
      await api.put(ENDPOINTS.USER.PASSWORD, payload);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordMessage('Đổi mật khẩu thành công.');
    } catch (error: any) {
      setPasswordMessage(error.response?.data?.error || error.response?.data?.message || 'Không thể đổi mật khẩu.');
    } finally {
      setSavingPassword(false);
    }
  };

  const reloadAddresses = async () => {
    const response = await api.get<AddressResponse[]>(ENDPOINTS.USER.ADDRESSES);
    setAddresses(response.data);
  };

  const openNewAddressForm = () => {
    setEditingAddressId(null);
    setAddressForm(emptyAddressForm());
    setShowAddressForm(true);
    setAddressMessage('');
  };

  const openEditAddressForm = (address: AddressResponse) => {
    setEditingAddressId(address.id);
    setAddressForm({
      recipientName: address.recipientName,
      phone: address.phone,
      addressLine: address.addressLine,
      ward: address.ward || '',
      district: address.district,
      city: address.city,
      isDefault: address.isDefault,
    });
    setShowAddressForm(true);
    setAddressMessage('');
  };

  const handleAddressFormChange = (field: keyof AddressRequest, value: string | boolean) => {
    setAddressForm((current) => ({ ...current, [field]: value }));
  };

  const handleSaveAddress = async () => {
    setAddressMessage('');

    if (!addressForm.recipientName || !addressForm.phone || !addressForm.addressLine || !addressForm.district || !addressForm.city) {
      setAddressMessage('Vui lòng nhập đầy đủ thông tin địa chỉ.');
      return;
    }

    setSavingAddress(true);

    try {
      const payload = { ...addressForm, ward: addressForm.ward || undefined };
      if (editingAddressId) {
        await api.put(`${ENDPOINTS.USER.ADDRESSES}/${editingAddressId}`, payload);
      } else {
        await api.post(ENDPOINTS.USER.ADDRESSES, payload);
      }

      await reloadAddresses();
      setShowAddressForm(false);
      setEditingAddressId(null);
      setAddressForm(emptyAddressForm());
      setAddressMessage('Đã lưu địa chỉ.');
    } catch (error: any) {
      setAddressMessage(error.response?.data?.error || error.response?.data?.message || 'Không thể lưu địa chỉ.');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      await api.delete(`${ENDPOINTS.USER.ADDRESSES}/${addressId}`);
      await reloadAddresses();
      setAddressMessage('Đã xóa địa chỉ.');
    } catch (error: any) {
      setAddressMessage(error.response?.data?.error || error.response?.data?.message || 'Không thể xóa địa chỉ.');
    }
  };

  const handleSetDefaultAddress = async (address: AddressResponse) => {
    try {
      await api.put(`${ENDPOINTS.USER.ADDRESSES}/${address.id}`, {
        recipientName: address.recipientName,
        phone: address.phone,
        addressLine: address.addressLine,
        ward: address.ward || undefined,
        district: address.district,
        city: address.city,
        isDefault: true,
      });
      await reloadAddresses();
      setAddressMessage('Đã cập nhật địa chỉ mặc định.');
    } catch (error: any) {
      setAddressMessage(error.response?.data?.error || error.response?.data?.message || 'Không thể cập nhật địa chỉ mặc định.');
    }
  };

  const handleRemoveWishlist = async (productId: number) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setWishlistItems((current) => current.filter((item) => item.productId !== productId));
    } catch {
      // Keep the page stable if wishlist removal fails.
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="size-10 animate-spin text-red-600" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
            {pageError || 'Không thể tải hồ sơ người dùng.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-red-600">Trang chủ</Link>
            <ChevronRight className="size-4" />
            <span className="text-gray-900">Tài khoản của tôi</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {pageError && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle className="size-5 flex-shrink-0" />
            <span>{pageError}</span>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="sticky top-24 rounded-lg border bg-white p-6">
              <div className="mb-6 border-b pb-6 text-center">
                <div className="relative mb-4 inline-block">
                  <ImageWithFallback
                    src={profile.avatarUrl || DEFAULT_AVATAR}
                    alt={profile.fullName}
                    className="size-24 rounded-full object-cover border-4 border-red-100"
                  />
                  <div className="absolute bottom-0 right-0 rounded-full bg-red-600 p-2 text-white">
                    <Camera className="size-4" />
                  </div>
                </div>
                <h2 className="mb-1 text-lg font-bold">{profile.fullName}</h2>
                <p className="mb-3 text-sm text-gray-600">{profile.email}</p>
                <Badge className="bg-yellow-500 hover:bg-yellow-600">{memberLevel}</Badge>
              </div>

              <nav className="space-y-1">
                {(
                  [
                    ['overview', <User className="size-5" />, 'Tổng quan'],
                    ['profile', <Settings className="size-5" />, 'Thông tin cá nhân'],
                    ['orders', <Package className="size-5" />, 'Đơn hàng'],
                    ['wishlist', <Heart className="size-5" />, 'Yêu thích'],
                    ['addresses', <MapPin className="size-5" />, 'Địa chỉ'],
                    ['password', <Lock className="size-5" />, 'Đổi mật khẩu'],
                    ['notifications', <Bell className="size-5" />, 'Thông báo'],
                  ] as [ActiveTab, React.ReactElement, string][]
                ).map(([tab, icon, label]) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                      activeTab === tab ? 'bg-red-50 font-medium text-red-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                    {tab === 'wishlist' && <Badge variant="secondary" className="ml-auto">{wishlistItems.length}</Badge>}
                  </button>
                ))}
              </nav>

              <Button variant="outline" className="mt-6 w-full" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </div>
          </div>

          <div className="lg:col-span-9">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="rounded-lg border bg-white p-6">
                  <h2 className="mb-6 text-2xl font-bold">Xin chào, {profile.fullName}!</h2>

                  <div className="mb-6 grid gap-6 md:grid-cols-3">
                    <div className="rounded-lg border border-red-100 bg-gradient-to-br from-red-50 to-orange-50 p-6">
                      <Package className="mb-3 size-10 text-red-600" />
                      <div className="mb-1 text-3xl font-bold">{ordersLoaded ? orders.length : '--'}</div>
                      <div className="text-sm text-gray-600">Tổng đơn hàng</div>
                    </div>

                    <div className="rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                      <CreditCard className="mb-3 size-10 text-blue-600" />
                      <div className="mb-1 text-3xl font-bold">{ordersLoaded ? `${(totalSpent / 1000000).toFixed(1)}M` : '--'}</div>
                      <div className="text-sm text-gray-600">Tổng chi tiêu</div>
                    </div>

                    <div className="rounded-lg border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                      <Heart className="mb-3 size-10 text-purple-600" />
                      <div className="mb-1 text-3xl font-bold">{wishlistItems.length}</div>
                      <div className="text-sm text-gray-600">Sản phẩm yêu thích</div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-6">
                    <h3 className="mb-2 flex items-center gap-2 text-lg font-bold">
                      <Star className="size-5 fill-yellow-600 text-yellow-600" />
                      Hạng thành viên: {memberLevel}
                    </h3>
                    <p className="text-sm text-gray-600">Trạng thái tài khoản: {profile.status}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="rounded-lg border bg-white p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Thông tin cá nhân</h2>
                  <Button onClick={handleSaveProfile} disabled={savingProfile} variant={editMode ? 'default' : 'outline'}>
                    {savingProfile ? <><Loader2 className="mr-2 size-4 animate-spin" />Đang lưu...</> : editMode ? <><Save className="mr-2 size-4" />Lưu thay đổi</> : <><Edit className="mr-2 size-4" />Chỉnh sửa</>}
                  </Button>
                </div>

                {profileMessage && <div className="mb-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{profileMessage}</div>}

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input id="fullName" value={profileForm.fullName} onChange={(e) => handleProfileChange('fullName', e.target.value)} disabled={!editMode} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                      <Input id="email" value={profile.email} disabled className="pl-10" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <div className="relative mt-2">
                      <Phone className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                      <Input id="phone" value={profileForm.phone} onChange={(e) => handleProfileChange('phone', e.target.value)} disabled={!editMode} className="pl-10" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="avatarUrl">Avatar URL</Label>
                    <div className="relative mt-2">
                      <Camera className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                      <Input id="avatarUrl" value={profileForm.avatarUrl} onChange={(e) => handleProfileChange('avatarUrl', e.target.value)} disabled={!editMode} className="pl-10" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Địa chỉ mặc định</Label>
                    <div className="mt-2 rounded-lg border bg-gray-50 p-3 text-sm text-gray-600">
                      {defaultAddress
                        ? [defaultAddress.addressLine, defaultAddress.ward, defaultAddress.district, defaultAddress.city].filter(Boolean).join(', ')
                        : 'Chưa có địa chỉ mặc định'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="rounded-lg border bg-white p-6">
                <h2 className="mb-6 text-2xl font-bold">Đơn hàng của tôi</h2>

                {ordersLoading && (
                  <div className="flex items-center justify-center py-8 text-gray-500">
                    <Loader2 className="mr-2 size-5 animate-spin" />
                    Đang tải đơn hàng...
                  </div>
                )}

                {ordersError && !ordersLoading && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                    {ordersError}
                  </div>
                )}

                {!ordersLoading && !ordersError && orders.length === 0 && (
                  <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
                    Chưa có đơn hàng nào để hiển thị.
                  </div>
                )}

                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="rounded-lg border p-6 transition-shadow hover:shadow-md">
                      <div className="mb-4 flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-sm text-gray-600">Mã đơn hàng:</span>
                            <span className="ml-2 font-semibold">#{order.orderCode}</span>
                          </div>
                          <Badge variant="outline" className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{getStatusLabel(order.status)}</span>
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">{formatDateTime(order.orderedAt)}</span>
                      </div>

                      {order.items.map((item) => (
                        <div key={item.productId} className="mb-4 flex items-center gap-4">
                          <div className="size-20 flex-shrink-0 overflow-hidden rounded border bg-gray-50">
                            {item.image
                              ? <img src={item.image} alt={item.productName} className="size-full object-cover" onError={e => { (e.target as HTMLImageElement).src = ''; (e.target as HTMLImageElement).style.display = 'none'; }} />
                              : <div className="flex size-full items-center justify-center text-xs text-gray-400">Laptop</div>
                            }
                          </div>
                          <div className="flex-1">
                            {item.brandName && <p className="mb-0.5 text-xs text-gray-500">{item.brandName}</p>}
                            <h4 className="mb-1 font-medium line-clamp-2">{item.productName}</h4>
                            <p className="text-sm text-gray-600">
                              {formatCurrency(Number(item.unitPrice))} × {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-red-600">{formatCurrency(Number(item.totalPrice))}</p>
                          </div>
                        </div>
                      ))}

                      <div className="flex items-center justify-between border-t pt-4">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/order-success?orderId=${order.id}`}>
                            <Eye className="mr-2 size-4" />
                            Chi tiết
                          </Link>
                        </Button>
                        <span className="text-xl font-bold">{formatCurrency(Number(order.totalAmount))}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="rounded-lg border bg-white p-6">
                <h2 className="mb-6 text-2xl font-bold">Sản phẩm yêu thích ({wishlistItems.length})</h2>

                <div className="grid gap-6 md:grid-cols-2">
                  {wishlistItems.length === 0 && (
                    <div className="rounded-lg border border-dashed p-8 text-center text-gray-500 md:col-span-2">
                      Chưa có sản phẩm yêu thích nào.
                    </div>
                  )}

                  {wishlistItems.map((item) => {
                    const currentPrice = Number(item.salePrice ?? item.basePrice);
                    const originalPrice = Number(item.basePrice);
                    const hasDiscount = item.salePrice !== null && item.salePrice < item.basePrice;

                    return (
                      <div key={item.productId} className="overflow-hidden rounded-lg border transition-shadow hover:shadow-md">
                        <div className="relative">
                          <ImageWithFallback src={item.primaryImage || ''} alt={item.productName} className="h-48 w-full object-cover" />
                          <button onClick={() => handleRemoveWishlist(item.productId)} className="absolute right-3 top-3 rounded-full bg-white/90 p-2 backdrop-blur-sm hover:bg-white">
                            <Heart className="size-5 fill-red-600 text-red-600" />
                          </button>
                        </div>

                        <div className="p-4">
                          <Badge variant="outline" className="mb-2">{item.brandName}</Badge>
                          <h3 className="mb-2 line-clamp-2 font-semibold">{item.productName}</h3>
                          <p className="mb-3 text-sm text-gray-500">Đã thêm: {formatDate(item.addedAt)}</p>
                          <div className="mb-4 flex items-baseline gap-2">
                            <span className="text-xl font-bold text-red-600">{formatCurrency(currentPrice)}</span>
                            {hasDiscount && <span className="text-sm text-gray-400 line-through">{formatCurrency(originalPrice)}</span>}
                          </div>
                          <Button className="w-full bg-red-600 hover:bg-red-700" size="sm" asChild>
                            <Link to={`/product/${item.productId}`}>Xem chi tiết</Link>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="rounded-lg border bg-white p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Địa chỉ giao hàng</h2>
                  <Button onClick={openNewAddressForm}>
                    <Plus className="mr-2 size-4" />
                    Thêm địa chỉ mới
                  </Button>
                </div>

                {addressMessage && <div className="mb-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{addressMessage}</div>}

                {showAddressForm && (
                  <div className="mb-6 rounded-lg border border-red-100 bg-red-50 p-5">
                    <h3 className="mb-4 text-lg font-semibold">{editingAddressId ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="recipientName">Người nhận</Label>
                        <Input id="recipientName" value={addressForm.recipientName} onChange={(e) => handleAddressFormChange('recipientName', e.target.value)} className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="addressPhone">Số điện thoại</Label>
                        <Input id="addressPhone" value={addressForm.phone} onChange={(e) => handleAddressFormChange('phone', e.target.value)} className="mt-2" />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="addressLine">Địa chỉ chi tiết</Label>
                        <Input id="addressLine" value={addressForm.addressLine} onChange={(e) => handleAddressFormChange('addressLine', e.target.value)} className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="ward">Phường/Xã</Label>
                        <Input id="ward" value={addressForm.ward || ''} onChange={(e) => handleAddressFormChange('ward', e.target.value)} className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="district">Quận/Huyện</Label>
                        <Input id="district" value={addressForm.district} onChange={(e) => handleAddressFormChange('district', e.target.value)} className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="city">Tỉnh/Thành phố</Label>
                        <Input id="city" value={addressForm.city} onChange={(e) => handleAddressFormChange('city', e.target.value)} className="mt-2" />
                      </div>
                      <div className="flex items-center gap-2 pt-8">
                        <input id="isDefault" type="checkbox" checked={addressForm.isDefault} onChange={(e) => handleAddressFormChange('isDefault', e.target.checked)} className="size-4 accent-red-600" />
                        <Label htmlFor="isDefault">Đặt làm địa chỉ mặc định</Label>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button onClick={handleSaveAddress} disabled={savingAddress}>
                        {savingAddress ? <><Loader2 className="mr-2 size-4 animate-spin" />Đang lưu...</> : 'Lưu địa chỉ'}
                      </Button>
                      <Button variant="outline" onClick={() => { setShowAddressForm(false); setEditingAddressId(null); setAddressForm(emptyAddressForm()); }}>
                        Hủy
                      </Button>
                    </div>
                  </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  {addresses.length === 0 && (
                    <div className="rounded-lg border border-dashed p-8 text-center text-gray-500 md:col-span-2">
                      Chưa có địa chỉ nào.
                    </div>
                  )}

                  {addresses.map((address) => (
                    <div key={address.id} className="relative rounded-lg border p-6 transition-shadow hover:shadow-md">
                      {address.isDefault && <Badge className="absolute right-4 top-4 bg-red-600">Mặc định</Badge>}

                      <div className="mb-4">
                        <h3 className="mb-2 text-lg font-bold">{address.recipientName}</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p className="flex items-center gap-2"><Phone className="size-4" />{address.phone}</p>
                          <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 flex-shrink-0" /><span>{[address.addressLine, address.ward, address.district, address.city].filter(Boolean).join(', ')}</span></p>
                        </div>
                      </div>

                      <div className="flex gap-2 border-t pt-4">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditAddressForm(address)}>
                          <Edit className="mr-2 size-4" />
                          Sửa
                        </Button>
                        {!address.isDefault && (
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDeleteAddress(address.id)}>
                            <Trash2 className="mr-2 size-4" />
                            Xóa
                          </Button>
                        )}
                      </div>

                      {!address.isDefault && (
                        <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={() => handleSetDefaultAddress(address)}>
                          Đặt làm mặc định
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="rounded-lg border bg-white p-6">
                <h2 className="mb-6 text-2xl font-bold">Đổi mật khẩu</h2>

                {passwordMessage && <div className="mb-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{passwordMessage}</div>}

                <div className="max-w-md space-y-6">
                  <div>
                    <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                      <Input id="current-password" type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((current) => ({ ...current, currentPassword: e.target.value }))} className="pl-10" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="new-password">Mật khẩu mới</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                      <Input id="new-password" type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((current) => ({ ...current, newPassword: e.target.value }))} className="pl-10" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                      <Input id="confirm-password" type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((current) => ({ ...current, confirmPassword: e.target.value }))} className="pl-10" />
                    </div>
                  </div>
                  <Button className="w-full bg-red-600 hover:bg-red-700" onClick={handleSavePassword} disabled={savingPassword}>
                    {savingPassword ? <><Loader2 className="mr-2 size-4 animate-spin" />Đang cập nhật...</> : 'Cập nhật mật khẩu'}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="rounded-lg border bg-white p-6">
                <h2 className="mb-6 text-2xl font-bold">Cài đặt thông báo</h2>
                <div className="space-y-6">
                  {(
                    [
                      ['Thông báo đơn hàng', 'Nhận cập nhật khi trạng thái đơn hàng thay đổi.', true],
                      ['Khuyến mãi & ưu đãi', 'Nhận thông tin về mã giảm giá và chương trình mới.', true],
                      ['Sản phẩm mới', 'Nhận thông báo khi có laptop mới phù hợp nhu cầu.', false],
                      ['Email marketing', 'Nhận email tổng hợp về tin tức và sản phẩm.', false],
                      ['Thông báo SMS', 'Nhận SMS về đơn hàng và các mốc giao hàng.', true],
                    ] as [string, string, boolean][]
                  ).map(([title, description, checked]) => (
                    <div key={title} className="flex items-center justify-between border-b py-4 last:border-b-0">
                      <div>
                        <h3 className="mb-1 font-semibold">{title}</h3>
                        <p className="text-sm text-gray-600">{description}</p>
                      </div>
                      <input type="checkbox" defaultChecked={checked} className="size-4 accent-red-600" />
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  Mục này hiện là giao diện tạm thời. Backend chưa có cấu hình lưu thông báo riêng.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
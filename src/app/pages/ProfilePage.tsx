import { useState } from 'react';
import { Link } from 'react-router';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  User,
  Package,
  Heart,
  MapPin,
  Lock,
  Bell,
  ChevronRight,
  Camera,
  Edit,
  Trash2,
  Plus,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Eye,
  Star,
  Truck,
  CheckCircle,
  Clock,
  X,
  Settings,
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const userData = {
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@email.com',
  phone: '0123456789',
  avatar: 'https://images.unsplash.com/photo-1704726135027-9c6f034cfa41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZSUyMGF2YXRhciUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NTIzMDUyMHww&ixlib=rb-4.1.0&q=80&w=1080',
  joinDate: '15/03/2023',
  totalOrders: 24,
  totalSpent: 45980000,
  memberLevel: 'Gold',
};

const orders = [
  {
    id: 'DH001234',
    date: '25/03/2026',
    items: [
      {
        name: 'Dell XPS 13 Plus',
        image: 'https://images.unsplash.com/photo-1759668358660-0d06064f0f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NzQ4ODczMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        quantity: 1,
        price: 32990000,
      },
    ],
    total: 32990000,
    status: 'delivered',
    statusText: 'Đã giao hàng',
  },
  {
    id: 'DH001235',
    date: '30/03/2026',
    items: [
      {
        name: 'Asus ZenBook 14 OLED',
        image: 'https://images.unsplash.com/photo-1754928864131-21917af96dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bHRyYWJvb2slMjB0aGluJTIwbGFwdG9wfGVufDF8fHx8MTc3NDg3NDI0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
        quantity: 1,
        price: 21990000,
      },
    ],
    total: 21990000,
    status: 'shipping',
    statusText: 'Đang giao hàng',
  },
  {
    id: 'DH001236',
    date: '02/04/2026',
    items: [
      {
        name: 'HP EliteBook 840 G9',
        image: 'https://images.unsplash.com/photo-1762341119317-fb5417c18407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGxhcHRvcCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzQ5NTc1MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        quantity: 1,
        price: 25990000,
      },
    ],
    total: 25990000,
    status: 'processing',
    statusText: 'Đang xử lý',
  },
];

const wishlistItems = [
  {
    id: 1,
    name: 'MacBook Air M2 - Mỏng nhẹ đỉnh cao cho sáng tạo',
    brand: 'Apple',
    price: 28990000,
    originalPrice: 32990000,
    rating: 4.9,
    reviews: 567,
    image: 'https://images.unsplash.com/photo-1532198528077-0d9e4ca9bb40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNib29rJTIwbGFwdG9wJTIwZGVza3xlbnwxfHx8fDE3NzQ5NTM2ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    inStock: true,
  },
  {
    id: 2,
    name: 'Lenovo ThinkPad X1 Carbon Gen 11 - Bền bỉ đa nhiệm',
    brand: 'Lenovo',
    price: 35990000,
    rating: 4.8,
    reviews: 198,
    image: 'https://images.unsplash.com/photo-1589913649361-56d3f8762bc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3Jrc3RhdGlvbiUyMGxhcHRvcCUyMHBvd2VyZnVsfGVufDF8fHx8MTc3NDk1NzUxNXww&ixlib=rb-4.1.0&q=80&w=1080',
    inStock: true,
  },
  {
    id: 3,
    name: 'MSI Gaming GF63 Thin - Gaming giá tốt hiệu năng cao',
    brand: 'MSI',
    price: 18990000,
    originalPrice: 21990000,
    rating: 4.5,
    reviews: 289,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjBzZXR1cHxlbnwxfHx8fDE3NzQ5NTc1MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    inStock: false,
  },
];

const addresses = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    phone: '0123456789',
    address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1',
    city: 'TP. Hồ Chí Minh',
    isDefault: true,
  },
  {
    id: 2,
    name: 'Nguyễn Văn A',
    phone: '0987654321',
    address: '456 Lê Lợi, Phường Bến Thành, Quận 1',
    city: 'TP. Hồ Chí Minh',
    isDefault: false,
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="size-5 text-green-600" />;
      case 'shipping':
        return <Truck className="size-5 text-blue-600" />;
      case 'processing':
        return <Clock className="size-5 text-orange-600" />;
      case 'cancelled':
        return <X className="size-5 text-red-600" />;
      default:
        return <Package className="size-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipping':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
            <span className="text-gray-900">Tài khoản của tôi</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border p-6 sticky top-24">
              {/* User Info */}
              <div className="text-center mb-6 pb-6 border-b">
                <div className="relative inline-block mb-4">
                  <ImageWithFallback
                    src={userData.avatar}
                    alt={userData.name}
                    className="size-24 rounded-full object-cover border-4 border-red-100"
                  />
                  <button className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors">
                    <Camera className="size-4" />
                  </button>
                </div>
                <h2 className="font-bold text-lg mb-1">{userData.name}</h2>
                <p className="text-sm text-gray-600 mb-3">{userData.email}</p>
                <Badge className="bg-yellow-500 hover:bg-yellow-600">
                  {userData.memberLevel} Member
                </Badge>
              </div>

              {/* Menu */}
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-red-50 text-red-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="size-5" />
                  <span>Tổng quan</span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-red-50 text-red-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="size-5" />
                  <span>Thông tin cá nhân</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-red-50 text-red-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Package className="size-5" />
                  <span>Đơn hàng</span>
                  <Badge variant="secondary" className="ml-auto">
                    {orders.length}
                  </Badge>
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'wishlist'
                      ? 'bg-red-50 text-red-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart className="size-5" />
                  <span>Yêu thích</span>
                  <Badge variant="secondary" className="ml-auto">
                    {wishlistItems.length}
                  </Badge>
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'addresses'
                      ? 'bg-red-50 text-red-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MapPin className="size-5" />
                  <span>Địa chỉ</span>
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'password'
                      ? 'bg-red-50 text-red-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Lock className="size-5" />
                  <span>Đổi mật khẩu</span>
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'notifications'
                      ? 'bg-red-50 text-red-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Bell className="size-5" />
                  <span>Thông báo</span>
                </button>
              </nav>

              <Button variant="outline" className="w-full mt-6" asChild>
                <Link to="/">
                  Đăng xuất
                </Link>
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border p-6">
                  <h2 className="text-2xl font-bold mb-6">Xin chào, {userData.name}!</h2>
                  
                  {/* Stats */}
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6 border border-red-100">
                      <div className="flex items-center justify-between mb-3">
                        <Package className="size-10 text-red-600" />
                        <Badge className="bg-red-600">+3 tháng này</Badge>
                      </div>
                      <div className="text-3xl font-bold mb-1">{userData.totalOrders}</div>
                      <div className="text-sm text-gray-600">Tổng đơn hàng</div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-100">
                      <div className="flex items-center justify-between mb-3">
                        <CreditCard className="size-10 text-blue-600" />
                      </div>
                      <div className="text-3xl font-bold mb-1">
                        {(userData.totalSpent / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-sm text-gray-600">Tổng chi tiêu</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100">
                      <div className="flex items-center justify-between mb-3">
                        <Heart className="size-10 text-purple-600" />
                      </div>
                      <div className="text-3xl font-bold mb-1">{wishlistItems.length}</div>
                      <div className="text-sm text-gray-600">Sản phẩm yêu thích</div>
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                          <Star className="size-5 text-yellow-600 fill-yellow-600" />
                          Hạng thành viên: {userData.memberLevel}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Thành viên từ {userData.joinDate}
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="bg-white">
                            Giảm 10% mọi đơn hàng
                          </Badge>
                          <Badge variant="outline" className="bg-white">
                            Miễn phí ship
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <Button size="sm">Xem ưu đãi</Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Đơn hàng gần đây</h3>
                    <Button
                      variant="ghost"
                      onClick={() => setActiveTab('orders')}
                    >
                      Xem tất cả
                      <ChevronRight className="size-4 ml-1" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold">#{order.id}</span>
                            <Badge
                              variant="outline"
                              className={getStatusColor(order.status)}
                            >
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{order.statusText}</span>
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-500">{order.date}</span>
                        </div>

                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 mb-3">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="size-16 object-cover rounded border"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">{item.name}</h4>
                              <p className="text-sm text-gray-600">
                                Số lượng: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-red-600">
                                {item.price.toLocaleString('vi-VN')}₫
                              </p>
                            </div>
                          </div>
                        ))}

                        <div className="flex items-center justify-between pt-3 border-t">
                          <span className="text-sm text-gray-600">Tổng cộng:</span>
                          <span className="font-bold text-lg">
                            {order.total.toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Thông tin cá nhân</h2>
                  <Button
                    variant={editMode ? 'default' : 'outline'}
                    onClick={() => setEditMode(!editMode)}
                  >
                    {editMode ? (
                      <>Lưu thay đổi</>
                    ) : (
                      <>
                        <Edit className="size-4 mr-2" />
                        Chỉnh sửa
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input
                      id="name"
                      defaultValue={userData.name}
                      disabled={!editMode}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        defaultValue={userData.email}
                        disabled={!editMode}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <div className="relative mt-2">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <Input
                        id="phone"
                        defaultValue={userData.phone}
                        disabled={!editMode}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="birthdate">Ngày sinh</Label>
                    <div className="relative mt-2">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <Input
                        id="birthdate"
                        type="date"
                        disabled={!editMode}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input
                      id="address"
                      defaultValue="123 Nguyễn Huệ, Quận 1, TP.HCM"
                      disabled={!editMode}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h2>

                {/* Order Filters */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  <Button variant="default" size="sm" className="bg-red-600 hover:bg-red-700">
                    Tất cả ({orders.length})
                  </Button>
                  <Button variant="outline" size="sm">
                    Đang xử lý (1)
                  </Button>
                  <Button variant="outline" size="sm">
                    Đang giao (1)
                  </Button>
                  <Button variant="outline" size="sm">
                    Đã giao (1)
                  </Button>
                  <Button variant="outline" size="sm">
                    Đã hủy (0)
                  </Button>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4 pb-4 border-b">
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-sm text-gray-600">Mã đơn hàng:</span>
                            <span className="font-semibold ml-2">#{order.id}</span>
                          </div>
                          <Badge
                            variant="outline"
                            className={getStatusColor(order.status)}
                          >
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.statusText}</span>
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">{order.date}</span>
                      </div>

                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 mb-4">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="size-20 object-cover rounded border"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium mb-2">{item.name}</h4>
                            <p className="text-sm text-gray-600">
                              Số lượng: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-red-600 text-lg">
                              {item.price.toLocaleString('vi-VN')}₫
                            </p>
                          </div>
                        </div>
                      ))}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/order/${order.id}`}>
                              <Eye className="size-4 mr-2" />
                              Chi tiết
                            </Link>
                          </Button>
                          {order.status === 'delivered' && (
                            <Button variant="outline" size="sm">
                              <Star className="size-4 mr-2" />
                              Đánh giá
                            </Button>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-600 mr-3">
                            Tổng cộng:
                          </span>
                          <span className="font-bold text-xl">
                            {order.total.toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-2xl font-bold mb-6">
                  Sản phẩm yêu thích ({wishlistItems.length})
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {wishlistItems.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                        />
                        <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                          <Heart className="size-5 text-red-600 fill-red-600" />
                        </button>
                        {!item.inStock && (
                          <Badge className="absolute top-3 left-3 bg-red-500">
                            Hết hàng
                          </Badge>
                        )}
                      </div>
                      <div className="p-4">
                        <Badge variant="outline" className="mb-2">
                          {item.brand}
                        </Badge>
                        <h3 className="font-semibold mb-2 line-clamp-2">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="size-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{item.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            ({item.reviews} đánh giá)
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-xl font-bold text-red-600">
                            {item.price.toLocaleString('vi-VN')}₫
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              {item.originalPrice.toLocaleString('vi-VN')}₫
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            className="flex-1 bg-red-600 hover:bg-red-700"
                            size="sm"
                            disabled={!item.inStock}
                            asChild
                          >
                            <Link to={`/product/${item.id}`}>
                              Xem chi tiết
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Địa chỉ giao hàng</h2>
                  <Button>
                    <Plus className="size-4 mr-2" />
                    Thêm địa chỉ mới
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="border rounded-lg p-6 relative hover:shadow-md transition-shadow"
                    >
                      {addr.isDefault && (
                        <Badge className="absolute top-4 right-4 bg-red-600">
                          Mặc định
                        </Badge>
                      )}
                      <div className="mb-4">
                        <h3 className="font-bold text-lg mb-2">{addr.name}</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <Phone className="size-4" />
                            {addr.phone}
                          </p>
                          <p className="flex items-start gap-2">
                            <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                            <span>
                              {addr.address}
                              <br />
                              {addr.city}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-4 border-t">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="size-4 mr-2" />
                          Sửa
                        </Button>
                        {!addr.isDefault && (
                          <Button variant="outline" size="sm" className="flex-1">
                            <Trash2 className="size-4 mr-2" />
                            Xóa
                          </Button>
                        )}
                      </div>
                      {!addr.isDefault && (
                        <Button variant="ghost" size="sm" className="w-full mt-2">
                          Đặt làm mặc định
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-2xl font-bold mb-6">Đổi mật khẩu</h2>

                <div className="max-w-md space-y-6">
                  <div>
                    <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <Input
                        id="current-password"
                        type="password"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="new-password">Mật khẩu mới</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <Input id="new-password" type="password" className="pl-10" />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Mật khẩu phải có ít nhất 8 ký tự
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type="password"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Cập nhật mật khẩu
                  </Button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-2xl font-bold mb-6">Cài đặt thông báo</h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b">
                    <div>
                      <h3 className="font-semibold mb-1">Thông báo đơn hàng</h3>
                      <p className="text-sm text-gray-600">
                        Nhận thông báo về trạng thái đơn hàng
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>

                  <div className="flex items-center justify-between py-4 border-b">
                    <div>
                      <h3 className="font-semibold mb-1">Khuyến mãi & Ưu đãi</h3>
                      <p className="text-sm text-gray-600">
                        Nhận thông báo về các chương trình khuyến mãi
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>

                  <div className="flex items-center justify-between py-4 border-b">
                    <div>
                      <h3 className="font-semibold mb-1">Sản phẩm mới</h3>
                      <p className="text-sm text-gray-600">
                        Thông báo khi có sản phẩm mới
                      </p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>

                  <div className="flex items-center justify-between py-4 border-b">
                    <div>
                      <h3 className="font-semibold mb-1">Email marketing</h3>
                      <p className="text-sm text-gray-600">
                        Nhận email về tin tức và sản phẩm
                      </p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="font-semibold mb-1">Thông báo SMS</h3>
                      <p className="text-sm text-gray-600">
                        Nhận SMS về đơn hàng và khuyến mãi
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>

                  <Button className="bg-red-600 hover:bg-red-700">
                    Lưu cài đặt
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

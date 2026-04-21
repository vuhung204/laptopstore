import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, Search, Menu, Phone, Package, CreditCard, Tag, Newspaper, ChevronDown, Laptop, LogIn, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
// import menuImage from 'figma:asset/16656dd52d160782af938dcf8b65fdc48efba0ce.png';

const categories = [
  { id: 1, name: 'Laptop văn phòng', icon: Laptop },
  { id: 2, name: 'Laptop Games & Đồ họa', icon: Laptop },
  { id: 3, name: 'Máy Game chuyên nghiệp', icon: Laptop },
  { id: 4, name: 'Sản phẩm clear', icon: Tag },
  { id: 5, name: 'Sản phẩm Apple', icon: Laptop },
  { id: 6, name: 'Máy tính bảng', icon: Laptop },
  { id: 7, name: 'PC đồng bộ', icon: Laptop },
  { id: 8, name: 'PCHM - Máy Tính Lắp Ráp', icon: Laptop },
  { id: 9, name: 'PC Workstation & Server', icon: Laptop },
  { id: 10, name: 'Linh kiện máy tính', icon: Laptop },
  { id: 11, name: 'Màn Hình Máy Tính', icon: Laptop },
  { id: 12, name: 'Gaming Gear', icon: Laptop },
  { id: 13, name: 'Thiết bị văn phòng', icon: Laptop },
  { id: 14, name: 'Thiết bị lưu trữ', icon: Laptop },
  { id: 15, name: 'Phụ kiện laptop', icon: Laptop },
];

const laptopBrands = {
  dell: [
    'Dell 14 Series',
    'Dell 15 Series',
    'Dell 16 Series',
    'Dell Plus Series',
    'Dell Premium Series',
    'Dell Pro Series',
    'Dell Pro Plus Series',
    'Dell Pro Premium Series',
    'Dell Inspiron Series',
    'Dell Vostro Series',
    'Dell Latitude Series',
    'Dell XPS Series',
    'Phụ kiện chính hãng Dell',
  ],
  asus: [
    'Asus Zenbook',
    'Asus Vivobook Flip',
    'Asus Vivobook S, K',
    'Asus Vivobook M',
    'Asus Vivobook A',
    'Asus Vivobook X',
    'Asus Vivobook Go',
  ],
  asusExpert: [
    'Asus ExpertBook B',
    'Asus ExpertBook B3',
    'Asus ExpertBook B5',
    'Asus ExpertBook P1',
    'Asus ExpertBook P3',
    'Asus ExpertBook P5',
  ],
  acer: ['Acer Swift', 'Acer Aspire', 'Aspire Lite'],
  lenovo: ['Lenovo Thinkpad Series'],
  hp: ['HP series'],
  msi: [
    'MSI Prestige 13 Series',
    'MSI Prestige 14 Series',
    'MSI Prestige 16 Series',
    'MSI Venture / VenturePro',
    'MSI Modern 14/15',
  ],
};

export function Header() {
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { userLoggedIn, userFullName, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar - Logo and Search */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="size-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="font-bold text-xl text-red-600">LaptopShop</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm laptop, phụ kiện..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {userLoggedIn ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <div className="size-9 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {userFullName ? userFullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-red-600 font-semibold text-sm max-w-[120px] truncate hidden sm:block">
                      {userFullName}
                    </span>
                    <ChevronDown className={`size-4 text-red-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-2">
                      <Link to="/profile" onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <User className="size-4" /> Trang cá nhân
                      </Link>
                      <Link to="/profile" onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <Package className="size-4" /> Đơn hàng của tôi
                      </Link>
                      <div className="border-t border-gray-100 my-1" />
                      <button onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                        <LogOut className="size-4" /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/register">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-600">
                      Đăng ký
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
                      <LogIn className="size-4" /> Đăng nhập
                    </Button>
                  </Link>
                </div>
              )}

              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="size-5" />
                  <span className="absolute -top-1 -right-1 size-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Red Navigation Bar */}
      <div className="bg-red-600 text-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center">
            {/* Category Menu */}
            <div
              className="relative"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <button className="flex items-center gap-2 px-4 py-3 font-medium hover:bg-red-700 transition-colors">
                <Menu className="size-5" />
                DANH MỤC SẢN PHẨM
                <ChevronDown className="size-4" />
              </button>

              {/* Mega Menu Dropdown */}
              {showMegaMenu && (
                <div className="absolute top-full left-0 w-[980px] bg-white shadow-2xl z-50">
                  <div className="flex">
                    {/* Left Sidebar */}
                    <div className="w-64 bg-gray-50 border-r">
                      {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                          <Link
                            key={category.id}
                            to="/products"
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors text-sm border-b border-gray-200"
                          >
                            <Icon className="size-4" />
                            {category.name}
                          </Link>
                        );
                      })}
                    </div>

                    {/* Right Content - Laptop Brands Grid */}
                    <div className="flex-1 p-6 grid grid-cols-3 gap-6">
                      {/* Dell Column */}
                      <div>
                        <h3 className="font-bold text-red-600 mb-3 pb-2 border-b-2 border-red-600">
                          LAPTOP DELL
                        </h3>
                        <ul className="space-y-2">
                          {laptopBrands.dell.map((item, idx) => (
                            <li key={idx}>
                              <Link
                                to="/products"
                                className="text-sm text-gray-700 hover:text-red-600 transition-colors"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Asus Column */}
                      <div>
                        <h3 className="font-bold text-red-600 mb-3 pb-2 border-b-2 border-red-600">
                          LAPTOP ASUS
                        </h3>
                        <ul className="space-y-2">
                          {laptopBrands.asus.map((item, idx) => (
                            <li key={idx}>
                              <Link
                                to="/products"
                                className="text-sm text-gray-700 hover:text-red-600 transition-colors"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>

                        <h3 className="font-bold text-red-600 mb-3 pb-2 border-b-2 border-red-600 mt-6">
                          LAPTOP ASUS EXPERTBOOK
                        </h3>
                        <ul className="space-y-2">
                          {laptopBrands.asusExpert.map((item, idx) => (
                            <li key={idx}>
                              <Link
                                to="/products"
                                className="text-sm text-gray-700 hover:text-red-600 transition-colors"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>

                        <h3 className="font-bold text-red-600 mb-3 pb-2 border-b-2 border-red-600 mt-6">
                          LAPTOP ACER
                        </h3>
                        <ul className="space-y-2">
                          {laptopBrands.acer.map((item, idx) => (
                            <li key={idx}>
                              <Link
                                to="/products"
                                className="text-sm text-gray-700 hover:text-red-600 transition-colors"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* MSI & Others Column */}
                      <div>
                        <h3 className="font-bold text-red-600 mb-3 pb-2 border-b-2 border-red-600">
                          LAPTOP MSI
                        </h3>
                        <ul className="space-y-2">
                          {laptopBrands.msi.map((item, idx) => (
                            <li key={idx}>
                              <Link
                                to="/products"
                                className="text-sm text-gray-700 hover:text-red-600 transition-colors"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>

                        <h3 className="font-bold text-red-600 mb-3 pb-2 border-b-2 border-red-600 mt-6">
                          LAPTOP LENOVO THINKPAD
                        </h3>
                        <ul className="space-y-2">
                          {laptopBrands.lenovo.map((item, idx) => (
                            <li key={idx}>
                              <Link
                                to="/products"
                                className="text-sm text-gray-700 hover:text-red-600 transition-colors"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>

                        <h3 className="font-bold text-red-600 mb-3 pb-2 border-b-2 border-red-600 mt-6">
                          LAPTOP HP
                        </h3>
                        <ul className="space-y-2">
                          {laptopBrands.hp.map((item, idx) => (
                            <li key={idx}>
                              <Link
                                to="/products"
                                className="text-sm text-gray-700 hover:text-red-600 transition-colors"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Other Menu Items */}
            <Link
              to="#"
              className="flex items-center gap-2 px-4 py-3 hover:bg-red-700 transition-colors"
            >
              <Phone className="size-4" />
              Bán hàng trực tuyến
            </Link>
            <Link
              to="#"
              className="flex items-center gap-2 px-4 py-3 hover:bg-red-700 transition-colors"
            >
              <Package className="size-4" />
              Bán hàng trả góp
            </Link>
            <Link
              to="#"
              className="flex items-center gap-2 px-4 py-3 hover:bg-red-700 transition-colors"
            >
              <Tag className="size-4" />
              Khuyến mại
            </Link>
            <Link
              to="#"
              className="flex items-center gap-2 px-4 py-3 hover:bg-red-700 transition-colors"
            >
              <Newspaper className="size-4" />
              Tin tức
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
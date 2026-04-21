import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, User, Search, Menu, Phone, Package, Tag, Newspaper, ChevronDown, ChevronRight, Laptop, LogIn, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const categories = [
  { id: 1, name: 'Laptop văn phòng', icon: Laptop, hasSubmenu: true },
  { id: 2, name: 'Laptop Games & Đồ họa', icon: Laptop, hasSubmenu: true },
  { id: 3, name: 'Máy Game chuyên nghiệp', icon: Laptop, hasSubmenu: true },
  { id: 4, name: 'Sản phẩm clear', icon: Tag, hasSubmenu: false },
  { id: 5, name: 'Sản phẩm Apple', icon: Laptop, hasSubmenu: true },
  { id: 6, name: 'Máy tính bảng', icon: Laptop, hasSubmenu: false },
  { id: 7, name: 'PC đồng bộ', icon: Laptop, hasSubmenu: false },
  { id: 8, name: 'PCHM - Máy Tính Lắp Ráp', icon: Laptop, hasSubmenu: false },
  { id: 9, name: 'PC Workstation & Server', icon: Laptop, hasSubmenu: false },
  { id: 10, name: 'Linh kiện máy tính', icon: Laptop, hasSubmenu: false },
  { id: 11, name: 'Màn Hình Máy Tính', icon: Laptop, hasSubmenu: false },
  { id: 12, name: 'Gaming Gear', icon: Laptop, hasSubmenu: false },
  { id: 13, name: 'Thiết bị văn phòng', icon: Laptop, hasSubmenu: false },
  { id: 14, name: 'Thiết bị lưu trữ', icon: Laptop, hasSubmenu: false },
  { id: 15, name: 'Phụ kiện laptop', icon: Laptop, hasSubmenu: true },
  { id: 16, name: 'Thiết bị mạng', icon: Laptop, hasSubmenu: false },
];

const submenuData: Record<number, { title: string; items: string[] }[]> = {
  1: [
    { title: 'Laptop Dell', items: ['Dell 14 Series', 'Dell 15 Series', 'Dell 16 Series', 'Dell Plus Series', 'Dell Premium Series', 'Dell Pro Series', 'Dell Pro Plus Series', 'Dell Pro Premium Series', 'Dell Inspiron Series', 'Dell Vostro Series', 'Dell Latitude Series', 'Dell XPS Series', 'Phụ kiện chính hãng Dell'] },
    { title: 'Laptop Asus', items: ['Asus Zenbook', 'Asus Vivobook Flip', 'Asus Vivobook S, K', 'Asus Vivobook M', 'Asus Vivobook A', 'Asus Vivobook X', 'Asus Vivobook Go'] },
    { title: 'Laptop Asus ExpertBook', items: ['Asus ExpertBook B', 'Asus ExpertBook B3', 'Asus ExpertBook B5', 'Asus ExpertBook P1', 'Asus ExpertBook P3', 'Asus ExpertBook P5'] },
    { title: 'Laptop Lenovo ThinkPad', items: ['Lenovo Thinkpad E', 'Lenovo Thinkpad X', 'Lenovo Thinkpad T', 'Lenovo ThinkPad L', 'Lenovo Thinkbook', 'Lenovo Thinkpad P', 'Lenovo V Series', 'Phụ kiện Thinkpad'] },
    { title: 'Laptop HP', items: ['HP series', 'HP Spectre Series', 'HP Pavilion Series', 'HP Probook Series', 'HP Envy Series', 'HP EliteBook Series', 'HP OmniBook Series'] },
    { title: 'Laptop Acer', items: ['Acer Swift', 'Acer Aspire', 'Aspire Lite'] },
    { title: 'Laptop MSI', items: ['MSI Prestige 13 Series', 'MSI Prestige 14 Series', 'MSI Prestige 16 Series', 'MSI Venture / VenturePro', 'MSI Modern 14/15'] },
    { title: 'Laptop Lenovo', items: ['Lenovo Ideapad', 'Lenovo Yoga', 'Lenovo IdeaPad 5 Pro'] },
    { title: 'Laptop LG Gram', items: ['LG Gram'] },
    { title: 'Laptop công nghệ AI', items: ['Intel Ultra 5 (CPU AI)', 'Intel Ultra 7 (CPU AI)', 'Intel Ultra 9 (CPU AI)', 'Ryzen AI 9 (CPU AI)'] },
  ],
  2: [
    { title: 'Laptop Gaming Asus ROG', items: ['ROG Strix G16', 'ROG Strix G18', 'ROG Zephyrus G14', 'ROG Zephyrus M16', 'TUF Gaming A15', 'TUF Gaming F15'] },
    { title: 'Laptop Gaming MSI', items: ['MSI Raider GE78', 'MSI Titan GT77', 'MSI Stealth 16', 'MSI Vector GP76', 'MSI Pulse GL76', 'MSI Katana GF76'] },
    { title: 'Laptop Gaming Lenovo', items: ['Legion Pro 7i', 'Legion 5 Pro', 'Legion 5i', 'LOQ 15', 'IdeaPad Gaming 3'] },
    { title: 'Laptop Gaming Acer', items: ['Predator Helios 300', 'Predator Helios 16', 'Nitro 5', 'Nitro 17', 'Aspire Vero 16'] },
    { title: 'Laptop Gaming HP', items: ['HP Omen 16', 'HP Omen 17', 'HP Victus 15', 'HP Victus 16'] },
  ],
  3: [
    { title: 'Máy Game PC', items: ['Alienware Aurora', 'MSI MEG Trident', 'Asus ROG Strix GA', 'Lenovo Legion Tower'] },
  ],
  5: [
    { title: 'MacBook', items: ['MacBook Air M2', 'MacBook Air M3', 'MacBook Pro 14" M3', 'MacBook Pro 16" M3', 'MacBook Pro M3 Max'] },
    { title: 'iPad', items: ['iPad Pro M4', 'iPad Air M2', 'iPad mini 6', 'iPad Gen 10'] },
  ],
  15: [
    { title: 'Phụ kiện Laptop', items: ['Túi laptop', 'Balo laptop', 'Chuột không dây', 'Bàn phím bluetooth', 'Hub USB-C', 'Đế tản nhiệt', 'Màn hình di động'] },
  ],
};

export function Header() {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { userLoggedIn, userFullName, logout } = useAuth();

  // Đóng category menu khi click ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowCategoryMenu(false);
        setHoveredCategory(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Đóng user menu khi click ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const activeSubmenu = hoveredCategory ? submenuData[hoveredCategory] : null;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="size-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="font-bold text-xl text-red-600">Laptop Store</span>
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
              {/* User: đã đăng nhập */}
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
                /* User: chưa đăng nhập */
                <div className="flex items-center gap-2">
                  <Link to="/register">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-600">
                      Đăng ký
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
                      <LogIn className="size-4" />
                      Đăng nhập
                    </Button>
                  </Link>
                </div>
              )}

              {/* Giỏ hàng */}
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

            {/* Category Menu Button */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => {
                  setShowCategoryMenu(!showCategoryMenu);
                  setHoveredCategory(null);
                }}
                className="flex items-center gap-2 px-4 py-3 font-bold hover:bg-red-800 transition-colors bg-red-700"
              >
                <Menu className="size-5" />
                DANH MỤC SẢN PHẨM
                <ChevronDown className={`size-4 transition-transform duration-200 ${showCategoryMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {showCategoryMenu && (
                <div
                  className="absolute top-full left-0 z-50 shadow-2xl border-t-2 border-red-600 flex bg-white"
                  style={{ minWidth: activeSubmenu ? '960px' : '240px' }}
                >
                  {/* Left: Category List */}
                  <div className="w-60 bg-white border-r border-gray-200 flex-shrink-0">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      const isHovered = hoveredCategory === category.id;
                      return (
                        <div
                          key={category.id}
                          className={`flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm transition-all border-b border-gray-100
                            ${isHovered
                              ? 'bg-red-50 text-red-600 border-l-4 border-l-red-600'
                              : 'text-gray-700 hover:bg-red-50 hover:text-red-600 border-l-4 border-l-transparent'
                            }`}
                          onMouseEnter={() => setHoveredCategory(category.hasSubmenu ? category.id : null)}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="size-4 flex-shrink-0" />
                            <span>{category.name}</span>
                          </div>
                          {category.hasSubmenu && (
                            <ChevronRight className="size-4 flex-shrink-0 text-gray-400" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Right: Submenu Panel */}
                  {activeSubmenu && (
                    <div className="flex-1 p-6 bg-white overflow-y-auto max-h-[480px]">
                      <div className="grid grid-cols-5 gap-5">
                        {activeSubmenu.map((group, idx) => (
                          <div key={idx}>
                            <h3 className="font-bold text-red-600 text-sm mb-3 pb-1 border-b border-red-200">
                              {group.title}
                            </h3>
                            <ul className="space-y-1.5">
                              {group.items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <Link
                                    to="/products"
                                    className="text-xs text-gray-700 hover:text-red-600 transition-colors block py-0.5"
                                    onClick={() => setShowCategoryMenu(false)}
                                  >
                                    {item}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Nav Links */}
            <Link to="#" className="flex items-center gap-2 px-4 py-3 hover:bg-red-700 transition-colors text-sm">
              <Phone className="size-4" />
              Bán hàng trực tuyến
            </Link>
            <Link to="#" className="flex items-center gap-2 px-4 py-3 hover:bg-red-700 transition-colors text-sm">
              <Package className="size-4" />
              Bán hàng trả góp
            </Link>
            <Link to="#" className="flex items-center gap-2 px-4 py-3 hover:bg-red-700 transition-colors text-sm">
              <Tag className="size-4" />
              Khuyến mại
            </Link>
            <Link to="#" className="flex items-center gap-2 px-4 py-3 hover:bg-red-700 transition-colors text-sm">
              <Newspaper className="size-4" />
              Tin tức
            </Link>
            <div className="ml-auto flex items-center bg-yellow-400 text-black font-bold px-4 py-2 text-sm">
              🔥 DEAL GIÁ SỐC
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
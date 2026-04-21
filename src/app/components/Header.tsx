import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, User, Search, Menu, Phone, Package, Tag, Newspaper, ChevronDown, ChevronRight, Laptop } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Link, useNavigate } from 'react-router';
import menuImage from 'figma:asset/16656dd52d160782af938dcf8b65fdc48efba0ce.png';

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
  lenovoThinkpad: [
    'Lenovo Thinkpad E Series',
    'Lenovo Thinkpad X Series',
    'Lenovo Thinkpad T Series',
    'Lenovo ThinkPad L Series',
    'Lenovo Thinkbook',
    'Lenovo Thinkpad P Series',
    'Lenovo V Series',
    'Phụ kiện Thinkpad',
  ],
  hp: [
    'HP series',
    'HP Spectre Series',
    'HP Pavilion Series',
    'HP Probook Series',
    'HP Envy Series',
    'HP EliteBook Series',
    'HP OmniBook Series',
  ],
  acer: ['Acer Swift', 'Acer Aspire', 'Aspire Lite'],
  msi: [
    'MSI Prestige 13 Series',
    'MSI Prestige 14 Series',
    'MSI Prestige 16 Series',
    'MSI Venture / VenturePro',
    'MSI Modern 14/15',
  ],
  lenovo: [
    'Lenovo Ideapad',
    'Lenovo Yoga',
    'Lenovo IdeaPad 5 Pro',
  ],
  lgGram: ['LG Gram'],
  aiLaptop: [
    'Intel Ultra 5 (CPU AI)',
    'Intel Ultra 7 (CPU AI)',
    'Intel Ultra 9 (CPU AI)',
    'Ryzen AI 9 (CPU AI)',
  ],
};

export function Header() {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setShowCategoryMenu(false);
        setHoveredCategory(null);
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
              <Link to="/profile">
                <Button variant="ghost" size="icon">
                  <User className="size-5" />
                </Button>
              </Link>
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
              ref={categoryMenuRef}
            >
              <button
                className="flex items-center gap-2 px-4 py-3 font-medium hover:bg-red-700 transition-colors"
                onClick={() => { setShowCategoryMenu(!showCategoryMenu); setHoveredCategory(null); }}
              >
                <Menu className="size-5" />
                DANH MỤC SẢN PHẨM
                <ChevronDown className="size-4" />
              </button>

              {/* Category Dropdown */}
              {showCategoryMenu && (
                <div
                  className="absolute top-full left-0 w-[900px] bg-white shadow-2xl z-50 border-t-4 border-red-600 flex"
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {/* Left Sidebar - category list */}
                  <div className="w-56 bg-white border-r">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      const isHovered = hoveredCategory === category.id;
                      return (
                        <div
                          key={category.id}
                          className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors text-sm border-b border-gray-100 ${isHovered ? 'bg-red-50 text-red-600 border-l-4 border-l-red-600' : 'text-gray-700 hover:bg-red-50 hover:text-red-600'}`}
                          onMouseEnter={() => setHoveredCategory(category.id)}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="size-4" />
                            {category.name}
                          </div>
                          <ChevronRight className="size-3" />
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Panel - brands submenu (shown for id=1 and id=2) */}
                  {(hoveredCategory === 1 || hoveredCategory === 2) && (
                    <div className="flex-1 p-6 overflow-y-auto max-h-[480px]">
                      <div className="grid grid-cols-5 gap-4">
                        {/* Row 1 */}
                        <div>
                          <h3 className="font-bold text-red-600 mb-2 pb-1 border-b-2 border-red-600 text-sm">LAPTOP DELL</h3>
                          <ul className="space-y-1">
                            {laptopBrands.dell.map((item, idx) => (
                              <li key={idx}>
                                <Link to="/products" className="text-xs text-gray-700 hover:text-red-600 transition-colors block">
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-bold text-red-600 mb-2 pb-1 border-b-2 border-red-600 text-sm">LAPTOP ASUS</h3>
                          <ul className="space-y-1">
                            {laptopBrands.asus.map((item, idx) => (
                              <li key={idx}>
                                <Link to="/products" className="text-xs text-gray-700 hover:text-red-600 transition-colors block">
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-bold text-red-600 mb-2 pb-1 border-b-2 border-red-600 text-sm">ASUS EXPERTBOOK</h3>
                          <ul className="space-y-1">
                            {laptopBrands.asusExpert.map((item, idx) => (
                              <li key={idx}>
                                <Link to="/products" className="text-xs text-gray-700 hover:text-red-600 transition-colors block">
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-bold text-red-600 mb-2 pb-1 border-b-2 border-red-600 text-sm">LENOVO THINKPAD</h3>
                          <ul className="space-y-1">
                            {laptopBrands.lenovoThinkpad.map((item, idx) => (
                              <li key={idx}>
                                <Link to="/products" className="text-xs text-gray-700 hover:text-red-600 transition-colors block">
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-bold text-red-600 mb-2 pb-1 border-b-2 border-red-600 text-sm">LAPTOP HP</h3>
                          <ul className="space-y-1">
                            {laptopBrands.hp.map((item, idx) => (
                              <li key={idx}>
                                <Link to="/products" className="text-xs text-gray-700 hover:text-red-600 transition-colors block">
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* Row 2 */}
                        <div className="mt-4">
                          <h3 className="font-bold text-red-600 mb-2 pb-1 border-b-2 border-red-600 text-sm">LAPTOP ACER</h3>
                          <ul className="space-y-1">
                            {laptopBrands.acer.map((item, idx) => (
                              <li key={idx}>
                                <Link to="/products" className="text-xs text-gray-700 hover:text-red-600 transition-colors block">
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-4">
                          <h3 className="font-bold text-red-600 mb-2 pb-1 border-b-2 border-red-600 text-sm">LAPTOP MSI</h3>
                          <ul className="space-y-1">
                            {laptopBrands.msi.map((item, idx) => (
                              <li key={idx}>
                                <Link to="/products" className="text-xs text-gray-700 hover:text-red-600 transition-colors block">
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-4">
                          <h3 className="font-bold text-red-600 mb-2 pb-1 border-b-2 border-red-600 text-sm">LAPTOP LENOVO</h3>
                          <ul className="space-y-1">
                            {laptopBrands.lenovo.map((item, idx) => (
                              <li key={idx}>
                                <Link to="/products" className="text-xs text-gray-700 hover:text-red-600 transition-colors block">
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-4">
                          <h3 className="font-bold text-red-600 mb-2 pb-1 border-b-2 border-red-600 text-sm">LG GRAM</h3>
                          <ul className="space-y-1">
                            {laptopBrands.lgGram.map((item, idx) => (
                              <li key={idx}>
                                <Link to="/products" className="text-xs text-gray-700 hover:text-red-600 transition-colors block">
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-4">
                          <h3 className="font-bold text-red-600 mb-2 pb-1 border-b-2 border-red-600 text-sm">LAPTOP CÔNG NGHỆ AI</h3>
                          <ul className="space-y-1">
                            {laptopBrands.aiLaptop.map((item, idx) => (
                              <li key={idx}>
                                <Link to="/products" className="text-xs text-gray-700 hover:text-red-600 transition-colors block">
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
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
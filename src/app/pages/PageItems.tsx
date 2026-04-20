import { useState } from 'react';
import { Header } from '../components/Header';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProductCard } from '../components/ProductCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';

const laptops = [
  {
    id: 1,
    name: 'Dell XPS 13 Plus - Laptop siêu mỏng nhẹ cho doanh nhân',
    brand: 'Dell',
    price: 32990000,
    originalPrice: 38990000,
    rating: 4.8,
    reviews: 245,
    image: 'https://images.unsplash.com/photo-1759668358660-0d06064f0f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NzQ4ODczMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    specs: {
      cpu: 'Intel Core i7-1360P',
      ram: '16GB',
      storage: '512GB SSD',
      display: '13.4" FHD+',
    },
    badge: 'Giảm 15%',
  },
  {
    id: 2,
    name: 'MSI Gaming GE76 Raider - Laptop gaming cao cấp RTX 4080',
    brand: 'MSI',
    price: 54990000,
    originalPrice: 62990000,
    rating: 4.9,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1632603093711-0d93a0bcc6cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjByZ2J8ZW58MXx8fHwxNzc0ODYyODQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    specs: {
      cpu: 'Intel Core i9-13980HX',
      ram: '32GB',
      storage: '1TB SSD',
      display: '17.3" QHD 240Hz',
    },
    badge: 'Hot',
  },
  {
    id: 3,
    name: 'MacBook Air M2 - Mỏng nhẹ đỉnh cao cho sáng tạo',
    brand: 'Apple',
    price: 28990000,
    originalPrice: 32990000,
    rating: 4.9,
    reviews: 567,
    image: 'https://images.unsplash.com/photo-1532198528077-0d9e4ca9bb40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNib29rJTIwbGFwdG9wJTIwZGVza3xlbnwxfHx8fDE3NzQ5NTM2ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    specs: {
      cpu: 'Apple M2 8-core',
      ram: '16GB',
      storage: '512GB SSD',
      display: '13.6" Liquid Retina',
    },
  },
  {
    id: 4,
    name: 'HP EliteBook 840 G9 - Laptop doanh nghiệp bảo mật cao',
    brand: 'HP',
    price: 25990000,
    originalPrice: 29990000,
    rating: 4.7,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1762341119317-fb5417c18407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGxhcHRvcCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzQ5NTc1MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    specs: {
      cpu: 'Intel Core i5-1235U',
      ram: '8GB',
      storage: '256GB SSD',
      display: '14" FHD IPS',
    },
    badge: 'Bán chạy',
  },
  {
    id: 5,
    name: 'Asus ZenBook 14 OLED - Màn hình OLED tuyệt đẹp',
    brand: 'Asus',
    price: 21990000,
    originalPrice: 24990000,
    rating: 4.6,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1754928864131-21917af96dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bHRyYWJvb2slMjB0aGluJTIwbGFwdG9wfGVufDF8fHx8MTc3NDg3NDI0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    specs: {
      cpu: 'Intel Core i7-1165G7',
      ram: '16GB',
      storage: '512GB SSD',
      display: '14" OLED 2.8K',
    },
  },
  {
    id: 6,
    name: 'Lenovo ThinkPad X1 Carbon Gen 11 - Bền bỉ đa nhiệm',
    brand: 'Lenovo',
    price: 35990000,
    rating: 4.8,
    reviews: 198,
    image: 'https://images.unsplash.com/photo-1589913649361-56d3f8762bc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3Jrc3RhdGlvbiUyMGxhcHRvcCUyMHBvd2VyZnVsfGVufDF8fHx8MTc3NDk1NzUxNXww&ixlib=rb-4.1.0&q=80&w=1080',
    specs: {
      cpu: 'Intel Core i7-1355U',
      ram: '16GB',
      storage: '1TB SSD',
      display: '14" WUXGA IPS',
    },
  },
  {
    id: 7,
    name: 'Acer Aspire 5 - Laptop học tập văn phòng giá rẻ',
    brand: 'Acer',
    price: 12990000,
    originalPrice: 14990000,
    rating: 4.4,
    reviews: 412,
    image: 'https://images.unsplash.com/photo-1759668358660-0d06064f0f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NzQ4ODczMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    specs: {
      cpu: 'Intel Core i5-1235U',
      ram: '8GB',
      storage: '512GB SSD',
      display: '15.6" FHD IPS',
    },
    badge: 'Giá tốt',
  },
  {
    id: 8,
    name: 'Dell Inspiron 16 Plus - Màn hình lớn cho đồ họa',
    brand: 'Dell',
    price: 27990000,
    rating: 4.7,
    reviews: 178,
    image: 'https://images.unsplash.com/photo-1632603093711-0d93a0bcc6cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjByZ2J8ZW58MXx8fHwxNzc0ODYyODQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    specs: {
      cpu: 'Intel Core i7-12700H',
      ram: '16GB',
      storage: '512GB SSD',
      display: '16" QHD+',
    },
  },
  {
    id: 9,
    name: 'HP Pavilion Gaming 15 - Gaming phổ thông giá tốt',
    brand: 'HP',
    price: 18990000,
    originalPrice: 22990000,
    rating: 4.5,
    reviews: 289,
    image: 'https://images.unsplash.com/photo-1754928864131-21917af96dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bHRyYWJvb2slMjB0aGluJTIwbGFwdG9wfGVufDF8fHx8MTc3NDg3NDI0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    specs: {
      cpu: 'AMD Ryzen 5 5600H',
      ram: '8GB',
      storage: '512GB SSD',
      display: '15.6" FHD 144Hz',
    },
    badge: 'Giảm giá',
  },
];

export default function PageItems() {
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(laptops.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLaptops = laptops.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <FilterSidebar />
        
        <main className="flex-1 p-6">
          {/* Top Bar */}
          <div className="bg-white rounded-lg p-4 mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold mb-1">Tất cả sản phẩm</h1>
              <p className="text-sm text-gray-500">
                Hiển thị {startIndex + 1}-{Math.min(endIndex, laptops.length)} của {laptops.length} sản phẩm
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sắp xếp:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Phổ biến nhất</SelectItem>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                    <SelectItem value="price-asc">Giá tăng dần</SelectItem>
                    <SelectItem value="price-desc">Giá giảm dần</SelectItem>
                    <SelectItem value="rating">Đánh giá cao</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-1 border rounded-lg p-1">
                <Button variant="ghost" size="icon" className="size-8">
                  <LayoutGrid className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8">
                  <List className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentLaptops.map((laptop) => (
              <ProductCard key={laptop.id} {...laptop} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="size-4" />
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="icon"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}

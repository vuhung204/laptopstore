export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
          
          {/* Về chúng tôi */}
          <div>
            <h4 className="font-bold text-base mb-4 text-white">Về chúng tôi</h4>
            <ul className="space-y-2 text-sm text-gray-400 mb-4">
              <li><a href="#" className="hover:text-white transition-colors">Giới thiệu Laptop World</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tuyển dụng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
            </ul>
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-3">
              <a href="#" title="Facebook" className="size-8 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors text-sm">f</a>
              <a href="#" title="Twitter" className="size-8 bg-gray-700 hover:bg-sky-500 rounded-full flex items-center justify-center transition-colors text-sm">𝕏</a>
              <a href="#" title="Instagram" className="size-8 bg-gray-700 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors text-sm">📷</a>
              <a href="#" title="YouTube" className="size-8 bg-gray-700 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors text-sm">▶</a>
            </div>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div>
            <h4 className="font-bold text-base mb-4 text-white">Hỗ trợ khách hàng</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Trung tâm hỗ trợ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hướng dẫn mua hàng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo hành</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Chính sách */}
          <div>
            <h4 className="font-bold text-base mb-4 text-white">Chính sách</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách thanh toán</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách vận chuyển</a></li>
            </ul>
          </div>

          {/* Thanh toán */}
          <div>
            <h4 className="font-bold text-base mb-4 text-white">Thanh toán</h4>
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-2 bg-gray-800 text-gray-300 text-xs px-3 py-2 rounded-md">💳 Thẻ tín dụng</span>
              <span className="inline-flex items-center gap-2 bg-gray-800 text-gray-300 text-xs px-3 py-2 rounded-md">📱 Ví điện tử</span>
              <span className="inline-flex items-center gap-2 bg-gray-800 text-gray-300 text-xs px-3 py-2 rounded-md">🏦 Chuyển khoản</span>
              <span className="inline-flex items-center gap-2 bg-gray-800 text-gray-300 text-xs px-3 py-2 rounded-md">🎁 Trả góp</span>
            </div>
          </div>

          {/* Chứng chỉ */}
          <div>
            <h4 className="font-bold text-base mb-4 text-white">Chứng chỉ</h4>
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-2 bg-green-900 text-green-300 text-xs px-3 py-2 rounded-md border border-green-700">✓ Hàng chính hãng 100%</span>
              <span className="inline-flex items-center gap-2 bg-green-900 text-green-300 text-xs px-3 py-2 rounded-md border border-green-700">✓ Bảo hành chính thức</span>
              <span className="inline-flex items-center gap-2 bg-green-900 text-green-300 text-xs px-3 py-2 rounded-md border border-green-700">✓ Giao hàng nhanh</span>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          <p>© 2026 Laptop World. Tất cả quyền được bảo lưu. | Địa chỉ: 123 Nguyễn Văn A, TP. HCM</p>
        </div>
      </div>
    </footer>
  );
}
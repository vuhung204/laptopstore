import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Link } from 'react-router';

interface ProductCardProps {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  specs: {
    cpu: string;
    ram: string;
    storage: string;
    display: string;
  };
  badge?: string;
}

export function ProductCard({
  id,
  name,
  brand,
  price,
  originalPrice,
  rating,
  reviews,
  image,
  specs,
  badge,
}: ProductCardProps) {
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg border hover:shadow-lg transition-shadow group">
      {/* Image Container */}
      <div className="relative p-4">
        {badge && (
          <Badge className="absolute top-6 left-6 bg-red-500 hover:bg-red-600 z-10">
            {badge}
          </Badge>
        )}
        <button className="absolute top-6 right-6 size-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-gray-50 z-10">
          <Heart className="size-4" />
        </button>
        <Link to={`/product/${id}`}>
          <ImageWithFallback
            src={image}
            alt={name}
            className="w-full h-48 object-cover rounded-md"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="p-4 pt-0">
        {/* Brand & Rating */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">{brand}</span>
          <div className="flex items-center gap-1">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-sm text-gray-500">({reviews})</span>
          </div>
        </div>

        {/* Name */}
        <Link to={`/product/${id}`}>
          <h3 className="font-medium text-sm mb-3 line-clamp-2 min-h-[40px] hover:text-red-600">
            {name}
          </h3>
        </Link>

        {/* Specs */}
        <div className="space-y-1 mb-3 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span>CPU:</span>
            <span className="font-medium text-gray-900">{specs.cpu}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>RAM:</span>
            <span className="font-medium text-gray-900">{specs.ram}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Ổ cứng:</span>
            <span className="font-medium text-gray-900">{specs.storage}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Màn hình:</span>
            <span className="font-medium text-gray-900">{specs.display}</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-red-600 font-bold text-lg">
              {price.toLocaleString('vi-VN')}₫
            </span>
            {originalPrice && (
              <>
                <span className="text-gray-400 line-through text-sm">
                  {originalPrice.toLocaleString('vi-VN')}₫
                </span>
                <Badge variant="outline" className="text-red-600 border-red-600">
                  -{discount}%
                </Badge>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button className="flex-1 bg-red-600 hover:bg-red-700" size="sm">
            <ShoppingCart className="size-4 mr-2" />
            Thêm vào giỏ
          </Button>
          <Link to={`/product/${id}`}>
            <Button variant="outline" size="sm">
              Xem chi tiết
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
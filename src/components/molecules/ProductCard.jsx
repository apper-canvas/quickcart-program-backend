import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const ProductCard = ({ product, onAddToCart, className }) => {
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onAddToCart) {
      onAddToCart(product);
      toast.success(`${product.name} added to cart!`);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const isLowStock = product.stock < 10;
  const isOutOfStock = product.stock === 0;

  return (
    <Link to={`/product/${product.Id}`} className="block">
      <Card 
        hover 
        className={cn(
          "group overflow-hidden transition-all duration-300",
          className
        )}
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="error" size="lg">Out of Stock</Badge>
            </div>
          )}
          
          {!isOutOfStock && (
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-elevated"
            >
              <ApperIcon name="Plus" size={16} />
            </Button>
          )}

          {isLowStock && !isOutOfStock && (
            <Badge variant="warning" size="sm" className="absolute top-3 left-3">
              Only {product.stock} left
            </Badge>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-display font-semibold text-primary line-clamp-2 group-hover:text-accent transition-colors duration-200">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary font-display">
                {formatPrice(product.price)}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <ApperIcon name="Star" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{product.reviews} reviews</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;
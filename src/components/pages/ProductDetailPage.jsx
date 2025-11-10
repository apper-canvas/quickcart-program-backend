import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";
import { cartService } from "@/services/api/cartService";
import { toast } from "react-toastify";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setError("");
      setLoading(true);
      const productData = await productService.getById(id);
      setProduct(productData);
      setSelectedImage(0);
    } catch (err) {
      setError(err.message || "Product not found");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await cartService.addItem(product, quantity);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error("Failed to add item to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      await cartService.addItem(product, quantity);
      navigate("/cart");
    } catch (err) {
      toast.error("Failed to add item to cart");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !product) {
    return (
      <ErrorView 
        message={error || "Product not found"} 
        onRetry={loadProduct}
      />
    );
  }

  const isLowStock = product.stock < 10;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 hover:bg-white/80"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            Back to Products
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-elevated overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200",
                        selectedImage === index 
                          ? "border-accent shadow-soft" 
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" size="sm">
                    {product.category}
                  </Badge>
                  {isLowStock && !isOutOfStock && (
                    <Badge variant="warning" size="sm">
                      Only {product.stock} left
                    </Badge>
                  )}
                  {isOutOfStock && (
                    <Badge variant="error" size="sm">
                      Out of Stock
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-bold font-display text-primary">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <ApperIcon 
                        key={i}
                        name="Star" 
                        className={cn(
                          "w-5 h-5",
                          i < Math.floor(product.rating) 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-gray-300"
                        )} 
                      />
                    ))}
                    <span className="font-medium text-primary ml-1">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">
                    {product.reviews} reviews
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-4xl font-bold text-primary font-display">
                  {formatPrice(product.price)}
                </p>
                <p className="text-sm text-gray-600">
                  Free shipping on orders over $50
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-primary">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <label className="font-medium text-primary">Quantity:</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 p-0"
                    >
                      <ApperIcon name="Minus" size={14} />
                    </Button>
                    
                    <span className="w-12 text-center font-medium text-lg">
                      {quantity}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="w-8 h-8 p-0"
                    >
                      <ApperIcon name="Plus" size={14} />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || addingToCart}
                    className="flex-1 bg-gradient-to-r from-accent to-red-500 hover:brightness-110"
                  >
                    {addingToCart ? (
                      <>
                        <ApperIcon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="ShoppingCart" className="w-5 h-5 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="flex-1 border-2 border-accent text-accent hover:bg-accent hover:text-white"
                  >
                    <ApperIcon name="Zap" className="w-5 h-5 mr-2" />
                    Buy Now
                  </Button>
                </div>

                {isOutOfStock && (
                  <p className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                    This item is currently out of stock
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
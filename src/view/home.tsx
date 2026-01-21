import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight, Plus, Star, ShoppingBag, } from 'lucide-react';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import { useCart } from '../api/CartContext';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  discountPercentage: number;
  rating: number;
  image: string;
  description?: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showNotification, setShowNotification] = useState(false);
  const [addedProductName, setAddedProductName] = useState('');

  const products: Product[] = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      category: 'Smartphones',
      price: '$1099',
      discountPercentage: 12.96,
      rating: 4.69,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2070&auto=format&fit=crop',
      description: 'Le smartphone ultime avec triple caméra et puce A17 Pro'
    },
    {
      id: 2,
      name: 'MacBook Air M3',
      category: 'Laptops',
      price: '$1299',
      discountPercentage: 8.94,
      rating: 4.88,
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1974&auto=format&fit=crop',
      description: 'Ultra-mince et puissant avec autonomie exceptionnelle'
    },
    {
      id: 3,
      name: 'Sony WH-1000XM5',
      category: 'Audio',
      price: '$399',
      discountPercentage: 15.0,
      rating: 4.75,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
      description: 'Réduction de bruit exceptionnelle et son haute-fidélité'
    },
    {
      id: 4,
      name: 'Apple Watch Ultra 2',
      category: 'Wearables',
      price: '$799',
      discountPercentage: 10.0,
      rating: 4.65,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964&auto=format&fit=crop',
      description: 'Montre connectée robuste pour les aventuriers'
    }
  ];

 

  // Carousel slides spécifiques au e-commerce
  const slides = [
    {
      id: 1,
      title: "L'Excellence à Votre Portée",
      subtitle: "Découvrez des produits haut de gamme aux prix les plus compétitifs",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop",
      color: "bg-gradient-to-r from-blue-600/80 via-blue-700/70 to-indigo-800/60",
      buttonText: "Explorer la collection",
      
    },
    {
      id: 2,
      title: "Économisez Jusqu'à 50%",
      subtitle: "Profitez de promotions exclusives sur nos meilleures ventes",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop",
      color: "bg-gradient-to-r from-indigo-600/80 via-purple-700/70 to-violet-800/60",
      buttonText: "Voir les offres",
      badge: "🔥 Promotions Flash"
    },
    {
      id: 3,
      title: "Les Marques les Plus Prestigieuses",
      subtitle: "Apple, Samsung, Sony, Bose et bien d'autres à découvrir",
      image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=2070&auto=format&fit=crop",
      color: "bg-gradient-to-r from-cyan-600/80 via-blue-700/70 to-blue-900/60",
      buttonText: "Découvrir les marques",
      badge: "🏆 Élu Meilleur Shop 2026"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-play for carousel
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 700);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Empêche la navigation vers le détail
    
    const productToAdd = {
      id: product.id,
      title: product.name,
      price: parseFloat(product.price.replace('$', '')),
      thumbnail: product.image,
      quantity: 1
    };
    
    addToCart(productToAdd, 1);
    
    // Afficher la notification
    setAddedProductName(product.name);
    setShowNotification(true);
    
    // Masquer la notification après 3 secondes
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const calculateOriginalPrice = (price: string, discount: number): string => {
    const numericPrice = parseFloat(price.replace('$', ''));
    const originalPrice = numericPrice / (1 - discount/100);
    return `$${originalPrice.toFixed(0)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Notification d'ajout au panier */}
      {showNotification && (
        <div className="fixed top-24 right-6 z-50 bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 shadow-lg transform transition-all duration-300 animate-fade-in max-w-md">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="font-medium block mb-1">
                {addedProductName}
              </span>
              <span className="text-sm text-green-700">
                Produit ajouté au panier avec succès
              </span>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              className="text-green-500 hover:text-green-700 ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <main className="flex-grow">
        {/* Hero Carousel Section */}
        <section className="relative overflow-hidden">
          <div className="relative w-full h-[600px] md:h-[700px] lg:h-[750px]">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentSlide 
                    ? 'opacity-100 translate-x-0 z-10' 
                    : index < currentSlide
                    ? 'opacity-0 -translate-x-full z-0'
                    : 'opacity-0 translate-x-full z-0'
                }`}
              >
                {/* Background Image with parallax effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <img 
                    src={slide.image} 
                    alt={slide.title}
                    className="w-full h-full object-cover scale-105 transform transition-transform duration-10000 ease-linear"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 ${slide.color}`} />
                  
                  {/* Effet de particules lumineuses */}
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${1 + Math.random() * 2}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Content avec animation */}
                <div className="relative h-full flex items-center z-20">
                  <div className="container mx-auto px-6 md:px-12 lg:px-24">
                    <div className="max-w-2xl">
                      {slide.badge && (
                        <div className="mb-6 animate-fadeInUp">
                          <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-lg text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
                            {slide.badge}
                          </span>
                        </div>
                      )}
                      
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white animate-fadeInUp animation-delay-100">
                        {slide.title}
                      </h1>
                      
                      <p className="text-xl md:text-2xl text-blue-100/90 mb-10 leading-relaxed max-w-xl animate-fadeInUp animation-delay-200">
                        {slide.subtitle}
                      </p>
                      
                      <div className="animate-fadeInUp animation-delay-300">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Link
                            to="/products"
                            className="inline-flex items-center justify-center bg-white text-blue-600 hover:text-blue-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 shadow-xl hover:shadow-2xl text-lg group min-w-[220px]"
                          >
                            <ShoppingBag className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                            {slide.buttonText}
                          </Link>
                          
                          <Link
                            to="/products?category=promotions"
                            className="inline-flex items-center justify-center bg-transparent border-2 border-white/40 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-bold transition-all duration-300 text-lg group min-w-[220px]"
                          >
                            <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            Voir les promotions
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 z-30 border border-white/20 shadow-lg group"
              aria-label="Slide précédent"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 z-30 border border-white/20 shadow-lg group"
              aria-label="Slide suivant"
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Indicators modernes */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className="group"
                  aria-label={`Aller au slide ${index + 1}`}
                >
                  <div className="relative">
                    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'bg-white scale-125'
                        : 'bg-white/50 group-hover:bg-white/80'
                    }`} />
                    {index === currentSlide && (
                      <div className="absolute inset-0 -m-1 border-2 border-white/30 rounded-full animate-ping" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <div className="relative -mt-16 md:-mt-20 z-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <div>
                <div className="flex items-center gap-3 mb-2 mt-10">
                  <div className="w-3 h-8 bg-blue-600 rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Produits Tendances
                  </h2>
                </div>
                <p className="text-gray-600">Les produits les plus appréciés par nos clients</p>
              </div>
              <div>
                <Link
                  to="/products"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group transition-colors duration-300"
                >
                  Voir la collection
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => handleProductClick(product.id)}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2 cursor-pointer relative"
                >
                  <div className="h-64 overflow-hidden bg-white relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/400x300/3b82f6/ffffff?text=${encodeURIComponent(product.name)}`;
                        e.currentTarget.className = 'w-full h-full object-cover';
                      }}
                    />
                    
                    {/* Discount badge */}
                    {product.discountPercentage > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                        -{product.discountPercentage}%
                      </div>
                    )}
                    
                    {/* Rating badge */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center transform group-hover:scale-110 transition-transform duration-300">
                      <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                      {product.rating}
                    </div>
                    
                    {/* Overlay au survol */}
                    <div className="absolute inset-0 bg--black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                        {product.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">
                          {product.price}
                        </span>
                        {product.discountPercentage > 0 && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            {calculateOriginalPrice(product.price, product.discountPercentage)}
                          </span>
                        )}
                      </div>
                    {/* context */}
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-90 shadow-md"
                        aria-label={`Ajouter ${product.name} au panier`}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Ribbon de vente rapide */}
                  <div className="absolute top-0 right-0 w-24 h-8 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 bg-blue-600 text-white text-xs font-bold py-1 text-center transform rotate-45 translate-x-8 -translate-y-1">
                      Vente rapide
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Banner Promo */}
        <section className="py-12 bg-blue-600">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  🎉 Offre Spéciale : Livraison Gratuite
                </h3>
                <p className="text-blue-100">
                  Pour toute commande supérieure à $50. Offre valable aujourd'hui seulement !
                </p>
              </div>
              <Link
                to="/products"
                className="bg-white text-blue-600 hover:text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                Profiter de l'offre
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Pourquoi Nous Choisir ?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Nous nous engageons à vous offrir la meilleure expérience d'achat en ligne
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  ),
                  title: 'Recherche Intelligente',
                  description: "Trouvez exactement ce que vous cherchez en quelques clics grâce à notre moteur de recherche avancé"
                },
                {
                  icon: (
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  ),
                  title: 'Large Sélection',
                  description: "Des milliers de produits de grandes marques, constamment mis à jour avec les dernières nouveautés"
                },
                {
                  icon: (
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ),
                  title: 'Avis Vérifiés',
                  description: "Prenez des décisions éclairées grâce aux avis authentiques de nos clients satisfaits"
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group hover:from-blue-100 hover:to-blue-200 transition-all duration-300">
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-24 bg-blue-600 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Prêt à transformer votre expérience d'achat ?
              </h2>
              <p className="text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Rejoignez notre communauté de clients satisfaits et découvrez pourquoi nous sommes la référence en matière de e-commerce
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center bg-white text-blue-600 px-12 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl text-lg group"
                >
                  <ShoppingBag className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Commencer mes achats
                </Link>
               
              </div>
              
              <div className="mt-12 pt-8 border-t border-white/20">
                <p className="text-blue-100/70 text-sm">
                  ✨ Déjà plus de 50,000 clients satisfaits ✨
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Styles CSS pour les animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseSlow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-pulse-slow {
          animation: pulseSlow 2s ease-in-out infinite;
        }

        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animation-delay-100 {
          animation-delay: 100ms;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
   </div>
  );
};

export default HomePage;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Download, Menu, X, User, LogOut, MessageSquare } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-8">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-forest to-forest-dark flex items-center justify-center shadow-lg overflow-hidden">
                  <img src="/logo.jpg" alt="KaKernel" className="w-full h-full object-cover" />
                </div>
                <span className="font-extrabold text-lg md:text-xl text-foreground">
                  Ka<span className="text-forest">Kernel</span>
                </span>
              </Link>

              {/* Navigation Links - Hidden on mobile */}
              <nav className="hidden md:flex items-center gap-6">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    cn(
                      'font-semibold transition-colors',
                      isActive ? 'text-forest' : 'text-foreground/80 hover:text-forest',
                    )
                  }
                >
                  {t.nav.features}
                </NavLink>
                <NavLink
                  to="/huong-dan"
                  className={({ isActive }) =>
                    cn(
                      'font-semibold transition-colors',
                      isActive ? 'text-forest' : 'text-foreground/80 hover:text-forest',
                    )
                  }
                >
                  {t.nav.guide}
                </NavLink>
              </nav>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Language Toggle */}
              <div className="flex items-center bg-muted rounded-full p-1">
                <button
                  onClick={() => setLanguage('vi')}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    language === 'vi'
                      ? 'bg-forest text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  VI
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    language === 'en'
                      ? 'bg-forest text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Download Button - Hidden on mobile */}
              <Button variant="cta" size="sm" className="hidden md:flex hover-jelly">
                <Download className="w-4 h-4 mr-2" />
                {t.nav.download}
              </Button>

              {/* Auth Button - Desktop */}
              {isLoggedIn ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/my-requests"
                    className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-forest"
                    title={language === 'vi' ? 'Yêu cầu của tôi' : 'My Requests'}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Link>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
                    <User className="w-4 h-4 text-forest" />
                    <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                      {user?.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    title={language === 'vi' ? 'Đăng xuất' : 'Logout'}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition-colors"
                >
                  <User className="w-4 h-4" />
                  {language === 'vi' ? 'Đăng nhập' : 'Login'}
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-foreground" />
                ) : (
                  <Menu className="w-6 h-6 text-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden glass border-b border-white/20"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <NavLink
                to="/"
                end
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'font-semibold py-3 px-4 rounded-lg transition-all',
                    isActive
                      ? 'bg-forest/10 text-forest border border-forest/30'
                      : 'text-foreground/80 hover:bg-muted',
                  )
                }
              >
                {t.nav.features}
              </NavLink>
              <NavLink
                to="/huong-dan"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'font-semibold py-3 px-4 rounded-lg transition-all',
                    isActive
                      ? 'bg-forest/10 text-forest border border-forest/30'
                      : 'text-foreground/80 hover:bg-muted',
                  )
                }
              >
                {t.nav.guide}
              </NavLink>

              {/* Auth - Mobile */}
              {isLoggedIn ? (
                <>
                  <Link
                    to="/my-requests"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-3 px-4 bg-purple-500/10 text-purple-400 font-semibold rounded-lg transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {language === 'vi' ? 'Yêu cầu của tôi' : 'My Requests'}
                  </Link>
                  <div className="flex items-center justify-between py-3 px-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-forest" />
                      <span className="font-medium text-foreground">{user?.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-red-400 hover:text-red-300"
                    >
                      <LogOut className="w-4 h-4" />
                      {language === 'vi' ? 'Đăng xuất' : 'Logout'}
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  {language === 'vi' ? 'Đăng nhập' : 'Login'}
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

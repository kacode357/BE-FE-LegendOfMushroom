import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowDown, Shield, CheckCircle } from 'lucide-react';

const HeroSection: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section className="relative min-h-screen pt-20 overflow-hidden">
      {/* Magical Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-forest/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        {/* Golden sparkles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`gold-${i}`}
            className="absolute w-1 h-1 rounded-full bg-gold"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Hero Gradient Overlay */}
      <div className="absolute inset-0 bg-hero-gradient" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-5rem)] py-12">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            {/* Safety Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-gold/50 bg-gold/15 shadow-lg mb-6"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="w-5 h-5 text-forest animate-pulse-glow" />
              </motion.div>
              <span className="text-sm font-bold text-foreground">{t.hero.safetyBadge}</span>
              <CheckCircle className="w-4 h-4 text-forest" />
            </motion.div>

            {/* Android Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-amber-500/50 bg-amber-500/15 shadow-lg mb-6 ml-2"
            >
              <span className="text-sm font-bold text-amber-600">{language === 'vi' ? '📱 Chỉ hỗ trợ Android' : '📱 Android Only'}</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4"
            >
              <span className="text-foreground">{t.hero.title}</span>
              <br />
              <span className="text-gradient-forest">{t.hero.titleHighlight}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
            >
              {t.hero.subtitle}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button variant="hero" size="xl" className="hover-jelly" asChild>
                <a href="#features">
                  <Sparkles className="w-5 h-5" />
                  {t.hero.exploreBtn}
                </a>
              </Button>
              <Button variant="glass" size="xl" className="hover-jelly" asChild>
                <a href="#features">
                  <ArrowDown className="w-5 h-5" />
                  {t.hero.learnMore}
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Side - Character Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Glow Effect Behind */}
            <div className="absolute inset-0 bg-gradient-radial from-forest/30 via-transparent to-transparent blur-3xl" />
            
            {/* Levitating Character Container */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              {/* Character Placeholder Box */}
              <div className="w-72 h-96 md:w-80 md:h-[420px] lg:w-96 lg:h-[500px] rounded-3xl glass-card border-2 border-forest/30 relative overflow-hidden">
                {/* Shimmer Effect */}
                <div className="absolute inset-0 animate-shimmer opacity-30" />

                <img
                  src="/character_img.webp"
                  alt={language === 'vi' ? 'Nhân vật' : 'Character'}
                  className="relative z-10 w-full h-full object-contain p-6"
                />

                {/* Decorative Corner Elements */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-gold rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-gold rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-gold rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-gold rounded-br-lg" />
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-6 -right-4 text-4xl"
              >
                ✨
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 text-3xl"
              >
                🌟
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1/4 -left-8 text-2xl"
              >
                💎
              </motion.div>
              
              {/* Safety Shield Floating */}
              <motion.div
                animate={{ y: [0, -6, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
                className="absolute top-1/3 -right-6 p-2 rounded-full glass-card border border-forest/50"
              >
                <Shield className="w-5 h-5 text-forest" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-forest/50 flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-2.5 rounded-full bg-forest" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

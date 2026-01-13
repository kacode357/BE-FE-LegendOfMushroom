import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 md:py-16 pb-32 md:pb-16 bg-cream-dark/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 items-center"
        >
          {/* Left */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-forest to-forest-dark flex items-center justify-center shadow-lg overflow-hidden">
                <img src="/logo.jpg" alt="KaKernel" className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-2xl text-foreground">
                Ka<span className="text-forest">Kernel</span>
              </span>
            </div>

            <p className="text-sm text-muted-foreground max-w-md md:max-w-none">
              Fan-made mod tool. Not affiliated with the official game developers.
            </p>
          </div>

          {/* Right */}
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">Made by KaKernel</p>
            <p className="text-xs text-muted-foreground/60 mt-2">
              © {new Date().getFullYear()} KaKernel. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ContactModal from './ContactModal';

const StickyCTA: React.FC = () => {
  const { language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 shadow-lg backdrop-blur-lg border-t border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-white font-bold text-lg mb-1">
                {language === 'vi' ? '💬 Cần hỗ trợ?' : '💬 Need Support?'}
              </h3>
              <p className="text-white/90 text-sm">
                {language === 'vi' 
                  ? 'Liên hệ với chúng tôi để được hỗ trợ nhanh chóng' 
                  : 'Contact us for quick support'}
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 bg-white text-purple-600 font-bold rounded-full hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap"
            >
              {language === 'vi' ? 'Liên hệ để hỗ trợ' : 'Contact for Support'}
            </button>
          </div>
        </div>
      </div>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default StickyCTA;

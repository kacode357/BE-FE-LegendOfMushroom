import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'vi' | 'en';

interface Package {
  name: string;
  price: string;
  features: string[];
  downloadUrl: string;
  gradient: string;
}

interface Translations {
  nav: {
    features: string;
    guide: string;
    download: string;
  };
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    exploreBtn: string;
    learnMore: string;
    safetyBadge: string;
  };
  guidePage: {
    title: string;
    subtitle: string;
    steps: string[];
    note: string;
  };
  featureStore: {
    title: string;
    subtitle: string;
    downloadBtn: string;
    safetyBadge: string;
    safetyTitle: string;
    safetyDesc: string;
    packages: Package[];
  };
  cta: {
    download: string;
    version: string;
  };
  placeholders: {
    logo: string;
    character: string;
  };
}

const translations: Record<Language, Translations> = {
  vi: {
    nav: {
      features: 'Trang chủ',
      guide: 'Hướng dẫn',
      download: 'Tải Ngay',
    },
    hero: {
      badge: '🍄 Phiên bản mới nhất v1.10.0',
      title: 'Nâng Cấp Trải Nghiệm',
      titleHighlight: 'Nấm Lùn Tiến Lên',
      subtitle: 'Mở khóa tất cả tính năng cao cấp, tự động hóa mọi thao tác và chinh phục game dễ dàng hơn bao giờ hết!',
      exploreBtn: 'Khám Phá Tính Năng',
      learnMore: 'Xem Chi Tiết',
      safetyBadge: '100% An Toàn • Anti-Ban',
    },
    guidePage: {
      title: 'Hướng dẫn',
      subtitle: 'Lưu ý: Chỉ hỗ trợ Android',
      steps: [
        'Bước 1: Xóa game, gỡ cài đặt ứng dụng cũ (nếu có)',
        'Tải game từ link: https://github.com/kacode357/LOM-FILEDOWN/releases/download/FileGame/Legend.of.Mushroom_.Rush.-.SEA_2.0.40.xapk',
        'Bước 2: Cài phần mềm hỗ trợ cài game',
        'Tải MT Manager: https://github.com/kacode357/LOM-FILEDOWN/releases/download/SupportInstallGame/MT2.19.4-mtmanager.net.apk',
        'Hoặc tải ZArchiver: https://github.com/kacode357/LOM-FILEDOWN/releases/download/SupportInstallGame/ZArchiver_1.0.10.apk',
        'Cài đặt phần mềm vừa tải và sử dụng để cài file .xapk'
      ],
      note: '⚠️ Lưu ý: Tính năng chỉ hỗ trợ thiết bị Android. Thiết bị iOS không được hỗ trợ.',
    },
    featureStore: {
      title: 'Các Tính Năng Web Đang Có',
      subtitle: 'Chọn gói phù hợp với nhu cầu của bạn - Miễn phí 100%',
      downloadBtn: 'Tải Ngay',
      safetyBadge: '100% An Toàn Tuyệt Đối',
      safetyTitle: 'Hướng Dẫn Sử Dụng',
      safetyDesc: 'Xem chi tiết cách cài đặt và sử dụng các gói tính năng',
      packages: [
        {
          name: 'Gói 1 - Bỏ Qua Quảng Cáo',
          price: 'Miễn Phí',
          features: [
            'Bỏ qua ngay quảng cáo',
            'Không cần xem quảng cáo',
            'Tiết kiệm thời gian'
          ],
          downloadUrl: 'https://github.com/user-attachments/files/24576374/index.js',
          gradient: 'from-blue-500 via-blue-400 to-cyan-500'
        },
        {
          name: 'Gói 2 - Bỏ Qua QC + Auto Lì Xì',
          price: 'Miễn Phí',
          features: [
            'Bao gồm tất cả tính năng Gói 1',
            'Tự động nhận lì xì ngay lập tức',
            'Không cần nhấn tay',
            'Không bỏ lỡ bất kỳ lì xì nào'
          ],
          downloadUrl: 'https://github.com/user-attachments/files/24576406/index.js',
          gradient: 'from-purple-500 via-purple-400 to-pink-500'
        },
        {
          name: 'Gói 3 - Full Tính Năng',
          price: 'Miễn Phí',
          features: [
            'Bao gồm tất cả tính năng Gói 2',
            'Tự động trả lời câu hỏi gia tộc',
            'Trả lời chính xác 100%',
            'Hoàn toàn tự động'
          ],
          downloadUrl: 'https://github.com/user-attachments/files/24576411/index.js',
          gradient: 'from-amber-500 via-orange-400 to-red-500'
        }
      ],
    },
    cta: {
      download: 'Tải Mod Ngay',
      version: 'Phiên bản 1.10.0 • Cập nhật mới nhất',
    },
    placeholders: {
      logo: 'CHÈN LOGO GAME TẠI ĐÂY',
      character: 'CHÈN HÌNH NHÂN VẬT TẠI ĐÂY',
    },
  },
  en: {
    nav: {
      features: 'Home',
      guide: 'Guide',
      download: 'Download',
    },
    hero: {
      badge: '🍄 Latest version v1.10.0',
      title: 'Upgrade Your Experience',
      titleHighlight: 'Legend of Mushroom',
      subtitle: 'Unlock all premium features, automate everything, and conquer the game easier than ever before!',
      exploreBtn: 'Explore Features',
      learnMore: 'View Details',
      safetyBadge: '100% Safe • Anti-Ban',
    },
    guidePage: {
      title: 'Guide',
      subtitle: 'Note: Android only',
      steps: [
        'Step 1: Delete game, uninstall old application (if any)',
        'Download game from: https://github.com/kacode357/LOM-FILEDOWN/releases/download/FileGame/Legend.of.Mushroom_.Rush.-.SEA_2.0.40.xapk',
        'Step 2: Install support software for game installation',
        'Download MT Manager: https://github.com/kacode357/LOM-FILEDOWN/releases/download/SupportInstallGame/MT2.19.4-mtmanager.net.apk',
        'Or download ZArchiver: https://github.com/kacode357/LOM-FILEDOWN/releases/download/SupportInstallGame/ZArchiver_1.0.10.apk',
        'Install the downloaded software and use it to install the .xapk file'
      ],
      note: '⚠️ Note: Features only support Android devices. iOS devices are not supported.',
    },
    featureStore: {
      title: 'Available Web Features',
      subtitle: 'Choose the package that fits your needs - 100% Free',
      downloadBtn: 'Download Now',
      safetyBadge: '100% Absolutely Safe',
      safetyTitle: 'Usage Guide',
      safetyDesc: 'See detailed instructions on how to install and use feature packages',
      packages: [
        {
          name: 'Package 1 - Skip Ads',
          price: 'Free',
          features: [
            'Skip ads instantly',
            'No need to watch ads',
            'Save your time'
          ],
          downloadUrl: 'https://github.com/user-attachments/files/24576374/index.js',
          gradient: 'from-blue-500 via-blue-400 to-cyan-500'
        },
        {
          name: 'Package 2 - Skip Ads + Auto Red Envelope',
          price: 'Free',
          features: [
            'All features from Package 1',
            'Auto collect red envelopes instantly',
            'No manual clicking needed',
            'Never miss any red envelope'
          ],
          downloadUrl: 'https://github.com/user-attachments/files/24576406/index.js',
          gradient: 'from-purple-500 via-purple-400 to-pink-500'
        },
        {
          name: 'Package 3 - Full Features',
          price: 'Free',
          features: [
            'All features from Package 2',
            'Auto answer family questions',
            '100% accuracy answers',
            'Fully automated'
          ],
          downloadUrl: 'https://github.com/user-attachments/files/24576411/index.js',
          gradient: 'from-amber-500 via-orange-400 to-red-500'
        }
      ],
    },
    cta: {
      download: 'Download Mod Now',
      version: 'Version 1.10.0 • Latest Update',
    },
    placeholders: {
      logo: 'INSERT GAME LOGO HERE',
      character: 'INSERT MUSHROOM CHARACTER ART',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = window.localStorage.getItem('language');
      return saved === 'en' || saved === 'vi' ? saved : 'vi';
    } catch {
      return 'vi';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      window.localStorage.setItem('language', lang);
    } catch {
      // ignore
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

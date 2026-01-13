import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { packageService, Package } from '@/services/package.service';
import { 
  Download,
  Shield,
  CheckCircle,
  Check,
  Gift,
  Sparkles,
  Loader2
} from 'lucide-react';

const FeatureStoreSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      const data = await packageService.getPackages();
      setPackages(data);
      setLoading(false);
    };
    fetchPackages();
  }, []);

  const handleDownload = (packageName: string, downloadUrl: string) => {
    window.open(downloadUrl, '_blank');
    toast({
      title: language === 'vi' ? "✅ Tải thành công!" : "✅ Download successful!",
      description: language === 'vi' 
        ? `Đang tải "${packageName}". Vui lòng kiểm tra thư mục tải xuống!`
        : `Downloading "${packageName}". Please check your downloads folder!`,
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        delay: i * 0.15,
        ease: 'easeOut' as const 
      },
    }),
  };

  // Get localized package data
  const getPackageName = (pkg: Package) => language === 'vi' ? pkg.name : (pkg.nameEn || pkg.name);
  const getPackagePrice = (pkg: Package) => language === 'vi' ? pkg.price : (pkg.priceEn || pkg.price);
  const getPackageFeatures = (pkg: Package) => language === 'vi' ? pkg.features : (pkg.featuresEn || pkg.features);

  return (
    <section id="features" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-forest/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-magic-purple/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
            <span className="text-gradient-gold">{t.featureStore.title}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.featureStore.subtitle}
          </p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-forest" />
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              {language === 'vi' ? 'Không có gói nào' : 'No packages available'}
            </p>
          </div>
        ) : (
          /* Package Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
              >
                <Card className="glass-card border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-2xl hover:scale-105 h-full flex flex-col">
                  <CardHeader>
                    <div className={`w-full h-2 rounded-full bg-gradient-to-r ${pkg.gradient} mb-4`} />
                    <CardTitle className="text-2xl font-bold text-foreground">
                      {getPackageName(pkg)}
                    </CardTitle>
                    <CardDescription className="text-lg font-semibold">
                      <span className={`bg-gradient-to-r ${pkg.gradient} bg-clip-text text-transparent`}>
                        {getPackagePrice(pkg)}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-3 mb-6 flex-1">
                      {getPackageFeatures(pkg).map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-forest mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full bg-gradient-to-r ${pkg.gradient} hover:opacity-90 text-white font-bold py-6 text-lg hover-jelly shadow-lg`}
                      onClick={() => handleDownload(getPackageName(pkg), pkg.fileUrl)}
                    >
                      <Download className="w-5 h-5 mr-2" />
                      {t.featureStore.downloadBtn}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Guide Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-forest mb-2 flex items-center justify-center gap-2">
              <Shield className="w-7 h-7" />
              {t.featureStore.safetyTitle}
            </h3>
            <p className="text-base text-muted-foreground mb-4">
              {t.featureStore.safetyDesc}
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-forest via-emerald-500 to-forest hover:opacity-90 text-white font-bold px-8 py-6 text-lg hover-jelly shadow-lg"
            >
              <a href="/huong-dan" className="inline-flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {language === 'vi' ? 'Xem Hướng Dẫn' : 'View Guide'}
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureStoreSection;

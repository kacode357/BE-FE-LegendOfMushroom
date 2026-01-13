import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { authService } from '@/services/auth.service';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const texts = {
    vi: {
      verifying: 'Đang xác thực email...',
      successTitle: 'Xác thực thành công!',
      successMessage: 'Email của bạn đã được xác thực. Bạn có thể đăng nhập ngay bây giờ.',
      goToLogin: 'Đăng nhập',
      errorTitle: 'Xác thực thất bại',
      invalidToken: 'Link xác thực không hợp lệ hoặc đã hết hạn.',
      requestNew: 'Gửi lại email xác thực',
    },
    en: {
      verifying: 'Verifying email...',
      successTitle: 'Verification Successful!',
      successMessage: 'Your email has been verified. You can login now.',
      goToLogin: 'Login',
      errorTitle: 'Verification Failed',
      invalidToken: 'The verification link is invalid or has expired.',
      requestNew: 'Resend verification email',
    },
  };

  const t = texts[language];

  useEffect(() => {
    if (!token) {
      setError(t.invalidToken);
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        await authService.verifyEmail(token);
        setSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : t.invalidToken);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-white text-lg">{t.verifying}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-green-500/20 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{t.successTitle}</h2>
            <p className="text-gray-400 mb-6">{t.successMessage}</p>
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition-all"
            >
              {t.goToLogin}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-red-500/20 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{t.errorTitle}</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition-all"
          >
            {t.goToLogin}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

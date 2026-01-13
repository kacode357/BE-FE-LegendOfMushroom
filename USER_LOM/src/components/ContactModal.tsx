import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { createContact } from '@/services/contact.service';
import { authService } from '@/services/auth.service';
import { X, Send, Loader2, CheckCircle, AlertCircle, LogIn } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill user info when logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  const texts = {
    vi: {
      title: 'Liên hệ hỗ trợ',
      subtitle: 'Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại sớm nhất',
      name: 'Họ tên',
      namePlaceholder: 'Nhập họ tên của bạn',
      email: 'Email',
      emailPlaceholder: 'Nhập email (không bắt buộc)',
      phone: 'Số điện thoại',
      phonePlaceholder: 'Nhập số điện thoại (không bắt buộc)',
      subject: 'Tiêu đề',
      subjectPlaceholder: 'VD: Hỗ trợ cài đặt game',
      message: 'Nội dung',
      messagePlaceholder: 'Mô tả chi tiết vấn đề bạn cần hỗ trợ...',
      submit: 'Gửi yêu cầu',
      submitting: 'Đang gửi...',
      successTitle: 'Gửi thành công!',
      successMessage: 'Chúng tôi đã nhận được yêu cầu của bạn và sẽ phản hồi sớm nhất. Email xác nhận đã được gửi đến bạn.',
      close: 'Đóng',
      telegramNote: 'Hoặc liên hệ trực tiếp qua',
      required: '*',
      loginRequired: 'Đăng nhập để gửi yêu cầu',
      loginRequiredDesc: 'Bạn cần đăng nhập để gửi yêu cầu hỗ trợ. Thông tin của bạn sẽ được bảo mật.',
      loginButton: 'Đăng nhập',
      registerButton: 'Đăng ký',
      noAccount: 'Chưa có tài khoản?',
    },
    en: {
      title: 'Contact Support',
      subtitle: 'Fill in the form below, we will contact you as soon as possible',
      name: 'Full Name',
      namePlaceholder: 'Enter your full name',
      email: 'Email',
      emailPlaceholder: 'Enter your email (optional)',
      phone: 'Phone Number',
      phonePlaceholder: 'Enter your phone number (optional)',
      subject: 'Subject',
      subjectPlaceholder: 'E.g: Help with game installation',
      message: 'Message',
      messagePlaceholder: 'Describe your issue in detail...',
      submit: 'Send Request',
      submitting: 'Sending...',
      successTitle: 'Sent Successfully!',
      successMessage: 'We have received your request and will respond as soon as possible. A confirmation email has been sent to you.',
      close: 'Close',
      telegramNote: 'Or contact us directly via',
      required: '*',
      loginRequired: 'Login to submit request',
      loginRequiredDesc: 'You need to login to submit a support request. Your information will be kept secure.',
      loginButton: 'Login',
      registerButton: 'Register',
      noAccount: "Don't have an account?",
    },
  };

  const t = texts[language];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleGoToLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleGoToRegister = () => {
    onClose();
    navigate('/register');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Vui lòng đăng nhập để gửi yêu cầu');
      }

      await createContact(
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        },
        token
      );

      setSuccess(true);
      setFormData({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', subject: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 rounded-2xl shadow-2xl border border-purple-500/30 max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="p-6">
          {!isLoggedIn ? (
            /* Login Required State */
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                <LogIn className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{t.loginRequired}</h3>
              <p className="text-gray-400 mb-6">{t.loginRequiredDesc}</p>
              <div className="space-y-3">
                <button
                  onClick={handleGoToLogin}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  {t.loginButton}
                </button>
                <p className="text-gray-400 text-sm">
                  {t.noAccount}{' '}
                  <button
                    onClick={handleGoToRegister}
                    className="text-purple-400 hover:text-purple-300 font-medium"
                  >
                    {t.registerButton}
                  </button>
                </p>
              </div>
              
              {/* Telegram fallback */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-gray-400 text-sm">
                  {t.telegramNote}{' '}
                  <a
                    href="https://t.me/kacode357"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 font-medium"
                  >
                    Telegram
                  </a>
                </p>
              </div>
            </div>
          ) : success ? (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{t.successTitle}</h3>
              <p className="text-gray-300 mb-6">{t.successMessage}</p>
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
              >
                {t.close}
              </button>
            </div>
          ) : (
            /* Form */
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">{t.title}</h2>
                <p className="text-gray-400 text-sm">{t.subtitle}</p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center gap-2 text-red-300 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    {t.name} <span className="text-pink-400">{t.required}</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={t.namePlaceholder}
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      {t.email}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t.emailPlaceholder}
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      {t.phone}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t.phonePlaceholder}
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    {t.subject} <span className="text-pink-400">{t.required}</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder={t.subjectPlaceholder}
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    {t.message} <span className="text-pink-400">{t.required}</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder={t.messagePlaceholder}
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t.submitting}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t.submit}
                    </>
                  )}
                </button>
              </form>

              {/* Telegram note */}
              <div className="mt-4 pt-4 border-t border-white/10 text-center">
                <p className="text-gray-400 text-sm">
                  {t.telegramNote}{' '}
                  <a
                    href="https://t.me/kacode357"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 font-medium"
                  >
                    Telegram
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;

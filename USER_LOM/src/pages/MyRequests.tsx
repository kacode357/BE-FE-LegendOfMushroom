import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { getMyContacts, ContactResponse } from '@/services/contact.service';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  RefreshCw,
  MessageCircle,
} from 'lucide-react';

const statusConfig = {
  pending: {
    label: { vi: 'Chờ xử lý', en: 'Pending' },
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    icon: Clock,
  },
  processing: {
    label: { vi: 'Đang xử lý', en: 'Processing' },
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: Loader2,
  },
  resolved: {
    label: { vi: 'Đã giải quyết', en: 'Resolved' },
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: CheckCircle,
  },
  closed: {
    label: { vi: 'Đã đóng', en: 'Closed' },
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    icon: XCircle,
  },
};

const MyRequests: React.FC = () => {
  const { language } = useLanguage();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<ContactResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    const token = authService.getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getMyContacts(token);
      setContacts(response.data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchContacts();
  }, [isLoggedIn, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {language === 'vi' ? 'Yêu cầu hỗ trợ của tôi' : 'My Support Requests'}
              </h1>
              <p className="text-muted-foreground">
                {language === 'vi'
                  ? 'Xem lại các yêu cầu hỗ trợ bạn đã gửi'
                  : 'View your submitted support requests'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchContacts}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {language === 'vi' ? 'Làm mới' : 'Refresh'}
          </Button>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
          </div>
        ) : error ? (
          <Card className="glass-card border-red-500/30">
            <CardContent className="py-10 text-center">
              <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-400">{error}</p>
              <Button variant="outline" onClick={fetchContacts} className="mt-4">
                {language === 'vi' ? 'Thử lại' : 'Try again'}
              </Button>
            </CardContent>
          </Card>
        ) : contacts.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="py-16 text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">
                {language === 'vi' ? 'Chưa có yêu cầu nào' : 'No requests yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {language === 'vi'
                  ? 'Bạn chưa gửi yêu cầu hỗ trợ nào'
                  : "You haven't submitted any support requests"}
              </p>
              <Button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                {language === 'vi' ? 'Quay về trang chủ' : 'Back to Home'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact, index) => {
              const status = statusConfig[contact.status] || statusConfig.pending;
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card hover:border-purple-500/30 transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <CardTitle className="text-lg font-semibold text-foreground line-clamp-1">
                          {contact.subject}
                        </CardTitle>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 flex-shrink-0 ${status.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {status.label[language]}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(contact.createdAt)}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* User message */}
                      <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {contact.message}
                        </p>
                      </div>

                      {/* Admin reply */}
                      {contact.adminReply && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageCircle className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-medium text-green-400">
                              {language === 'vi' ? 'Phản hồi từ Admin' : 'Admin Reply'}
                            </span>
                            {contact.repliedAt && (
                              <span className="text-xs text-muted-foreground">
                                • {formatDate(contact.repliedAt)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-foreground whitespace-pre-wrap">
                            {contact.adminReply}
                          </p>
                        </div>
                      )}

                      {/* Waiting for reply */}
                      {!contact.adminReply && contact.status !== 'closed' && (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Clock className="w-4 h-4" />
                          {language === 'vi'
                            ? 'Đang chờ phản hồi từ đội ngũ hỗ trợ...'
                            : 'Waiting for support team response...'}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Download, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Guide: React.FC = () => {
  const { t, language } = useLanguage();

  const gameDownloadUrl = 'https://github.com/kacode357/LOM-FILEDOWN/releases/download/FileGame/Legend.of.Mushroom_.Rush.-.SEA_2.0.40.xapk';
  const mtManagerUrl = 'https://github.com/kacode357/LOM-FILEDOWN/releases/download/SupportInstallGame/MT2.19.4-mtmanager.net.apk';
  const zArchiverUrl = 'https://github.com/kacode357/LOM-FILEDOWN/releases/download/SupportInstallGame/ZArchiver_1.0.10.apk';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 md:pt-28 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">{t.guidePage.title}</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl text-lg font-semibold text-amber-600">{t.guidePage.subtitle}</p>

          <div className="glass-card rounded-2xl border border-white/20 p-6 md:p-8 max-w-3xl mb-6">
            <div className="space-y-8">
              {/* Bước 1 */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-gold to-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                  {language === 'vi' ? 'Gỡ và Tải Game' : 'Uninstall & Download Game'}
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
                  <li>{language === 'vi' ? 'Xóa game, gỡ cài đặt ứng dụng cũ (nếu có)' : 'Delete game, uninstall old application (if any)'}</li>
                  <li>{language === 'vi' ? 'Tải file game từ link bên dưới' : 'Download game file from link below'}</li>
                  <li>{language === 'vi' ? 'Bấm nút "Tải Game" và chờ tải xuống hoàn tất' : 'Tap "Download Game" button and wait for download to complete'}</li>
                </ul>
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-white font-bold py-6 text-lg shadow-lg"
                  onClick={() => window.open(gameDownloadUrl, '_blank')}
                >
                  <Download className="w-5 h-5 mr-2" />
                  {language === 'vi' ? 'Tải Game (.xapk)' : 'Download Game (.xapk)'}
                </Button>
              </div>

              {/* Bước 2 */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                  {language === 'vi' ? 'Cài Phần Mềm Hỗ Trợ' : 'Install Support Software'}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {language === 'vi' ? 'Chọn 1 trong 2 phần mềm bên dưới để cài file .xapk:' : 'Choose one of the two software below to install .xapk file:'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:opacity-90 text-white font-bold py-6 text-lg shadow-lg"
                    onClick={() => window.open(mtManagerUrl, '_blank')}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    MT Manager
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 text-white font-bold py-6 text-lg shadow-lg"
                    onClick={() => window.open(zArchiverUrl, '_blank')}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    ZArchiver
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  {language === 'vi' ? 'Sau khi cài phần mềm, mở nó và chọn file .xapk đã tải để cài đặt game.' : 'After installing the software, open it and select the downloaded .xapk file to install the game.'}
                </p>
              </div>
            </div>
          </div>

          {/* Hướng dẫn chi tiết */}
          <div className="glass-card rounded-2xl border border-white/20 p-6 md:p-8 max-w-3xl mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-blue-600" />
              {language === 'vi' ? 'Hướng Dẫn Chi Tiết' : 'Detailed Guide'}
            </h2>
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-bold text-foreground mb-3">
                {language === 'vi' ? 'Cách xem file đã tải xuống:' : 'How to view downloaded files:'}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    {language === 'vi' ? '1. Xem danh sách file tải xuống:' : '1. View download list:'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === 'vi' ? 'Mở trình duyệt Chrome/Google và bấm vào biểu tượng tải xuống ở góc trên bên phải' : 'Open Chrome/Google browser and tap the download icon in the top right corner'}
                  </p>
                  <img 
                    src="/huongdangooglecachxemteptaixuong.png" 
                    alt="Download list" 
                    className="rounded-lg border border-white/20 shadow-md w-full max-w-sm mx-auto"
                  />
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    {language === 'vi' ? '2. Bấm vào file để tải về:' : '2. Tap the file to download:'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === 'vi' ? 'Trong danh sách file, chọn file game hoặc file app bạn muốn tải' : 'In the file list, select the game file or app file you want to download'}
                  </p>
                  <img 
                    src="/bamnuttaixuonggoogle.png" 
                    alt="Download file" 
                    className="rounded-lg border border-white/20 shadow-md w-full max-w-sm mx-auto"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    {language === 'vi' ? '3. Bấm vào để tải app hỗ trợ:' : '3. Tap to download support app:'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === 'vi' ? 'Sau khi tải xong, bấm vào file APK (MT Manager hoặc ZArchiver) để cài đặt' : 'After downloading, tap the APK file (MT Manager or ZArchiver) to install'}
                  </p>
                  <img 
                    src="/bamvaodetaiapp.png" 
                    alt="Install app" 
                    className="rounded-lg border border-white/20 shadow-md w-full max-w-sm mx-auto"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    {language === 'vi' ? '4. Mở ứng dụng ZArchiver/MT Manager:' : '4. Open ZArchiver/MT Manager app:'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === 'vi' ? 'Sau khi cài xong app hỗ trợ, mở ứng dụng và tìm file game .xapk đã tải để cài đặt' : 'After installing the support app, open it and find the downloaded .xapk game file to install'}
                  </p>
                  <img 
                    src="/moungdungzrazchive.png" 
                    alt="Open ZArchiver" 
                    className="rounded-lg border border-white/20 shadow-md w-full max-w-sm mx-auto"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    {language === 'vi' ? '5. Cho phép cài đặt ứng dụng:' : '5. Allow app installation:'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === 'vi' ? 'Khi xuất hiện yêu cầu cấp quyền, bấm "Cho phép" hoặc "Allow" để cài đặt app từ nguồn không xác định' : 'When permission request appears, tap "Allow" to install apps from unknown sources'}
                  </p>
                  <img 
                    src="/agreecholandauvaoapp.png" 
                    alt="Allow installation" 
                    className="rounded-lg border border-white/20 shadow-md w-full max-w-sm mx-auto"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    {language === 'vi' ? '6. Chọn thư mục Download:' : '6. Select Download folder:'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === 'vi' ? 'Trong ứng dụng ZArchiver/MT Manager, tìm và bấm vào thư mục "Download" để xem file game đã tải' : 'In ZArchiver/MT Manager app, find and tap the "Download" folder to view downloaded game files'}
                  </p>
                  <img 
                    src="/chonthumucdowgame.png" 
                    alt="Select Download folder" 
                    className="rounded-lg border border-white/20 shadow-md w-full max-w-sm mx-auto"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    {language === 'vi' ? '7. Cài đặt game từ file .xapk:' : '7. Install game from .xapk file:'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === 'vi' ? 'Tìm file game .xapk trong thư mục Download, bấm vào file và chọn "Install" để bắt đầu cài đặt game' : 'Find the .xapk game file in Download folder, tap it and select "Install" to start installing the game'}
                  </p>
                  <img 
                    src="/huongdaninstallgame.png" 
                    alt="Install game" 
                    className="rounded-lg border border-white/20 shadow-md w-full max-w-sm mx-auto"
                  />
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-400 dark:border-amber-600 rounded-lg p-4">
                  <p className="text-sm font-bold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {language === 'vi' ? '⚠️ QUAN TRỌNG - Đọc kỹ!' : '⚠️ IMPORTANT - Read carefully!'}
                  </p>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground">
                      {language === 'vi' ? '8. Mở game và tải dữ liệu:' : '8. Open game and load data:'}
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>{language === 'vi' ? 'Sau khi cài xong, mở game lên và CHỜ game tải dữ liệu hoàn tất (có thể mất vài phút)' : 'After installation, open the game and WAIT for data download to complete (may take a few minutes)'}</li>
                      <li>{language === 'vi' ? 'Đăng nhập vào tài khoản game của bạn (Facebook, Google, hoặc tài khoản khác)' : 'Log in to your game account (Facebook, Google, or other account)'}</li>
                      <li className="font-bold text-amber-700 dark:text-amber-400">{language === 'vi' ? '⚠️ Sau khi đăng nhập xong, PHẢI TẮT GAME đi (đóng hoàn toàn ứng dụng)' : '⚠️ After logging in, you MUST CLOSE THE GAME (completely close the app)'}</li>
                    </ul>
                    <img 
                      src="/capnhatgame.png" 
                      alt="Update game" 
                      className="rounded-lg border border-white/20 shadow-md w-full max-w-sm mx-auto mt-3"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    {language === 'vi' ? '9. Tải gói tính năng:' : '9. Download feature package:'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === 'vi' ? 'Sau khi tắt game, vào lại trang web ' : 'After closing the game, go back to '}
                    <a 
                      href="https://kakerel.vercel.app/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline decoration-2"
                    >
                      https://kakerel.vercel.app/
                    </a>
                    {language === 'vi' ? ', chọn Gói tính năng bạn muốn (Gói 1, 2 hoặc 3) và bấm nút "Tải Ngay"' : ', select the feature package you want (Package 1, 2 or 3) and tap "Download Now" button'}
                  </p>
                  <img 
                    src="/taipackagemodgame.png" 
                    alt="Download package" 
                    className="rounded-lg border border-white/20 shadow-md w-full max-w-sm mx-auto"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    {language === 'vi' ? '10. Sao chép file Index:' : '10. Copy Index file:'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === 'vi' ? 'Sau khi tải xong file Index.js, mở lại ứng dụng ZArchiver/MT Manager, tìm file Index.js vừa tải trong thư mục Download và bấm vào để sao chép' : 'After downloading Index.js file, open ZArchiver/MT Manager app again, find the downloaded Index.js file in Download folder and tap to copy'}
                  </p>
                  <img 
                    src="/copyfileindex.png" 
                    alt="Copy Index file" 
                    className="rounded-lg border border-white/20 shadow-md w-full max-w-sm mx-auto"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    {language === 'vi' ? '11. Quay về trang chủ ZArchiver:' : '11. Back to ZArchiver home:'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === 'vi' ? 'Sau khi sao chép file Index.js, bấm vào đường dẫn thư mục ở trên cùng (như trong ảnh) để quay về trang chủ của ZArchiver' : 'After copying Index.js file, tap the folder path at the top (as shown in the image) to return to ZArchiver home page'}
                  </p>
                  <img 
                    src="/backvetranghome.png" 
                    alt="Back to home" 
                    className="rounded-lg border border-white/20 shadow-md w-full max-w-sm mx-auto"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    {language === 'vi' ? '12. Chọn thư mục Android:' : '12. Select Android folder:'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === 'vi' ? 'Ở trang chủ ZArchiver, tìm và bấm vào thư mục "Android"' : 'On ZArchiver home page, find and tap the "Android" folder'}
                  </p>
                  <img 
                    src="/chonthumucandoird.png" 
                    alt="Select Android folder" 
                    className="rounded-lg border border-white/20 shadow-md w-full max-w-sm mx-auto"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    {language === 'vi' ? '13. Chọn thư mục data:' : '13. Select data folder:'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === 'vi' ? 'Trong thư mục Android, tìm và bấm vào thư mục "data"' : 'Inside Android folder, find and tap the "data" folder'}
                  </p>
                  <img 
                    src="/chonthumucdata.png" 
                    alt="Select data folder" 
                    className="rounded-lg border border-white/20 shadow-md w-full max-w-sm mx-auto"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    {language === 'vi' ? '14. Chọn thư mục game:' : '14. Select game folder:'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === 'vi' ? 'Trong thư mục data, tìm và bấm vào thư mục "com.mxdzz.sea" (đây là thư mục của game)' : 'Inside data folder, find and tap the "com.mxdzz.sea" folder (this is the game folder)'}
                  </p>
                  <img 
                    src="/bamvaothuduccommxddzsea.png" 
                    alt="Select game folder" 
                    className="rounded-lg border border-white/20 shadow-md w-full max-w-sm mx-auto"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    {language === 'vi' ? '15. Chọn thư mục files:' : '15. Select files folder:'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === 'vi' ? 'Trong thư mục game, tìm và bấm vào thư mục "files"' : 'Inside game folder, find and tap the "files" folder'}
                  </p>
                  <img 
                    src="/bamvaothumucfile.png" 
                    alt="Select files folder" 
                    className="rounded-lg border border-white/20 shadow-md w-full max-w-sm mx-auto"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    {language === 'vi' ? '16. Chọn thư mục blackjack-remote-asset:' : '16. Select blackjack-remote-asset folder:'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === 'vi' ? 'Trong thư mục files, tìm và bấm vào thư mục "blackjack-remote-asset"' : 'Inside files folder, find and tap the "blackjack-remote-asset" folder'}
                  </p>
                  <img 
                    src="/bamketiepvaothumucblackjackasset.png" 
                    alt="Select blackjack-remote-asset folder" 
                    className="rounded-lg border border-white/20 shadow-md w-full max-w-sm mx-auto"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    {language === 'vi' ? '17. Chọn thư mục assets:' : '17. Select assets folder:'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === 'vi' ? 'Trong thư mục blackjack-remote-asset, tìm và bấm vào thư mục "assets"' : 'Inside blackjack-remote-asset folder, find and tap the "assets" folder'}
                  </p>
                  <img 
                    src="/bamvaoasset.png" 
                    alt="Select assets folder" 
                    className="rounded-lg border border-white/20 shadow-md w-full max-w-sm mx-auto"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    {language === 'vi' ? '18. Chọn thư mục scripts:' : '18. Select scripts folder:'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === 'vi' ? 'Trong thư mục assets, tìm và bấm vào thư mục "scripts"' : 'Inside assets folder, find and tap the "scripts" folder'}
                  </p>
                  <img 
                    src="/bamvaothumucscipt.png" 
                    alt="Select scripts folder" 
                    className="rounded-lg border border-white/20 shadow-md w-full max-w-sm mx-auto"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    {language === 'vi' ? '19. Dán file Index.js:' : '19. Paste Index.js file:'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === 'vi' ? 'Trong thư mục scripts, bấm vào icon "Dán" (paste) để dán file Index.js đã sao chép trước đó' : 'Inside scripts folder, tap the "Paste" icon to paste the Index.js file copied earlier'}
                  </p>
                  <img 
                    src="/bamvaoicondananh.png" 
                    alt="Paste file" 
                    className="rounded-lg border border-white/20 shadow-md w-full max-w-sm mx-auto"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">
                    {language === 'vi' ? '20. Ghi đè file Index.js:' : '20. Overwrite Index.js file:'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === 'vi' ? 'Khi xuất hiện thông báo file đã tồn tại, chọn "Ghi đè" hoặc "Replace" để thay thế file Index.js cũ bằng file mới' : 'When the file exists notification appears, select "Overwrite" or "Replace" to replace the old Index.js file with the new one'}
                  </p>
                  <img 
                    src="/huongdanghide.png" 
                    alt="Overwrite file" 
                    className="rounded-lg border border-white/20 shadow-md w-full max-w-sm mx-auto"
                  />
                </div>

                <div className="bg-green-50 dark:bg-green-950/20 border-2 border-green-400 dark:border-green-600 rounded-lg p-4">
                  <p className="text-sm font-bold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {language === 'vi' ? '✅ HOÀN THÀNH - Kiểm tra kết quả!' : '✅ COMPLETE - Check the result!'}
                  </p>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground">
                      {language === 'vi' ? '21. Mở lại game và kiểm tra:' : '21. Reopen game and check:'}
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>{language === 'vi' ? 'Tắt hoàn toàn game và ZArchiver (đóng tất cả ứng dụng)' : 'Close game and ZArchiver completely (close all apps)'}</li>
                      <li>{language === 'vi' ? 'Mở lại game Legend of Mushroom' : 'Reopen Legend of Mushroom game'}</li>
                      <li className="font-bold text-green-700 dark:text-green-400">{language === 'vi' ? '✅ Nếu thấy giao diện như ảnh dưới đây, bạn đã cài đặt thành công!' : '✅ If you see the interface as shown below, installation successful!'}</li>
                    </ul>
                    <img 
                      src="/xacthucthanhcong.png" 
                      alt="Success verification" 
                      className="rounded-lg border-2 border-green-400 shadow-lg w-full max-w-sm mx-auto mt-3"
                    />
                    <p className="text-center font-bold text-green-700 dark:text-green-400 mt-3">
                      {language === 'vi' ? '🎉 Chúc mừng! Bây giờ bạn có thể sử dụng các tính năng đã tải!' : '🎉 Congratulations! Now you can use the downloaded features!'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Alert className="max-w-3xl border-amber-500/50 bg-amber-500/10">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-600 font-bold">{language === 'vi' ? 'Lưu Ý Quan Trọng' : 'Important Note'}</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              {t.guidePage.note}
            </AlertDescription>
          </Alert>
        </div>
      </main>

      <Footer />
      <StickyCTA />
    </div>
  );
};

export default Guide;

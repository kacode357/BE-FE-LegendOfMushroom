// Seed packages script
// Run with: node scripts/seed-packages.js

require("dotenv").config();
const { getSequelize } = require("../src/db/sequelize");
const Package = require("../src/entities/package/package.model");

const packages = [
  {
    name: "Gói 1 - Bỏ Qua Quảng Cáo",
    nameEn: "Package 1 - Skip Ads",
    description: "Bỏ qua ngay quảng cáo,Không cần xem quảng cáo,Tiết kiệm thời gian",
    price: "Miễn Phí",
    priceEn: "Free",
    features: [
      "Bỏ qua ngay quảng cáo",
      "Không cần xem quảng cáo",
      "Tiết kiệm thời gian"
    ],
    featuresEn: [
      "Skip ads instantly",
      "No need to watch ads",
      "Save your time"
    ],
    fileUrl: "https://github.com/user-attachments/files/24576374/index.js",
    gradient: "from-blue-500 via-blue-400 to-cyan-500",
    order: 1,
    isActive: true,
  },
  {
    name: "Gói 2 - Bỏ Qua QC + Auto Lì Xì",
    nameEn: "Package 2 - Skip Ads + Auto Red Envelope",
    description: "Bao gồm tất cả tính năng Gói 1,Tự động nhận lì xì ngay lập tức,Không cần nhấn tay,Không bỏ lỡ bất kỳ lì xì nào",
    price: "Miễn Phí",
    priceEn: "Free",
    features: [
      "Bao gồm tất cả tính năng Gói 1",
      "Tự động nhận lì xì ngay lập tức",
      "Không cần nhấn tay",
      "Không bỏ lỡ bất kỳ lì xì nào"
    ],
    featuresEn: [
      "All features from Package 1",
      "Auto collect red envelopes instantly",
      "No manual clicking needed",
      "Never miss any red envelope"
    ],
    fileUrl: "https://github.com/user-attachments/files/24576406/index.js",
    gradient: "from-purple-500 via-purple-400 to-pink-500",
    order: 2,
    isActive: true,
  },
  {
    name: "Gói 3 - Full Tính Năng",
    nameEn: "Package 3 - Full Features",
    description: "Bao gồm tất cả tính năng Gói 2,Tự động trả lời câu hỏi gia tộc,Trả lời chính xác 100%,Hoàn toàn tự động",
    price: "Miễn Phí",
    priceEn: "Free",
    features: [
      "Bao gồm tất cả tính năng Gói 2",
      "Tự động trả lời câu hỏi gia tộc",
      "Trả lời chính xác 100%",
      "Hoàn toàn tự động"
    ],
    featuresEn: [
      "All features from Package 2",
      "Auto answer family questions",
      "100% correct answers",
      "Fully automated"
    ],
    fileUrl: "https://github.com/user-attachments/files/24576411/index.js",
    gradient: "from-amber-500 via-orange-400 to-red-500",
    order: 3,
    isActive: true,
  },
];

async function seedPackages() {
  try {
    const sequelize = getSequelize();
    await sequelize.authenticate();
    console.log("Database connected");
    
    // Sync model with alter to add new columns
    await Package.sync({ alter: true });
    console.log("Package table synced");

    for (const pkg of packages) {
      const existing = await Package.findOne({ where: { name: pkg.name } });
      if (existing) {
        await existing.update(pkg);
        console.log(`Updated: ${pkg.name}`);
      } else {
        await Package.create(pkg);
        console.log(`Created: ${pkg.name}`);
      }
    }

    console.log("\n✅ Seed packages completed!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedPackages();

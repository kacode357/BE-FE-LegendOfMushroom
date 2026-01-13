// Package service for USER_LOM

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// API Response interface (what we get from BE)
interface PackageApiItem {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  price?: string;
  priceEn?: string;
  features?: string[];
  featuresEn?: string[];
  fileUrl: string;
  gradient?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
}

// Normalized Package interface (what we use in UI)
export interface Package {
  id: string;
  name: string;
  nameEn: string;
  price: string;
  priceEn: string;
  features: string[];
  featuresEn: string[];
  fileUrl: string;
  gradient: string;
  order: number;
  isActive: boolean;
}

export interface PackageListResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    items: PackageApiItem[];
  };
}

// Default gradients for packages
const DEFAULT_GRADIENTS = [
  'from-blue-500 via-blue-400 to-cyan-500',
  'from-purple-500 via-purple-400 to-pink-500',
  'from-amber-500 via-orange-400 to-red-500',
];

class PackageService {
  private baseUrl = `${API_BASE_URL}/api/packages`;

  // Parse description string into features array using comma
  private parseDescription(description: string): string[] {
    if (!description) return [];
    return description.split(',').map(f => f.trim()).filter(f => f.length > 0);
  }

  // Normalize API response to our Package interface
  private normalizePackage(item: PackageApiItem, index: number): Package {
    // Parse features from description if not provided
    const features = item.features && item.features.length > 0 
      ? item.features 
      : this.parseDescription(item.description || '');
    
    const featuresEn = item.featuresEn && item.featuresEn.length > 0
      ? item.featuresEn
      : features; // Fallback to Vietnamese features

    return {
      id: item.id,
      name: item.name,
      nameEn: item.nameEn || item.name,
      price: item.price || 'Miễn Phí',
      priceEn: item.priceEn || 'Free',
      features,
      featuresEn,
      fileUrl: item.fileUrl,
      gradient: item.gradient || DEFAULT_GRADIENTS[index % DEFAULT_GRADIENTS.length],
      order: item.order ?? index + 1,
      isActive: item.isActive ?? true,
    };
  }

  async getPackages(): Promise<Package[]> {
    try {
      const response = await fetch(this.baseUrl);
      const result: PackageListResponse = await response.json();
      
      if (result.success && result.data?.items) {
        // Normalize, filter active, and sort by order
        return result.data.items
          .map((item, index) => this.normalizePackage(item, index))
          .filter(pkg => pkg.isActive)
          .sort((a, b) => a.order - b.order);
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching packages:', error);
      return [];
    }
  }
}

export const packageService = new PackageService();

export type PackageDto = {
  id: string;
  name: string;
  description: string | null;
  fileUrl: string | null;
  isHidden?: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

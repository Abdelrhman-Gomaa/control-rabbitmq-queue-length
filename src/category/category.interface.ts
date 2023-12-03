export interface IUpdateCategory {
  enTitle: string;
  arTitle: string;
  enDescription: string;
  arDescription: string;
  isPublished: boolean;
}

export interface ICategory extends IUpdateCategory {
  id: number;
}

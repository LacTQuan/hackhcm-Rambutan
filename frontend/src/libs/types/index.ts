export interface Item {
    img: string;
    desc: string;
}

export interface ImageCard {
    imageUrl: string;
    objects: { [key: string]: number[][] };
    reasoning: string;
  }

export interface Entry {
    _id: string;
    createdAt: Date;
    images: ImageCard[];
}
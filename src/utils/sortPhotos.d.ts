export function sortPhotos(
  photos: Array<{
    id: string;
    imageUrl: string;
    thumbPath?: string;
    title?: string;
    caption?: string;
    author?: string;
    body?: string;
    date?: string;
  }>,
  option: string
): typeof photos;
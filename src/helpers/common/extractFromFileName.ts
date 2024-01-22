export function extractFileName(url: string): string {
    const pattern = /image/;
    const index = url.search(pattern);
  
    if (index !== -1) {
      return url.substring(index);
    }
  
    return url; 
  }
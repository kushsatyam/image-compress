import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadServiceService {

  constructor() { }

  downloadFiles(urls: any[]): void {
    urls.forEach((url:any) => {
      if (url) {
        const randomFilename = this.generateRandomFilename();
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url.previewUrl;
        a.download = randomFilename;

        document.body.appendChild(a);
        a.click();

        // Clean up the URL object after download
        // URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Invalid URL:', url.previewUrl);  // Catch any invalid URLs
      }
    });
  }

  private generateRandomFilename(): string {
    const randomString = Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15);
    return `${randomString}.jpg`;  // Modify the extension as needed
  }

}

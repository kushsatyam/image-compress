import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import imageCompression from 'browser-image-compression';
import { NgxImageCompressService } from 'ngx-image-compress';
import { FileDownloadServiceService } from '../file-download-service.service';

@Component({
  selector: 'app-compress-image',
  standalone: true,
  imports: [NgFor,NgIf],
  providers:[DecimalPipe],
  templateUrl: './compress-image.component.html',
  styleUrl: './compress-image.component.css'
})
export class CompressImageComponent implements OnDestroy{

  constructor(private fileDownloadService: FileDownloadServiceService,private router:Router,private imageCompress: NgxImageCompressService,private decimalPipe: DecimalPipe){}

  // file:any=[];
  // base64StringArray:any=[];

  // compressedImage:any;

  // onImageUpload(e:any){
  //   // console.log(e.target.files[0]);
  //   let file = e.target.files;
  //   this.base64StringArray = [];
  //   let i =0;

  //   if (file.length) {
  //     for(let item of file){
  //       const reader = new FileReader();
      
  //       reader.onload = (e: any) => {
  //         const base64String = e.target.result as string;
  //         this.compressImage(base64String,i);
  //         // console.log(base64String); // This is your Base64 string
  //         // this.base64StringArray.push(base64String);
  //       };
    
  //       reader.readAsDataURL(item); // Converts the file to base64
  //     }
  //   }
    
  // }

  // compressImage(file:any,index:any){
  //   this.imageCompress.compressFile(file,-1, 100, 85).then(
  //     result => {
  //       // You can now use the compressed image file
  //       console.log('Compressed image:', result);
  //       this.base64StringArray.push(result);
  //     }
  //   ).catch();
  // }
  
  compressedImages: File[] = [];
  imagePreviews: { previewUrl: string, size: number }[] = [];

  uploadedImage:any = [];

  isLoading = false;
  progress = 0;
  totalImages = 0;
  imagesProcessed = 0;

  onImageUpload(event: any): void {
    const files: FileList = event.target.files;
    let uploadFiles = event.target.files;
    if (files.length<=10) {
      this.uploadedImage = [];
      for(let item of uploadFiles){
        this.uploadedImage.push(URL.createObjectURL(item));
      }

      this.isLoading = true;
      this.progress = 0;
      this.totalImages = files.length;
      this.imagesProcessed = 0;

      Array.from(files).forEach((file, index) => {
        this.compressImage(file, index);
      });
    }else{
      alert("Only 10 Images at time compress")
      // window.location.reload;
      this.router.navigate(['/']);
    }
  }

  async compressImage(file: File, index: number): Promise<void> {
    try {
      const options = {
        maxSizeMB: 1,                // Maximum size in MB for the compressed image
        maxWidthOrHeight: Infinity,  // Retain original dimensions by setting to Infinity
        useWebWorker: true,          // Enable web worker for faster compression
        initialQuality: 0.5,           // Start with the best quality and compress down
      };

      const compressedFile = await imageCompression(file, options);
      console.log('Original file:', file);
      console.log('Compressed file:', compressedFile);

      // Store the compressed file
      this.compressedImages.push(compressedFile);
      const previewUrl = URL.createObjectURL(compressedFile);

      const fileSize = (compressedFile.size / 1024).toFixed(2);

      this.imagePreviews.push({ 
        previewUrl, 
        size: parseFloat(fileSize) 
      });

      // Update progress
      this.imagesProcessed++;
      this.progress = (this.imagesProcessed / this.totalImages) * 100;

      // Hide loader when done
      if (this.imagesProcessed === this.totalImages) {
        this.isLoading = false;
        this.progress = 100; // Ensure progress reaches 100%
      }


    } catch (error) {
      console.error('Image compression error:', error);
      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    // Clean up blob URLs when the component is destroyed
    this.imagePreviews.forEach(image => URL.revokeObjectURL(image.previewUrl));
    this.uploadedImage.forEach((img: any) => URL.revokeObjectURL(img));
  }

  getProgressText(): string {
    return this.decimalPipe.transform(this.progress, '1.0-0') + '%';
  }

  downloadAllFiles(): void {
    this.fileDownloadService.downloadFiles(this.imagePreviews);
  }
}

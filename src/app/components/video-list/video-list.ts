import { Component } from '@angular/core';
import { Video, VideoService } from '../../services/video.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './video-list.html',
  styleUrl: './video-list.css',
})
export class VideoList {
  filteredVideos: Video[] = [];
  searchText = '';
  modalVideoId: string | null = null;

  constructor(private videoService: VideoService) {
    this.filterVideos();
  }

  filterVideos() {
    this.filteredVideos = this.videoService.getVideos(this.searchText);
  }

  onFilterChange() {
    this.filterVideos();
  }

  openVideo(url: string) {
    window.open(url, '_blank');
  }

  getThumbnail(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  openModal(videoId: string) {
    this.modalVideoId = videoId;
  }

  closeModal() {
    this.modalVideoId = null;
  }

  openVideoInNewTab(url: string) {
    window.open(url, '_blank');
  }
}

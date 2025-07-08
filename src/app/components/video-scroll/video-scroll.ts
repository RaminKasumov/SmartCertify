import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Video, VideoService } from '../../services/video.service';

@Component({
  selector: 'app-video-scroll',
  imports: [FormsModule, CommonModule],
  templateUrl: './video-scroll.html',
  styleUrl: './video-scroll.css',
})
export class VideoScroll implements OnInit, OnChanges {
  referenceVideos: Video[] = [];
  @Input() courseTopic: string = '';
  constructor(private videoService: VideoService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.referenceVideos = this.videoService.getVideos(this.courseTopic);
  }

  ngOnInit() {
    this.referenceVideos = this.videoService.getVideos(this.courseTopic);
  }

  // Extract YouTube video ID and generate thumbnail URL
  getThumbnail(url: string): string {
    const videoId = this.extractVideoId(url);
    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
  }

  // Helper function to extract video ID from URL
  extractVideoId(url: string): string | null {
    const match = url.match(/v=([^&]+)/);
    return match ? match[1] : null;
  }

  // Open video in a new tab
  openVideo(url: string): void {
    window.open(url, '_blank');
  }
}

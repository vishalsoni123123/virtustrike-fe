import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';

@Component({
  selector: 'app-game-news-page',
  templateUrl: './game-news-page.component.html',
  styleUrls: ['./game-news-page.component.scss']
})
export class GameNewsPageComponent implements OnInit, OnDestroy {
  originalNewsList = [
    { image: './assets/images/game-news-img/news-1.jpg', tag: 'Technology', date: '2022-01-04', author: 'Krista Gordon', title: 'Innovative Business Models You Must Know.', description: 'Financial experts support or help you...', link: '#' },
    { image: './assets/images/game-news-img/news-2.jpg', tag: 'Innovation', date: '2022-01-05', author: 'Tyrell Wellick', title: 'Startup Launch Tips For New Founders.', description: 'Financial experts support or help you...', link: '#' },
    { image: './assets/images/game-news-img/news-3.jpg', tag: 'Finance', date: '2022-01-03', author: 'Angela Moss', title: 'Financial Experts Support Help You To Find Out.', description: 'Financial experts support or help you...', link: '#' },
    { image: './assets/images/game-news-img/news-4.jpg', tag: 'Business', date: '2022-01-01', author: 'Elliot Alderson', title: 'Innovative Business All Over The World.', description: 'Financial experts support or help you...', link: '#' },
    { image: './assets/images/game-news-img/news-5.jpg', tag: 'Startup', date: '2022-01-02', author: 'Darlene Smith', title: 'How To Start Initiating A Startup In Few Days.', description: 'Financial experts support or help you...', link: '#' },
    { image: './assets/images/game-news-img/news-6.jpeg', tag: 'Innovation', date: '2022-01-05', author: 'Tyrell Wellick', title: 'Startup Launch Tips For New Founders.', description: 'Financial experts support or help you...', link: '#' }
  ];

  displayNews: any[] = [];
  itemWidth = 0;
  itemsPerView = 3;
  currentIndex = 0;
  transformStyle = '';
  transitionStyle = 'transform 0.5s ease-in-out';
  autoSlideInterval: any;

  ngOnInit(): void {
    this.updateResponsiveSettings();
    this.setupSlider();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.clearAutoSlide();
  }

  @HostListener('window:resize')
  onResize() {
    setTimeout(() => {
      this.updateResponsiveSettings();
      this.setupSlider();
    }, 100);
  }

  updateResponsiveSettings() {
    const container = document.querySelector('.slider-viewport') as HTMLElement;
    const width = container?.clientWidth || window.innerWidth;

    if (width <= 480) this.itemsPerView = 1;
    else if (width <= 768) this.itemsPerView = 2;
    else this.itemsPerView = 3;

    this.itemWidth = width / this.itemsPerView;
  }

  setupSlider() {
    const cloneStart = this.originalNewsList.slice(-this.itemsPerView);
    const cloneEnd = this.originalNewsList.slice(0, this.itemsPerView);
    this.displayNews = [...cloneStart, ...this.originalNewsList, ...cloneEnd];
    this.currentIndex = this.itemsPerView;
    this.transitionStyle = 'none';
    this.updateTransform();
  }

  updateTransform() {
    this.transformStyle = `translateX(-${this.currentIndex * this.itemWidth}px)`;
  }

  nextSlide() {
    this.currentIndex++;
    this.transitionStyle = 'transform 0.5s ease-in-out';
    this.updateTransform();

    if (this.currentIndex === this.originalNewsList.length + this.itemsPerView) {
      setTimeout(() => {
        this.transitionStyle = 'none';
        this.currentIndex = this.itemsPerView;
        this.updateTransform();
      }, 500);
    }
  }

  prevSlide() {
    this.currentIndex--;
    this.transitionStyle = 'transform 0.5s ease-in-out';
    this.updateTransform();

    if (this.currentIndex === 0) {
      setTimeout(() => {
        this.transitionStyle = 'none';
        this.currentIndex = this.originalNewsList.length;
        this.updateTransform();
      }, 500);
    }
  }

  startAutoSlide() {
    this.clearAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  pauseAutoSlide() {
    this.clearAutoSlide();
  }

  resumeAutoSlide() {
    this.startAutoSlide();
  }

  clearAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }
}
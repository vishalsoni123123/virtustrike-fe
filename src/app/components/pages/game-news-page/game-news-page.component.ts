import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';

@Component({
  selector: 'app-game-news-page',
  templateUrl: './game-news-page.component.html',
  styleUrls: ['./game-news-page.component.scss']
})


export class GameNewsPageComponent implements OnInit, OnDestroy { originalNewsList = [ { image: './assets/images/game-news-img/news-1.jpg', tag: 'Launch', date: '2025-07-26', author: 'Virtustrike team', title: 'VirtuStrike Launches Next-Gen Free-Roam VR Arena in Indore', description: 'gaming support or help you...', link: '#' }, { image: './assets/images/game-news-img/news-2.jpg', tag: 'Events', date: '2025-09-25', author: 'VirtuStrike Team', title: 'VR Battles and Multiplayer Tournaments.', description: 'Join VirtuStrike every weekend for ...', link: '#' }, { image: './assets/images/game-news-img/news-3.jpg', tag: 'Innovation', date: '2025-08-13', author: 'VirtuStrike Team', title: 'Building India’s Own VR Gaming and Haptics Technology', description: 'VirtuStrike is developing indigenous VR software ...', link: '#' }, { image: './assets/images/game-news-img/news-4.jpg', tag: 'Community', date: '2025-01-01', author: 'Virtustrike team', title: 'Introducing Students to the Future of VR..', description: 'VirtuStrike partners with schools and colleg..', link: '#' }, { image: './assets/images/game-news-img/news-5.jpg', tag: 'Patnership', date: '2025-01-02', author: 'Virtustrike team', title: 'Collaborating with Indian Developers to Create VR Game.', description: 'We are working with local studios to design free...', link: '#' }, { image: './assets/images/game-news-img/news-6.jpeg', tag: 'offers', date: '2025-11-05', author: 'Virtustrike Team', title: 'Festive Discounts on All VR Experiences.', description: 'Celebrate with exciting offers on group booking...', link: '#' } ];
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

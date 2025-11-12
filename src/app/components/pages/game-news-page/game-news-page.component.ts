import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';

@Component({
  selector: 'app-game-news-page',
  templateUrl: './game-news-page.component.html',
  styleUrls: ['./game-news-page.component.scss']
})
export class GameNewsPageComponent implements OnInit, OnDestroy { originalNewsList = [ { image: './assets/images/game-news-img/news-1.jpg', tag: 'Launch', date: '2025-10-15', author: 'VirtuStrike Team', title: 'VirtuStrike Launches Next-Gen Free-Roam VR Arena in Indore', description: 'Step into Indore’s first large-scale VR gaming experience featuring free-roam adventures and high-end immersive tech.', link: '#' }, 
                                                                                      { image: './assets/images/game-news-img/news-2.jpg', tag: 'Events', date: '2025-09-20', author: 'VirtuStrike Team', title: 'Weekend VR Battles and Multiplayer Tournaments', description: 'Join VirtuStrike every weekend for thrilling multiplayer VR competitions and exciting community gaming sessions.', link: '#' },
                                                                                      { image: './assets/images/game-news-img/news-3.jpg', tag: 'Innovation', date: '2025-08-10', author: 'VirtuStrike Labs', title: 'Building India’s Own VR Gaming and Haptics Technology', description: 'VirtuStrike is developing indigenous VR software and haptic solutions to revolutionize interactive gaming in India.', link: '#' }, 
                                                                                      { image: './assets/images/game-news-img/news-4.jpg', tag: 'Community', date: '2025-07-05', author: 'VirtuStrike Team', title: 'Introducing Students to the Future of Virtual Reality', description: 'VirtuStrike partners with schools and colleges in Indore to educate youth about immersive VR technology and innovation.', link: '#' }, 
                                                                                      { image: './assets/images/game-news-img/news-5.jpg', tag: 'Partnerships', date: '2025-06-25', author: 'VirtuStrike Team', title: 'Collaborating with Indian Developers to Create VR Games', description: 'We are working with local studios to design free-roam VR titles optimized for VirtuStrike’s arena experience.', link: '#' },
                                                                                      { image: './assets/images/game-news-img/news-6.jpeg', tag: 'Offers', date: '2025-05-10', author: 'VirtuStrike Team', title: 'Festive Discounts on All VR Experiences at VirtuStrike', description: 'Celebrate with exciting offers on group bookings and premium VR games — exclusively at VirtuStrike Indore.', link: '#' } ]; }

  
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

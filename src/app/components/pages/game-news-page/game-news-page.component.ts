import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';

@Component({
  selector: 'app-game-news-page',
  templateUrl: './game-news-page.component.html',
  styleUrls: ['./game-news-page.component.scss']
})

export class GameNewsPageComponent implements OnInit, OnDestroy {
  originalNewsList = [
    {
      image: './assets/images/game-news-img/news-1.jpg',
      tag: 'New Launch',
      date: '2025-10-20',
      author: 'VirtuStrike Team',
      title: 'VirtuStrike Expands VR Gaming Experience in Indore',
      description: 'Our arena at The Hub, Scheme 78, brings next-gen free-roam VR gaming to the heart of Indore. Step into immersive adventures like never before.',
      link: '#'
    },
    {
      image: './assets/images/game-news-img/news-2.jpg',
      tag: 'Event',
      date: '2025-09-15',
      author: 'VirtuStrike Team',
      title: 'Weekend VR Battles & Multiplayer Challenges',
      description: 'Join our thrilling weekend tournaments and multiplayer VR experiences. Compete, win prizes, and show off your gaming skills at VirtuStrike.',
      link: '#'
    },
    {
      image: './assets/images/game-news-img/news-3.jpg',
      tag: 'Innovation',
      date: '2025-08-30',
      author: 'VirtuStrike Labs',
      title: 'Developing India’s Own Free-Roam VR Technology',
      description: 'VirtuStrike is working on indigenous VR haptics and immersive systems to redefine how India experiences virtual reality gaming.',
      link: '#'
    },
    {
      image: './assets/images/game-news-img/news-4.jpg',
      tag: 'Community',
      date: '2025-07-25',
      author: 'VirtuStrike Team',
      title: 'Bringing VR Fun and Education to Indore’s Youth',
      description: 'We’re introducing children and students to safe, interactive, and learning-based VR experiences — blending fun with innovation.',
      link: '#'
    },
    {
      image: './assets/images/game-news-img/news-5.jpg',
      tag: 'Partnerships',
      date: '2025-06-10',
      author: 'VirtuStrike Team',
      title: 'Collaborating with Local Startups for VR Growth',
      description: 'VirtuStrike partners with Indore-based creators and developers to build an ecosystem for VR gaming, design, and tech innovation in India.',
      link: '#'
    },
    {
      image: './assets/images/game-news-img/news-6.jpeg',
      tag: 'Offers',
      date: '2025-05-05',
      author: 'VirtuStrike Team',
      title: 'Special Festive Offers on All VR Experiences!',
      description: 'Celebrate festivals with us! Enjoy discounts on all games and group bookings at VirtuStrike VR Arena, Indore’s favorite gaming spot.',
      link: '#'
    }
  ];
}

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

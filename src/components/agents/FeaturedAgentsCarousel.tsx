import React, { useState, useEffect } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Profile } from '../../utils/mockData';
import AgentCard from './AgentCard';
import 'keen-slider/keen-slider.min.css';

interface FeaturedAgentsCarouselProps {
  agents: Profile[];
}

const FeaturedAgentsCarousel: React.FC<FeaturedAgentsCarouselProps> = ({ agents }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slides: {
      perView: 'auto',
      spacing: 24,
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: { perView: 2, spacing: 24 },
      },
      '(min-width: 1024px)': {
        slides: { perView: 4, spacing: 24 },
      },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      if (instanceRef.current) {
        instanceRef.current.next();
      }
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [instanceRef]);

  // Pause auto-advance on hover
  const handleMouseEnter = () => {
    if (instanceRef.current) {
      instanceRef.current.container.classList.add('keen-slider--paused');
    }
  };

  const handleMouseLeave = () => {
    if (instanceRef.current) {
      instanceRef.current.container.classList.remove('keen-slider--paused');
    }
  };

  // Show grid layout if 4 or fewer agents
  if (agents.length <= 4) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {agents.map(agent => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Carousel Container */}
      <div
        ref={sliderRef}
        className="keen-slider overflow-visible"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {agents.map(agent => (
          <div key={agent.id} className="keen-slider__slide !min-w-[300px] md:!min-w-0">
            <AgentCard agent={agent} />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {loaded && instanceRef.current && (
        <>
          <button
            onClick={() => instanceRef.current?.prev()}
            disabled={currentSlide === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full glass-panel-dark flex items-center justify-center transition-all duration-300 ${
              currentSlide === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'opacity-0 group-hover:opacity-100 hover:bg-white/10'
            }`}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => instanceRef.current?.next()}
            disabled={currentSlide === instanceRef.current.track.details.maxIdx}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 rounded-full glass-panel-dark flex items-center justify-center transition-all duration-300 ${
              currentSlide === instanceRef.current.track.details.maxIdx
                ? 'opacity-50 cursor-not-allowed'
                : 'opacity-0 group-hover:opacity-100 hover:bg-white/10'
            }`}
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {loaded && instanceRef.current && (
        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(instanceRef.current.track.details.slides.length)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'bg-accent-500 w-4' : 'bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedAgentsCarousel;
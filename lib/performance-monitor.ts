interface ImageLoadMetrics {
  src: string;
  loadTime: number;
  size?: number;
  fromCache: boolean;
  retry: boolean;
  success: boolean;
}

class PerformanceMonitor {
  private metrics: ImageLoadMetrics[] = [];
  private observer?: PerformanceObserver;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObserver();
    }
  }

  private initializeObserver() {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource' && entry.name.includes('image')) {
            this.recordResourceTiming(entry as PerformanceResourceTiming);
          }
        }
      });

      this.observer.observe({ entryTypes: ['resource'] });
    }
  }

  private recordResourceTiming(entry: PerformanceResourceTiming) {
    const metric: ImageLoadMetrics = {
      src: entry.name,
      loadTime: entry.responseEnd - entry.startTime,
      size: entry.transferSize,
      fromCache: entry.transferSize === 0,
      retry: false,
      success: entry.responseStatus === 200,
    };

    this.metrics.push(metric);
    this.analyzePerformance(metric);
  }

  trackImageLoad(src: string, startTime: number, retry = false) {
    const loadTime = performance.now() - startTime;
    
    const metric: ImageLoadMetrics = {
      src,
      loadTime,
      fromCache: false,
      retry,
      success: true,
    };

    this.metrics.push(metric);
    this.analyzePerformance(metric);
  }

  trackImageError(src: string, startTime: number, retry = false) {
    const loadTime = performance.now() - startTime;
    
    const metric: ImageLoadMetrics = {
      src,
      loadTime,
      fromCache: false,
      retry,
      success: false,
    };

    this.metrics.push(metric);
    this.analyzePerformance(metric);
  }

  private analyzePerformance(metric: ImageLoadMetrics) {
    // Log slow loading images
    if (metric.loadTime > 3000) {
      console.warn(`Slow image load detected: ${metric.src} took ${metric.loadTime}ms`);
    }

    // Log failed images
    if (!metric.success) {
      console.error(`Image failed to load: ${metric.src}`);
    }

    // Send metrics to analytics (implement your analytics service)
    this.sendMetrics(metric);
  }

  private sendMetrics(metric: ImageLoadMetrics) {
    // Example: Send to Google Analytics, DataDog, etc.
    if (typeof gtag !== 'undefined') {
      gtag('event', 'image_load', {
        event_category: 'performance',
        event_label: metric.success ? 'success' : 'error',
        value: Math.round(metric.loadTime),
        custom_map: {
          load_time: metric.loadTime,
          from_cache: metric.fromCache,
          retry: metric.retry,
        },
      });
    }
  }

  getMetrics() {
    return {
      totalImages: this.metrics.length,
      averageLoadTime: this.metrics.reduce((acc, m) => acc + m.loadTime, 0) / this.metrics.length,
      failureRate: this.metrics.filter(m => !m.success).length / this.metrics.length,
      cacheHitRate: this.metrics.filter(m => m.fromCache).length / this.metrics.length,
      slowImages: this.metrics.filter(m => m.loadTime > 3000),
    };
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();
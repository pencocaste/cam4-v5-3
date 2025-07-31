import { removeDuplicateCams, mergeUniqueCams, CamTracker } from '@/lib/utils';
import { type Cam } from '@/lib/types';

// Mock cam data for testing
const mockCams: Cam[] = [
  {
    id: 1,
    nickname: "model1",
    gender: "female",
    country: "US",
    viewers: 100,
    thumb: "thumb1.jpg",
    thumb_big: null,
    thumb_error: "error1.jpg",
    status: "online",
    show_tags: ["tag1"],
    languages: ["en"],
    broadcast_type: "public",
    show_type: "free",
    daily_award: false,
    monthly_award: false,
    hd_stream: true,
    private_room: false,
    new_performer: false,
    has_shop_content: false,
    kiiroo: false,
    mobile: false,
    goal: 0,
    goal_balance: 0
  },
  {
    id: 2,
    nickname: "model2",
    gender: "male",
    country: "UK",
    viewers: 200,
    thumb: "thumb2.jpg",
    thumb_big: null,
    thumb_error: "error2.jpg",
    status: "online",
    show_tags: ["tag2"],
    languages: ["en"],
    broadcast_type: "public",
    show_type: "free",
    daily_award: false,
    monthly_award: false,
    hd_stream: true,
    private_room: false,
    new_performer: false,
    has_shop_content: false,
    kiiroo: false,
    mobile: false,
    goal: 0,
    goal_balance: 0
  }
];

describe('Duplicate Prevention Utils', () => {
  describe('removeDuplicateCams', () => {
    it('should remove duplicate cams based on ID', () => {
      const camsWithDuplicates = [
        mockCams[0],
        mockCams[1],
        mockCams[0], // duplicate
        mockCams[1]  // duplicate
      ];
      
      const result = removeDuplicateCams(camsWithDuplicates);
      
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });
    
    it('should return empty array for empty input', () => {
      const result = removeDuplicateCams([]);
      expect(result).toHaveLength(0);
    });
    
    it('should return same array if no duplicates', () => {
      const result = removeDuplicateCams(mockCams);
      expect(result).toHaveLength(2);
      expect(result).toEqual(mockCams);
    });
  });
  
  describe('mergeUniqueCams', () => {
    it('should merge arrays without duplicates', () => {
      const existing = [mockCams[0]];
      const newCams = [mockCams[1]];
      
      const result = mergeUniqueCams(existing, newCams);
      
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });
    
    it('should filter out duplicates from new cams', () => {
      const existing = [mockCams[0], mockCams[1]];
      const newCams = [mockCams[0], mockCams[1]]; // all duplicates
      
      const result = mergeUniqueCams(existing, newCams);
      
      expect(result).toHaveLength(2); // should remain the same
      expect(result).toEqual(existing);
    });
    
    it('should handle empty existing array', () => {
      const result = mergeUniqueCams([], mockCams);
      expect(result).toEqual(mockCams);
    });
  });
  
  describe('CamTracker', () => {
    let tracker: CamTracker;
    
    beforeEach(() => {
      tracker = new CamTracker();
    });
    
    it('should track added cams', () => {
      tracker.addCams([mockCams[0]]);
      
      expect(tracker.hasModel(1)).toBe(true);
      expect(tracker.hasModel(2)).toBe(false);
      expect(tracker.getLoadedCount()).toBe(1);
    });
    
    it('should filter out already tracked cams', () => {
      tracker.addCams([mockCams[0]]);
      
      const filtered = tracker.filterUnique(mockCams);
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe(2);
    });
    
    it('should clear tracking', () => {
      tracker.addCams(mockCams);
      expect(tracker.getLoadedCount()).toBe(2);
      
      tracker.clear();
      expect(tracker.getLoadedCount()).toBe(0);
      expect(tracker.hasModel(1)).toBe(false);
    });
  });
});

describe('Integration Tests', () => {
  it('should simulate loading cams without duplicates', () => {
    const tracker = new CamTracker();
    let loadedCams: Cam[] = [];
    
    // Simulate first load
    const firstBatch = [mockCams[0]];
    tracker.addCams(firstBatch);
    loadedCams = mergeUniqueCams(loadedCams, firstBatch);
    
    expect(loadedCams).toHaveLength(1);
    
    // Simulate second load with one duplicate and one new
    const secondBatch = [mockCams[0], mockCams[1]]; // mockCams[0] is duplicate
    const uniqueSecondBatch = tracker.filterUnique(secondBatch);
    tracker.addCams(uniqueSecondBatch);
    loadedCams = mergeUniqueCams(loadedCams, uniqueSecondBatch);
    
    expect(loadedCams).toHaveLength(2);
    expect(loadedCams.map(c => c.id)).toEqual([1, 2]);
  });
});
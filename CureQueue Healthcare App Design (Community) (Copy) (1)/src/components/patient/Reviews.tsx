import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Star, 
  Search, 
  ThumbsUp, 
  MessageCircle, 
  Filter,
  Plus,
  Check
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

type ReviewTab = 'browse' | 'write';

export function Reviews() {
  const [activeTab, setActiveTab] = useState<ReviewTab>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [reviewForm, setReviewForm] = useState({
    provider: '',
    rating: 0,
    title: '',
    review: '',
    wouldRecommend: true
  });

  const reviews = [
    {
      id: 1,
      patientName: 'Sarah M.',
      doctorName: 'Dr. Sarah Johnson',
      hospitalName: 'City General Hospital',
      rating: 5,
      date: '2 days ago',
      title: 'Excellent care and very professional',
      review: 'Dr. Johnson was incredibly thorough and took time to explain everything. The appointment was on time and the staff was very friendly. Highly recommend!',
      helpful: 12,
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      patientName: 'Mike R.',
      doctorName: 'Dr. Michael Chen',
      hospitalName: 'Medicare Clinic',
      rating: 4,
      date: '1 week ago',
      title: 'Good experience overall',
      review: 'Wait time was a bit longer than expected but Dr. Chen was very knowledgeable and answered all my questions. The facility is clean and modern.',
      helpful: 8,
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      patientName: 'Emma L.',
      doctorName: 'Dr. Emma Wilson',
      hospitalName: 'Health Plus Center',
      rating: 5,
      date: '2 weeks ago',
      title: 'Outstanding home visit service',
      review: 'Dr. Wilson came to my home when I couldn\'t travel. She was punctual, professional, and provided excellent care. This service is a game-changer!',
      helpful: 15,
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const providers = [
    'Dr. Sarah Johnson - City General Hospital',
    'Dr. Michael Chen - Medicare Clinic',
    'Dr. Emma Wilson - Health Plus Center',
    'Dr. James Rodriguez - CardioCare Clinic'
  ];

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm', interactive: boolean = false) => {
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => setReviewForm({...reviewForm, rating: star}) : undefined}
          />
        ))}
      </div>
    );
  };

  const renderBrowseReviews = () => (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search reviews by doctor or hospital..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="3">3+ Stars</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <ImageWithFallback
                src={review.avatar}
                alt={review.patientName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gray-900">{review.patientName}</span>
                  {review.verified && (
                    <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <Check className="w-3 h-3" />
                      Verified
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {review.doctorName} • {review.hospitalName}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <h4 className="text-gray-900 mb-2">{review.title}</h4>
              <p className="text-gray-700 text-sm leading-relaxed">{review.review}</p>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <button className="flex items-center gap-1 hover:text-gray-700">
                <ThumbsUp className="w-4 h-4" />
                Helpful ({review.helpful})
              </button>
              <button className="flex items-center gap-1 hover:text-gray-700">
                <MessageCircle className="w-4 h-4" />
                Reply
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <Button variant="outline" className="w-full">
        Load More Reviews
      </Button>
    </div>
  );

  const renderWriteReview = () => (
    <div className="space-y-6">
      <Card className="p-4 space-y-4">
        <h3 className="text-gray-900">Write a Review</h3>
        
        <div>
          <label className="block text-sm text-gray-700 mb-2">Select Healthcare Provider</label>
          <Select 
            value={reviewForm.provider} 
            onValueChange={(value) => setReviewForm({...reviewForm, provider: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a doctor or hospital..." />
            </SelectTrigger>
            <SelectContent>
              {providers.map((provider) => (
                <SelectItem key={provider} value={provider}>
                  {provider}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">Overall Rating</label>
          <div className="flex items-center gap-2">
            {renderStars(reviewForm.rating, 'lg', true)}
            <span className="text-gray-600">
              {reviewForm.rating === 0 ? 'Click to rate' : 
               reviewForm.rating === 1 ? 'Poor' :
               reviewForm.rating === 2 ? 'Fair' :
               reviewForm.rating === 3 ? 'Good' :
               reviewForm.rating === 4 ? 'Very Good' : 'Excellent'}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">Review Title</label>
          <Input
            placeholder="Summarize your experience..."
            value={reviewForm.title}
            onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-2">Your Review</label>
          <Textarea
            placeholder="Share details about your experience, what went well, and any areas for improvement..."
            value={reviewForm.review}
            onChange={(e) => setReviewForm({...reviewForm, review: e.target.value})}
            rows={5}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="recommend"
            checked={reviewForm.wouldRecommend}
            onChange={(e) => setReviewForm({...reviewForm, wouldRecommend: e.target.checked})}
            className="rounded border-gray-300"
          />
          <label htmlFor="recommend" className="text-sm text-gray-700">
            I would recommend this healthcare provider to others
          </label>
        </div>

        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={!reviewForm.provider || !reviewForm.rating || !reviewForm.title || !reviewForm.review}
        >
          Submit Review
        </Button>
      </Card>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <h4 className="text-blue-900 mb-2">Review Guidelines</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be honest and specific about your experience</li>
          <li>• Focus on the quality of care and service</li>
          <li>• Avoid sharing personal medical details</li>
          <li>• Keep your review respectful and constructive</li>
        </ul>
      </Card>
    </div>
  );

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-xl mb-2 text-gray-900">Reviews & Ratings</h2>
        <p className="text-gray-600">Share and read experiences from our community</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('browse')}
          className={`flex-1 py-2 px-4 rounded-md text-sm transition-colors ${
            activeTab === 'browse' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Browse Reviews
        </button>
        <button
          onClick={() => setActiveTab('write')}
          className={`flex-1 py-2 px-4 rounded-md text-sm transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'write' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Plus className="w-4 h-4" />
          Write Review
        </button>
      </div>

      {activeTab === 'browse' ? renderBrowseReviews() : renderWriteReview()}
    </div>
  );
}
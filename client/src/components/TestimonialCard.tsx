import { Star, StarHalf } from 'lucide-react';

interface TestimonialCardProps {
  content: string;
  author: string;
  title: string;
  rating: number;
}

const TestimonialCard = ({ content, author, title, rating }: TestimonialCardProps) => {
  // Create array of stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-current text-accent" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-current text-accent" />);
    }
    
    return stars;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <div className="text-accent flex">
          {renderStars()}
        </div>
      </div>
      <p className="text-gray-600 italic mb-4">
        "{content}"
      </p>
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-gray-600 font-bold">
            {author.split(' ').map(name => name[0]).join('')}
          </span>
        </div>
        <div className="ml-3">
          <h4 className="text-sm font-bold text-gray-900">{author}</h4>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;

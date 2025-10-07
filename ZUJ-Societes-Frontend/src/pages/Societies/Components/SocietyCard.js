import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SocietyCard(props) {
  const navigate = useNavigate();
  const [joined, setJoined] = useState(false);
  const defaultImage = 'https://img.freepik.com/free-vector/multicultural-people-standing-together_74855-6583.jpg';

  const handleClick = () => navigate(`/societies/${props.ID}`);

  const handleJoin = (e) => {
    e.stopPropagation();
    setJoined(true);
    // TODO: trigger join request API call
  };

  return (
    <div 
      onClick={handleClick}
      className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-xl transform hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-gray-100 mb-6"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={props.Image || defaultImage}
          alt={props.Name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300 mb-3">
          {props.Name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
          {props.Description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-500">{props.Member_Count || 0} members</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-500">{props.Category}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { MapPin, Search, Filter, Eye, ThumbsUp, ThumbsDown, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

const MapView = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);

  // Mock news reports with locations
  const newsReports = [
    {
      id: 1,
      title: 'Major Traffic Accident on Highway 101',
      description: 'Multiple vehicles involved in collision causing major delays. Emergency services on scene.',
      location: 'San Francisco, CA',
      coordinates: { lat: 37.7749, lng: -122.4194 },
      timestamp: '2 hours ago',
      category: 'emergency',
      verificationStatus: 'pending',
      verifications: { true: 12, false: 2, total: 14 },
      reportedBy: 'Local Resident'
    },
    {
      id: 2,
      title: 'New Restaurant Opens Downtown',
      description: 'Popular chef opens new fusion restaurant in the heart of downtown district.',
      location: 'Austin, TX',
      coordinates: { lat: 30.2672, lng: -97.7431 },
      timestamp: '4 hours ago',
      category: 'local',
      verificationStatus: 'verified',
      verifications: { true: 28, false: 1, total: 29 },
      reportedBy: 'Food Blogger'
    },
    {
      id: 3,
      title: 'City Council Announces New Budget',
      description: 'Major infrastructure investments planned for next fiscal year including road improvements.',
      location: 'Seattle, WA',
      coordinates: { lat: 47.6062, lng: -122.3321 },
      timestamp: '6 hours ago',
      category: 'politics',
      verificationStatus: 'verified',
      verifications: { true: 45, false: 3, total: 48 },
      reportedBy: 'City Reporter'
    },
    {
      id: 4,
      title: 'Flash Flood Warning Issued',
      description: 'Heavy rainfall expected to cause flooding in low-lying areas. Residents advised to avoid travel.',
      location: 'Phoenix, AZ',
      coordinates: { lat: 33.4484, lng: -112.0740 },
      timestamp: '1 hour ago',
      category: 'emergency',
      verificationStatus: 'disputed',
      verifications: { true: 8, false: 15, total: 23 },
      reportedBy: 'Weather Service'
    },
    {
      id: 5,
      title: 'Celebrity Spotted at Local Coffee Shop',
      description: 'Famous actor seen filming scenes at popular downtown coffee shop this morning.',
      location: 'Los Angeles, CA',
      coordinates: { lat: 34.0522, lng: -118.2437 },
      timestamp: '30 minutes ago',
      category: 'breaking',
      verificationStatus: 'false',
      verifications: { true: 3, false: 22, total: 25 },
      reportedBy: 'Anonymous'
    }
  ];

  // Calculate distance between two coordinates (simplified)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied, using default location');
          // Default to San Francisco for demo
          setUserLocation({ lat: 37.7749, lng: -122.4194 });
        }
      );
    } else {
      // Default location if geolocation not supported
      setUserLocation({ lat: 37.7749, lng: -122.4194 });
    }
  }, []);

  // Add distance to news reports based on user location
  const newsWithDistance = newsReports.map(news => ({
    ...news,
    distance: userLocation ? calculateDistance(
      userLocation.lat, userLocation.lng,
      news.coordinates.lat, news.coordinates.lng
    ) : null
  })).sort((a, b) => (a.distance || 0) - (b.distance || 0));

  // Filter news based on search and filter
  const filteredNews = newsWithDistance.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchLocation.toLowerCase()) ||
                         news.location.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || news.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'false': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'disputed': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'false': return 'bg-red-100 text-red-800 border-red-200';
      case 'disputed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'emergency': return 'bg-red-500';
      case 'breaking': return 'bg-orange-500';
      case 'politics': return 'bg-blue-500';
      case 'local': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleVerification = (newsId, isTrue) => {
    console.log(`User verified news ${newsId} as ${isTrue ? 'true' : 'false'}`);
    alert(`Thank you for verifying this news as ${isTrue ? 'TRUE' : 'FALSE'}!`);
  };

  return (
   <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">News Verification Map</h1>
        <p className="text-gray-600 mt-2">Help verify local news reports in your area</p>
        {userLocation && (
          <p className="text-sm text-blue-600 mt-1">
            📍 Your location detected - showing news sorted by proximity
          </p>
        )}
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search news or location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="emergency">Emergency</option>
              <option value="breaking">Breaking News</option>
              <option value="politics">Politics</option>
              <option value="local">Local News</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">News Locations</h3>
            
            {/* Interactive Map Placeholder */}
            <div className="relative bg-gray-100 rounded-lg h-96 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg font-medium">Interactive News Map</p>
                  <p className="text-gray-500 text-sm">Real map integration would show news locations here</p>
                </div>
              </div>
              
              {/* Mock map pins */}
              <div className="absolute inset-0">
                {filteredNews.slice(0, 5).map((news, index) => (
                  <div
                    key={news.id}
                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${20 + index * 15}%`,
                      top: `${30 + index * 10}%`
                    }}
                    onClick={() => setSelectedNews(news)}
                  >
                    <div className={`w-4 h-4 rounded-full ${getCategoryColor(news.category)} border-2 border-white shadow-lg hover:scale-110 transition-transform`}></div>
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                      {news.title.substring(0, 30)}...
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Legend */}
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Emergency</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Breaking News</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Politics</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Local News</span>
              </div>
            </div>
          </div>
        </div>

        {/* News List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Nearby News Reports</h3>
            <p className="text-sm text-gray-600">Help verify news in your area</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {filteredNews.map((news) => (
              <div 
                key={news.id} 
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                  selectedNews?.id === news.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => setSelectedNews(news)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{news.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{news.location}</p>
                      {news.distance && (
                        <p className="text-xs text-blue-600 font-medium">
                          📍 {news.distance.toFixed(1)} km away
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      {getStatusIcon(news.verificationStatus)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(news.category)} text-white`}>
                        {news.category}
                      </span>
                      <span className="text-xs text-gray-500">{news.timestamp}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {news.verifications.total} verifications
                    </div>
                  </div>

                  {/* Verification Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-green-600">True: {news.verifications.true}</span>
                      <span className="text-red-600">False: {news.verifications.false}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="bg-green-500 h-1 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${news.verifications.total > 0 ? (news.verifications.true / news.verifications.total) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected News Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{selectedNews.title}</h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-600">📍 {selectedNews.location}</span>
                    {selectedNews.distance && (
                      <span className="text-sm text-blue-600 font-medium">
                        {selectedNews.distance.toFixed(1)} km from you
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <p className="text-gray-700 leading-relaxed">{selectedNews.description}</p>
                <div className="flex items-center space-x-4 mt-4 text-sm text-gray-600">
                  <span>Reported by: {selectedNews.reportedBy}</span>
                  <span>•</span>
                  <span>{selectedNews.timestamp}</span>
                </div>
              </div>

              {/* Verification Status */}
              <div className={`p-4 rounded-lg border ${getStatusColor(selectedNews.verificationStatus)}`}>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(selectedNews.verificationStatus)}
                  <span className="font-medium capitalize">{selectedNews.verificationStatus}</span>
                </div>
              </div>

              {/* Verification Stats */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Community Verification</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Verified as True</span>
                    <span className="text-sm font-medium text-green-600">{selectedNews.verifications.true}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Marked as False</span>
                    <span className="text-sm font-medium text-red-600">{selectedNews.verifications.false}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${selectedNews.verifications.total > 0 ? (selectedNews.verifications.true / selectedNews.verifications.total) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    {selectedNews.verifications.total} total verifications
                  </p>
                </div>
              </div>

              {/* Verification Actions */}
              {selectedNews.distance && selectedNews.distance < 50 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3">
                    🎯 You're nearby! Help verify this news
                  </h4>
                  <p className="text-sm text-blue-700 mb-4">
                    Since you're within {selectedNews.distance.toFixed(1)} km of this location, your verification carries extra weight.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleVerification(selectedNews.id, true)}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>This is TRUE</span>
                    </button>
                    <button
                      onClick={() => handleVerification(selectedNews.id, false)}
                      className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      <span>This is FALSE</span>
                    </button>
                  </div>
                </div>
              )}

              {selectedNews.distance && selectedNews.distance >= 50 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-700">
                    ⚠️ You're {selectedNews.distance.toFixed(1)} km away from this location. 
                    Only people within 50km can verify local news for accuracy.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How News Verification Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Location-Based</h4>
            <p className="text-sm text-gray-600">Only people near the news location can verify its accuracy</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Community Verified</h4>
            <p className="text-sm text-gray-600">Multiple local residents verify each news report</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Real-Time Updates</h4>
            <p className="text-sm text-gray-600">Verification status updates as more people contribute</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
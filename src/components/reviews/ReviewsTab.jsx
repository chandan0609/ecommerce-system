import React,{useState} from "react";
import {useDispatch,useSelector} from "react-redux";
import {fetchReviews,deleteReview} from "../../redux/reviews/reviewsSlice"
const ReviewsTab = () => {
  const dispatch = useDispatch();
  const reviews = useSelector(state => state.reviews.items);
  const products = useSelector(state => state.products.items);
  const customers = useSelector(state => state.customers.items);
  const loading = useSelector(state => state.reviews.loading);
  
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const filteredReviews = reviews.filter(r => {
    const product = products.find(p => p.id === r.productId);
    const customer = customers.find(c => c.id === r.customerId);
    const matchesSearch = !search || 
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase()) ||
      product?.name.toLowerCase().includes(search.toLowerCase());
    const matchesRating = !ratingFilter || r.rating == ratingFilter;
    const matchesStatus = !statusFilter || r.status === statusFilter;
    return matchesSearch && matchesRating && matchesStatus;
  });
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      dispatch(deleteReview(id));
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <div className="flex gap-3 flex-1 flex-wrap">
          <input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg flex-1 min-w-[200px]"
          />
          <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg">
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg">
            <option value="">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <button
          onClick={() => dispatch(fetchReviews())}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Fetch Reviews
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Product</th>
                <th className="px-6 py-3 text-left font-semibold">Customer</th>
                <th className="px-6 py-3 text-left font-semibold">Rating</th>
                <th className="px-6 py-3 text-left font-semibold">Review</th>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-left font-semibold">Helpful</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map(review => {
                const product = products.find(p => p.id === review.productId);
                const customer = customers.find(c => c.id === review.customerId);
                return (
                  <tr key={review.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium">{product?.name || 'Unknown Product'}</div>
                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">✓ Verified</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-yellow-500 text-lg">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="font-medium mb-1">{review.title}</div>
                      <div className="text-sm text-gray-600">
                        {review.comment.substring(0, 80)}{review.comment.length > 80 ? '...' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4">{review.reviewDate}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <span className="text-green-600">👍 {review.helpful}</span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className="text-red-600">👎 {review.notHelpful}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        review.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        review.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {review.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(review.id)}
                              className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200">
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default ReviewsTab
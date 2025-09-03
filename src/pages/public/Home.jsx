import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await Axios({
          method: SummaryApi.getProducts.method,
          url: SummaryApi.getProducts.url,
        });

        if (!data.error) {
          setProducts(data.data); 
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <Loader />;

  if (products.length === 0) {
    return (
      <div>
        <h2>No Products Found</h2>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.map((prod) => (
          <div
            key={prod._id}
            className="bg-white rounded-lg shadow hover:shadow-md cursor-pointer transition p-3 flex flex-col"
            onClick={() => navigate(`/${prod._id}`)}
          >
            <img
              src={prod.image[0]}
              alt={prod.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h2 className="font-semibold text-sm truncate">{prod.name}</h2>
            <p className="text-gray-500 text-xs truncate">{prod.categoryId?.name}</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-blue-600 font-bold">${prod.price}</p>
              {prod.discount > 0 && (
                <p className="text-red-500 text-xs line-through">${prod.price + prod.discount}</p>
              )}
            </div>
            <div className="flex items-center mt-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={`text-yellow-400 ${
                    index < Math.round(prod.averageRating) ? "filled" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
              <span className="text-gray-500 text-xs ml-2">({prod.totalReviews})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

// Updated useFetch.js
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosConfig";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(url);
        setData(res.data);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    if (url) fetchData();
  }, [url]);

  const reFetch = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(url);
      setData(res.data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  return { data, loading, error, reFetch };
};

export default useFetch;
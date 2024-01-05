import {useState, useEffect} from 'react'
import axios from 'axios'


function ProductsAPI() {
    axios.defaults.baseURL = 'https://onetel-admin.onrender.com';
    const [products, setProducts] = useState([])
    const [callback, setCallback] = useState(false)
    const [category, setCategory] = useState('')
    const [sort, setSort] = useState('')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [result, setResult] = useState(0)
    const [subcategory, setSubcategory] = useState('');

    useEffect(() => {
        const getProducts = async () => {
        const res = await axios.get(`/api/products?limit=${page * 10}&&${category ? `category=${category}&` : ''}${subcategory ? `subcategory=${subcategory}&` : ''}&${sort}&title[regex]=${search}`);
          console.log(res.data);
          setProducts(res.data.products);
          setResult(res.data.result);
        };
        getProducts();
      }, [callback, category, subcategory, sort, search, page]);
    
    return {
        products: [products, setProducts],
        callback: [callback, setCallback],
        category: [category, setCategory],
        sort: [sort, setSort],
        search: [search, setSearch],
        page: [page, setPage],
        result: [result, setResult],
        subcategory: [subcategory, setSubcategory],
    }
}

export default ProductsAPI

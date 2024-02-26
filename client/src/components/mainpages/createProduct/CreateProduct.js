import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import {GlobalState} from '../../../GlobalState';
import Loading from '../utils/loading/Loading';
import {useNavigate, useParams} from 'react-router-dom';
import {motion} from 'framer-motion';
import {fadeIn} from '../../../variants';

const initialState = {
    product_id: '',
    title: '',
    price: '',
    discountprice: '',
    description: '',
    stock: '',
    condition: 'Brand New',
    content: '',
    colors:'',
    category: '',
    subcategory: '',
    _id: ''
}

function CreateProduct() {
    axios.defaults.baseURL = 'https://onetel-admin.onrender.com';
    const state = useContext(GlobalState);
    const [product, setProduct] = useState(initialState);
    const [categories] = state.categoriesAPI.categories;
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [images, setImages] = useState(false);
    const [loading, setLoading] = useState(false);


    const [isAdmin] = state.userAPI.isAdmin
    // const [token] = state.token

    const navigate = useNavigate();
    const param = useParams()

    const [products] = state.productsAPI.products
    const [onEdit, setOnEdit] = useState(false)
    const [callback, setCallback] = state.productsAPI.callback

    useEffect(() => {
      if (param.id) {
        setOnEdit(true);
        products.forEach((product) => {
          if (product._id === param.id) {
            setProduct(product);
            setImages(product.images);
            setSelectedCategory(product.category);
            // Set subcategories first
            setSubcategories(categories.find((cat) => cat._id === product.category)?.subcategory || []);
            // Then set selected subcategory
            setSelectedSubcategory(product.subcategory);
          }
        });
      } else {
        setOnEdit(false);
        setProduct(initialState);
        setImages(false);
      }
    }, [param.id, products, categories]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("You're not an admin");
      const file = e.target.files[0];
  
      if (!file) return alert("File not exist.");
  
      if (file.size > 1024 * 1024) return alert("Size too large!");
  
      if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        return alert("File format is incorrect.");
  
      const img = document.createElement("img");
      const canvas = document.createElement("canvas");
      const reader = new FileReader();
  
      reader.onload = function (e) {
        img.onload = async function () {
          const ctx = canvas.getContext("2d");
  
          // Set the canvas to the desired size
          const canvasSize = 800;
          canvas.width = canvasSize;
          canvas.height = canvasSize;
  
          // Calculate the scale to fit the image into the fixed size canvas
          const scale = Math.min(canvasSize / img.width, canvasSize / img.height);
  
          // Calculate the new dimensions
          const newWidth = img.width * scale;
          const newHeight = img.height * scale;
  
          // Calculate the center position on the canvas
          const x = (canvas.width - newWidth) / 2;
          const y = (canvas.height - newHeight) / 2;
  
          // Draw the image on the canvas with the new dimensions
          ctx.drawImage(img, x, y, newWidth, newHeight);
  
          canvas.toBlob(async function (blob) {
            let formData = new FormData();
            formData.append('file', blob, file.name);
  
            setLoading(true);
            const res = await axios.post('/api/upload', formData, {
              // headers: { 'content-type': 'multipart/form-data', Authorization: token },
            });
            setLoading(false);
            setImages(res.data);
          }, file.type);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };
  

    const handleDestroy = async () => {
        try {
            if(!isAdmin) return alert("You're not an admin")
            setLoading(true)
            await axios.post('/api/destroy', {public_id: images.public_id}, {
                // headers: {Authorization: token}
            })
            setLoading(false)
            setImages(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleChangeInput = (e) => {
      const { name, value } = e.target;
    
      if (name === 'category') {
        // Update subcategories when the category changes
        const selectedCategory = categories.find((cat) => cat._id === value);
        setSubcategories(selectedCategory ? selectedCategory.subcategory : []);
        setSelectedCategory(value);
      }
    
      if (name === 'content') {
        setProduct({ ...product, [name]: value });
      } else if (name === 'condition') {
        setProduct({ ...product, [name]: value });
      } else {
        setProduct({ ...product, [name]: value });
      }
    
      if (name === 'category') {
        // Set selected subcategory to the first option when the category changes
        setSelectedSubcategory(subcategories.length > 0 ? subcategories[0] : '');
      }
      
    };

    const handleSubmit = async e => {
      e.preventDefault();
      try {
          if (!isAdmin) return alert("You're not an admin");
          if (!images) return alert("No Image Upload");
  
          if (onEdit) {
              await axios.put(`/api/products/${product._id}`, { ...product, images, subcategory: selectedSubcategory }, {
                  // headers: { Authorization: token }
              });
          } else {
              await axios.post('/api/products', { ...product, images, subcategory: selectedSubcategory }, {
                  // headers: { Authorization: token }
              });
          }
          setCallback(!callback);
          navigate("/products");
      } catch (err) {
          alert(err.response.data.msg);
      }
  };
  

    // const styleUpload = {
    //     display: images ? "block" : "none"
    // }
    return (
        <motion.div
        // variants={fadeIn('right', 0.4)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }}
        className="bg-purple-800 bg-opacity-30 backdrop-filter backdrop-blur-lg p-4 rounded-lg max-w-3xl mx-auto mt-8 shadow-2xl flex-col items-center md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="file_up" className="text-white">
            Choose Image:
          </label>
          <div className="flex  items-center mt-1">
            <label
              htmlFor="file_up"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg cursor-pointer hover:bg-gray-300"
            >
              Choose File
            </label>
            <input
              type="file"
              name="file"
              id="file_up"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div className="ml-1 mt-4">
              {images && <img src={images.url} className='border rounded-lg w-50 h-96 justify-center' alt="" />}
              {images && (
                <button className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700" onClick={handleDestroy}>
                  Delete
                </button>
              )}
            </div>
          )}
        </div>

        <dev className=""> 
        <form className="col-span-1 md:col-span-1 " onSubmit={handleSubmit}>
                    {/* <div className="mb-4 ">
                      <label htmlFor="product_id" className="text-white text">Product ID:</label>
                      <input className='bg-gray-200 rounded-lg p-2 w-full text-slate-950 justify-center' type="text" name="product_id" id="product_id" required
                      value={product.product_id} onChange={handleChangeInput} disabled={onEdit} />
                    </div>  */}
                    <div className="mb-4">
                      <label htmlFor="title" className="text-white">Title:</label>
                      <input className='bg-gray-200 rounded-lg p-2 w-full text-slate-950' type="text" name="title" id="title" required
                      value={product.title} onChange={handleChangeInput} />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="price" className="text-white">Price:</label>
                      <input className='bg-gray-200 rounded-lg p-2 w-full text-slate-950' type="number" name="price" id="price" required
                      value={product.price} onChange={handleChangeInput} />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="discountprice" className="text-white">Discount Price:</label>
                      <input className='bg-gray-200 rounded-lg p-2 w-full text-slate-950' type="number" name="discountprice" id="discountprice"
                      value={product.discountprice} onChange={handleChangeInput} />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="description" className="text-white">Model:</label>
                      <input className='bg-gray-200 rounded-lg p-2 w-full text-slate-950' type="text" name="description" id="description" 
                      value={product.description} onChange={handleChangeInput} />
                    </div>
                    <div className="mb-4">
                    <label htmlFor="stock" className="text-white">
                      Stock:
                    </label>
                    <select
                      className="bg-gray-200 rounded-lg p-2 w-full text-slate-950"
                      name="stock"
                      id="stock"
                      value={product.stock}
                      onChange={handleChangeInput}
                    >
                      <option value=""></option>
                      <option value="Out-of-Stock">Out-of-Stock</option>
                      {/* Add other stock options as needed */}
                    </select>
                    </div>
                    <div className="mb-4">
                    <label htmlFor="condition" className="text-white">
                      condition:
                    </label>
                    <select
                      className="bg-gray-200 rounded-lg p-2 w-full text-slate-950"
                      name="condition"
                      id="condition"
                      value={product.condition}
                      onChange={handleChangeInput}
                    >
                      
                      <option value="Brand New">Brand New</option>
                      <option value="Used">Used</option>
                      {/* Add other stock options as needed */}
                    </select>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="content" className="text-white">Content:</label>
                      <textarea className='bg-gray-200 rounded-lg p-2 w-full h-32 text-slate-950' type="text" name="content" id="content" required
                      value={product.content} rows="15" onChange={handleChangeInput} />
                    </div>
                    <div className="mb-4 ">
                      <label htmlFor="colors" className="text-white text">Colours:</label>
                      <input className='bg-gray-200 rounded-lg p-2 w-full text-slate-950 justify-center' type="text" name="colors" id="colors" required
                      value={product.colors} onChange={handleChangeInput} />
                    </div>
                    <div className="mb-4">
                    <label htmlFor="categories" className="text-white">
                      Category:
                    </label>
                    <select
                      className="bg-gray-200 rounded-lg p-2 w-full text-slate-950"
                      name="category"
                      value={selectedCategory}
                      onChange={handleChangeInput}
                    >
                      <option value="">Please select a category</option>
                      {categories.map((category) => (
                        <option value={category._id} key={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                    <div className="mb-4">
                      <label htmlFor="subcategories" className="text-white">
                        Subcategory
                      </label>
                      <select
                        className="bg-gray-200 rounded-lg p-2 w-full text-slate-950"
                        name="subcategory"
                        value={selectedSubcategory}
                        onChange={(e) => setSelectedSubcategory(e.target.value)}
                      >
                        <option value="">Please select a subcategory</option>
                        {subcategories.map((subcategory) => (
                          <option value={subcategory} key={subcategory}>
                            {subcategory}
                          </option>
                        ))}
                      </select>
                    </div>


             <button type="submit" className="bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">{onEdit? "Update" : "Create"}</button>
            </form>
        </dev>
        </motion.div>

    )
}

export default CreateProduct;

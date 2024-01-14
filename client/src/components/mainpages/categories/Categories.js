import React, { useState, useContext, useEffect } from 'react';
import { GlobalState } from '../../../GlobalState';
import axios from 'axios';
import { motion } from 'framer-motion';
import { fadeIn } from '../../../variants';

function Categories() {
  // axios.defaults.baseURL = 'http://20.2.85.43:5000';
  axios.defaults.baseURL = 'https://onetel-admin.onrender.com';  
  const state = useContext(GlobalState);
  const [categories, setCategories] = state.categoriesAPI.categories;
  const [createCategory, setCreateCategory] = useState(''); // Separate state for Create Main Category form
  const [updateCategory, setUpdateCategory] = useState(''); // Separate state for Update Main Category form
  const [subCategory, setSubCategory] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [token] = state.token;
  const [callback, setCallback] = state.categoriesAPI.callback;

  useEffect(() => {
    const getCategories = async () => {
      const res = await axios.get('/api/category');
      setCategories(res.data);
    };

    getCategories();
  }, [callback]);

  const createMainCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/category', { name: createCategory }, { headers: { Authorization: token } });
      alert(res.data.msg);
      setCreateCategory('');
      setCallback(!callback);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const createSubCategory = async (e) => {
    e.preventDefault();
    try {
      const mainCategory = categories.find((cat) => cat._id === selectedMainCategory);
      const updatedSubcategories = [...mainCategory.subcategory, subCategory];
  
      const res = await axios.put(`/api/category/${selectedMainCategory}`, { subcategory: updatedSubcategories }, { headers: { Authorization: token } });
      alert(res.data.msg);
      setSubCategory('');
      setCallback(!callback);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const editMainCategory = async (id, name) => {
    setUpdateCategory(name);
    setSelectedMainCategory(id);
  };

  const updateMainCategory = async () => {
    try {
      const res = await axios.put(`/api/category/${selectedMainCategory}`, { name: updateCategory }, { headers: { Authorization: token } });
      alert(res.data.msg);
      setUpdateCategory('');
      setSelectedMainCategory('');
      setCallback(!callback);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const deleteMainCategory = async (id) => {
    try {
      const res = await axios.delete(`/api/category/${id}`, { headers: { Authorization: token } });
      alert(res.data.msg);
      setCallback(!callback);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const deleteSubCategory = async (mainCategoryId, subCategoryName) => {
    try {
      const res = await axios.put(
        `/api/category/${mainCategoryId}`,
        { subcategory: categories.find(cat => cat._id === mainCategoryId)?.subcategory.filter(subCat => subCat !== subCategoryName) },
        { headers: { Authorization: token } }
      );
  
      alert(res.data.msg);
      setCallback(!callback);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const updateSubCategory = async (mainCategoryId, oldSubCategoryName, newSubCategoryName) => {
    try {
      const mainCategory = categories.find(cat => cat._id === mainCategoryId);
      const updatedSubcategories = mainCategory.subcategory.map(subCat => (subCat === oldSubCategoryName ? newSubCategoryName : subCat));
  
      const res = await axios.put(
        `/api/category/${mainCategoryId}`,
        { subcategory: updatedSubcategories },
        { headers: { Authorization: token } }
      );
  
      alert(res.data.msg);
      setCallback(!callback);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };
  
  return (
      <motion.div variants={fadeIn('left', 0.3)} 
      initial='hidden' whileInView={'show'} 
      viewport={{ once: false, amount: 0.3 }} 
      className='mt-8 gap-8 text-xs' 
      style={{ display: 'grid', justifyContent: 'center', alignItems: 'center'}}
      >
       
        <div className="bg-violet-500 px-3 py-6 border rounded-lg border-purple-700 "> 
        {/* Create Main Category Form */}
        <form onSubmit={createMainCategory}>
          <label htmlFor="mainCategory" className="block text-gray-700 font-bold mb-2">Main Category</label>
          <div className="flex items-center mb-4">
            <input
              type="text"
              name="mainCategory"
              value={createCategory}
              required
              onChange={(e) => setCreateCategory(e.target.value)}
              className="appearance-none border rounded w-full py-2 px-3 mr-4 leading-tight focus:outline-none focus:shadow-outline text-slate-900"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Create Main Category
            </button>
          </div>
        </form>

        {/* List of Categories and Subcategories */}
        <div className="mt-6">
      <h2 className="text-gray-700 font-bold mb-2">Categories</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 ">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Main Category</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategories</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategory Actions</th>
            {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Main category Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {categories.map((mainCategory) => (
            <tr key={mainCategory._id}>
              <td className="px-6 py-4 whitespace-nowrap">{mainCategory.name}
              <tr>

              <button onClick={() => editMainCategory(mainCategory._id, mainCategory.name)} className="text-indigo-600 hover:text-indigo-900">
                  Edit
                </button>
                <button onClick={() => deleteMainCategory(mainCategory._id)} className="text-red-600 hover:text-red-900 ml-2">
                  Delete
                </button>
              </tr>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {mainCategory.subcategory.length > 0 && (
                  <ul>
                    {mainCategory.subcategory.map((subCat, index) => (
                      <li key={index}>{subCat}</li>
                    ))}
                  </ul>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {mainCategory.subcategory.length > 0 && (
                  <ul>
                    {mainCategory.subcategory.map((subCat, index) => (
                      <li key={index}>
                        <button onClick={() => deleteSubCategory(mainCategory._id, subCat)} className="text-red-600 hover:text-red-900 ml-2">
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap">
                <button onClick={() => editMainCategory(mainCategory._id, mainCategory.name)} className="text-indigo-600 hover:text-indigo-900">
                  Edit
                </button>
                <button onClick={() => deleteMainCategory(mainCategory._id)} className="text-red-600 hover:text-red-900 ml-2">
                  Delete
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      </div>

           <div>  
          {/* Update Main Category Form */}
          {selectedMainCategory && (
          <div  className="bg-violet-500 px-3 py-6 border rounded-lg border-purple-700">
            <form onSubmit={updateMainCategory}>
              <label htmlFor="updateCategory" className="block text-gray-700 font-bold mb-2">
                Update Main Category
              </label>
              <div className="flex items-center mb-4">
                <input
                  type="text"
                  name="updateCategory"
                  value={updateCategory}
                  required
                  onChange={(e) => setUpdateCategory(e.target.value)}
                  className="appearance-none border rounded w-full py-2 px-3 mr-4 leading-tight focus:outline-none focus:shadow-outline text-slate-900"
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Update
                </button>
              </div>
            </form>

          {/* Add Subcategory Form */}
          {selectedMainCategory && (
            <div className="mt-6">
              <form onSubmit={createSubCategory}>
                <label htmlFor="subCategory" className="block text-gray-700 font-bold mb-2">
                  Subcategory for {categories.find((cat) => cat._id === selectedMainCategory)?.name}
                </label>
                <div className="flex items-center mb-4">
                  <input
                    type="text"
                    name="subCategory"
                    value={subCategory}
                    required
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="appearance-none border rounded w-full py-2 px-3 mr-4 leading-tight focus:outline-none focus:shadow-outline text-slate-900"
                  />
                  <button
                    type="submit"
                    className="bg-green-500 hover.bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Add Subcategory
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        )}
      </div>
    </motion.div>

  );
}

export default Categories;









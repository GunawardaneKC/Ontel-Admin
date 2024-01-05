import React, { useState , useContext } from 'react';
import { GlobalState } from '../../../GlobalState';

function Filters() {
  const state = useContext(GlobalState);
  const [categories] = state.categoriesAPI.categories;
  const [subcategories, setSubcategories] = useState([]);
  const [category, setCategory] = state.productsAPI.category;
  const [search, setSearch] = state.productsAPI.search;
  const [subcategory, setSubcategory] = state.productsAPI.subcategory;
  const [sort, setSort] = state.productsAPI.sort

  const handleCategory = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    
    // Fetch subcategories based on the selected category
    const selectedCategoryObject = categories.find((cat) => cat._id === selectedCategory);
    setSubcategories(selectedCategoryObject?.subcategory || []);
    
    // Reset subcategory when changing the main category
    setSubcategory('');
  };

  return (
    <div className="mt-10 ml-4 mr-4 flex flex-wrap justify-between rounded-2xl p-4 bg-gray-200 text-slate-900">
    <div className="flex flex-wrap items-center gap-4">
      <span className="font-medium">Filters: </span>
      <select
        name="category"
        value={category}
        onChange={handleCategory}
        className="border rounded-md w-40 px-2 py-1"
      >
        <option value="">All Products</option>
        {categories.map((category) => (
          <option value={category._id} key={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      {/* Add Subcategory dropdown */}
      {subcategories.length > 0 && (
        <select
          name="subcategory"
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          className="border rounded-md w-40 px-2 py-1"
        >
          <option value="">All Subcategories</option>
          {subcategories.map((subcat) => (
            <option value={subcat} key={subcat}>
              {subcat}
            </option>
          ))}
        </select>
      )}
    </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          value={search}
          placeholder="Enter your search!"
          onChange={e => setSearch(e.target.value.toLowerCase())}
          className="border rounded-md px-2 py-1"
        />
      </div>
              <div className="row sort">
                 <span className="font-medium">Sort By: </span>
                <select value={sort} onChange={e => setSort(e.target.value)} className="border rounded-md px-2 py-1">

                     <option value=''>Newest</option>
                    <option value='sort=oldest'>Oldest</option>
                    <option value='sort=-price'>Price: Hight-Low</option>
                </select>
             </div> 
    </div>


  );
}

export default Filters;


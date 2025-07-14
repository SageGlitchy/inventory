import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "@/styles/inventory.module.scss";

export default function ProductForm({ onProductAdded, onClose}){
  const [form, setForm]=useState({
    name:"",
    stock:"",
    category:"",
    price:""
  });

  const[formError, setFormError]=useState("");
  const[formLoading, setFormLoading]=useState(false);

  const handleChange=(e)=>{
    setForm({...form, [e.target.name]:e.target.value})
  };
  
  const handleSubmit= async(e)=> {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try{
      if (!form.name || !form.stock || !form.category || !form.price){
        setFormError("All fields are required.");
        setFormLoading(false);
        return;
      }

      const {data,error}= await supabase
        .from("products")
        .insert([
          {
            name: form.name,
            description: form.description,
            stock: parseInt(form.stock, 10),
            category: form.category,
            price: parseFloat(form.price)
          }
        ])
        .select();
      if (error){
        setFormError(error.message);
      }
      else{
        setForm({name:"",description: "", stock:"", category:"", price:""});
        onProductAdded(data[0]);
        if (onClose) onClose();
      }
    } finally {
      setFormLoading(false);
    }
  };

  return(
    <form onSubmit={handleSubmit} className={styles.modalForm}>
        <label>
          Name
          <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        </label>

        <label>
          Description
          <textarea
        name= "description"
        placeholder="Short Description"
        value={form.description}
        onChange={handleChange}
        />
        </label>

        <label>
          Stock
          <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
        />
        </label>

        <label>
          Category
          <select
        name="category"
        placeholder= "Select Category"
        value={form.category}
        onChange={handleChange}>
          <option value="">Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Stationary">Stationary</option>
          <option value="Wellness">Wellness</option>
          <option value="Home">Home</option>
        </select>
        </label>

        <label>
          Price
          <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />
        </label>

        <button 
        type="submit"
        className={styles.addButton} 
        disabled={formLoading}>
          {formLoading ? "Adding..." : "Add Product"}
        </button>
        {formError && <span style= {{color:"red", marginLeft:8}}>{formError}</span>}

      </form>
  );
}
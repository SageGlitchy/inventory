import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ProductTable({ products, onProductUpdated, onProductDeleted}){
    const [editingId, setEditingId]=useState(null);
    const[editForm, setEditForm]= useState({
        name:"",
        stock:"",
        category:"",
        price:""
    });

    const [editError, setEditError]= useState("");
    const [editLoading, setEditLoading]= useState(false);

    const handleDelete= async (id)=> {
      if(window.confirm("Are you sure you want to delete this item?")){
        const {error}= await supabase
          .from("products")
          .delete()
          .eq("id", id)

        if (error){
          alert(" Could not delete item: " + error.message);
        }
        else{
          onProductDeleted(id);
        }
      }
    };

    
    const handleUpdate= async(id) => {
        setEditLoading(true);
        setEditError("");
        const stockValue= Number(editForm.stock);
        const priceValue= Number(editForm.price);
    
        if(
        !editForm.name||
        !editForm.category||
        isNaN(stockValue)||
        isNaN(priceValue)||
        stockValue<=0||
        priceValue<=0
        ){
        setEditError("All fields are required and must be valid numbers.");
        setEditLoading(false);
        return;
        }
    
        const {error}= await supabase
        .from("products")
        .update({
            name: editForm.name,
            stock: stockValue,
            category: editForm.category,
            price: priceValue
        })
        .eq("id", id);
    
        if(error){
            setEditError(error.message);
        }
        else{
            onProductUpdated(id, {
                ...editForm,
                stock: stockValue,
                price: priceValue
            });
            setEditingId(null);
        }
        setEditLoading(false);
    };

    return (
        <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              {editingId === product.id ? (
                <>
                  <td>
                    <input
                    name="name"
                    value= {editForm.name}
                    onChange={e=> setEditForm({...editForm, name: e.target.value})} 
                    />
                  </td>
                  <td>
                    <input
                    name="stock"
                    type= "number"
                    value={editForm.stock}
                    onChange={e=> setEditForm ({...editForm, stock : e.target.value})}
                    />
                  </td>
                  <td>
                    <input
                      name="category"
                      value={editForm.category}
                      onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      value={editForm.price}
                      onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                    />
                  </td>
                  <td>
                    <button
                      onClick={()=> handleUpdate(product.id)}
                      disabled={editLoading}
                      >
                        {editLoading ? "Saving..." : "Save"}
                      </button>

                      <button
                      onClick={()=> setEditingId(null)}
                      disabled= {editLoading}
                      >Cancel</button>

                      {editError && <span style={{color:"red"}}>{editError}</span>}
                  </td>
                </>
              ) : (
                <>
                  <td>{product.name}</td>
                  <td>{product.stock}</td>
                  <td>{product.category}</td>
                  <td>{product.price}</td>
                  <td>
                    <button onClick={()=> {
                      setEditingId(product.id);
                      setEditForm({
                        name: product.name,
                        stock: product.stock,
                        category: product.category,
                        price: product.price
                      });
                      setEditError("");
                    }}>Edit</button> 

                    <button
                    onClick={()=> handleDelete(product.id)}
                    style= {{marginLeft: "8px", backgroundColor: "#ff4444", color: "white"}}>
                      Delete
                    </button>

                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );

}
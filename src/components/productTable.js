import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "@/styles/inventory.module.scss";
import { NotebookText, Trash2 } from "lucide-react";

export default function ProductTable({ products, onProductUpdated, onProductDeleted}){
    const [editingId, setEditingId]=useState(null);
    const[editForm, setEditForm]= useState({
        name:"",
        description : "",
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
          .eq("id", id);

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
            description:editForm.description,
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
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <colgroup>
            <col style={{ width: "28%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "12%" }} />
          </colgroup>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
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
                    <textarea
                    name="description"
                    value={editForm.description}
                    onChange={e=> setEditForm({...editForm, description: e.target.value})}
                    style={{width:"100%", minHeight:"2.2em", fontSize:"1em"}}></textarea>
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
                  <td>
                    <div className={styles.productName}>{product.name}</div>
                    <div className={styles.productDescription}>{product.description}</div>
                  </td>

                  <td>
                    <div style={{fontWeight: "bold"}}>{product.stock}</div>
                    <span className={`${styles.stockBadge} ${
                      product.stock===0
                      ?styles.stockOut
                      :product.stock<=5
                      ?styles.stockLow
                      :styles.stockIn
                    }`}>
                    {product.stock===0
                      ?"Out of Stock"
                      : product.stock <= 5
                      ? "Low Stock"
                      : "In Stock"}
                    </span>
                  </td>

                  <td>
                    <span
                    className={`${styles.categoryBadge} ${styles['category'+(product.category ||'').replace(/\s/g, '')]}`}
                    >
                      {product.category}
                    </span>
                  </td>

                  <td>
                    {Number(product.price).toLocaleString("en-IN",{
                      style:"currency",
                      currency:"INR"
                    })}
                  </td>

                  <td>
                    <button 
                    className={styles.actionButton}
                    onClick={()=> {
                      setEditingId(product.id);
                      setEditForm({
                        name: product.name,
                        description:product.description,
                        stock: product.stock,
                        category: product.category,
                        price: product.price
                      });
                      setEditError("");
                    }}
                    title="Edit"
                    >
                      <NotebookText />
                    </button> 

                    <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={()=> handleDelete(product.id)}
                    title="Delete">
                      <Trash2 />
                    </button>
                  </td>

                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    );

}
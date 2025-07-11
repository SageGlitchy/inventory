import LogoutButton from "@/components/logoutButton";
import { supabase } from "@/lib/supabaseClient";
import withAuth from "@/lib/withAuth";
import { useEffect,useState } from "react";



function HomePage(){
  const [products, setProducts]= useState([]);
  const[loading, setLoading]= useState(true);
  const[error, setError]= useState('');
  const [editingId, setEditingId]=useState(null);
  const[editForm, setEditForm]= useState({
    name:"",
    stock:"",
    category:"",
    price:""
  });

  const [editError, setEditError]= useState("");
  const [editLoading, setEditLoading]= useState(false);

  const [form, setForm]=useState({
    name:"",
    stock:"",
    category:"",
    price:""
  });

  const[formError, setFormError]=useState("");
  const[formLoading, setFormLoading]=useState(false);

  useEffect(()=> {
    async function fetchProducts(){
      setLoading(true);
      const {data,error}=await supabase
        .from('products')
        .select('*')
        .order('name', {ascending: true});

      if (error){
        setError(error.message);
      } else{
        setProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const handleChange=(e)=>{
    setForm({...form, [e.target.name]:e.target.value})
  };
  
  const handleSubmit= async(e)=> {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
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
      setForm({name:"", stock:"", category:"", price:""});
      setProducts((prev)=> [...prev, ...data]);
    }
    setFormLoading(false);
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
        setProducts(products=> 
          products.map(p=>
            p.id === id
            ?{...p, ...editForm, stock:stockValue, price:priceValue}
            : p
          )
        );
        setEditingId(null);
      }
      setEditLoading(false);
  };


  return (
    <div>
      <h1>
        Inventory
      </h1>
      <LogoutButton/>

      <form onSubmit={handleSubmit} style={{marginBottom: "2rem"}}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />

        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />

        <button type="submit" disabled={formLoading}>
          {formLoading ? "Adding..." : "Add Product"}
        </button>
        {formError && <span style= {{color:"red", marginLeft:8}}>{formError}</span>}

      </form>


      {loading &&<p>Loading...</p>}
      {error && <p style={{color:"red"}}>{error}</p>}
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

export default withAuth(HomePage);
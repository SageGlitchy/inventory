import LogoutButton from "@/components/logoutButton";
import { supabase } from "@/lib/supabaseClient";
import withAuth from "@/lib/withAuth";
import { red } from "@mui/material/colors";
import { useEffect,useState } from "react";



function HomePage(){
  const [products, setProducts]= useState([]);
  const[loading, setLoading]= useState(true);
  const[error, setError]= useState('');

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

  return (
    <div>
      <h1>
        Inventory
      </h1>
      <LogoutButton/>
      {loading &&<p>Loading...</p>}
      {error && <p style={{color:red}}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.stock}</td>
              <td>{product.category}</td>
              <td>{product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default withAuth(HomePage);
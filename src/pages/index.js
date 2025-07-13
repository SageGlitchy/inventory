import LogoutButton from "@/components/logoutButton";
import ProductForm from "@/components/productForm";
import ProductTable from "@/components/productTable";
import { supabase } from "@/lib/supabaseClient";
import withAuth from "@/lib/withAuth";
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
  

  const handleProductAdded= (newProduct)=> {
    setProducts((prev)=> [...prev, newProduct]);
  };


  const handleProductUpdated= (id, updatedProduct) => {
    setProducts((prev)=>
      prev.map ((p) => (p.id === id? {...p, ...updatedProduct} : p))
    );
  };

  const handleProductDeleted= (id) => {
    setProducts((prev)=> prev.filter(p=> p.id!==id));
  };


  return (
    <div>
      <h1>
        Inventory
      </h1>
      <LogoutButton/>

      <ProductForm 
      onProductAdded= {handleProductAdded} 
      />

      {loading &&<p>Loading...</p>}
      {error && <p style={{color:"red"}}>{error}</p>}

      <ProductTable
      products= {products}
      onProductUpdated= {handleProductUpdated}
      onProductDeleted={handleProductDeleted}
      />
    </div>
  );
}

export default withAuth(HomePage);
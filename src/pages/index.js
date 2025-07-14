import LogoutButton from "@/components/logoutButton";
import ProductForm from "@/components/productForm";
import ProductTable from "@/components/productTable";
import { supabase } from "@/lib/supabaseClient";
import withAuth from "@/lib/withAuth";
import { useEffect,useState } from "react";
import ProductFilters from "@/components/productFilters";
import styles from "@/styles/inventory.module.scss";
import Modal from "@/components/modal";



function HomePage(){
  const [products, setProducts]= useState([]);
  const[loading, setLoading]= useState(true);
  const[error, setError]= useState("");
  const [search, setSearch]=useState("");
  const[category, setCategory]=useState("");
  const[showForm, setShowForm]=useState(false);


  const categories= Array.from(new Set(products.map(p=> p.category).filter(Boolean)));
  
  const filteredProducts= products.filter(product=> {
    const matchesSearch= 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory= category === ""||product.category===category;
    return matchesSearch && matchesCategory;
  });


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
    <div className={styles.inventoryContainer}>
      <div className={styles.logoutButton}>
      <LogoutButton/>
      </div>
      <h1 className={styles.title}> Inventory Management </h1>
      <div className={styles.subtitle}> Manage your product inventory efficiently </div>
      
      {showForm &&(
        <Modal onClose={()=> setShowForm(false)}>
          <ProductForm onProductAdded= {handleProductAdded} onClose={()=> setShowForm(false)} />
        </Modal>
      )}

      {loading &&<p>Loading...</p>}
      {error && <p style={{color:"red"}}>{error}</p>}

      <div className={styles.toolbarRow}>
        <button className={styles.addButton}
          onClick={()=> setShowForm((prev)=> !prev)}>
            <span className={styles.plusIcon}>+</span> Add Product
        </button>
        <div className={styles.filtersRight}>
          <ProductFilters
            categories={categories}
            onSearch={setSearch}
            onCategory={setCategory}
          />
        </div>
      </div>

      <ProductTable
      products= {filteredProducts}
      onProductUpdated= {handleProductUpdated}
      onProductDeleted={handleProductDeleted}
      />
    </div>
  );
}

export default withAuth(HomePage);
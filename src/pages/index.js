import LogoutButton from "@/components/logoutButton";
import withAuth from "@/lib/withAuth";

function HomePage(){
  return (
    <div>
      <h1>
        Welcome to Inventory Management System.
      </h1>
      <LogoutButton/>
    </div>
  );
}

export default withAuth(HomePage);
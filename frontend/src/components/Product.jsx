// Component for single products card

// Global Imports
import { useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Local Imports
import Rating from "./Rating";
import { Store } from "../Store";

// External Imports
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

const Product = (props) => {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    if (existItem) {
      toast.error("Product already in the cart");
      return;
    }
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry, Product is out of stock");
      return;
    } else {
      toast("Product added to cart", {
        type: "success",
      });
      ctxDispatch({
        type: "ADD_TO_CART",
        payload: { ...item, quantity: 1 }, // payload: {...product, quantity} --> to see the product quantity in nav cart
      });
    }
  };
  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}</Card.Text>
        {product.countInStock === 1 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>Add to Cart</Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;

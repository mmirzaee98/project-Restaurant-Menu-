'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Server action to create a new item
export async function createItem(formData) {
    const dishName = formData.get('dishName');
    const price = formData.get('price');
    const dish_description = formData.get('dish_description');
  
    // Fetch the existing items to get the latest ID
    const resGet = await fetch('http://localhost:4000/items');
    if (!resGet.ok) {
      const error = await resGet.json();
      throw new Error(error.message || 'Failed to fetch items');
    }
    const items = await resGet.json();
  
    // Get the last ID and increment it by 1
    const lastId = items.length > 0 ? Math.max(...items.map(item => item.id)) : 0;
    const newId = lastId + 1;
  
    // Create the new item with the incremented ID
    const newItem = {
      id: newId,
      dishName,
      price: Number(price),
      dish_description
    };
  
    // Send the new item to the server
    const resPost = await fetch('http://localhost:4000/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
  
    if (!resPost.ok) {
      const error = await resPost.json();
      throw new Error(error.message || 'Failed to create item');
    }
  }
  

export default function MenuItemForm({ initialData = {}, action }) {
  const router = useRouter();

  // Initialize state with fallback values
  const [dishName, setDishName] = useState(initialData.dishName ?? '');
  const [price, setPrice] = useState(initialData.price ?? 0);
  const [dishDescription, setDishDescription] = useState(initialData.dish_description ?? '');
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear old errors
    setErrors([]);

    // CLIENT-SIDE VALIDATION
    const validationErrors = [];
    if (dishName.length < 3 || dishName.length > 50) {
      validationErrors.push('Dish name must be between 3 and 50 characters in length.');
    }
    if (Number(price) <= 0) {
      validationErrors.push('Price must be a positive number greater than 0.');
    }
    if (!dishDescription || dishDescription.length < 10) {
      validationErrors.push('Dish description must be at least 10 characters.');
    }

    // If there are errors, display them inline and STOP
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // No errors, so let's call the server action in a try/catch
    try {
      const formData = new FormData();
      formData.append('dishName', dishName);
      formData.append('price', price);
      formData.append('dish_description', dishDescription);

      await createItem(formData); // Calls createItem on the server
      router.push('/admin');  // Redirect to /admin if successful
    } catch (error) {
      // If the server action throws an error (e.g., negative price),
      // show it inline instead of a Next.js error page
      setErrors([error.message]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Display any errors inline */}
      {errors.length > 0 && (
        <ul style={{ color: 'red' }}>
          {errors.map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </ul>
      )}

      <div>
        <label>Dish Name:</label>
        <input
          type="text"
          value={dishName}
          onChange={(e) => setDishName(e.target.value)}
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div>
        <label>Dish Description:</label>
        <textarea
          value={dishDescription}
          onChange={(e) => setDishDescription(e.target.value)}
        />
      </div>
      <button type="submit">Create</button>
    </form>
  );
}

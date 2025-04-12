'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Server-side function to create a new item
export async function createItem(formData) {
    const dishName = formData.get('dishName');
    const price = formData.get('price');
    const dish_description = formData.get('dish_description');
  
  // Fetch all existing items to determine the next available ID
    const resGet = await fetch('http://localhost:4000/collection');
    if (!resGet.ok) {
      const error = await resGet.json();
      throw new Error(error.message || 'Failed to fetch items');
    }
    const items = await resGet.json();
  
 // Increment the highest current ID by 1 to get the new item's ID
    const lastId = items.length > 0 ? Math.max(...items.map(item => item.id)) : 0;
    const newId = lastId + 1;
  
  // Create a new item object
    const newItem = {
      id: String(newId), // make sure the ID is string
      dishName: formData.get('dishName'),
      price: Number(formData.get('price')),
      dish_description: formData.get('dish_description')
    };
    
  // Send the new item to the server using a POST request
    const resPost = await fetch('http://localhost:4000/collection', {
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

// Set up form fields with initial values if available
  const [dishName, setDishName] = useState(initialData.dishName ?? '');
  const [price, setPrice] = useState(initialData.price ?? 0);
  const [dishDescription, setDishDescription] = useState(initialData.dish_description ?? '');
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

  
    setErrors([]);

  // Perform client-side validation
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

  // If validation fails, display errors and stop form submission
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

  // If validation passes, call the server function
    try {
      const formData = new FormData();
      formData.append('dishName', dishName);
      formData.append('price', price);
      formData.append('dish_description', dishDescription);

      await createItem(formData); // Call server-side create function
      router.push('/admin');// Redirect to the admin page on success 
    } catch (error) {
      
      setErrors([error.message]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Show any errors inline */}
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

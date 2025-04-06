'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

      await action(formData); // Calls createItem on the server
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

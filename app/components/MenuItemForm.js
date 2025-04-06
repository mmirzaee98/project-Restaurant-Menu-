// app/components/MenuItemForm.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MenuItemForm({ initialData = {}, action }) {
  const router = useRouter();

  // Default to empty or zero for new items
  const [dishName, setDishName] = useState(initialData.dishName ?? '');
  const [price, setPrice] = useState(initialData.price ?? 0);
  const [dishDescription, setDishDescription] = useState(initialData.dish_description ?? '');
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear old errors
    setErrors([]);

    // 1. Client-side validation
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

    // 2. If there are errors, display them and STOP.
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // 3. If validation passes, call the server action in a try/catch
    try {
      const formData = new FormData();
      formData.append('dishName', dishName);
      formData.append('price', price);
      formData.append('dish_description', dishDescription);

      // The server action can also throw errors if it fails
      await action(formData);

      // If everything succeeds, navigate back to /admin
      router.push('/admin');
    } catch (error) {
      // If the server action throws an Error, show it inline
      setErrors([error.message]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <ul style={{ color: 'red' }}>
          {errors.map((err, i) => (
            <li key={i}>{err}</li>
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

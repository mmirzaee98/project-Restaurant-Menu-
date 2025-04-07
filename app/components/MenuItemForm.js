// app/components/MenuItemForm.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MenuItemForm({ initialData = {}, action }) {
  const router = useRouter();
  const [dishName, setDishName] = useState(initialData.dishName ?? '');
  const [price, setPrice] = useState(initialData.price ?? 0);
  const [dishDescription, setDishDescription] = useState(initialData.dish_description ?? '');
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    // Client-side validation
    const validationErrors = [];
    if (dishName.length < 3 || dishName.length > 50) {
      validationErrors.push("Dish name must be between 3 and 50 characters in length.");
    }
    if (Number(price) <= 0) {
      validationErrors.push("Price must be a positive number greater than 0.");
    }
    if (!dishDescription || dishDescription.length < 10) {
      validationErrors.push("Dish description must be at least 10 characters.");
    }
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const formData = new FormData();
      // DO NOT append an id so JSON Server can auto-generate it
      formData.append('dishName', dishName);
      formData.append('price', price);
      formData.append('dish_description', dishDescription);

      await action(formData);
      router.push('/admin');
    } catch (error) {
      setErrors([error.message]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <ul style={{ color: 'red' }}>
          {errors.map((err, idx) => (
            <li key={idx}>{err}</li>
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
          step="0.01"
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
      <button type="submit">Submit</button>
    </form>
  );
}

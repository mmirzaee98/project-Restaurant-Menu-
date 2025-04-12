// app/components/MenuItemForm.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MenuItemForm({ initialData = {}, action }) {
  const router = useRouter();

// Set initial form state (empty for create, pre-filled for edit)
  const [dishName, setDishName] = useState(initialData.dishName ?? '');
  const [price, setPrice] = useState(initialData.price ?? 0);
  const [dishDescription, setDishDescription] = useState(initialData.dish_description ?? '');
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

  // Run client-side form validation
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
// For JSON Server: no need to send an ID when creating a new item
      formData.append('dishName', dishName);
      formData.append('price', price);
      formData.append('dish_description', dishDescription);

// Send the ID only if we're editing an existing item
      if (initialData?.id) {
        formData.append('id', initialData.id);
      }
// Call the provided server action (create or update)      
      await action(formData);
// Redirect to admin dashboard after success      
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

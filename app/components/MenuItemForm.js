// app/components/MenuItemForm.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MenuItemForm({ initialData = {}, action }) {
  // Initialize state with fallback defaults
  const [dishName, setDishName] = useState(initialData.dishName ?? '');
  const [price, setPrice] = useState(initialData.price ?? 0);
  const [dishDescription, setDishDescription] = useState(initialData.dish_description ?? '');
  const [errors, setErrors] = useState([]);
  
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = [];

    // Validation rules
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

    // Prepare form data for the server action
    const formData = new FormData();
    formData.append('id', initialData.id);
    formData.append('dishName', dishName);
    formData.append('price', price);
    formData.append('dish_description', dishDescription);

    await action(formData);
    router.push('/admin');
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
        <label>Dish Name: </label>
        <input
          type="text"
          value={dishName}
          onChange={(e) => setDishName(e.target.value)}
        />
      </div>
      <div>
        <label>Price: </label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div>
        <label>Dish Description: </label>
        <textarea
          value={dishDescription}
          onChange={(e) => setDishDescription(e.target.value)}
        />
      </div>
      <button type="submit">Update</button>
    </form>
  );
}

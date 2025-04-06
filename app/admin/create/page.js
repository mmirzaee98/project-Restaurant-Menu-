// app/admin/create/page.js
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Server action to create a new item
export async function createItem(formData) {
  'use server';
  const dishName = formData.get('dishName');
  const price = formData.get('price');
  const dish_description = formData.get('dish_description');

  const newItem = {
    dishName,
    price: Number(price),
    dish_description,
  };

  await fetch('http://localhost:4000/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newItem),
  });

  // Revalidate relevant paths
  revalidatePath('/admin');
  revalidatePath('/collection');
  redirect('/admin');
}

export default function CreatePage() {
  return (
    <div>
      <h1>Create New Menu Item</h1>
      <form action={createItem}>
        <div>
          <label>Dish Name: </label>
          <input name="dishName" type="text" required />
        </div>
        <div>
          <label>Price: </label>
          <input name="price" type="number" required />
        </div>
        <div>
          <label>Dish Description: </label>
          <textarea name="dish_description" required />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

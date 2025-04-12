// app/admin/edit/[id]/page.js
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import MenuItemForm from '../../../components/MenuItemForm';

// Fetch a single item by ID from the collection
async function getItem(id) {
  const res = await fetch('http://localhost:4000/collection');
  if (!res.ok) throw new Error('Failed to fetch items');
  const items = await res.json();

// Find the item that matches the given ID
  const item = items.find((item) => String(item.id) === String(id));
  if (!item) throw new Error('Item not found');
  return item;
}

// Handle form submission to update an existing item
export async function updateItem(formData) {
  'use server';

  const id = formData.get('id'); 
  const dishName = formData.get('dishName');
  const price = formData.get('price');
  const dish_description = formData.get('dish_description');

  const updatedItem = {
    dishName,
    price: Number(price),
    dish_description
  };

  // Send a PUT request to update the item
  await fetch(`http://localhost:4000/collection/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedItem),
  });

  // Refresh relevant pages to reflect the changes
  revalidatePath('/admin');
  revalidatePath('/collection');
  revalidatePath(`/collection/${id}`);
  revalidatePath(`/admin/edit/${id}`);

  // Redirect back to the admin dashboard
  redirect('/admin');
}


export default async function EditPage({ params: { id } }) {
  const item = await getItem(id);

  return (
    <div>
      <h1>Edit Menu Item</h1>
      <MenuItemForm initialData={{ ...item, id }} action={updateItem} />
    </div>
  );
}

import { useState, type FormEvent } from 'react';
import { ArrowLeft, ImagePlus, LockKeyhole, LogOut, Plus, Save, ShieldCheck, Trash2, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCT_CATEGORIES, type Product, type ProductCategory, type ProductCurrency, type ProductDraft } from '../../types';

const MAX_PHOTOS = 5;

async function compressPhoto(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error(`${file.name} is not an image.`);
  const image = await createImageBitmap(file);
  const scale = Math.min(1, 1400 / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('This browser could not process the selected photo.');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  image.close();
  return canvas.toDataURL('image/jpeg', 0.82);
}

function priceText(product: Product) {
  return new Intl.NumberFormat(product.currency === 'UGX' ? 'en-UG' : 'en-US', {
    style: 'currency', currency: product.currency, maximumFractionDigits: product.currency === 'UGX' ? 0 : 2,
  }).format(product.price);
}

export function AdminPortal({ backToStore }: { backToStore: () => void }) {
  const { products, ownerPinHash, isOwnerSignedIn, signInOwner, signOutOwner, saveOwnerPin, verifyOwnerPin, addProduct, updateProduct, deleteProduct } = useStore();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Perfumes');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<ProductCurrency>('UGX');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const authenticate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPinError('');
    try {
      if (!ownerPinHash) {
        if (pin.trim().length < 8) {
          setPinError('Choose a PIN of at least 8 characters.');
          return;
        }
        if (pin !== confirmPin) {
          setPinError('The PINs do not match.');
          return;
        }
        await saveOwnerPin(pin.trim());
        signInOwner();
      } else if (await verifyOwnerPin(pin)) {
        signInOwner();
      } else {
        setPinError('That PIN did not match. Try again.');
      }
    } catch {
      setPinError('Could not save the PIN in this browser.');
    }
  };

  const resetForm = () => {
    setEditing(null);
    setName('');
    setCategory('Perfumes');
    setPrice('');
    setCurrency('UGX');
    setDescription('');
    setImages([]);
    setFormError('');
  };

  const editProduct = (product: Product) => {
    setEditing(product);
    setName(product.name);
    setCategory(product.category);
    setPrice(String(product.price));
    setCurrency(product.currency);
    setDescription(product.description);
    setImages(product.images);
    setFormError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addPhotos = async (files: FileList | null) => {
    if (!files?.length) return;
    setFormError('');
    setSaving(true);
    try {
      const selectedFiles = Array.from(files);
      if (images.length + selectedFiles.length > MAX_PHOTOS) throw new Error(`A product can have up to ${MAX_PHOTOS} photos.`);
      const processed = await Promise.all(selectedFiles.map(compressPhoto));
      setImages((current) => [...current, ...processed]);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Could not process the selected photos.');
    } finally {
      setSaving(false);
    }
  };

  const saveProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    if (!name.trim()) return setFormError('Enter a product name.');
    if (!Number.isFinite(Number(price)) || Number(price) <= 0) return setFormError('Enter a price greater than zero.');
    if (!images.length) return setFormError('Add at least one product photo.');
    const draft: ProductDraft = { name: name.trim(), category, price: Number(price), currency, description: description.trim(), images };
    if (editing) updateProduct(editing.id, draft);
    else addProduct(draft);
    resetForm();
  };

  if (!isOwnerSignedIn) {
    return (
      <main className="admin-page">
        <div className="admin-access">
          <button className="back-link" onClick={backToStore}><ArrowLeft size={15} /> Back to the shop</button>
          <span className="eyebrow"><LockKeyhole size={13} /> Owner access</span>
          <h1>{ownerPinHash ? 'Welcome back.' : 'Set up your owner PIN.'}</h1>
          <p>{ownerPinHash ? 'Enter the PIN you created on this device to manage shop listings.' : 'Create an owner PIN to make this browser’s product manager less accessible to casual visitors.'}</p>
          <form className="pin-form" onSubmit={authenticate}>
            <label>{ownerPinHash ? 'Owner PIN' : 'Create PIN'}<input autoComplete="new-password" type="password" minLength={8} value={pin} onChange={(event) => setPin(event.target.value)} required /></label>
            {!ownerPinHash && <label>Confirm PIN<input autoComplete="new-password" type="password" minLength={8} value={confirmPin} onChange={(event) => setConfirmPin(event.target.value)} required /></label>}
            {pinError && <p className="form-error" role="alert">{pinError}</p>}
            <button className="button button-green" type="submit">{ownerPinHash ? 'Sign in' : 'Set PIN and continue'} <LockKeyhole size={15} /></button>
          </form>
          <p className="security-note"><ShieldCheck size={15} /> This PIN is a convenience lock, not secure server authentication. Products and PIN are stored only in this browser.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <div className="admin-topline"><button className="back-link" onClick={backToStore}><ArrowLeft size={15} /> View storefront</button><button className="text-button" onClick={() => { signOutOwner(); resetForm(); }}><LogOut size={15} /> Sign out</button></div>
        <div className="admin-heading"><div><span className="eyebrow">Scents By Kitiibwa · Owner</span><h1>Product manager</h1><p>Add new arrivals or keep existing listings up to date.</p></div><div className="listing-count"><strong>{products.length.toString().padStart(2, '0')}</strong><span>listings</span></div></div>
        <div className="admin-grid">
          <section className="admin-panel editor-panel">
            <div className="panel-heading"><div><span className="panel-index">{editing ? '02' : '01'}</span><h2>{editing ? 'Edit listing' : 'Add a product'}</h2></div>{editing && <button className="icon-button" aria-label="Cancel editing" onClick={resetForm}><X size={18} /></button>}</div>
            <form className="product-form" onSubmit={saveProduct}>
              <label>Product name<input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} required placeholder="e.g. Amber perfume oil" /></label>
              <div className="form-row">
                <label>Category<select value={category} onChange={(event) => setCategory(event.target.value as ProductCategory)}>{PRODUCT_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label>Price<div className="price-input"><input type="number" min="1" step="any" value={price} onChange={(event) => setPrice(event.target.value)} required placeholder="0" /><select aria-label="Currency" value={currency} onChange={(event) => setCurrency(event.target.value as ProductCurrency)}><option value="UGX">UGX</option><option value="USD">USD</option></select></div></label>
              </div>
              <label>Description <span className="optional">Optional</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={220} rows={3} placeholder="A short note for customers" /></label>
              <div className="photo-field"><div className="photo-field-heading"><label htmlFor="product-photos">Product photos</label><span>{images.length}/{MAX_PHOTOS}</span></div><label className={`photo-drop ${images.length >= MAX_PHOTOS || saving ? 'disabled' : ''}`} htmlFor="product-photos"><ImagePlus size={21} /><span>{saving ? 'Preparing photos…' : 'Choose photos from your device'}</span><small>JPG, PNG or WebP · up to {MAX_PHOTOS} images</small><input id="product-photos" type="file" accept="image/*" multiple disabled={images.length >= MAX_PHOTOS || saving} onChange={(event) => { void addPhotos(event.target.files); event.currentTarget.value = ''; }} /></label>
                {images.length > 0 && <div className="photo-preview-list">{images.map((image, index) => <div className="photo-preview" key={`${index}-${image.slice(-20)}`}><img src={image} alt={`Product preview ${index + 1}`} /><button type="button" aria-label={`Remove photo ${index + 1}`} onClick={() => setImages((current) => current.filter((_, imageIndex) => imageIndex !== index))}><X size={13} /></button></div>)}</div>}
              </div>
              {formError && <p className="form-error" role="alert">{formError}</p>}
              <button type="submit" className="button button-green" disabled={saving}>{editing ? <Save size={16} /> : <Plus size={17} />}{editing ? 'Save changes' : 'Add to storefront'}</button>
            </form>
          </section>
          <section className="admin-panel listing-panel"><div className="panel-heading"><div><span className="panel-index">02</span><h2>Current listings</h2></div><span className="listing-total">{products.length} products</span></div>
            {products.length === 0 ? <div className="admin-empty"><span className="empty-icon"><ImagePlus size={23} /></span><strong>Your product list is empty</strong><p>Add a product with a photo and price to start your catalog.</p></div> : <div className="admin-product-list">{products.map((product) => <article className="admin-product-row" key={product.id}><img src={product.images[0]} alt="" /><div className="admin-product-copy"><span>{product.category}</span><strong>{product.name}</strong><small>{priceText(product)}</small></div><div className="row-actions"><button className="icon-button" aria-label={`Edit ${product.name}`} title="Edit listing" onClick={() => editProduct(product)}><Save size={15} /></button><button className="icon-button delete-action" aria-label={`Delete ${product.name}`} title="Delete listing" onClick={() => { if (confirm(`Delete ${product.name}?`)) { deleteProduct(product.id); if (editing?.id === product.id) resetForm(); } }}><Trash2 size={15} /></button></div></article>)}</div>}
          </section>
        </div>
        <div className="local-storage-warning"><ShieldCheck size={16} /><p><strong>Stored on this device only.</strong> In this version, products and photos live in this browser. They are not automatically published to other visitors or synced to another device. Public updates need a shared database and secure owner login.</p></div>
      </div>
    </main>
  );
}
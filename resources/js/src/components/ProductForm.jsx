import { useEffect, useMemo, useState } from 'react';
import api from '../api';

const emptyForm = {
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image: null,
};

function ProductForm({ product = null, onSaved }) {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState(() => ({
        ...emptyForm,
        ...product,
        image: null,
    }));
    const [preview, setPreview] = useState(product?.image_url || '');
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const isEditing = Boolean(product);

    useEffect(() => {
        api.get('/categories').then((response) => setCategories(response.data));
    }, []);

    useEffect(() => {
        if (!form.image) {
            setPreview(product?.image_url || '');
            return;
        }

        const nextPreview = URL.createObjectURL(form.image);
        setPreview(nextPreview);

        return () => URL.revokeObjectURL(nextPreview);
    }, [form.image, product]);

    const flatErrors = useMemo(() => Object.values(errors).flat(), [errors]);

    const handleChange = (event) => {
        const { name, value, files } = event.target;

        setForm({
            ...form,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setErrors({});
        setMessage('');

        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description || '');
        formData.append('price', form.price);
        formData.append('stock', form.stock);
        formData.append('category_id', form.category_id);

        if (form.image) {
            formData.append('image', form.image);
        }

        try {
            if (isEditing) {
                formData.append('_method', 'PUT');
                await api.post(`/products/${product.id}`, formData);
            } else {
                await api.post('/products', formData);
            }

            onSaved();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                setMessage('Could not save product.');
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <form className="form-panel" onSubmit={handleSubmit}>
            {message && <p className="status error">{message}</p>}
            {flatErrors.length > 0 && (
                <div className="validation-summary">
                    {flatErrors.map((error) => (
                        <p key={error}>{error}</p>
                    ))}
                </div>
            )}

            <div className="form-grid">
                <label>
                    Name
                    <input name="name" value={form.name} onChange={handleChange} />
                    <FieldError errors={errors.name} />
                </label>

                <label>
                    Category
                    <select name="category_id" value={form.category_id || ''} onChange={handleChange}>
                        <option value="">Select category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                    <FieldError errors={errors.category_id} />
                </label>

                <label>
                    Price
                    <input name="price" type="number" min="0" value={form.price} onChange={handleChange} />
                    <FieldError errors={errors.price} />
                </label>

                <label>
                    Stock
                    <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} />
                    <FieldError errors={errors.stock} />
                </label>
            </div>

            <label>
                Description
                <textarea name="description" value={form.description || ''} onChange={handleChange} rows="5" />
                <FieldError errors={errors.description} />
            </label>

            <div className="image-field">
                <label>
                    Image
                    <input name="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleChange} />
                    <FieldError errors={errors.image} />
                </label>
                {preview ? (
                    <img className="product-image preview" src={preview} alt="Preview" />
                ) : (
                    <div className="product-image preview placeholder">No image</div>
                )}
            </div>

            <div className="form-actions">
                <button className="button primary" type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save product'}
                </button>
            </div>
        </form>
    );
}

function FieldError({ errors }) {
    if (!errors?.length) {
        return null;
    }

    return <span className="field-error">{errors[0]}</span>;
}

export default ProductForm;

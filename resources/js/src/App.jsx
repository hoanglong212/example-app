import { Link, Navigate, Route, BrowserRouter as Router, Routes, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from './api';
import ProductForm from './components/ProductForm.jsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/products" replace />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/new" element={<ProductCreate />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/products/:id/edit" element={<ProductEdit />} />
            </Routes>
        </Router>
    );
}

function ProductList() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        category_id: '',
        min_price: '',
        max_price: '',
        sort: 'newest',
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/categories').then((response) => setCategories(response.data));
    }, []);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async (nextFilters = filters) => {
        setLoading(true);
        setError('');

        try {
            const response = await api.get('/products', {
                params: cleanParams(nextFilters),
            });
            setProducts(response.data);
        } catch {
            setError('Could not load products.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (event) => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.value,
        });
    };

    const handleSearch = (event) => {
        event.preventDefault();
        loadProducts(filters);
    };

    const clearFilters = () => {
        const nextFilters = {
            search: '',
            category_id: '',
            min_price: '',
            max_price: '',
            sort: 'newest',
        };
        setFilters(nextFilters);
        loadProducts(nextFilters);
    };

    const deleteProduct = async (product) => {
        if (!window.confirm(`Delete "${product.name}"?`)) {
            return;
        }

        try {
            await api.delete(`/products/${product.id}`);
            setProducts(products.filter((item) => item.id !== product.id));
            setMessage('Product deleted successfully.');
        } catch {
            setError('Could not delete product.');
        }
    };

    return (
        <main className="page-shell">
            <section className="page-header">
                <div>
                    <p className="eyebrow">Laravel REST API + React</p>
                    <h1>Products</h1>
                </div>
                <Link className="button primary" to="/products/new">New product</Link>
            </section>

            <form className="toolbar" onSubmit={handleSearch}>
                <label>
                    Search
                    <input name="search" value={filters.search} onChange={handleFilterChange} placeholder="Product name" />
                </label>
                <label>
                    Category
                    <select name="category_id" value={filters.category_id} onChange={handleFilterChange}>
                        <option value="">All categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Min price
                    <input name="min_price" type="number" min="0" value={filters.min_price} onChange={handleFilterChange} />
                </label>
                <label>
                    Max price
                    <input name="max_price" type="number" min="0" value={filters.max_price} onChange={handleFilterChange} />
                </label>
                <label>
                    Sort
                    <select name="sort" value={filters.sort} onChange={handleFilterChange}>
                        <option value="newest">Newest</option>
                        <option value="name_asc">Name A-Z</option>
                        <option value="name_desc">Name Z-A</option>
                        <option value="price_asc">Price low-high</option>
                        <option value="price_desc">Price high-low</option>
                        <option value="stock_desc">Stock high-low</option>
                    </select>
                </label>
                <div className="toolbar-actions">
                    <button className="button primary" type="submit">Apply</button>
                    <button className="button subtle" type="button" onClick={clearFilters}>Reset</button>
                </div>
            </form>

            <StatusMessage message={message} error={error} />

            <section className="table-wrap">
                {loading ? (
                    <p className="empty-state">Loading products...</p>
                ) : products.length === 0 ? (
                    <p className="empty-state">No products found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td><ProductImage product={product} /></td>
                                    <td>
                                        <strong>{product.name}</strong>
                                        <span className="muted clamp">{product.description || 'No description'}</span>
                                    </td>
                                    <td>{product.category?.name || 'N/A'}</td>
                                    <td>{formatCurrency(product.price)}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <div className="actions">
                                            <Link className="button subtle" to={`/products/${product.id}`}>View</Link>
                                            <Link className="button subtle" to={`/products/${product.id}/edit`}>Edit</Link>
                                            <button className="button danger" type="button" onClick={() => deleteProduct(product)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </main>
    );
}

function ProductCreate() {
    const navigate = useNavigate();

    return (
        <main className="page-shell narrow">
            <PageBack title="Create product" />
            <ProductForm onSaved={() => navigate('/products')} />
        </main>
    );
}

function ProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/products/${id}`)
            .then((response) => setProduct(response.data))
            .catch(() => setError('Could not load product.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <main className="page-shell narrow"><p className="empty-state">Loading product...</p></main>;
    }

    if (error) {
        return <main className="page-shell narrow"><StatusMessage error={error} /></main>;
    }

    return (
        <main className="page-shell narrow">
            <PageBack title="Edit product" />
            <ProductForm product={product} onSaved={() => navigate(`/products/${id}`)} />
        </main>
    );
}

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/products/${id}`)
            .then((response) => setProduct(response.data))
            .catch(() => setError('Could not load product.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <main className="page-shell narrow"><p className="empty-state">Loading product...</p></main>;
    }

    if (error) {
        return <main className="page-shell narrow"><StatusMessage error={error} /></main>;
    }

    return (
        <main className="page-shell narrow">
            <PageBack title={product.name} />
            <section className="detail-layout">
                <ProductImage product={product} large />
                <div className="detail-content">
                    <dl>
                        <div>
                            <dt>Category</dt>
                            <dd>{product.category?.name || 'N/A'}</dd>
                        </div>
                        <div>
                            <dt>Price</dt>
                            <dd>{formatCurrency(product.price)}</dd>
                        </div>
                        <div>
                            <dt>Stock</dt>
                            <dd>{product.stock}</dd>
                        </div>
                    </dl>
                    <p>{product.description || 'No description available.'}</p>
                    <Link className="button primary" to={`/products/${product.id}/edit`}>Edit product</Link>
                </div>
            </section>
        </main>
    );
}

function PageBack({ title }) {
    return (
        <section className="page-header compact">
            <div>
                <Link className="back-link" to="/products">Back to products</Link>
                <h1>{title}</h1>
            </div>
        </section>
    );
}

function ProductImage({ product, large = false }) {
    const className = large ? 'product-image large' : 'product-image';

    if (!product.image_url) {
        return <div className={`${className} placeholder`}>No image</div>;
    }

    return <img className={className} src={product.image_url} alt={product.name} />;
}

function StatusMessage({ message = '', error = '' }) {
    if (!message && !error) {
        return null;
    }

    return <p className={error ? 'status error' : 'status success'}>{error || message}</p>;
}

function cleanParams(params) {
    return Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined),
    );
}

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value || 0);
}

export default App;

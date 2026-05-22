<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Details</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-8 offset-md-2">
                <div class="card shadow-sm">
                    <div class="card-header bg-dark text-white">
                        <h3 class="mb-0">Product Details: {{ $product->name }}</h3>
                    </div>
                    <div class="card-body">
                        <div class="row mb-4">
                            <div class="col-md-4 text-center">
                                @if($product->image)
                                    <img src="{{ asset('storage/' . $product->image) }}" class="img-fluid rounded" alt="{{ $product->name }}">
                                @else
                                    <div class="bg-light d-flex align-items-center justify-content-center rounded" style="height: 200px; border: 1px solid #dee2e6;">
                                        <span class="text-muted">No Image</span>
                                    </div>
                                @endif
                            </div>
                            <div class="col-md-8">
                                <h4 class="card-title">{{ $product->name }}</h4>
                                <h5 class="text-primary mb-3">${{ number_format($product->price, 2) }}</h5>
                                
                                <table class="table table-borderless">
                                    <tbody>
                                        <tr>
                                            <th style="width: 30%">Category:</th>
                                            <td><span class="badge bg-secondary">{{ $product->category->name ?? 'Uncategorized' }}</span></td>
                                        </tr>
                                        <tr>
                                            <th>Stock Status:</th>
                                            <td>
                                                @if($product->stock > 10)
                                                    <span class="text-success"><i class="bi bi-check-circle-fill"></i> In Stock ({{ $product->stock }})</span>
                                                @elseif($product->stock > 0)
                                                    <span class="text-warning"><i class="bi bi-exclamation-triangle-fill"></i> Low Stock ({{ $product->stock }})</span>
                                                @else
                                                    <span class="text-danger"><i class="bi bi-x-circle-fill"></i> Out of Stock</span>
                                                @endif
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Added On:</th>
                                            <td>{{ $product->created_at->format('F d, Y') }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="mt-4">
                            <h5>Description</h5>
                            <div class="p-3 bg-light rounded border">
                                {{ $product->description ?: 'No description available for this product.' }}
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-light d-flex justify-content-between">
                        <a href="{{ url('/products') }}" class="btn btn-secondary">
                            &larr; Back to List
                        </a>
                        <div>
                            <a href="{{ route('products.edit', $product->id) }}" class="btn btn-primary">Edit Product</a>
                            <form action="{{ route('products.destroy', $product->id) }}" method="POST" class="d-inline">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this product?')">Delete</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
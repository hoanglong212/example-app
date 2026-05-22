<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|min:3|max:100',
            'description' => 'nullable|string|max:1000',
            'price' => 'required|integer|min:0|max:100000000',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10240',
            'category_id' => 'required|exists:categories,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Product name is required.',
            'name.string' => 'Product name must be a string.',
            'name.min' => 'Product name must be at least 3 characters.',
            'name.max' => 'Product name may not be greater than 100 characters.',
            'description.string' => 'Description must be a string.',
            'description.max' => 'Description may not be greater than 1000 characters.',
            'price.required' => 'Price is required.',
            'price.integer' => 'Price must be an integer.',
            'price.min' => 'Price must be at least 0.',
            'price.max' => 'Price may not be greater than 100000000.',
            'stock.required' => 'Stock is required.',
            'stock.integer' => 'Stock must be an integer.',
            'stock.min' => 'Stock must be at least 0.',
            'image.image' => 'The uploaded file must be an image.',
            'image.mimes' => 'Image must be a JPG, JPEG, PNG, or WEBP file.',
            'image.max' => 'Image may not be greater than 10MB.',
            'category_id.required' => 'Category is required.',
            'category_id.exists' => 'Selected category does not exist.',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'message' => 'The given data was invalid.',
            'errors' => $validator->errors(),
        ], 422));
    }
}

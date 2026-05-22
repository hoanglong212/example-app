<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
        'image',
        'category_id'
    ];

    protected $appends = [
        'image_url',
    ];

    protected $casts = [
        'price' => 'integer',
        'stock' => 'integer',
        'category_id' => 'integer',
    ];
    
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image) {
            return null;
        }

        return asset(Storage::url($this->image));
    }
}

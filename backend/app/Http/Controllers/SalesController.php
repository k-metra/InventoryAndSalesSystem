<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;

class SalesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Sale::with('customer')
            ->withCount('items')
            ->orderBy('created_at', 'desc');

        if ($request->search) {
            $query->whereHas('customer', function ($q) use ($request) {
                $q->where('name', 'like', "%$request->search%");
            });
        }

        if ($request->date_from && $request->date_to) {
            $query->whereBetween('created_at', [
                $request->date_from,
                $request->date_to
            ]);
        }

        return $query->paginate(10)->withQueryString();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated_data = $request->validate([
            'customer_id'       => 'nullable|exists:customers,id',
            'payment_method'    => 'required|string|max:50',
            'items'             => 'required|array|min:1',
            'items.*.product_id'=> 'required|exists:products,id',
            'items.*.quantity'  => 'required|integer|min:1',
            'items.*.price'     => 'required|numeric|min:0',
            'items.*.discount'  => 'nullable|numeric|min:0'
        ]);

        DB::transaction(function () use ($validated_data) {
            $sale = Sale::create([
                'customer_id'   => $validated_data['customer_id'] ?? null,
                'payment_method'=> $validated_data['payment_method'],
                'total_amount'  => 0,
            ]);

            $totalAmount = 0;

            foreach ($validated_data['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    abort(400, "Not enough stock for {$product->name}");
                }

                $product->stock -= $item['quantity'];
                $product->save();

                $subtotal = ($item['price'] * $item['quantity']) - ($item['discount'] ?? 0);
                $totalAmount += $subtotal;

                SaleItem::create([
                    'sale_id'   => $sale->id,
                    'product_id'=> $item['product_id'],
                    'quantity'  => $item['quantity'],
                    'price'     => $item['price'],
                    'discount'  => $item['discount'] ?? 0,
                    'subtotal'  => $subtotal,
                ]);
            }

            $sale->update(['total_amount' => $totalAmount]);

            return $sale->load(['items.product', 'customer']);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $sale = Sale::with(['customer', 'items.product'])->findOrFail($id);
        return $sale;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // No UPDATE method implemented. Sales are and should be immutable after creation
        // This is how it is in most inventory and sales system with POS.
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return DB::transaction(function () use ($id) {
            $sale = Sale::with('items.product')->findOrFail($id);

            foreach($sale->items as $item) {
                $product = $item->product;
                if ($product) {
                    $product->stock += $item->quantity;
                    $product->save();
                }
            }

            $sale->items()->delete();
            $sale->delete();

            return response()
                ->json(['message' => 'Sale deleted successfully.'], 200);
        });
    }
}

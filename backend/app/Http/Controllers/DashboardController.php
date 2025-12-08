<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sale;
use App\Models\Customer;
use App\Models\Product;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $total_sales_today = Sale::whereDate(
            'created_at', now()->toDateString())
            ->count();
        
        $total_customers = Customer::count();

        $total_products = Product::count();

        $total_sales_this_month = Sale::whereMonth(
            'created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        
        $low_stock_count = Product::where('stock', '<', 16)->count();

        $out_of_stock_count = Product::where('stock', '=', 0)->count();

        $recent_sales = Sale::with('customer')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Sales total sfor the last 30 days for charting
        $total_chart_data = [];

        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $total = Sale::whereDate('created_at', $date->toDateString())
                ->sum('total');
            
            $total_chart_data[] = [
                'date' => $date->toDateString(),
                'total' => $total,
            ];
        }
        
        return response()->json([
            'total_sales_today' => $total_sales_today,
            'total_customers' => $total_customers,
            'total_products' => $total_products,
            'total_sales_this_month' => $total_sales_this_month,
            'low_stock_count' => $low_stock_count,
            'out_of_stock_count' => $out_of_stock_count,
            'recent_sales' => $recent_sales,
            'total_chart_data' => $total_chart_data,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

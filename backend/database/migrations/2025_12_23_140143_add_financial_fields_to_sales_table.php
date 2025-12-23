<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->decimal('subtotal', 10, 2)->default(0)->after('payment_method');
            $table->decimal('discount_amount', 10, 2)->default(0)->after('subtotal');
            $table->decimal('vat_rate', 5, 2)->default(12.00)->after('discount_amount');
            $table->decimal('vat_amount', 10, 2)->default(0)->after('vat_rate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropColumn(['subtotal', 'discount_amount', 'vat_rate', 'vat_amount']);
        });
    }
};

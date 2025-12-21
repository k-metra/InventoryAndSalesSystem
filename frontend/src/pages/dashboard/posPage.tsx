import { AiOutlineProduct } from "react-icons/ai";
import { TiShoppingCart } from "react-icons/ti";
import SearchBar from "@components/searchBar";
import useProducts from "../../queries/products/useProducts";
import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RiArrowDropDownFill } from "react-icons/ri";
import Dropdown from "@components/dropdown";
import useSuppliers from "../../queries/suppliers/useSuppliers";
import type { Category, Supplier } from "../../types/objects";
import useCategories from "../../queries/categories/useCategories";
import type { Product } from "../../utils/fetchProducts";
import Pagination from "@components/pagination";
import { formatCurrency } from "../../utils/formatNumbers";
import { MdAddShoppingCart } from "react-icons/md";
import CartItem from "@components/cartItem";
import { type Item, type Discount } from "@typings/objects";
import DiscountModal from "@/components/discountModal";

export default function POSPage() {
    
    const [searchParams, setSearchParams] = useSearchParams();

    const [activeSearch, setActiveSearch] = useState<string>(searchParams.get("search") || "");
    const [search, setSearch] = useState(activeSearch || "");
    const [sort, setSort] = useState<string>(searchParams.get("sort") || "");
    const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get("page")) || 1);
    const [supplier, setSupplier] = useState<string>(searchParams.get("supplier") || "");
    const [category, setCategory] = useState<string>(searchParams.get("category") || "");
    const [sortOpen, setSortOpen] = useState(false);
    const [supplierOpen, setSupplierOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);

    const [showDiscountModal, setShowDiscountModal] = useState(false); 

    const [cart, setCart] = useState<Item[]>(() => {
        const saved = localStorage.getItem("pos-cart");
        return saved ? JSON.parse(saved) : [];
    });

    const [discounts, setDiscounts] = useState<Discount[]>(() => {
        const savedDiscounts = localStorage.getItem("pos-discounts");
        return savedDiscounts ? JSON.parse(savedDiscounts) : [];
    });

    const updateItemQuantity = useCallback((itemId: number, newQuantity: number) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.id === itemId) {
                    return { ... item, quantity: newQuantity }
                }

                return item;
            });
        });
    }, [setCart]);

    const onItemRemove = useCallback((itemId: number) => {
        setCart(prevCart => { return prevCart.filter(item => item.id !== itemId); })
    }, [setCart])

    useEffect(() => {
        localStorage.setItem("pos-cart", JSON.stringify(cart));
        localStorage.setItem("pos-discounts", JSON.stringify(discounts));
    }, [cart, discounts]);

    const subtotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, [cart]);

    const total = useMemo(() => {
        let totalAmount = subtotal;

        const totalDiscount = discounts.reduce((prev, discount) => {
            if (discount.type === 'fixed') {
                return prev + discount.value;
            } else {
                return prev + (subtotal * discount.value) / 100;
            }
        }, 0);

        return (Math.max(0, totalAmount - totalDiscount));
    }, [subtotal, discounts]);

    const sortRef = useRef<HTMLDivElement | null>(null);
    const supplierRef = useRef<HTMLDivElement | null>(null);
    const categoryRef = useRef<HTMLDivElement | null>(null);

    const onSortClick = useCallback(() => setSortOpen(prev => !prev), [setSortOpen]);
    const onSupplierClick = useCallback(() => setSupplierOpen(prev => !prev), [setSupplierOpen]);
    const onCategoryClick = useCallback(() => setCategoryOpen(prev => !prev), [setCategoryOpen]);

    const {
        data: supplierList,
        isPending: isSuppliersPending,
        isError: isSuppliersError,
    } = useSuppliers();

    const {
        data: categoryList,
        isPending: isCategoriesPending,
        isError: isCategoriesError,
    } = useCategories();
    

    const sortingOptions = useMemo(() => {
        return [
            { label: "Name: A to Z", value: "A-Z" },
            { label: "Name: Z to A", value: "Z-A" },
            { label: "Price: Low to High", value: "Lower Price" },
            { label: "Price: High to Low", value: "Higher Price" },
            { label: "Stock: Low to High", value: "Lower Stock" },
            { label: "Stock: High to Low", value: "Greater Stock" },
            { label: "Cost: Low to High", value: "Lower Cost" },
            { label: "Cost: High to Low", value: "Greater Cost" },
        ];
    }, []);

    const setPage = useCallback((page: number) => {
        setCurrentPage(page);
        updateParam("page", page.toString());
    }, []);


    const handleClickOutside = useCallback((e: MouseEvent) => {
        if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
            setSortOpen(false);
        }

        if (supplierRef.current && !supplierRef.current.contains(e.target as Node)) {
            setSupplierOpen(false);
        }

        if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
            setCategoryOpen(false);
        }
        
    }, [sortRef, supplierRef, categoryRef]);

    const updateParam = useCallback((param: string, value: string | null) => {
        const newParams = new URLSearchParams(searchParams);

        if (value) newParams.set(param, value);
        else newParams.delete(param);

        setSearchParams(newParams);
    }, [searchParams, setSearchParams]);

    const handleSearch = useCallback((searchQuery: string | null) => {
        if (searchQuery && searchQuery.trim()) {
            setActiveSearch(searchQuery.trim());
            updateParam("search", searchQuery.trim())
        } else {
            setActiveSearch("");
            updateParam("search", null);
        }
    }, [setActiveSearch, updateParam]);

    const {
        data: products,
        isPending: isProductsLoading,
        isError: isProductError,
        refetch: refetchProducts
    } = useProducts(activeSearch, sort, supplier, category, currentPage, false);

    useEffect(() => {
        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
        }
    }, [handleClickOutside]);

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="shadow-md bg-background border border-black/25 rounded-md p-4 mb-4 h-full">
                <h4 className="text-text text-lg  font-semibold mb-2">
                    Product List
                    <AiOutlineProduct className="inline-block ml-2" size={35} />

                    
                </h4>
                <hr className="border-t border-black/25 my-4" />
                <SearchBar 
                    placeholder="Product name or SKU..."
                    handleSearch={() => handleSearch(search)}
                    handleClear={() => {}}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                    value={search}

                    searchParams={searchParams}
                />
                
                <div className="flex gap-2 my-2 items-start">

                    <Dropdown 
                        onOptionClick={(option?: string | null) => {
                            updateParam("sort", option || "");
                            setSort(option || "");
                            setSortOpen(false);
                        }}
                        ref={sortRef}
                        onClick={onSortClick}
                        options={sortingOptions}
                        label="Sort by"
                        value={sort || undefined}
                        isOpen={sortOpen}
                    />



                    <Dropdown
                        onOptionClick={(option?: string | null) => {
                            updateParam("supplier", option || "");
                            setSupplier(option || "");
                            setSupplierOpen(false);
                        }}
                        ref={supplierRef}
                        onClick={onSupplierClick}
                        options={(supplierList && supplierList.map((supplier: Supplier) => ({ label: supplier.name, value: supplier.id }))) || []}
                        label="Supplier"
                        value={supplier || undefined}
                        isOpen={supplierOpen}
                    />


                    <Dropdown
                        options={(categoryList && categoryList.map((category: Category) => ({ label: category.name, value: category.id }))) || []}
                        onOptionClick={(option?: string | null) => {
                            updateParam("category", option || "");
                            setCategory(option || "");
                            setCategoryOpen(false);
                        }}
                        ref={categoryRef}
                        onClick={onCategoryClick}
                        label="Category"
                        isOpen={categoryOpen}
                        value={category || undefined} 
                    />

                </div>

                <div className="flex justify-end mt-1 mb-2">
                    <Pagination
                        key={"paginationTop"}
                        page={currentPage}
                        lastPage={products?.last_page || 1}
                        setPage={setPage}
                    />
                </div>

                
                <hr className="border-t border-black/25 my-4" />

                {isProductsLoading ? (
                    <p className="text-text text-center">Loading products...</p>
                ) : isProductError ? (
                    <p className="text-red-500">Ran into an error loading products.</p>
                ) : (
                    <div className="custom-scrollbar pr-4 flex flex-col gap-4 w-full overflow-y-auto max-h-[500px] max-w-full">
                        {(products && products?.data?.length > 0) ? (products?.data?.map((product: Product) => (
                            <div key={product.id} className="w-full border border-black/25 rounded-md p-3 hover:shadow-lg transition-shadow duration-300 ease-out cursor-pointer flex flex-col justify-evenly gap-0">
                                <div className="w-full flex justify-between">
                                    <span className="font-semibold text-text text-left text-[16px]">{product.name}</span>
                                    <span className="text-text font-bold text-[16px]">{formatCurrency(product.price)}</span>
                                </div>
                                <span className={`text-[16px] mb-3 ${product?.stock === 0 ? "text-red-500" : "text-text/70"}`}>{product?.stock} in stock</span>
                                <div className="flex justify-between">
                                    <div className="flex flex-col gap-0">
                                        <span className="text-muted text-[14px]">{product.supplier?.name || "No supplier"}</span>
                                        <span className="text-muted text-[14px]">{product.category?.name || "No category"}</span>
                                    </div>

                                    <button
                                        title={product.stock <= 0 ? "Out of stock" : "Add to cart"}
                                        disabled={product.stock <= 0}
                                        onClick={() => {
                                            const existingItem = cart.find(item => item.id === product.id);

                                            if (existingItem) {
                                                updateItemQuantity(product.id, existingItem.quantity + 1);
                                            } else {
                                                const { id, name, price } = product;
                                                const newItem: Item = { id, name, price, quantity: 1 };

                                                setCart(prevCart => [...prevCart, newItem]);
                                            }
                                        }}
                                        className="from-blue-500 to-blue-600 bg-linear-to-r hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex justify-center items-center gap-2 cursor-pointer disabled:to-blue-500/50 disabled:from-blue-600/50 disabled:cursor-not-allowed"
                                    >
                                        <MdAddShoppingCart size={24} />
                                    </button>
                                </div>
                            </div>
                        )) 

                    ) : (
                            <p className="text-text text-center w-full">No products found.</p>
                        )}
                    </div>  
                )}
                
                <div className="flex justify-end my-2">
                    <Pagination
                        key={"paginationBottom"}
                        page={currentPage}
                        lastPage={products?.last_page || 1}
                        setPage={setPage}
                    />
                </div>
            </div>
            <div className="shadow-md bg-background border border-black/25 rounded-md p-4 mb-4 flex flex-col h-full">
                <h4 className="text-lg font-semibold mb-2 text-text sticky">
                    Cart
                    <TiShoppingCart className="inline-block ml-2" size={35} />
                </h4>

                <div className="flex flex-col gap-2 bg-white border border-black/25 rounded-md p-4 flex-1 max-h-3/5 min-h-3/5 overflow-y-auto">
                    {(cart.length > 0 ) ? cart.map((item: Item, idx: number, _arr: Item[]) => (
                        <CartItem
                            key={item.id + "-" + idx + "-" + crypto.randomUUID()}
                            item={item}
                            onUpdateQuantity={updateItemQuantity}
                            onRemoveItem={onItemRemove}
                        />
                    )) : (
                        <p className="text-muted text-center w-full">Cart is empty.</p>
                    )}
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-t-black/25 mt-auto">
                    <span className="font-semibold text-text text-lg">Subtotal</span>
                    <span className={`text-md ${subtotal > 0 ? 'text-green-700 font-semibold' : 'text-muted'}`}>{formatCurrency(subtotal)}</span>
                </div>

                {discounts.length > 0 ? (
                    <>
                        <span className="text-lg font-semibold text-text mt-2 block">Discount(s)</span>
                        {discounts.map((discount: Discount, idx: number) => (
                            <div onClick={() => {setDiscounts(prevDiscounts => prevDiscounts.filter(curDiscount => curDiscount.name !== discount.name))}} key={idx} className="flex justify-between items-center mt-1 hover:bg-red-400/50 rounded-md p-1 cursor-pointer">
                                <span className="text-text text-sm">{discount.name} ({discount.type === 'percentage' ? `${discount.value}%` : formatCurrency(discount.value)})</span>
                                <span className="text-muted text-sm">
                                    -{discount.type === 'fixed' ? formatCurrency(discount.value) : formatCurrency((subtotal * discount.value) / 100)} 
                                </span>
                            </div>
                        ))}
                    </>
                ) : (<span className="text-muted text-sm">No discounts applied.</span>)}
                 
                <div className="my-4 pt-4 justify-between items-center flex">
                    <span className="font-semibold text-text text-xl">Total</span>
                    <span className="text-xl font-bold text-green-800">{formatCurrency(total)}</span>
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        className="p-2 px-4 rounded-md text-white border cursor-pointer bg-blue-600 hover:bg-blue-700 transition-colors duration-300 flex justify-center items-center gap-2"
                        onClick={() => setShowDiscountModal(true)}
                    >
                        Apply Discount
                    </button>
                    <button
                        className="p-2 px-4 rounded-md bg-green-600 border cursor-pointer text-white hover:bg-green-700 transition-colors duration-300 flex justify-center items-center gap-2"
                    >
                        Checkout
                    </button>
                </div>
            </div>

            <DiscountModal
                showModal={showDiscountModal}
                setShowModal={setShowDiscountModal}
                onApply={(discount: Discount) => {
                    setDiscounts((prevDiscounts) => [...prevDiscounts, discount]);
                }}
            />
        </div>
    )

  }
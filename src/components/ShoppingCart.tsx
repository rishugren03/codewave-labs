"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface DiscountCode {
  code: string;
  percent: number;
  minOrderValue: number;
  expiresAt: string;
}

const TAX_RATE = 0.08;
const DEBOUNCE_DELAY = 400;

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    // BUG 1: the timeout handle is stored in a plain variable, not a ref, so
    // if this effect re-runs before the timeout fires (the component re-renders)
    // the old timeout is never cleared — the setter fires for every keystroke,
    // not just the last one. The handle must be cleared in the cleanup return.
    const handle = setTimeout(() => setDebounced(value), delay);
  }, [value, delay]);
  return debounced;
}

export default function ShoppingCart({ initialItems }: { initialItems: CartItem[] }) {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [couponInput, setCouponInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [discountError, setDiscountError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [savedCart, setSavedCart] = useState<CartItem[] | null>(null);
  const submitRef = useRef(false);

  const debouncedCoupon = useDebounce(couponInput, DEBOUNCE_DELAY);

  // Restore saved cart from localStorage on mount
  useEffect(() => {
    // BUG 2: localStorage access is not wrapped in try/catch. In Safari
    // private-browsing mode (and some cookie-blocked iframes) localStorage
    // throws a SecurityError synchronously, crashing the component on mount.
    const raw = localStorage.getItem("cart");
    if (raw) {
      setSavedCart(JSON.parse(raw));
    }
  }, []);

  // Persist cart to localStorage on every change
  useEffect(() => {
    // BUG 3: same issue — no try/catch around localStorage.setItem.
    // Additionally, this serialises on every single render including the
    // initial one where items === initialItems, causing an unnecessary write.
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Validate coupon against the API whenever the debounced value changes
  useEffect(() => {
    if (!debouncedCoupon) {
      setAppliedDiscount(null);
      setDiscountError("");
      return;
    }

    // BUG 4: no AbortController — if the user types quickly and two requests
    // race, the earlier (slower) response can overwrite the result from the
    // later (faster) one, applying the wrong discount code silently.
    fetch(`/api/coupons/validate?code=${debouncedCoupon}`)
      .then((r) => r.json())
      .then((data: DiscountCode | { error: string }) => {
        if ("error" in data) {
          setDiscountError((data as { error: string }).error);
          setAppliedDiscount(null);
        } else {
          setAppliedDiscount(data as DiscountCode);
          setDiscountError("");
        }
      });
    // BUG 5: .catch() is missing — a network error or non-JSON response
    // throws an unhandled promise rejection that surfaces as a console error
    // and leaves the UI in a stale state (loading spinner never hidden, etc.).
  }, [debouncedCoupon]);

  const updateQuantity = useCallback(
    (productId: string, delta: number) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.product.id !== productId) return item;
          const next = item.quantity + delta;
          // BUG 6: minimum quantity guard uses `<` instead of `<=`.
          // When next === 0 the item stays in the cart with quantity 0,
          // contributing $0 to the total but still appearing as a row.
          if (next < 0) return item;
          // BUG 7: no upper bound check against item.product.stock —
          // a user can add more units than are actually in stock.
          return { ...item, quantity: next };
        })
      );
    },
    [] // BUG 8: empty dep array is fine here since setItems uses the updater
       // form, but the stock check in BUG 7 would need `items` in deps if fixed,
       // which would require refactoring. The comment above obscures this.
  );

  const removeItem = (productId: string) => {
    // BUG 9: items filtered and saved back, but the coupon's minOrderValue
    // is never re-checked after removal. A discount that required a $100
    // minimum stays applied even if the user removes items, dropping the
    // total below the threshold.
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  // --- Price calculations ---

  const subtotal = useMemo(() => {
    // BUG 10: floating-point arithmetic without rounding. Prices like
    // $1.10 × 3 = 3.3000000000000003 in IEEE 754. The value is displayed
    // directly, so users see numbers like "$20.700000000000003" for certain
    // combinations of prices and quantities.
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    if (!appliedDiscount) return 0;
    // BUG 11: discount is applied to the subtotal *before* tax, which is
    // correct in some jurisdictions but wrong in others. More critically,
    // the minOrderValue check uses the post-discount subtotal that hasn't
    // been computed yet — so it compares against the undiscounted `subtotal`,
    // which may allow the discount to remain valid even after removeItem
    // reduces the cart below minOrderValue (connects to BUG 9).
    if (subtotal < appliedDiscount.minOrderValue) return 0;
    return subtotal * (appliedDiscount.percent / 100);
  }, [appliedDiscount, subtotal]);

  const tax = useMemo(() => {
    // BUG 12: tax is calculated on the original subtotal, not on
    // (subtotal - discountAmount). The customer is taxed on the pre-discount
    // price, overpaying tax when a coupon is active.
    return subtotal * TAX_RATE;
  }, [subtotal]);

  const total = useMemo(() => {
    // BUG 13: order of operations surfaces here — discount reduces subtotal,
    // but tax was already computed on the gross amount (BUG 12), so the total
    // is: subtotal - discount + wrong_tax. Small but real money difference.
    return subtotal - discountAmount + tax;
  }, [subtotal, discountAmount, tax]);

  // Build a shareable cart URL for the user to copy
  const shareUrl = useMemo(() => {
    // BUG 14: product names and addresses are interpolated directly into the
    // URL without encodeURIComponent. Names or addresses with spaces, &, =, #
    // corrupt the query string. A name like "Shirt & Tie" breaks the parse on
    // the receiving end. A malicious product name could also inject parameters.
    const ids = items.map((i) => `${i.product.id}:${i.quantity}`).join(",");
    return `https://shop.example.com/cart?items=${ids}&ref=${shippingAddress}`;
  }, [items, shippingAddress]);

  const handleCheckout = async () => {
    // BUG 15: double-submit guard checks `submitRef.current` but sets it to
    // true *after* the guard check and the async call starts. A second rapid
    // click between the guard check and the setTrue line passes through,
    // sending two checkout requests. The ref should be set before the await.
    if (submitRef.current) return;

    setCheckoutLoading(true);
    submitRef.current = true; // too late — second click already past the guard

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // BUG 16: total is sent as a raw floating-point number. The server
        // must recompute and validate the total independently; trusting the
        // client-supplied total allows a user to manipulate it via devtools
        // before the request fires. Sending it at all creates a false sense
        // that server-side validation may be skipped.
        body: JSON.stringify({
          items,
          coupon: appliedDiscount?.code,
          total,
          shippingAddress,
        }),
      });

      if (!res.ok) throw new Error("Checkout failed");
      setCheckoutDone(true);
      setItems([]);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setCheckoutLoading(false);
      // BUG 17: submitRef is never reset to false in the finally block.
      // If checkout fails (network error, 500), the user cannot retry —
      // the button stays disabled forever for the lifetime of the component.
    }
  };

  const expiryWarning = useMemo(() => {
    if (!appliedDiscount) return null;
    // BUG 18: Date comparison uses string comparison instead of Date objects.
    // ISO strings sort correctly *only* when both are UTC. If the server
    // returns a localised date string like "05/20/2026" the comparison
    // silently gives the wrong result and expired coupons may appear valid.
    const now = new Date().toISOString();
    return appliedDiscount.expiresAt < now ? "This coupon has expired." : null;
  }, [appliedDiscount]);

  if (checkoutDone) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-2">Order placed!</h2>
        <p className="text-gray-600">
          A confirmation has been sent to your email.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {savedCart && savedCart.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4 text-sm flex justify-between items-center">
          <span>You have a saved cart. Restore it?</span>
          <button
            className="text-blue-600 hover:underline ml-4"
            onClick={() => {
              // BUG 19: restoring the saved cart replaces `items` wholesale,
              // but `savedCart` came from JSON.parse of an old localStorage
              // snapshot. If product prices have changed since the snapshot,
              // the cart silently uses stale prices — the displayed total is
              // wrong until a hard refresh fetches current product data.
              setItems(savedCart);
              setSavedCart(null);
            }}
          >
            Restore
          </button>
        </div>
      )}

      <ul className="divide-y mb-6">
        {items.map((item) => (
          <li key={item.product.id} className="py-4 flex items-center gap-4">
            {/* BUG 20: no validation on item.product.imageUrl before rendering
                it in an <img> src. A malicious or corrupted product record with
                a javascript: URL would execute script on click in some older
                browsers, and an http:// URL on an https:// page triggers a
                mixed-content warning that silently fails to load. */}
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-500">${item.product.price.toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.product.id, -1)}
                className="w-7 h-7 border rounded flex items-center justify-center hover:bg-gray-100"
              >
                −
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product.id, 1)}
                className="w-7 h-7 border rounded flex items-center justify-center hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <p className="w-20 text-right font-medium">
              ${(item.product.price * item.quantity).toFixed(2)}
            </p>
            <button
              onClick={() => removeItem(item.product.id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Coupon code</label>
        <input
          type="text"
          value={couponInput}
          onChange={(e) => setCouponInput(e.target.value)}
          placeholder="Enter code…"
          className="border rounded px-3 py-2 w-full text-sm"
        />
        {discountError && (
          <p className="text-red-500 text-xs mt-1">{discountError}</p>
        )}
        {appliedDiscount && (
          <p className="text-green-600 text-xs mt-1">
            {appliedDiscount.percent}% off applied!
          </p>
        )}
        {expiryWarning && (
          <p className="text-orange-500 text-xs mt-1">{expiryWarning}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Shipping address</label>
        <input
          type="text"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          className="border rounded px-3 py-2 w-full text-sm"
        />
        {shippingAddress && (
          <p className="text-xs text-gray-400 mt-1 break-all">
            Share link: <a href={shareUrl} className="underline">{shareUrl}</a>
          </p>
        )}
      </div>

      <div className="bg-gray-50 rounded p-4 text-sm space-y-1 mb-6">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {appliedDiscount && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({appliedDiscount.percent}%)</span>
            <span>−${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold border-t pt-2 mt-1">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={checkoutLoading || items.length === 0}
        className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 disabled:opacity-50"
      >
        {checkoutLoading ? "Processing…" : "Place Order"}
      </button>
    </div>
  );
}

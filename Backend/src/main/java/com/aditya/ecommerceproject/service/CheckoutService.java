package com.aditya.ecommerceproject.service;

import com.aditya.ecommerceproject.dto.Purchase;
import com.aditya.ecommerceproject.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}

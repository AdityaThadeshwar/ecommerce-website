package com.aditya.ecommerceproject.dto;

import lombok.Data;

@Data
public class PurchaseResponse {

    //lombok generates constructor for final fields only
    private final String orderTrackingNumber;
}

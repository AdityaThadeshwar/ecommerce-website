package com.aditya.ecommerceproject.dto;

import com.aditya.ecommerceproject.entity.Address;
import com.aditya.ecommerceproject.entity.Customer;
import com.aditya.ecommerceproject.entity.Order;
import com.aditya.ecommerceproject.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}

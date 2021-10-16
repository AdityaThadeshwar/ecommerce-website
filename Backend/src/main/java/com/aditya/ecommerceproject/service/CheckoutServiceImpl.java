package com.aditya.ecommerceproject.service;

import com.aditya.ecommerceproject.dao.CustomerRepository;
import com.aditya.ecommerceproject.dto.Purchase;
import com.aditya.ecommerceproject.dto.PurchaseResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private CustomerRepository customerRepository;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        return null;
    }
}

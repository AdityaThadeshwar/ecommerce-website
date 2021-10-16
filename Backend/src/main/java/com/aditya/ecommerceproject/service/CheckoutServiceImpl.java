package com.aditya.ecommerceproject.service;

import com.aditya.ecommerceproject.dao.CustomerRepository;
import com.aditya.ecommerceproject.dto.Purchase;
import com.aditya.ecommerceproject.dto.PurchaseResponse;
import com.aditya.ecommerceproject.entity.Customer;
import com.aditya.ecommerceproject.entity.Order;
import com.aditya.ecommerceproject.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;
import java.util.UUID;

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

        //retrieve the order info from dto
        Order order = purchase.getOrder();

        //generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        //populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));   //orderItems.forEach(order::add);

        //populate order with billing address and shipping address
        order.setShippingAddress(purchase.getShippingAddress());
        order.setBillingAddress(purchase.getBillingAddress());

        //populate customer with order
        Customer customer = purchase.getCustomer();
        customer.add(order);

        //save to database
        customerRepository.save(customer);

        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {

        //UUID version 4
        return UUID.randomUUID().toString();
    }
}

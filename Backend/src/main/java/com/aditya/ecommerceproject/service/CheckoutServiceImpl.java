package com.aditya.ecommerceproject.service;

import com.aditya.ecommerceproject.dao.CustomerRepository;
import com.aditya.ecommerceproject.dto.PaymentInfo;
import com.aditya.ecommerceproject.dto.Purchase;
import com.aditya.ecommerceproject.dto.PurchaseResponse;
import com.aditya.ecommerceproject.entity.Customer;
import com.aditya.ecommerceproject.entity.Order;
import com.aditya.ecommerceproject.entity.OrderItem;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private CustomerRepository customerRepository;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository,
                               @Value("${stripe.key.secret}") String secretKey) {
        this.customerRepository = customerRepository;

        // Initialize Stripe API with secret key
        Stripe.apiKey = secretKey;
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

        //check if this is an existing customer from DB
        String theEmail = customer.getEmail();

        Customer customerFromFB = customerRepository.findByEmail(theEmail);

        if (customerFromFB != null) {
            //Add customer from DB to customer
            customer = customerFromFB;
        }

        customer.add(order);

        //save to database
        customerRepository.save(customer);

        return new PurchaseResponse(orderTrackingNumber);
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {

        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentInfo.getAmount());
        params.put("currency", paymentInfo.getCurrency());
        params.put("payment_method_types", paymentMethodTypes);
        params.put("description", "FullStackECommerce Purchase");

        return PaymentIntent.create(params);
    }

    private String generateOrderTrackingNumber() {

        //UUID version 4
        return UUID.randomUUID().toString();
    }
}

package com.aditya.ecommerceproject.dao;

import com.aditya.ecommerceproject.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("http://localhost:4200") //Allow angular to make calls to spring application
public interface ProductRepository extends JpaRepository<Product, Long> {
}

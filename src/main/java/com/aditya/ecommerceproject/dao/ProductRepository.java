package com.aditya.ecommerceproject.dao;

import com.aditya.ecommerceproject.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

public interface ProductRepository extends JpaRepository<Product, Long> {
}

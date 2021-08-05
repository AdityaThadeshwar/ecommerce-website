package com.aditya.ecommerceproject.dao;

import com.aditya.ecommerceproject.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin("http://localhost:4200") //Allow angular to make calls to spring application
public interface ProductRepository extends JpaRepository<Product, Long> {

    //Query method findBy: select * from products where category_id = @id
    //Spring REST will automatically expose this endpoint
    //http://localhost:8080/api/products/search/findByCategoryId?id=?
    Page<Product> findByCategoryId(@RequestParam("id") Long id, Pageable pageable);
}

package org.crudprojedata;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class ProductMaterial extends PanacheEntity{

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonIgnore
    public Product product;

    @ManyToOne
    @JoinColumn(name = "material_id")
    public Material material;

    public Integer quantityNeeded;
}
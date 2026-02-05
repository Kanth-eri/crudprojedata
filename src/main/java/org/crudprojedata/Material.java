package org.crudprojedata;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

@Entity
public class Material extends PanacheEntity {
    public String name;
    public Integer stockQuantity;
}
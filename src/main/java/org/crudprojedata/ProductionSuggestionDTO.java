package org.crudprojedata;

public class ProductionSuggestionDTO {
    public String productName;
    public Integer quantity;
    public Double totalValue;

    public ProductionSuggestionDTO(String productName, Integer quantity, Double totalValue) {
        this.productName = productName;
        this.quantity = quantity;
        this.totalValue = totalValue;
    }
}